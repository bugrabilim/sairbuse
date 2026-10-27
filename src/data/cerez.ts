// Çerez onayı (Bumba Genel Standartlar §14). Seçim tarayıcıda "bumba-cerez" anahtarında:
// {"surum": CEREZ_SURUMU, "istatistik": true|false}. Politika merkezde; sürümü değişince standardın "Sürüm
// notları"nda duyurulur, burası güncellenir ve seçim yeniden sorulur.
export const CEREZ_SURUMU = '2026-10-21';
export const CEREZ_ANAHTARI = 'bumba-cerez';
export const cerezPolitikasi = (dil: 'tr' | 'en') =>
  dil === 'en' ? 'https://bumbagroup.com/cerez-politikasi?dil=en' : 'https://bumbagroup.com/cerez-politikasi';
