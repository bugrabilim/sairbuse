// Ortam sesleri gerçek saha kayıtlarıdır: Beeld en Geluid (Hollanda Ses ve Görüntü Enstitüsü) kayıtları,
// Wikimedia Commons'tan, CC BY-SA 3.0. Kesilip temizlenmiş hâlleri public/ortam/ altında; künyeleri
// src/data/ortam-sesleri.ts dosyasında. Dosya yalnız okur o sesi seçince indirilir.
// Kayıt sona yaklaşınca bir sonraki kopya birkaç saniyelik çapraz geçişle başlar, dikiş duyulmaz.
import type { Ortam } from '../data/ortam-sesleri';
export type { Ortam };

/** Vapurda arada bir çalan düdük */
const DUDUK = '/ortam/vapur-duduk.mp3';
/** Döngü dikişindeki çapraz geçiş (sn). Saat tıkırtısında kısa: kesit tık aralığının katı + bu pay (scripts/ortam.py) */
const gecisSuresi = (tur: Ortam) => (tur === 'ev' ? 0.25 : 4);
const ANA_SEVIYE = 0.9;

let baglam: AudioContext | null = null;
let ana: GainNode | null = null;
let durdur: (() => void) | null = null;
let duzey = 0.1;
let sira = 0; // art arda seçimlerde yalnız sonuncusu çalsın

const tamponlar = new Map<string, Promise<AudioBuffer>>();

function yukle(ctx: AudioContext, adres: string): Promise<AudioBuffer> {
  let p = tamponlar.get(adres);
  if (!p) {
    p = fetch(adres)
      .then((r) => {
        if (!r.ok) throw new Error(adres);
        return r.arrayBuffer();
      })
      .then((b) => ctx.decodeAudioData(b));
    p.catch(() => tamponlar.delete(adres));
    tamponlar.set(adres, p);
  }
  return p;
}

/** Tamponu çapraz geçişli, kesintisiz döngüyle çalar */
function dongu(ctx: AudioContext, tampon: AudioBuffer, cikis: AudioNode, gecis: number, rastgele = true): () => void {
  let bitti = false;
  let sayac = 0;
  const calanlar = new Set<AudioBufferSourceNode>();
  const sure = tampon.duration;

  function cal(baslangic: number, ilk: boolean) {
    if (bitti) return;
    const k = ctx.createBufferSource();
    k.buffer = tampon;
    const g = ctx.createGain();
    k.connect(g).connect(cikis);
    // İlk kopya kaydın rastgele bir yerinden başlar; her açılış aynı saniyeyle başlamasın
    const ofset = ilk && rastgele ? Math.random() * Math.max(0, sure - 16) : 0;
    const kalan = sure - ofset;
    g.gain.setValueAtTime(0, baslangic);
    g.gain.linearRampToValueAtTime(1, baslangic + gecis);
    g.gain.setValueAtTime(1, baslangic + kalan - gecis);
    g.gain.linearRampToValueAtTime(0, baslangic + kalan);
    k.start(baslangic, ofset);
    k.stop(baslangic + kalan + 0.05);
    calanlar.add(k);
    k.onended = () => calanlar.delete(k);
    const sonraki = baslangic + kalan - gecis;
    sayac = window.setTimeout(() => cal(sonraki, false), Math.max(0, (sonraki - ctx.currentTime - 1.5) * 1000));
  }
  cal(ctx.currentTime + 0.05, true);

  return () => {
    bitti = true;
    window.clearTimeout(sayac);
    calanlar.forEach((k) => {
      try {
        k.stop();
      } catch {
        /* zaten durmuş */
      }
    });
  };
}

/** Kısa bir kaydı rastgele aralıklarla çalar (vapur düdüğü) */
function arada(ctx: AudioContext, tampon: AudioBuffer, cikis: AudioNode, seviye: number, enAz: number, enCok: number) {
  let sayac = 0;
  const g = ctx.createGain();
  g.gain.value = seviye;
  g.connect(cikis);
  const zamanla = (ilk: boolean) => {
    const bekle = ilk ? 12 + Math.random() * 18 : enAz + Math.random() * (enCok - enAz);
    sayac = window.setTimeout(() => {
      const k = ctx.createBufferSource();
      k.buffer = tampon;
      k.connect(g);
      k.start();
      zamanla(false);
    }, bekle * 1000);
  };
  zamanla(true);
  return () => {
    window.clearTimeout(sayac);
    g.disconnect();
  };
}

