// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { karsilik } from './src/i18n/index.ts';

const SITE = 'https://duygularinpesinde.bumba.tr';

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // Hata sayfaları ve içerik paneli haritaya girmez
      filter: (url) => !/\/(404|500)\/?$/.test(new URL(url).pathname) && !new URL(url).pathname.startsWith('/admin'),
      // Her sayfanın iki dildeki karşılığı (hreflang), Google'ın beklediği biçimde
      serialize(oge) {
        const yol = new URL(oge.url).pathname;
        const tr = SITE + karsilik(yol, 'tr');
        const en = SITE + karsilik(yol, 'en');
        oge.links = [
          { lang: 'tr', url: tr },
          { lang: 'en', url: en },
          { lang: 'x-default', url: tr },
        ];
        return oge;
      },
    }),
  ],
});
