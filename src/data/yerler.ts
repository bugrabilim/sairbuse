// Haritadaki yerler. Anahtarlar şiirlerdeki "yerGrubu" (yoksa "yer") değeriyle aynı olmalı.
// Konumlar yaklaşık; amaç semti göstermek.
export interface HaritaYeri {
  enlem: number;
  boylam: number;
  /** Etiketin işaretin hangi yanında duracağı */
  yon: 'sag' | 'sol';
  /** Haritada yazılacak kısa ad */
  etiket?: string;
  /** Etiketin dikey kayması (yakın yerlerin etiketleri çakışmasın diye) */
  etiketY?: number;
}

export const HARITA_YERLERI: Record<string, HaritaYeri> = {
  Cihangir: { enlem: 41.0315, boylam: 28.983, yon: 'sag' },
  Sirkeci: { enlem: 41.0145, boylam: 28.977, yon: 'sol' },
  'Eminönü vapuru': { enlem: 41.006, boylam: 29.0, yon: 'sol', etiket: 'vapurda' },
  Altunizade: { enlem: 41.0215, boylam: 29.044, yon: 'sag' },
  Kalkedon: { enlem: 40.9915, boylam: 29.024, yon: 'sol' },
  'Walters Cafe, Kadıköy': { enlem: 40.9858, boylam: 29.0268, yon: 'sag', etiket: 'Walters Cafe', etiketY: 12 },
  Karga: { enlem: 40.9874, boylam: 29.0291, yon: 'sag', etiket: 'Karga', etiketY: -6 },
  Moda: { enlem: 40.98, boylam: 29.026, yon: 'sol' },
  Feneryolu: { enlem: 40.9795, boylam: 29.0535, yon: 'sag', etiketY: 30 },
  Burgazada: { enlem: 40.88, boylam: 29.067, yon: 'sol', etiket: 'Burgazada · Antigoni' },
  Büyükada: { enlem: 40.858, boylam: 29.12, yon: 'sol' },
};

/** Haritanın dışında kalan yerler için kısa açıklama */
export const UZAK_YERLER: Record<string, string> = {
  Söğüt: 'Marmaris',
  İzmir: 'Ege',
  "Eyfel Kulesi'nin altı": 'Paris',
};

/** Haritada ya da uzak yerlerde adı geçen gerçek bir yer mi ("evde", "yer yok" değil) */
export function gercekYer(ad?: string): ad is string {
  return !!ad && (ad in HARITA_YERLERI || ad in UZAK_YERLER);
}

export function yerSlug(ad: string): string {
  return ad
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
