import { getCollection, type CollectionEntry } from 'astro:content';
import { duygu, type Duygu } from '../data/duygular';

export type Siir = CollectionEntry<'siirler'>;

const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

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

export function uzunTarih(tarih: string): string {
  const [y, a, g] = tarih.split('-').map(Number);
  return `${g} ${AYLAR[a - 1]} ${y}`;
}

export function gunAy(tarih: string): string {
  const [, a, g] = tarih.split('-').map(Number);
  return `${g} ${AYLAR[a - 1]}`;
}

/** Şairin kendi biçimi: "18.07.2011 – Moda" */
export function imza(s: Siir): string {
  const p: string[] = [];
  if (s.data.tarih) p.push(tarihYaz(s.data.tarih));
  if (s.data.yer) p.push(s.data.yer);
  return p.join(' – ');
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

export function siirYolu(s: Siir): string {
  return `/siir/${s.id}/`;
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
export function kapilar(s: Siir, tum: Siir[]): Kapi[] {
  const sonuc: Kapi[] = [];
  const d = anaDuygu(s);
  const ayniDuygu = sonraki(s, tum, (x) => x.data.duygular.includes(d.slug));
  if (ayniDuygu) sonuc.push({ etiket: 'Aynı duygudan', deger: d.ad.toLocaleLowerCase('tr'), siir: ayniDuygu });

  const yer = yerGrubu(s);
  const ayniYer = yer ? sonraki(s, tum, (x) => yerGrubu(x) === yer) : undefined;
  if (yer && ayniYer) sonuc.push({ etiket: 'Aynı yerden', deger: yer, siir: ayniYer });

  const y = yil(s);
  const ayniYil = y ? sonraki(s, tum, (x) => yil(x) === y) : undefined;
  if (y && ayniYil) sonuc.push({ etiket: 'Aynı yıldan', deger: y, siir: ayniYil });

  return sonuc;
}

/** Tarayıcı tarafı betikler için hafif şiir verisi */
export function istemciVerisi(s: Siir) {
  return {
    id: s.id,
    ad: ad(s),
    basliksiz: basliksiz(s),
    imza: imza(s),
    tarih: s.data.tarih ?? null,
    yer: yerGrubu(s) ?? null,
    duygu: anaDuygu(s).slug,
    kitalar: kitalar(s),
  };
}

/** Takvimde anlamı olan günler (AA-GG) */
export const OZEL_GUNLER: Record<string, string> = {
  '12-21': 'yılın en uzun gecesi',
};

/** Türkçe bulunma eki: Moda'da, Söğüt'te, Cihangir'de */
export function bulunma(yer: string): string {
  const son = yer.trim().split(/\s+/).pop() ?? yer;
  const unluler = son.toLocaleLowerCase('tr').match(/[aıouöüei]/g);
  const unlu = unluler ? unluler[unluler.length - 1] : 'a';
  const kalin = 'aıou'.includes(unlu);
  const sert = /[çfhkpsştÇFHKPSŞT]$/.test(son);
  return `${yer}'${sert ? 't' : 'd'}${kalin ? 'a' : 'e'}`;
}
