// Pruebas de diseño móvil con Chrome real; sin npm ni Playwright.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const browser = [process.env.CHROME_BIN, 'google-chrome', 'chromium'].filter(Boolean).find(cmd => {
  const p = spawnSync(cmd, ['--version'], {timeout:3000}); return !p.error && p.status === 0;
});
if (!browser) throw new Error('No hay Chrome/Chromium instalado en el ejecutor');
const dir = mkdtempSync(join(tmpdir(), 'dimsac-browser-'));
const child = spawn(browser, ['--headless=new','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',
  '--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+dir,
  ...(process.getuid?.()===0?['--no-sandbox']:[]),'about:blank'], {stdio:'ignore'});
let socket;
let seq=0;
const pending = new Map();
let failures=0;
let screenshotTask;
// Captura solo el primer fallo, sin interrumpir el estado de error del check.
async function saveFailureScreenshot(reason) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('Captura no disponible: Chrome DevTools todavía no está conectado.');
    return;
  }
  const result = await send('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
  if (!result.data) throw new Error('Chrome no devolvió datos de imagen');
  mkdirSync('artifacts', {recursive:true});
  writeFileSync('artifacts/browser-failure.png', Buffer.from(result.data,'base64'));
  writeFileSync('artifacts/browser-failure.txt', 'Primera prueba fallida: '+reason+'\\nFecha UTC: '+new Date().toISOString()+'\\n');
  console.log('Captura del fallo guardada en artifacts/browser-failure.png');
}
function captureOnFailure(reason) {
  if (!screenshotTask) screenshotTask = saveFailureScreenshot(reason).catch(error => {
    console.warn('No se pudo guardar la captura: '+error.message);
  });
}
function assert(ok, label, detail='') {
  console.log((ok?'OK':'FALLO')+': '+label+(detail?' ('+detail+')':''));
  if (!ok) { failures++; captureOnFailure(label+(detail?' ('+detail+')':'')); }
}
async function wait(check,label,ms=10000) {
  const deadline=Date.now()+ms;
  while(Date.now()<deadline) {
    try { const result=await check(); if(result)return result; } catch{}
    await sleep(150);
  }
  throw new Error('Tiempo agotado: '+label);
}
async function send(method,params={}) {
  const id=++seq;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error('Sin respuesta: '+method));},15000);
    pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});
    socket.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw new Error('JavaScript: '+result.exceptionDetails.text);
  return result.result?.value;
}
try {
  const activePort=join(dir,'DevToolsActivePort');
  const port=await wait(()=>existsSync(activePort)&&readFileSync(activePort,'utf8').split('\n')[0],'Chrome DevTools');
  const pages=await wait(async()=>{
    const r=await fetch('http://127.0.0.1:'+port+'/json/list');
    return r.ok?(await r.json()).filter(p=>p.type==='page'&&p.webSocketDebuggerUrl):null;
  },'pestaña Chrome');
  socket=new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=()=>reject(new Error('DevTools WebSocket'));});
  socket.onmessage=e=>{ const m=JSON.parse(e.data);const p=pending.get(m.id);if(!p)return;
    pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result||{}); };
  await send('Page.enable');await send('Runtime.enable');
  const site='http://127.0.0.1:8765/';
  for(const width of [360,390,1280]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:850,deviceScaleFactor:1,mobile:width<900});
    const nav=await send('Page.navigate',{url:site});
    if(nav.errorText)throw new Error('No abre la web local: '+nav.errorText);
    await wait(()=>evaluate("document.readyState!=='loading'&&!!document.querySelector('#precios')"),'carga '+width);
    await evaluate('Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1500))])');
    await sleep(400);
    const result=await evaluate(`(() => {
      const wa=document.querySelector('.wa-flotante');
      const tables=[...document.querySelectorAll('#precios .grupo')].slice(0,2).map(g=>{
        const e=g.querySelector('.tabla-envoltura'),b=e.getBoundingClientRect();
        const hs=[...g.querySelectorAll('.tabla-precios thead th')];
        return {scroll:e.scrollWidth-e.clientWidth,labels:hs.map(h=>h.textContent.trim()),
          visible:hs.every(h=>h.getBoundingClientRect().left>=b.left-1&&h.getBoundingClientRect().right<=b.right+1)};
      });
      return {width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,
        wa:getComputedStyle(wa).visibility,tables};
    })()`);
    assert(result.width===width,'Ancho '+width,result.width+'px');
    assert(result.overflow<=1,'Sin desbordamiento horizontal '+width,result.overflow+'px');
    assert(result.wa==='visible','WhatsApp visible fuera de precios '+width);
    assert(result.tables.length===2,'Tablas intraorales y extraorales presentes '+width);
    for(const t of result.tables) {
      assert(t.scroll<=1,'Tabla sin desplazamiento horizontal '+width,t.scroll+'px');
      assert(t.visible&&t.labels.some(s=>/Impresa/i.test(s))&&t.labels.some(s=>/Digital/i.test(s)),
        'Impresa y Digital visibles '+width);
    }

    if(width<900) {
      const initial=await evaluate("(() => {const b=document.querySelector('#menuBoton');const m=document.querySelector('#menu');return getComputedStyle(b).display!=='none'&&getComputedStyle(m).display==='none'&&b.getAttribute('aria-expanded')==='false'})()");
      assert(initial,'Menú móvil cerrado al cargar '+width);
      await evaluate("document.querySelector('#menuBoton').click()");
      await wait(()=>evaluate("(() => {const b=document.querySelector('#menuBoton');const m=document.querySelector('#menu');return b.getAttribute('aria-expanded')==='true'&&getComputedStyle(m).display==='flex'})()"),'menú abierto '+width,3000);
      assert(true,'Menú móvil abre '+width);
      await evaluate("document.querySelector('#menu a').click()");
      await wait(()=>evaluate("(() => {const b=document.querySelector('#menuBoton');const m=document.querySelector('#menu');return b.getAttribute('aria-expanded')==='false'&&getComputedStyle(m).display==='none'})()"),'menú cerrado al navegar '+width,3000);
      assert(true,'Menú móvil se cierra al elegir enlace '+width);
    } else {
      assert(await evaluate("getComputedStyle(document.querySelector('#menuBoton')).display==='none'&&getComputedStyle(document.querySelector('#menu')).display==='flex'"),'Navegación de escritorio activa '+width);
    }
    await evaluate("document.querySelector('#precios').scrollIntoView({behavior:'instant',block:'start'})");
    await wait(()=>evaluate("document.body.classList.contains('en-precios')"),'entrada precios '+width);
    // La transición CSS dura 200 ms. Esperar el estado real evita falsos fallos con CPU ocupada.
    await wait(()=>evaluate("getComputedStyle(document.querySelector('.wa-flotante')).visibility==='hidden'&&getComputedStyle(document.querySelector('.wa-burbuja')).visibility==='hidden'"),
      'WhatsApp y burbuja ocultos '+width,3500);
    assert(true,'WhatsApp y burbuja ocultos dentro de precios '+width);
    await evaluate("window.scrollTo({top:0,behavior:'instant'})");
    await wait(()=>evaluate("!document.body.classList.contains('en-precios')"),'salida precios '+width);
    await wait(()=>evaluate("getComputedStyle(document.querySelector('.wa-flotante')).visibility==='visible'"),
      'WhatsApp reaparece '+width,3500);
    assert(true,'WhatsApp reaparece al salir '+width);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:850,deviceScaleFactor:1,mobile:true});
  await send('Page.navigate',{url:site+'#precios'});
  await wait(()=>evaluate("document.readyState!=='loading'&&document.body.classList.contains('en-precios')"),'acceso directo #precios');
  await wait(()=>evaluate("getComputedStyle(document.querySelector('.wa-flotante')).visibility==='hidden'"),
    'ocultación de WhatsApp en enlace directo',3500);
  assert(true,'Enlace directo #precios oculta WhatsApp');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches&&getComputedStyle(document.querySelector('.wa-flotante')).animationName==='none'"),
    'Movimiento reducido elimina latido');
} catch(e){console.error('ERROR:',e.message);failures++;captureOnFailure(e.message);}
finally {
  if(screenshotTask) await screenshotTask;
  socket?.close();
  if(child.exitCode===null) { child.kill('SIGTERM'); await Promise.race([new Promise(r=>child.once('exit',r)),sleep(1800)]); }
  try{rmSync(dir,{recursive:true,force:true,maxRetries:5,retryDelay:100});}catch{}
}
if(failures)process.exitCode=1;
console.log(failures?'Fallaron '+failures+' verificaciones.':'Todas las verificaciones superadas.');
