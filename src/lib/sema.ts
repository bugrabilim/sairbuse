// Sayfaların JSON-LD yapılandırılmış verisi (Bumba Genel Standartlar §2). Her sayfada kuruluş, site ve şair;
// sayfa türüne göre ek olarak şiir (CreativeWork), koleksiyon, kırıntı yolu ve sık sorulanlar.
import { SITE } from '../data/site';
import { metin, sayfaYolu, type Dil } from '../i18n';
import { ad, ilkMisra, siirYolu, yerGrubu, type Siir } from './siirler';
import { yerAdi } from '../i18n';

export const KOK = `https://${SITE.alan}`;
const tam = (yol: string) => new URL(yol, KOK).href;

export type Sema = Record<string, unknown>;

/** Her sayfada bulunan ortak düğümler */
export function ortakSema(dil: Dil): Sema[] {
  return [
    {
      '@type': 'Organization',
      '@id': `${KOK}/#kurulus`,
      name: SITE.ad,
      url: tam(sayfaYolu('ana', dil)),
      logo: tam('/icon-512.png'),
      email: 'bilgi@bumbagroup.com',
      parentOrganization: { '@type': 'Organization', name: 'Bumba Group', url: 'https://bumbagroup.com' },
    },
    {
      '@type': 'WebSite',
      '@id': `${KOK}/#site`,
      name: SITE.ad,
      alternateName: 'In Pursuit of Emotions',
      url: tam(sayfaYolu('ana', dil)),
      description: metin(dil).site.aciklama,
      inLanguage: ['tr', 'en'],
      publisher: { '@id': `${KOK}/#kurulus` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${tam(sayfaYolu('arama', dil))}?q={sorgu}` },
        'query-input': 'required name=sorgu',
      },
    },
    { '@type': 'Person', '@id': `${KOK}/#sair`, name: SITE.sair },
  ];
}

/** Ana sayfadan başlayan kırıntı yolu */
export function kirintiSema(dil: Dil, adimlar: { ad: string; yol: string }[]): Sema {
  const hepsi = [{ ad: metin(dil).sayfaAdlari.ana, yol: sayfaYolu('ana', dil) }, ...adimlar];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: hepsi.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.ad, item: tam(a.yol) })),
  };
}

/** Tek bir şiir: şiir türünde yaratıcı eser */
export function siirSema(s: Siir, dil: Dil, gorsel: string): Sema {
  const yer = yerGrubu(s);
  return {
    '@type': 'CreativeWork',
    '@id': `${tam(siirYolu(s, 'tr'))}#siir`,
    genre: dil === 'en' ? 'Poetry' : 'Şiir',
    name: ad(s),
    abstract: ilkMisra(s),
    url: tam(siirYolu(s, dil)),
    inLanguage: 'tr',
    author: { '@id': `${KOK}/#sair` },
    publisher: { '@id': `${KOK}/#kurulus` },
    isPartOf: { '@id': `${KOK}/#site` },
    image: tam(gorsel),
    ...(s.data.tarih ? { dateCreated: s.data.tarih } : {}),
    ...(yer ? { locationCreated: { '@type': 'Place', name: yerAdi(yer, dil) } } : {}),
    copyrightHolder: { '@id': `${KOK}/#sair` },
    copyrightNotice: dil === 'en' ? 'All rights reserved.' : 'Tüm hakları saklıdır.',
  };
}

/** Bir şiir koleksiyonu sayfası (duygu, yer, bütün şiirler) */
export function koleksiyonSema(baslik: string, yol: string, siirler: Siir[], dil: Dil): Sema {
  return {
    '@type': 'CollectionPage',
    name: baslik,
    url: tam(yol),
    inLanguage: dil,
    isPartOf: { '@id': `${KOK}/#site` },
    hasPart: siirler.map((s) => ({ '@type': 'CreativeWork', name: ad(s), url: tam(siirYolu(s, dil)) })),
  };
}

/** Soru-cevap blokları */
export function sssSema(sorular: { soru: string; cevap: string }[]): Sema {
  return {
    '@type': 'FAQPage',
    mainEntity: sorular.map((x) => ({ '@type': 'Question', name: x.soru, acceptedAnswer: { '@type': 'Answer', text: x.cevap } })),
  };
}
