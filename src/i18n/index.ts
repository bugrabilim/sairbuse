// Sitenin iki dili. Türkçe varsayılan ve kökte; İngilizce /en/ altında, kendi adresleriyle.
// Arayüzün bütün metinleri tr.ts ve en.ts'de. Şiirler çevrilmez: İngilizce sayfalarda da özgün Türkçeleriyle durur.
import { tr } from './tr';
import { en } from './en';
import type { DuyguSlug } from '../data/duygular';
import { yerSlug } from '../data/yerler';

export type Dil = 'tr' | 'en';
export const DILLER: Dil[] = ['tr', 'en'];
export type Metin = typeof tr;

const METINLER: Record<Dil, Metin> = { tr, en };

export function metin(dil: Dil): Metin {
  return METINLER[dil];
}

/** Sayfanın dili adresinden çıkar: /en/ ile başlıyorsa İngilizce */
export function dilBul(url: URL | string): Dil {
  const yol = typeof url === 'string' ? url : url.pathname;
  return yol === '/en' || yol.startsWith('/en/') ? 'en' : 'tr';
}

export const YEREL: Record<Dil, string> = { tr: 'tr-TR', en: 'en-GB' };
export const OG_YEREL: Record<Dil, string> = { tr: 'tr_TR', en: 'en_GB' };

// ---------- Adresler ----------

/** İngilizce duygu adresleri */
export const DUYGU_EN: Record<DuyguSlug, string> = {
  ask: 'love',
  ozlem: 'longing',
  huzun: 'sorrow',
  yalnizlik: 'loneliness',
  ayrilik: 'parting',
  karanlik: 'darkness',
  ozgurluk: 'freedom',
};

/** Sabit sayfaların iki dildeki adresleri */
export const SAYFALAR = {
  ana: { tr: '/', en: '/en/' },
  siirler: { tr: '/siirler/', en: '/en/poems/' },
  harita: { tr: '/harita/', en: '/en/map/' },
  zaman: { tr: '/zaman/', en: '/en/time/' },
  fal: { tr: '/fal/', en: '/en/fortune/' },
  hakkinda: { tr: '/hakkinda/', en: '/en/about/' },
  arama: { tr: '/arama/', en: '/en/search/' },
  gizlilik: { tr: '/gizlilik/', en: '/en/privacy/' },
} as const;
export type SayfaAdi = keyof typeof SAYFALAR;

export function sayfaYolu(ad: SayfaAdi, dil: Dil): string {
  return SAYFALAR[ad][dil];
}
export function siirYoluDil(id: string, dil: Dil): string {
  return dil === 'en' ? `/en/poem/${id}/` : `/siir/${id}/`;
}
export function duyguYolu(slug: DuyguSlug, dil: Dil): string {
  return dil === 'en' ? `/en/emotion/${DUYGU_EN[slug]}/` : `/duygu/${slug}/`;
}
export function yerYoluDil(ad: string, dil: Dil): string {
  return dil === 'en' ? `/en/place/${yerSlug(ad)}/` : `/yer/${yerSlug(ad)}/`;
}

/** Bir sayfanın öbür dildeki karşılığı (dil değiştirici ve hreflang için) */
export function karsilik(yol: string, hedef: Dil): string {
  const kaynak = dilBul(yol);
  if (kaynak === hedef) return yol;
  for (const s of Object.values(SAYFALAR)) {
    if (s[kaynak] === yol) return s[hedef];
  }
  const kurallar: [RegExp, (m: RegExpMatchArray) => string][] =
    hedef === 'en'
      ? [
          [/^\/siir\/([^/]+)\/$/, (m) => `/en/poem/${m[1]}/`],
          [/^\/duygu\/([^/]+)\/$/, (m) => `/en/emotion/${DUYGU_EN[m[1] as DuyguSlug] ?? m[1]}/`],
          [/^\/yer\/([^/]+)\/$/, (m) => `/en/place/${m[1]}/`],
        ]
      : [
          [/^\/en\/poem\/([^/]+)\/$/, (m) => `/siir/${m[1]}/`],
          [
            /^\/en\/emotion\/([^/]+)\/$/,
            (m) => `/duygu/${Object.entries(DUYGU_EN).find(([, v]) => v === m[1])?.[0] ?? m[1]}/`,
          ],
          [/^\/en\/place\/([^/]+)\/$/, (m) => `/yer/${m[1]}/`],
        ];
  for (const [desen, cevir] of kurallar) {
    const m = yol.match(desen);
    if (m) return cevir(m);
  }
  return SAYFALAR.ana[hedef];
}

// ---------- Tarih ----------

const AYLAR: Record<Dil, string[]> = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** "22 Ocak 2012" / "22 January 2012" */
export function uzunTarihDil(tarih: string, dil: Dil): string {
  const [y, a, g] = tarih.split('-').map(Number);
  return `${g} ${AYLAR[dil][a - 1]} ${y}`;
}
/** "22 Ocak" / "22 January" */
export function gunAyDil(tarih: string, dil: Dil): string {
  const [, a, g] = tarih.split('-').map(Number);
  return `${g} ${AYLAR[dil][a - 1]}`;
}

// ---------- Yer adları ----------

/** Şiirlerdeki yer adlarının İngilizcesi; listede olmayan özel adlar aynen kalır */
const YER_EN: Record<string, string> = {
  'Eminönü vapuru': 'Eminönü ferry',
  "Eyfel Kulesi'nin altı": 'Under the Eiffel Tower',
  evde: 'at home',
  'yer yok': 'nowhere',
  'Feneryolu, ev': 'Feneryolu, home',
  Ege: 'Aegean',
  vapurda: 'on the ferry',
  'Eyfel Kulesi · Paris': 'Eiffel Tower · Paris',
};

export function yerAdi(ad: string, dil: Dil): string {
  return dil === 'en' ? (YER_EN[ad] ?? ad) : ad;
}

/** "Moda'da yazılmış" ifadesinin yer kısmı: "Moda'da" / "in Moda" */
export function yerde(ad: string, dil: Dil): string {
  if (dil === 'en') {
    const y = yerAdi(ad, dil);
    return /^(under|on|at)\b/i.test(y) ? y.charAt(0).toLowerCase() + y.slice(1) : `in ${y}`;
  }
  const son = ad.trim().split(/\s+/).pop() ?? ad;
  const unluler = son.toLocaleLowerCase('tr').match(/[aıouöüei]/g);
  const unlu = unluler ? unluler[unluler.length - 1] : 'a';
  const kalin = 'aıou'.includes(unlu);
  const sert = /[çfhkpsştÇFHKPSŞT]$/.test(son);
  return `${ad}'${sert ? 't' : 'd'}${kalin ? 'a' : 'e'}`;
}

/** Sayı + şiir: "1 şiir", "3 şiir" / "1 poem", "3 poems" */
export function siirSayisi(n: number, dil: Dil): string {
  return dil === 'en' ? `${n} poem${n === 1 ? '' : 's'}` : `${n} şiir`;
}

/** Büyük harf, dile göre (Türkçede i → İ) */
export function buyuk(s: string, dil: Dil): string {
  return s.toLocaleUpperCase(YEREL[dil]);
}
export function kucuk(s: string, dil: Dil): string {
  return s.toLocaleLowerCase(YEREL[dil]);
}
