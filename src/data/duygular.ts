// Her duygunun rengi şiirlerin içinden geliyor; "misra" o rengin geçtiği dizeler.
export const DUYGU_SLUGLARI = [
  'ask',
  'ozlem',
  'huzun',
  'yalnizlik',
  'ayrilik',
  'karanlik',
  'ozgurluk',
] as const;

export type DuyguSlug = (typeof DUYGU_SLUGLARI)[number];

export interface Duygu {
  slug: DuyguSlug;
  ad: string;
  /** "Bugün neyin peşindesin?" sorusunun cevabı: "aşkın", "özlemin"… */
  ilgi: string;
  renkAdi: string;
  /** Gece temasında yazı/vurgu rengi */
  gece: string;
  /** Gündüz temasında yazı/vurgu rengi */
  gunduz: string;
  zeminGece: string;
  zeminGunduz: string;
  /** Liste noktaları ve paylaşım görselleri için */
  nokta: string;
  /** Gündüz temasında da sayfayı karanlıkta tut */
  hepGece?: boolean;
  /** Fotoğrafın ışıkları bu iki renk arasında boyanır (üstten alta) */
  isik: [string, string];
  /** Fotoğrafın gölgeleri en az bu kadar aydınlık kalır */
  golge: string;
  misra: string[];
  /** Mısranın geçtiği şiir */
  kaynak: string;
}

export const DUYGULAR: Duygu[] = [
  {
    slug: 'ask',
    ad: 'Aşk',
    ilgi: 'aşkın',
    renkAdi: 'pembe',
    gece: '#e891b2',
    gunduz: '#a3335f',
    zeminGece: '#21111a',
    zeminGunduz: '#f7e8ee',
    nokta: '#e891b2',
    isik: ['#f8d6e2', '#ea8db0'],
    golge: '#2a0e1a',
    misra: ['Koklamaya kıyamadığım pembe küpe çiçeğim'],
    kaynak: '2021-06-23-sogut',
  },
  {
    slug: 'ozlem',
    ad: 'Özlem',
    ilgi: 'özlemin',
    renkAdi: 'kayısı',
    gece: '#f2a766',
    gunduz: '#9a5114',
    zeminGece: '#21160e',
    zeminGunduz: '#f8ecde',
    nokta: '#f2a766',
    isik: ['#f9e0c6', '#f0a25f'],
    golge: '#2b1608',
    misra: ['Kayısılarım', 'Çocukluğum kayıp'],
    kaynak: '2018-08-18-buyukada',
  },
  {
    slug: 'huzun',
    ad: 'Hüzün',
    ilgi: 'hüznün',
    renkAdi: 'sarı',
    gece: '#ebcb52',
    gunduz: '#735c00',
    zeminGece: '#1f1b0b',
    zeminGunduz: '#f7f0d4',
    nokta: '#ebcb52',
    isik: ['#f7e6a8', '#efc444'],
    golge: '#2a1d06',
    misra: ['Üstünde kaldı sarı kediler'],
    kaynak: 'sari',
  },
  {
    slug: 'yalnizlik',
    ad: 'Yalnızlık',
    ilgi: 'yalnızlığın',
    renkAdi: 'gri',
    gece: '#aab0b7',
    gunduz: '#545a61',
    zeminGece: '#16181b',
    zeminGunduz: '#ebebe9',
    nokta: '#9aa1a9',
    isik: ['#e3e6ea', '#a5adb6'],
    golge: '#111418',
    misra: ['Gri bir kahve içerim.'],
    kaynak: '2017-11-24-kadikoy',
  },
  {
    slug: 'ayrilik',
    ad: 'Ayrılık',
    ilgi: 'ayrılığın',
    renkAdi: 'siyah',
    gece: '#d8d2c8',
    gunduz: '#1a1714',
    zeminGece: '#030303',
    zeminGunduz: '#030303',
    nokta: '#050505',
    hepGece: true,
    isik: ['#d9d4cc', '#8f8981'],
    golge: '#000000',
    misra: ['Sensizliğin rengi “siyah”'],
    kaynak: '2012-06-03-eyfel',
  },
  {
    slug: 'karanlik',
    ad: 'Karanlık',
    ilgi: 'karanlığın',
    renkAdi: 'mor',
    gece: '#b991ea',
    gunduz: '#61359a',
    zeminGece: '#160e21',
    zeminGunduz: '#efe6f7',
    nokta: '#a77ade',
    isik: ['#e2d2f6', '#9c70d8'],
    golge: '#160a25',
    misra: ['Parmaklarım var, mor mosmor'],
    kaynak: '2011-10-24-antigoni',
  },
  {
    slug: 'ozgurluk',
    ad: 'Özgürlük',
    ilgi: 'özgürlüğün',
    renkAdi: 'turuncu',
    gece: '#f4874f',
    gunduz: '#a6430c',
    zeminGece: '#22110a',
    zeminGunduz: '#fbe8dc',
    nokta: '#f4874f',
    isik: ['#ffdcc2', '#ff8c45'],
    golge: '#2b1206',
    misra: ['Turuncu bir gemide olsam şimdi'],
    kaynak: '2012-12-21-eminonu-vapuru',
  },
];

export function duygu(slug: DuyguSlug): Duygu {
  const d = DUYGULAR.find((x) => x.slug === slug);
  if (!d) throw new Error(`Bilinmeyen duygu: ${slug}`);
  return d;
}

/** Sayfayı bir duygunun rengine boyamak için CSS değişkenleri */
export function duyguStili(d: Duygu): string {
  return [
    `--d-gece:${d.gece}`,
    `--d-gunduz:${d.gunduz}`,
    `--z-gece:${d.zeminGece}`,
    `--z-gunduz:${d.zeminGunduz}`,
    `--nokta:${d.nokta}`,
    `--ton-ust:${d.isik[0]}`,
    `--ton-alt:${d.isik[1]}`,
    `--ton-golge:${d.golge}`,
  ].join(';');
}