export async function baslat(tur: Ortam) {
  // Bağlam dokunuşun içinde kurulup açılmalı (iOS); indirme ondan sonra
  baglam ??= new AudioContext();
  const ctx = baglam;
  const acilis = ctx.resume();
  bitir(0.8);
  const benim = ++sira;
  let tampon: AudioBuffer;
  let duduk: AudioBuffer | null;
  try {
    [tampon, duduk] = await Promise.all([
      yukle(ctx, `/ortam/${tur}.mp3`),
      tur === 'vapur' ? yukle(ctx, DUDUK) : Promise.resolve(null),
      acilis,
    ]);
  } catch {
    return; // ağ yoksa ses sessizce gelmez
  }
  if (benim !== sira) return; // bu arada başka bir ses seçildi ya da kapatıldı
  const g = ctx.createGain();
  g.gain.value = 0;
  g.connect(ctx.destination);
  g.gain.setTargetAtTime(ortamSeviyesi(), ctx.currentTime, 0.8);
  const durduranlar = [dongu(ctx, tampon, g, gecisSuresi(tur))];
  if (duduk) durduranlar.push(arada(ctx, duduk, g, 0.7, 75, 150));
  ana = g;
  durdur = () => durduranlar.forEach((d) => d());
}

/** Fon müziği açıkken ortam sesi biraz kısılır, ikisi birbirini bastırmasın */
const ortamSeviyesi = () => ANA_SEVIYE * duzey * (muzik ? 0.6 : 1);
const MUZIK_SEVIYE = 0.8;

/** Ses düzeyi (0–1): ortam sesi ve fon müziği birlikte */
export function duzeyAyarla(yeni: number) {
  duzey = Math.max(0, Math.min(1, yeni));
  if (baglam && ana) ana.gain.setTargetAtTime(ortamSeviyesi(), baglam.currentTime, 0.15);
  if (baglam && muzik) muzik.gain.setTargetAtTime(MUZIK_SEVIYE * duzey, baglam.currentTime, 0.15);
}

export function bitir(sure = 1.2) {
  sira++;
  if (!baglam || !ana) return;
  sondur(ana, durdur, sure);
  ana = null;
  durdur = null;
}

function sondur(g: GainNode, d: (() => void) | null, sure: number) {
  if (!baglam) return;
  g.gain.setTargetAtTime(0, baglam.currentTime, sure / 4);
  window.setTimeout(() => {
    d?.();
    g.disconnect();
  }, sure * 1000 + 200);
}

// Fon müziği: her duygunun kendi makamında bir taksim (public/muzik/, üretimi scripts/muzik.py).
// Ortam sesinin yanında ayrı bir kanaldan çalar; aynı çapraz geçişli döngüyle.
let muzik: GainNode | null = null;
let muzikDurdur: (() => void) | null = null;
let muzikSira = 0;

export async function muzikBaslat(duygu: string) {
  baglam ??= new AudioContext();
  const ctx = baglam;
  const acilis = ctx.resume();
  muzikBitir(0.8);
  const benim = ++muzikSira;
  let tampon: AudioBuffer;
  try {
    [tampon] = await Promise.all([yukle(ctx, `/muzik/${duygu}.mp3`), acilis]);
  } catch {
    return;
  }
  if (benim !== muzikSira) return;
  const g = ctx.createGain();
  g.gain.value = 0;
  g.connect(ctx.destination);
  g.gain.setTargetAtTime(MUZIK_SEVIYE * duzey, ctx.currentTime, 1.5);
  muzik = g;
  muzikDurdur = dongu(ctx, tampon, g, 6, false); // taksim baştan başlar
  if (ana) ana.gain.setTargetAtTime(ortamSeviyesi(), ctx.currentTime, 0.8);
}

export function muzikBitir(sure = 1.5) {
  muzikSira++;
  if (!baglam || !muzik) return;
  sondur(muzik, muzikDurdur, sure);
  muzik = null;
  muzikDurdur = null;
  if (ana) ana.gain.setTargetAtTime(ortamSeviyesi(), baglam.currentTime, 0.8);
}
