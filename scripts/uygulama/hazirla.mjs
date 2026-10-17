// iOS uygulamasının içine gömülecek siteyi ayıklar: dist-uygulama/ içinden uygulamada işe yaramayan dosyalar
// (içerik paneli, paylaşım önizleme görselleri, site haritası, robots, Cloudflare başlıkları) silinir.
// `npm run uygulama` içinde, astro build'den sonra ve cap sync'ten önce çalışır.
import { rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const kok = fileURLToPath(new URL('../../dist-uygulama/', import.meta.url));
const silinecek = ['admin', 'og', 'robots.txt', '_headers', 'llms.txt'];
for (const ad of await readdir(kok)) {
  if (silinecek.includes(ad) || ad.startsWith('sitemap')) {
    await rm(kok + ad, { recursive: true, force: true });
    console.log('çıkarıldı:', ad);
  }
}
