// Kazanım rozetleri (Bumba Genel Standartlar §13; yalnız telefon uygulamasında, sahibinin kararı). Veri yalnız cihazda, localStorage'daki tek bir kayıtta
// ("rozetler") tutulur ve hiçbir yolla sunucuya gitmez: kazanılan rozetin kimliği ve günü (saat yok), koşulları
// hesaplamaya yeten sayaçlar (okunan ve dinlenen şiirlerin kimlikleri, yapılmış eylemler, okuma serisinin son günü ve
// gün sayısı). Eylem günlüğü ve zaman damgası tutulmaz. Sayfalar eylemi `rozet` olayıyla bildirir:
//   document.dispatchEvent(new CustomEvent('rozet', { detail: { tur: 'okuma', id } }))
// Bir rozet o anki eylemle ilk kez kazanılınca kısa bir bildirim çıkar ve (istatistiğe izin verildiyse) Umami'ye
// yalnız kimliğiyle `rozet-kazanildi` gider.
import { ROZETLER, ROZET_ANAHTARI, type RozetKimligi } from '../data/rozetler';

export interface KatalogSiiri {
  /** şiir kimliği */
  i: string;
  /** duygular */
  d: string[];
  /** yer (gerçek bir yer değilse null) */
  y: string | null;
  /** sesli okuması var mı */
  s: boolean;
  /** yazıldığı gün ve ay (AA-GG) */
  t: string | null;
}
export interface RozetVerisi {
  siirler: KatalogSiiri[];
  adlar: Record<string, string>;
  metin: { bildirim: string; bildirimBag: string; not: string };
  sayfa: string;
}
export interface Durum {
  v: 1;
  /** kazanılan rozetler: kimlik → gün (YYYY-AA-GG) */
  k: Record<string, string>;
  /** okunan şiirler */
  o: string[];
  /** dinlenen şiirler */
  d: string[];
  /** yapılmış eylemler: fal, cark, paylas, misra-karti, gece, bugun */
  e: string[];
  /** okuma serisi: son gün ve üst üste gün sayısı */
  g: { s: string; n: number } | null;
  /** ilk bildirimde not gösterildi */
  b?: 1;
}
type Olay = { tur: 'okuma' | 'dinleme' | 'fal' | 'cark' | 'paylas' | 'misra-karti'; id?: string };

const bos = (): Durum => ({ v: 1, k: {}, o: [], d: [], e: [], g: null });

export function durumOku(): Durum {
  try {
    const d = JSON.parse(localStorage.getItem(ROZET_ANAHTARI) ?? 'null');
    if (d && d.v === 1) return { ...bos(), ...d };
  } catch {}
  return bos();
}
function durumYaz(d: Durum) {
  try {
    localStorage.setItem(ROZET_ANAHTARI, JSON.stringify(d));
  } catch {}
}
export function rozetleriSil() {
  try {
    localStorage.removeItem(ROZET_ANAHTARI);
  } catch {}
}

