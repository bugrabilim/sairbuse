// iOS uygulaması için mi derleniyor? `npm run uygulama` PUBLIC_UYGULAMA=1 ile derler (dist-uygulama/).
// Uygulamada ziyaret sayacı yok, e-posta listesi siteye bağlanır, paylaşım iOS'un kendi paylaşım ekranıyla olur
// ve "Günün şiiri" bildirimi menüde açılır. Ayrıntı: uygulama/README.md
export const UYGULAMA = import.meta.env.PUBLIC_UYGULAMA === '1';

/** Uygulamanın dışarıdan açtığı site adresleri (e-posta listesi) */
export const SITE_KOK = 'https://duygularinpesinde.bumba.tr';

/** Tarayıcıda çalışan kodun uygulamanın içinde olup olmadığını anlaması (Capacitor köprüsü) */
export function yerelUygulama(): boolean {
  const c = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return c?.isNativePlatform?.() === true;
}
