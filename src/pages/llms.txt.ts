// /llms.txt: sitenin yapay zekâ yanıt motorları için özeti (Bumba Genel Standartlar §2, GEO).
// Derlemede üretilir; yeni şiir eklenince kendiliğinden güncellenir.
import type { APIRoute } from 'astro';
import { DUYGULAR } from '../data/duygular';
import { SITE } from '../data/site';
import { ad, imza, tumSiirler, yerler } from '../lib/siirler';
import { SAYFALAR, duyguYolu, metin, siirYoluDil, yerAdi, yerYoluDil } from '../i18n';

export const GET: APIRoute = async () => {
  const kok = `https://${SITE.alan}`;
  const tum = await tumSiirler();
  const tr = metin('tr');
  const en = metin('en');
  const satirlar = [
    `# ${SITE.ad}`,
    '',
    `> ${tr.site.ozet}`,
    '',
    `> ${en.site.ozet}`,
    '',
    `Şair: ${SITE.sair}. Şiirlerin tüm hakları saklıdır; alıntı yaparken şiirin adını ve bağlantısını verin, şiirin tamamını kopyalamayın.`,
    `Poet: ${SITE.sair}. All rights to the poems are reserved; when quoting, give the poem's title and link rather than reproducing it in full.`,
    `Site ${SITE.ad}, bir Bumba Life ürünüdür (Bumba Group, https://bumbagroup.com). İletişim: bilgi@bumbagroup.com`,
    '',
    '## Sayfalar / Pages',
    '',
    ...(['ana', 'siirler', 'harita', 'zaman', 'fal', 'hakkinda', 'arama', 'gizlilik'] as const).map(
      (k) => `- [${tr.sayfaAdlari[k]}](${kok}${SAYFALAR[k].tr}) · [${en.sayfaAdlari[k]}](${kok}${SAYFALAR[k].en})`,
    ),
    '',
    '## Duygular / Emotions',
    '',
    ...DUYGULAR.map(
      (d) => `- [${d.ad}](${kok}${duyguYolu(d.slug, 'tr')}) / [${d.en.ad}](${kok}${duyguYolu(d.slug, 'en')}): renk ${d.renkAdi} / colour ${d.en.renkAdi}`,
    ),
    '',
    '## Yerler / Places',
    '',
    ...yerler(tum).map((y) => `- [${y.ad}](${kok}${yerYoluDil(y.ad, 'tr')}) / [${yerAdi(y.ad, 'en')}](${kok}${yerYoluDil(y.ad, 'en')}): ${y.siirler.length}`),
    '',
    '## Şiirler / Poems',
    '',
    ...tum.map((s) => `- [${ad(s)}](${kok}${siirYoluDil(s.id, 'tr')})${imza(s) ? ` — ${imza(s)}` : ''}`),
    '',
  ];
  return new Response(satirlar.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