/** Kullanıcının yerel günü (YYYY-AA-GG) */
export function gun(t = new Date()): string {
  const iki = (n: number) => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${iki(t.getMonth() + 1)}-${iki(t.getDate())}`;
}
function dun(): string {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return gun(t);
}

export function veriOku(): RozetVerisi | null {
  try {
    return JSON.parse(document.getElementById('rozet-veri')?.textContent ?? 'null');
  } catch {
    return null;
  }
}

/** Bir rozetin ilerlemesi: şu anki değer ve hedef */
export function ilerleme(id: RozetKimligi, d: Durum, v: RozetVerisi): { deger: number; hedef: number } {
  const kimlikler = new Set(v.siirler.map((s) => s.i));
  const okunan = v.siirler.filter((s) => d.o.includes(s.i));
  const yerler = new Set(okunan.map((s) => s.y).filter(Boolean));
  const tumYerler = new Set(v.siirler.map((s) => s.y).filter(Boolean));
  const duygular = [...new Set(v.siirler.flatMap((s) => s.d))];
  const sesliler = v.siirler.filter((s) => s.s);
  const seri = d.g && (d.g.s === gun() || d.g.s === dun()) ? d.g.n : 0;
  const var1 = (x: string) => ({ deger: d.e.includes(x) ? 1 : 0, hedef: 1 });
  switch (id) {
    case 'ilk-siir':
      return { deger: Math.min(okunan.length, 1), hedef: 1 };
    case 'bes-siir':
      return { deger: Math.min(okunan.length, 5), hedef: 5 };
    case 'on-bes-siir':
      return { deger: Math.min(okunan.length, 15), hedef: 15 };
    case 'butun-siirler':
      return { deger: okunan.length, hedef: kimlikler.size };
    case 'yedi-duygu':
      return { deger: duygular.filter((x) => okunan.some((s) => s.d.includes(x))).length, hedef: duygular.length };
    case 'bir-duygu': {
      // En çok yaklaşılan duygu
      let en = { deger: 0, hedef: 1 };
      for (const x of duygular) {
        const hepsi = v.siirler.filter((s) => s.d.includes(x));
        const a = hepsi.filter((s) => d.o.includes(s.i)).length;
        if (a / hepsi.length > en.deger / en.hedef) en = { deger: a, hedef: hepsi.length };
      }
      return en;
    }
    case 'uc-yer':
      return { deger: Math.min(yerler.size, 3), hedef: Math.min(3, tumYerler.size) };
    case 'on-yer':
      return { deger: Math.min(yerler.size, 10), hedef: Math.min(10, tumYerler.size) };
    case 'ilk-ses':
      return { deger: Math.min(d.d.length, 1), hedef: 1 };
    case 'butun-sesler':
      return { deger: sesliler.filter((s) => d.d.includes(s.i)).length, hedef: sesliler.length };
    case 'seri-3':
      return { deger: Math.min(seri, 3), hedef: 3 };
    case 'seri-7':
      return { deger: Math.min(seri, 7), hedef: 7 };
    case 'fal':
    case 'cark':
    case 'paylas':
    case 'misra-karti':
    case 'gece':
    case 'bugun':
      return var1(id);
  }
}

const tamam = (p: { deger: number; hedef: number }) => p.hedef > 0 && p.deger >= p.hedef;

function bildir(yeni: RozetKimligi[], v: RozetVerisi, d: Durum) {
  const kutu = document.createElement('div');
  kutu.className = 'rozet-bildirim';
  kutu.setAttribute('role', 'status');
  const ust = document.createElement('p');
  const b = document.createElement('strong');
  b.textContent = `${v.metin.bildirim}: `;
  ust.append(b, yeni.map((x) => v.adlar[x] ?? x).join(', '));
  kutu.append(ust);
  // Not ilk bildirimde bir kez (bağlantısız); tam hâli Rozetler sayfasında
  if (!d.b) {
    const not = document.createElement('p');
    not.className = 'rozet-not';
    not.textContent = v.metin.not;
    kutu.append(not);
    d.b = 1;
  }
  const a = document.createElement('a');
  a.href = v.sayfa;
  a.textContent = v.metin.bildirimBag;
  kutu.append(a);
  document.body.append(kutu);
  requestAnimationFrame(() => kutu.classList.add('acik'));
  window.setTimeout(() => {
    kutu.classList.remove('acik');
    window.setTimeout(() => kutu.remove(), 600);
  }, 6500);
}

function isle(olay: Olay) {
  const v = veriOku();
  if (!v) return;
  const d = durumOku();
  const bugun = gun();
  const ekle = (liste: string[], x: string) => {
    if (!liste.includes(x)) liste.push(x);
  };
  if (olay.tur === 'okuma' && olay.id) {
    ekle(d.o, olay.id);
    const s = v.siirler.find((x) => x.i === olay.id);
    if (s?.t && s.t === bugun.slice(5)) ekle(d.e, 'bugun');
    if (new Date().getHours() < 5) ekle(d.e, 'gece');
    if (!d.g || d.g.s !== bugun) d.g = { s: bugun, n: d.g && d.g.s === dun() ? d.g.n + 1 : 1 };
  } else if (olay.tur === 'dinleme' && olay.id) {
    ekle(d.d, olay.id);
  } else if (olay.tur !== 'okuma' && olay.tur !== 'dinleme') {
    ekle(d.e, olay.tur);
  }
  const yeni = ROZETLER.filter((id) => !d.k[id] && tamam(ilerleme(id, d, v)));
  for (const id of yeni) d.k[id] = bugun;
  if (yeni.length) {
    for (const id of yeni) window.bumbaOlay?.('rozet-kazanildi', { rozet: id });
    bildir(yeni, v, d);
  }
  durumYaz(d);
}

document.addEventListener('rozet', (e) => isle((e as CustomEvent<Olay>).detail));
