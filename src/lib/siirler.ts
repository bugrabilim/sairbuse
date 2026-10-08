import { getCollection, type CollectionEntry } from 'astro:content';
import { duygu, type Duygu } from '../data/duygular';
import { gercekYer, yerSlug } from '../data/yerler';
import { duyguAdi } from '../data/duygular';
import { gunAyDil, siirYoluDil, uzunTarihDil, yerAdi, yerYoluDil, metin, type Dil } from '../i18n';

export type Siir = CollectionEntry<'siirler'>;

/** Tarihliler eskiden yeniye, tarihsizler sonda. */
function sirala(a: Siir, b: Siir): number {
  const ta = a.data.tarih;
  const tb = b.data.tarih;
  if (ta && tb) return ta.localeCompare(tb);
  if (ta) return -1;
  if (tb) return 1;
  return a.id.localeCompare(b.id, 'tr');
}

export async function tumSiirler(): Promise<Siir[]> {
  const liste = await getCollection('siirler');
  return liste.sort(sirala);
}

/** Boş satırla ayrılmış kıtalar, her kıta mısralar dizisi. Mısralar asla birleştirilmez. */
export function kitalar(s: Siir): string[][] {
  return (s.body ?? '')
    .replace(/\r/g, '')
    .trim()
    .split(/\n[ \t]*\n/)
    .map((k) => k.split('\n').map((m) => m.trimEnd()));
}

export function ilkMisra(s: Siir): string {
  return kitalar(s)[0]?.[0] ?? '';
}

export function basliksiz(s: Siir): boolean {
  return !s.data.baslik;
}

/** Şiirin adı: kendi adı, yoksa ilk mısrası. */
export function ad(s: Siir): string {
  return s.data.baslik ?? ilkMisra(s).replace(/[,;:]+$/, '');
}

export function tarihYaz(tarih: string): string {
  const [y, a, g] = tarih.split('-');
  return `${g}.${a}.${y}`;
}

export function uzunTarih(tarih: string, dil: Dil = 'tr'): string {
  return uzunTarihDil(tarih, dil);
}

export function gunAy(tarih: string, dil: Dil = 'tr'): string {
  return gunAyDil(tarih, dil);
}

/** Şairin kendi biçimi: "18.07.2011 – Moda" (İngilizcede yer adı çevrilir: "evde" → "at home") */
export function imza(s: Siir, dil: Dil = 'tr'): string {
  const p: string[] = [];
  if (s.data.tarih) p.push(tarihYaz(s.data.tarih));
  if (s.data.yer) p.push(yerAdi(s.data.yer, dil));
  return p.join(' – ');
}

export interface SahneBasligi {
  baslik: string;
  alt: string;
  /** ad: şiirin kendi adı; yer: yazıldığı yer; tarih: yalnız tarih; ilk: ilk mısra */
  tur: 'ad' | 'yer' | 'tarih' | 'ilk';
}

/** Fotoğrafın üstündeki büyük başlık: adı, yoksa yeri, yoksa tarihi, o da yoksa ilk mısrası. */
export function sahneBasligi(s: Siir, dil: Dil = 'tr'): SahneBasligi {
  const { baslik, tarih } = s.data;
  const yer = s.data.yer ? yerAdi(s.data.yer, dil) : undefined;
  const t = tarih ? uzunTarih(tarih, dil) : '';
  const tarihsiz = metin(dil).genel.tarihsiz;
  if (baslik) return { baslik, alt: [yer, t].filter(Boolean).join(' · '), tur: 'ad' };
  if (yer) return { baslik: yer, alt: t || tarihsiz, tur: 'yer' };
  if (t) return { baslik: t, alt: '', tur: 'tarih' };
  return { baslik: ad(s), alt: tarihsiz, tur: 'ilk' };
}

export function yil(s: Siir): string | undefined {
  return s.data.tarih?.slice(0, 4);
}

export function yerGrubu(s: Siir): string | undefined {
  return s.data.yerGrubu ?? s.data.yer;
}

export function anaDuygu(s: Siir): Duygu {
  return duygu(s.data.duygular[0]);
}

