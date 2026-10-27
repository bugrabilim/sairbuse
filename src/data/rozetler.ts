// Kazanım rozetleri (Bumba Genel Standartlar §13): kolaydan zora 18 rozet, her biri sitede gerçekten olan bir eyleme
// dayanır. Adlar ve koşullar çeviri dosyalarında (rozet.liste). Kimlikler dilden bağımsız ve sabittir: Umami'ye
// `rozet-kazanildi` olayıyla yalnız kimlik gider. Hesap src/scripts/rozetler.ts'de.
export const ROZETLER = [
  'ilk-siir',
  'ilk-ses',
  'fal',
  'cark',
  'paylas',
  'misra-karti',
  'uc-yer',
  'bes-siir',
  'yedi-duygu',
  'seri-3',
  'gece',
  'bir-duygu',
  'on-bes-siir',
  'on-yer',
  'butun-sesler',
  'seri-7',
  'bugun',
  'butun-siirler',
] as const;
export type RozetKimligi = (typeof ROZETLER)[number];

/** Tarayıcıdaki tek kayıt (localStorage) */
export const ROZET_ANAHTARI = 'rozetler';
