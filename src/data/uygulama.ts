// iOS uygulaması için mi derleniyor? `npm run uygulama` PUBLIC_UYGULAMA=1 ile derler (dist-uygulama/).
// Uygulamada ziyaret sayacı yok, e-posta listesi siteye bağlanır, paylaşım iOS'un kendi paylaşım ekranıyla olur
// ve "Günün şiiri" bildirimi menüde açılır. Ayrıntı: uygulama/README.md
export const UYGULAMA = import.meta.env.PUBLIC_UYGULAMA === '1';

/** App Store sayfası (Apple ID). Uygulama App Store'da yayına girince `yayinda: true` yapılır; o zamana dek sitede
 *  bağlantı ve Safari'nin uygulama şeridi görünmez (yayında olmayan uygulamanın sayfası açılmaz). Durumu GitHub
 *  Actions → "iOS mağaza durumu" yazar. */
export const APP_STORE = { kimlik: '6824072247', yayinda: false } as const;

/** Sitede App Store bağlantısı ve uygulama şeridi gösterilsin mi (uygulamanın kendi içinde gösterilmez) */
export const MAGAZA_GORUNUR = APP_STORE.yayinda && !UYGULAMA;

export const appStoreAdresi = (dil: 'tr' | 'en') => `https://apps.apple.com/${dil === 'en' ? 'us' : 'tr'}/app/id${APP_STORE.kimlik}`;

/** Uygulamanın dışarıdan açtığı site adresleri (e-posta listesi) */
export const SITE_KOK = 'https://duygularinpesinde.bumba.tr';

/** Tarayıcıda çalışan kodun uygulamanın içinde olup olmadığını anlaması (Capacitor köprüsü) */
export function yerelUygulama(): boolean {
  const c = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return c?.isNativePlatform?.() === true;
}
