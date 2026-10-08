// Ortam sesleri tarayıcıda, Web Audio ile üretilir: dosya yok, telif yok, ağ trafiği yok.
// Her ses birkaç katmandan oluşur ve rastgele zamanlanmış olaylar içerir (dalga, damla, düdük, martı),
// böylece döngü gibi duyulmaz.
export type Ortam = 'deniz' | 'yagmur' | 'vapur' | 'gece';

let baglam: AudioContext | null = null;
let ana: GainNode | null = null;
let durdur: (() => void) | null = null;
let duzey = 0.6;
const ANA_SEVIYE = 0.55;

type Durdur = () => void;
type Tur = 'kahverengi' | 'pembe' | 'beyaz';
const tamponlar = new Map<string, AudioBuffer>();

/** Gürültü tamponu (bağlam başına bir kez üretilir) */
function gurultu(ctx: AudioContext, tur: Tur, saniye = 8): AudioBuffer {
  const anahtar = `${tur}-${saniye}`;
  const hazir = tamponlar.get(anahtar);
  if (hazir) return hazir;
  const tampon = ctx.createBuffer(2, ctx.sampleRate * saniye, ctx.sampleRate);
  for (let k = 0; k < tampon.numberOfChannels; k++) {
    const v = tampon.getChannelData(k);
    let son = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < v.length; i++) {
      const w = Math.random() * 2 - 1;
      if (tur === 'beyaz') v[i] = w * 0.5;
      else if (tur === 'kahverengi') {
        son = (son + 0.02 * w) / 1.02;
        v[i] = son * 3.5;
      } else {
        // Paul Kellet'in pembe gürültü süzgeci
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        v[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
  }
  tamponlar.set(anahtar, tampon);
  return tampon;
}

const rastgele = (a: number, b: number) => a + Math.random() * (b - a);

/** Döngülü gürültü kaynağı (rastgele bir yerden başlar) */
function kaynak(ctx: AudioContext, tur: Tur): AudioBufferSourceNode {
  const s = ctx.createBufferSource();
  s.buffer = gurultu(ctx, tur);
  s.loop = true;
  s.start(0, rastgele(0, 7));
  return s;
}

function suzgec(ctx: AudioContext, type: BiquadFilterType, frequency: number, Q = 0.7): BiquadFilterNode {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = Q;
  return f;
}

function kazanc(ctx: AudioContext, deger: number): GainNode {
  const g = ctx.createGain();
  g.gain.value = deger;
  return g;
}

function lfo(ctx: AudioContext, frekans: number, derinlik: number, hedef: AudioParam): OscillatorNode {
  const o = ctx.createOscillator();
  o.frequency.value = frekans;
  const g = kazanc(ctx, derinlik);
  o.connect(g).connect(hedef);
  o.start();
  return o;
}

function yan(ctx: AudioContext, konum: number): StereoPannerNode {
  const p = ctx.createStereoPanner();
  p.pan.value = konum;
  return p;
}

/** Uzaklık hissi için kısa yankı (gecikme + geri besleme) */
function yanki(ctx: AudioContext, cikis: AudioNode, sure = 0.18, geri = 0.32): AudioNode {
  const giris = kazanc(ctx, 1);
  const gecikme = ctx.createDelay(1);
  gecikme.delayTime.value = sure;
  const besleme = kazanc(ctx, geri);
  const yumusak = suzgec(ctx, 'lowpass', 2400);
  giris.connect(cikis);
  giris.connect(gecikme).connect(yumusak).connect(besleme).connect(gecikme);
  yumusak.connect(cikis);
  return giris;
}

/** Rastgele aralıklarla tekrarlanan bir olay; durdurma işlevi döner */
function arada(fn: () => void, enAz: number, enCok: number, ilk = true): Durdur {
  let acik = true;
  let id = 0;
  const kur = () => {
    id = window.setTimeout(() => {
      if (!acik) return;
      fn();
      kur();
    }, rastgele(enAz, enCok));
  };
  if (ilk) fn();
  kur();
  return () => {
    acik = false;
    window.clearTimeout(id);
  };
}

// ---------- olaylar ----------

/** Kıyıya gelip çekilen tek bir dalga */
function dalga(ctx: AudioContext, cikis: AudioNode) {
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = gurultu(ctx, 'kahverengi');
  const f = suzgec(ctx, 'lowpass', 300, 0.5);
  const g = kazanc(ctx, 0.0001);
  const p = yan(ctx, rastgele(-0.6, 0.6));
  const yukselis = rastgele(1.4, 2.8);
  const cekilis = rastgele(3, 6);
  const tepe = rastgele(0.35, 0.8);
  g.gain.exponentialRampToValueAtTime(tepe, t + yukselis);
  g.gain.exponentialRampToValueAtTime(0.0001, t + yukselis + cekilis);
  f.frequency.setValueAtTime(300, t);
  f.frequency.linearRampToValueAtTime(rastgele(1100, 1800), t + yukselis);
  f.frequency.linearRampToValueAtTime(380, t + yukselis + cekilis);
  s.connect(f).connect(g).connect(p).connect(cikis);
  s.start(t, rastgele(0, 6));
  s.stop(t + yukselis + cekilis + 0.2);
}

/** Uzaktan bir martı: iki üç kısa, inen çığlık */
function marti(ctx: AudioContext, cikis: AudioNode) {
  const p = yan(ctx, rastgele(-0.8, 0.8));
  p.connect(cikis);
  const uzak = yanki(ctx, p);
  const kac = Math.round(rastgele(2, 4));
  let t = ctx.currentTime + 0.05;
  for (let i = 0; i < kac; i++) {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    const bas = rastgele(1500, 2100);
    o.frequency.setValueAtTime(bas, t);
    o.frequency.exponentialRampToValueAtTime(bas * 1.18, t + 0.05);
    o.frequency.exponentialRampToValueAtTime(bas * 0.62, t + 0.32);
    const bant = suzgec(ctx, 'bandpass', 1700, 1.4);
    const g = kazanc(ctx, 0.0001);
    g.gain.exponentialRampToValueAtTime(rastgele(0.025, 0.05), t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    o.connect(bant).connect(g).connect(uzak);
    o.start(t);
    o.stop(t + 0.4);
    t += rastgele(0.38, 0.6);
  }
}

/** Camda tek bir damla */
function damla(ctx: AudioContext, cikis: AudioNode) {
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = gurultu(ctx, 'pembe', 1);
  const bant = suzgec(ctx, 'bandpass', rastgele(1800, 5200), 6);
  const g = kazanc(ctx, 0.0001);
  g.gain.exponentialRampToValueAtTime(rastgele(0.2, 0.5), t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + rastgele(0.05, 0.11));
  s.connect(bant).connect(g).connect(yan(ctx, rastgele(-0.9, 0.9))).connect(cikis);
  s.start(t, rastgele(0, 0.9), 0.14);
}

/** Uzak gök gürültüsü */
function gokGurultusu(ctx: AudioContext, cikis: AudioNode) {
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = gurultu(ctx, 'kahverengi');
  const f = suzgec(ctx, 'lowpass', 140, 0.6);
  const g = kazanc(ctx, 0.0001);
  const tepe = rastgele(0.4, 0.75);
  g.gain.exponentialRampToValueAtTime(tepe, t + rastgele(0.6, 1.4));
  g.gain.exponentialRampToValueAtTime(tepe * 0.5, t + 2.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + rastgele(6, 9));
  s.connect(f).connect(g).connect(yan(ctx, rastgele(-0.5, 0.5))).connect(cikis);
  s.start(t, rastgele(0, 6));
  s.stop(t + 10);
}

/** Vapur düdüğü: iki derin, birbirine yakın ses; uzaktan yankılanır */
function duduk(ctx: AudioContext, cikis: AudioNode) {
  const t = ctx.currentTime;
  const uzun = rastgele(1.8, 2.8);
  const uzak = yanki(ctx, cikis, 0.42, 0.38);
  const f = suzgec(ctx, 'lowpass', 520, 0.8);
  const g = kazanc(ctx, 0.0001);
  g.gain.exponentialRampToValueAtTime(0.13, t + 0.45);
  g.gain.setValueAtTime(0.13, t + uzun);
  g.gain.exponentialRampToValueAtTime(0.0001, t + uzun + 1.4);
  f.connect(g).connect(yan(ctx, rastgele(-0.4, 0.4))).connect(uzak);
  for (const [frekans, tur] of [
    [108, 'sawtooth'],
    [136, 'sawtooth'],
    [216, 'triangle'],
  ] as const) {
    const o = ctx.createOscillator();
    o.type = tur;
    o.frequency.value = frekans;
    o.detune.value = rastgele(-6, 6);
    o.connect(f);
    o.start(t);
    o.stop(t + uzun + 1.6);
  }
}

/** Bir cırcır böceği: kısa titreşimli ötüş kümesi */
function circir(ctx: AudioContext, cikis: AudioNode, konum: number, frekans: number) {
  let t = ctx.currentTime + 0.02;
  const p = yan(ctx, konum);
  p.connect(cikis);
  for (let i = 0; i < 3; i++) {
    const o = ctx.createOscillator();
    o.frequency.value = frekans;
    const g = kazanc(ctx, 0.0001);
    g.gain.exponentialRampToValueAtTime(0.018, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(g).connect(p);
    o.start(t);
    o.stop(t + 0.06);
    t += 0.07;
  }
}

// ---------- sahneler ----------

function deniz(ctx: AudioContext, cikis: AudioNode): Durdur {
  // Sürekli, uzak bir kıyı uğultusu
  const yatak = kaynak(ctx, 'kahverengi');
  const f = suzgec(ctx, 'lowpass', 420, 0.4);
  const g = kazanc(ctx, 0.22);
  yatak.connect(f).connect(g).connect(cikis);
  const l = lfo(ctx, 0.05, 0.08, g.gain);
  const dalgalar = arada(() => dalga(ctx, cikis), 3800, 8500);
  const martilar = arada(() => marti(ctx, cikis), 14000, 32000, false);
  return () => {
    [yatak, l].forEach((n) => n.stop());
    dalgalar();
    martilar();
  };
}

function yagmur(ctx: AudioContext, cikis: AudioNode): Durdur {
  // İnce, sık yağmur
  const ince = kaynak(ctx, 'pembe');
  const g1 = kazanc(ctx, 0.32);
  ince.connect(suzgec(ctx, 'highpass', 650)).connect(suzgec(ctx, 'lowpass', 7000)).connect(g1).connect(cikis);
  // Damlaların çatıya, yere vuruşu: alçak ve kalın
  const kalin = kaynak(ctx, 'kahverengi');
  const g2 = kazanc(ctx, 0.14);
  kalin.connect(suzgec(ctx, 'lowpass', 900)).connect(g2).connect(cikis);
  // Yağmur bazen hızlanır, bazen diner
  const l1 = lfo(ctx, 0.031, 0.12, g1.gain);
  const l2 = lfo(ctx, 0.047, 0.06, g2.gain);
  const damlalar = arada(() => damla(ctx, cikis), 70, 320);
  const gok = arada(() => gokGurultusu(ctx, cikis), 28000, 70000, false);
  return () => {
    [ince, kalin, l1, l2].forEach((n) => n.stop());
    damlalar();
    gok();
  };
}

function vapur(ctx: AudioContext, cikis: AudioNode): Durdur {
  // Motorun derin uğultusu ve pistonların vuruşu
  const motorCikis = kazanc(ctx, 0.16);
  const motorSuzgec = suzgec(ctx, 'lowpass', 150, 0.9);
  motorSuzgec.connect(motorCikis).connect(cikis);
  const motorlar = [46, 46.6, 92.4].map((frekans) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = frekans;
    o.connect(motorSuzgec);
    o.start();
    return o;
  });
  const vurus = lfo(ctx, 1.7, 0.05, motorCikis.gain);
  // Pervanenin ve gövdenin yardığı su
  const su = kaynak(ctx, 'kahverengi');
  const suKazanc = kazanc(ctx, 0.28);
  const suSuzgec = suzgec(ctx, 'lowpass', 750, 0.5);
  su.connect(suSuzgec).connect(suKazanc).connect(cikis);
  const l1 = lfo(ctx, 0.12, 0.08, suKazanc.gain);
  const l2 = lfo(ctx, 0.07, 220, suSuzgec.frequency);
  const dudukler = arada(() => duduk(ctx, cikis), 38000, 80000, false);
  const martilar = arada(() => marti(ctx, cikis), 9000, 24000, false);
  // İlk düdük birkaç saniye sonra
  const ilk = window.setTimeout(() => duduk(ctx, cikis), 4000);
  return () => {
    [...motorlar, vurus, su, l1, l2].forEach((n) => n.stop());
    dudukler();
    martilar();
    window.clearTimeout(ilk);
  };
}

function gece(ctx: AudioContext, cikis: AudioNode): Durdur {
  // Yaprakların arasından geçen rüzgâr
  const ruzgar = kaynak(ctx, 'pembe');
  const bant = suzgec(ctx, 'bandpass', 420, 0.6);
  const g = kazanc(ctx, 0.16);
  ruzgar.connect(bant).connect(g).connect(cikis);
  const l1 = lfo(ctx, 0.06, 0.08, g.gain);
  const l2 = lfo(ctx, 0.043, 180, bant.frequency);
  // İki cırcır böceği, ikisi de kendi ritminde
  const c1 = arada(() => circir(ctx, cikis, -0.55, 4300), 650, 1100);
  const c2 = arada(() => circir(ctx, cikis, 0.6, 4750), 900, 1600);
  return () => {
    [ruzgar, l1, l2].forEach((n) => n.stop());
    c1();
    c2();
  };
}

const SAHNELER: Record<Ortam, (ctx: AudioContext, cikis: AudioNode) => Durdur> = { deniz, yagmur, vapur, gece };

export async function baslat(tur: Ortam) {
  baglam ??= new AudioContext();
  await baglam.resume();
  bitir(0.6);
  const ctx = baglam;
  ana = ctx.createGain();
  ana.gain.value = 0;
  ana.connect(ctx.destination);
  ana.gain.setTargetAtTime(ANA_SEVIYE * duzey, ctx.currentTime, 1.2);
  durdur = SAHNELER[tur](ctx, ana);
}

/** Ses düzeyi (0–1) */
export function duzeyAyarla(yeni: number) {
  duzey = Math.max(0, Math.min(1, yeni));
  if (baglam && ana) ana.gain.setTargetAtTime(ANA_SEVIYE * duzey, baglam.currentTime, 0.15);
}

export function bitir(sure = 1.2) {
  if (!baglam || !ana) return;
  const g = ana;
  const d = durdur;
  g.gain.setTargetAtTime(0, baglam.currentTime, sure / 4);
  window.setTimeout(() => {
    d?.();
    g.disconnect();
  }, sure * 1000 + 200);
  ana = null;
  durdur = null;
}