export function siirDuygulari(s: Siir): Duygu[] {
  return s.data.duygular.map(duygu);
}

export function siirYolu(s: Siir, dil: Dil = 'tr'): string {
  return siirYoluDil(s.id, dil);
}

/** Listede s'den sonra gelen ve koşula uyan ilk şiir (başa sararak). */
function sonraki(s: Siir, tum: Siir[], kosul: (x: Siir) => boolean): Siir | undefined {
  const i = tum.findIndex((x) => x.id === s.id);
  for (let k = 1; k < tum.length; k++) {
    const x = tum[(i + k) % tum.length];
    if (kosul(x)) return x;
  }
  return undefined;
}

export interface Kapi {
  etiket: string;
  deger: string;
  siir: Siir;
}

/** Bir şiirden çıkan üç kapı: aynı duygu, aynı yer, aynı yıl. */
export function kapilar(s: Siir, tum: Siir[], dil: Dil = 'tr'): Kapi[] {
  const sonuc: Kapi[] = [];
  const m = metin(dil).siir;
  const d = anaDuygu(s);
  const ayniDuygu = sonraki(s, tum, (x) => x.data.duygular.includes(d.slug));
  if (ayniDuygu) sonuc.push({ etiket: m.ayniDuygudan, deger: duyguAdi(d, dil).toLocaleLowerCase(dil), siir: ayniDuygu });

  const yer = yerGrubu(s);
  const ayniYer = yer ? sonraki(s, tum, (x) => yerGrubu(x) === yer) : undefined;
  if (yer && ayniYer) sonuc.push({ etiket: m.ayniYerden, deger: yerAdi(yer, dil), siir: ayniYer });

  const y = yil(s);
  const ayniYil = y ? sonraki(s, tum, (x) => yil(x) === y) : undefined;
  if (y && ayniYil) sonuc.push({ etiket: m.ayniYildan, deger: y, siir: ayniYil });

  return sonuc;
}

/** Tarayıcı tarafı betikler için hafif şiir verisi */
export function istemciVerisi(s: Siir, dil: Dil = 'tr') {
  const y = yerGrubu(s);
  return {
    id: s.id,
    ad: ad(s),
    basliksiz: basliksiz(s),
    imza: imza(s, dil),
    tarih: s.data.tarih ?? null,
    yer: y ? yerAdi(y, dil) : null,
    duygu: anaDuygu(s).slug,
    kitalar: kitalar(s),
    sahne: sahneBasligi(s, dil),
    href: siirYolu(s, dil),
  };
}

/** Takvimde anlamı olan günler (AA-GG) */
export const OZEL_GUNLER: Record<string, string> = metin('tr').ozelGunler;

/** Türkçe bulunma eki: Moda'da, Söğüt'te, Cihangir'de */
export function bulunma(yer: string): string {
  const son = yer.trim().split(/\s+/).pop() ?? yer;
  const unluler = son.toLocaleLowerCase('tr').match(/[aıouöüei]/g);
  const unlu = unluler ? unluler[unluler.length - 1] : 'a';
  const kalin = 'aıou'.includes(unlu);
  const sert = /[çfhkpsştÇFHKPSŞT]$/.test(son);
  return `${yer}'${sert ? 't' : 'd'}${kalin ? 'a' : 'e'}`;
}

export interface Yer {
  ad: string;
  slug: string;
  siirler: Siir[];
}

/** Şiirlerin yazıldığı gerçek yerler ("evde", "yer yok" hariç), en çok şiir yazılandan başlayarak */
export function yerler(tum: Siir[]): Yer[] {
  const harita = new Map<string, Siir[]>();
  for (const s of tum) {
    const y = yerGrubu(s);
    if (!gercekYer(y)) continue;
    harita.set(y, [...(harita.get(y) ?? []), s]);
  }
  return [...harita.entries()]
    .map(([ad, siirler]) => ({ ad, slug: yerSlug(ad), siirler }))
    .sort((a, b) => b.siirler.length - a.siirler.length || a.ad.localeCompare(b.ad, 'tr'));
}

export function yerYolu(ad: string, dil: Dil = 'tr'): string {
  return yerYoluDil(ad, dil);
}
