// Ortam sesleri tarayıcıda, Web Audio ile üretilir: dosya yok, telif yok, ağ trafiği yok.
export type Ortam = 'deniz' | 'yagmur';

let baglam: AudioContext | null = null;
let ana: GainNode | null = null;
let durdur: (() => void) | null = null;

function gurultu(ctx: AudioContext, tur: 'kahverengi' | 'pembe', saniye = 6): AudioBuffer {
  const tampon = ctx.createBuffer(2, ctx.sampleRate * saniye, ctx.sampleRate);
  for (let k = 0; k < tampon.numberOfChannels; k++) {
    const v = tampon.getChannelData(k);
    let son = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < v.length; i++) {
      const w = Math.random() * 2 - 1;
      if (tur === 'kahverengi') {
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
  return tampon;
}

function lfo(ctx: AudioContext, frekans: number, derinlik: number, hedef: AudioParam) {
  const o = ctx.createOscillator();
  o.frequency.value = frekans;
  const g = ctx.createGain();
  g.gain.value = derinlik;
  o.connect(g).connect(hedef);
  o.start();
  return o;
}

function deniz(ctx: AudioContext, cikis: AudioNode) {
  const kaynak = ctx.createBufferSource();
  kaynak.buffer = gurultu(ctx, 'kahverengi');
  kaynak.loop = true;
  const suzgec = ctx.createBiquadFilter();
  suzgec.type = 'lowpass';
  suzgec.frequency.value = 650;
  suzgec.Q.value = 0.4;
  const dalga = ctx.createGain();
  dalga.gain.value = 0.55;
  kaynak.connect(suzgec).connect(dalga).connect(cikis);
  // Birbirine denk düşmeyen iki yavaş salınım: dalgalar düzenli değil
  const l1 = lfo(ctx, 0.09, 0.3, dalga.gain);
  const l2 = lfo(ctx, 0.053, 0.18, dalga.gain);
  const l3 = lfo(ctx, 0.07, 260, suzgec.frequency);
  kaynak.start();
  return () => [kaynak, l1, l2, l3].forEach((n) => n.stop());
}

function yagmur(ctx: AudioContext, cikis: AudioNode) {
  const kaynak = ctx.createBufferSource();
  kaynak.buffer = gurultu(ctx, 'pembe');
  kaynak.loop = true;
  const alt = ctx.createBiquadFilter();
  alt.type = 'highpass';
  alt.frequency.value = 700;
  const ust = ctx.createBiquadFilter();
  ust.type = 'lowpass';
  ust.frequency.value = 6500;
  const g = ctx.createGain();
  g.gain.value = 0.5;
  kaynak.connect(alt).connect(ust).connect(g).connect(cikis);
  const l1 = lfo(ctx, 0.11, 0.08, g.gain);
  kaynak.start();

  // Ara sıra camda tek tük damla
  const damla = gurultu(ctx, 'pembe', 1);
  let acik = true;
  const zamanla = () => {
    if (!acik) return;
    const s = ctx.createBufferSource();
    s.buffer = damla;
    const bant = ctx.createBiquadFilter();
    bant.type = 'bandpass';
    bant.frequency.value = 1800 + Math.random() * 3200;
    bant.Q.value = 6;
    const z = ctx.createGain();
    const t = ctx.currentTime;
    z.gain.setValueAtTime(0.0001, t);
    z.gain.exponentialRampToValueAtTime(0.35 + Math.random() * 0.3, t + 0.004);
    z.gain.exponentialRampToValueAtTime(0.0001, t + 0.05 + Math.random() * 0.06);
    s.connect(bant).connect(z).connect(cikis);
    s.start(t, Math.random() * 0.9, 0.12);
    window.setTimeout(zamanla, 60 + Math.random() * 260);
  };
  zamanla();
  return () => {
    acik = false;
    kaynak.stop();
    l1.stop();
  };
}

export async function baslat(tur: Ortam) {
  baglam ??= new AudioContext();
  await baglam.resume();
  bitir(0.6);
  const ctx = baglam;
  ana = ctx.createGain();
  ana.gain.value = 0;
  ana.connect(ctx.destination);
  ana.gain.setTargetAtTime(0.32, ctx.currentTime, 1.2);
  durdur = tur === 'deniz' ? deniz(ctx, ana) : yagmur(ctx, ana);
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
