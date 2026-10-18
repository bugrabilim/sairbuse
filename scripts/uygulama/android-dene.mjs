// Android uygulamasının WebView'ine Chrome hata ayıklama protokolüyle bağlanıp sitenin uygulamada doğru çalıştığını
// dener: ana sayfa, dizin yönlendirici (/siir/x/ → siir/x/index.html), bulunamayan adres (404.html) ve ortam sesinin
// fetch + Web Audio ile çözülmesi (iOS'taki "durum 0" sorununun Android karşılığı). Hata varsa çıkış kodu 1.
const hedefler = await (await fetch('http://127.0.0.1:9222/json')).json();
const sayfa = hedefler.find((h) => h.type === 'page') ?? hedefler[0];
const ws = new WebSocket(sayfa.webSocketDebuggerUrl);
await new Promise((tamam) => ws.addEventListener('open', tamam, { once: true }));
let sira = 0;
const bekleyen = new Map();
ws.addEventListener('message', (o) => {
  const m = JSON.parse(o.data);
  if (m.id && bekleyen.has(m.id)) bekleyen.get(m.id)(m);
});
const gonder = (method, params = {}) =>
  new Promise((tamam) => {
    const id = ++sira;
    bekleyen.set(id, tamam);
    ws.send(JSON.stringify({ id, method, params }));
  });
const deger = async (ifade) => (await gonder('Runtime.evaluate', { expression: ifade, awaitPromise: true, returnByValue: true })).result?.result?.value;
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
async function git(yol) {
  await deger(`location.assign(${JSON.stringify(yol)})`);
  await bekle(5000);
}

const sonuclar = [];
const dene = (ad, kosul, ayrinti) => sonuclar.push(`${kosul ? '✓' : '✗'} ${ad}: ${ayrinti}`);

const ana = await deger('JSON.stringify({ adres: location.href, baslik: document.title })');
dene('Ana sayfa', ana && JSON.parse(ana).baslik === 'Duyguların Peşinde', ana);

await git('/siir/2011-07-18-moda/');
const siir = JSON.parse(await deger('JSON.stringify({ yol: location.pathname, baslik: document.title, siir: document.body.innerText.includes("Şiir kitabım ağlıyor") })'));
dene('Şiir sayfası (dizin yönlendirici)', siir.baslik.startsWith('Şiir kitabım ağlıyor') && siir.siir, JSON.stringify(siir));

const ses = JSON.parse(
  await deger(`(async () => {
    const r = await fetch('/ortam/deniz.mp3');
    const b = await r.arrayBuffer();
    // decodeAudioData tamponu devralır (byteLength 0'a düşer); boyut önce okunur
    const bayt = b.byteLength;
    const t = await new AudioContext().decodeAudioData(b);
    return JSON.stringify({ durum: r.status, ok: r.ok, bayt, saniye: Math.round(t.duration) });
  })().catch((h) => JSON.stringify({ hata: String(h) }))`),
);
dene('Ortam sesi (fetch + çözme)', ses.bayt > 100000 && ses.saniye > 60 && !(ses.durum >= 400), JSON.stringify(ses));

await git('/boyle-bir-sayfa-yok/');
const yok = await deger('document.title');
dene('Bulunamayan adres → 404', String(yok).startsWith('Bulunamadı'), yok);

await git('/siir/2011-07-18-moda/');
console.log(sonuclar.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import('node:fs');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + sonuclar.join('\n') + '\n```\n');
}
ws.close();
process.exit(sonuclar.some((s) => s.startsWith('✗')) ? 1 : 0);
