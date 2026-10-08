// Site içi arama dizini: derlemede üretilir, yeni şiir eklenince kendiliğinden güncellenir.
// Her kayıt iki dilde başlık ve adres taşır; tarayıcı sayfanın diline göre seçer.
import type { APIRoute } from 'astro';
import { DUYGULAR, duyguAdi, renkAdi } from '../data/duygular';
import { ad, anaDuygu, imza, kitalar, siirYolu, tumSiirler, yerGrubu, yerler, yerYolu } from '../lib/siirler';
import { DILLER, SAYFALAR, duyguYolu, metin, yerAdi, type Dil, type SayfaAdi } from '../i18n';

type IkiDil = Record<Dil, string>;
const iki = (f: (d: Dil) => string): IkiDil => Object.fromEntries(DILLER.map((d) => [d, f(d)])) as IkiDil;

export const GET: APIRoute = async () => {
  const tum = await tumSiirler();
  const kayitlar = [
    ...tum.map((s) => {
      const d = anaDuygu(s);
      const yer = yerGrubu(s);
      return {
        tur: 'siir',
        baslik: iki(() => ad(s)),
        alt: iki((dil) => [imza(s, dil), duyguAdi(d, dil)].filter(Boolean).join(' · ')),
        href: iki((dil) => siirYolu(s, dil)),
        renk: d.nokta,
        satirlar: kitalar(s).flat(),
        // aranan metin: ad, şiirin tamamı, yer, tarih, duygular (iki dilde)
        metin: [
          ad(s),
          kitalar(s).flat().join(' '),
          s.data.yer ?? '',
          yer ?? '',
          ...DILLER.map((dil) => (yer ? yerAdi(yer, dil) : '')),
          s.data.tarih ?? '',
          s.data.tarih?.slice(0, 4) ?? '',
          ...s.data.duygular.flatMap((x) => DUYGULAR.filter((y) => y.slug === x).flatMap((y) => [y.ad, y.en.ad, y.renkAdi, y.en.renkAdi])),
        ].join(' '),
      };
    }),
    ...DUYGULAR.map((d) => ({
      tur: 'duygu',
      baslik: iki((dil) => duyguAdi(d, dil)),
      alt: iki((dil) => `${metin(dil).duygu.etiket(renkAdi(d, dil), tum.filter((s) => s.data.duygular.includes(d.slug)).length)}`),
      href: iki((dil) => duyguYolu(d.slug, dil)),
      renk: d.nokta,
      metin: [d.ad, d.en.ad, d.renkAdi, d.en.renkAdi, d.ilgi, ...d.misra].join(' '),
    })),
    ...yerler(tum).map((y) => ({
      tur: 'yer',
      baslik: iki((dil) => yerAdi(y.ad, dil)),
      alt: iki((dil) => `${metin(dil).yer.etiket} · ${y.siirler.length}`),
      href: iki((dil) => yerYolu(y.ad, dil)),
      renk: null,
      metin: [y.ad, ...DILLER.map((dil) => yerAdi(y.ad, dil))].join(' '),
    })),
    ...(['siirler', 'harita', 'zaman', 'fal', 'hakkinda', 'gizlilik'] as SayfaAdi[]).map((k) => ({
      tur: 'sayfa',
      baslik: iki((dil) => metin(dil).sayfaAdlari[k]),
      alt: iki(() => ''),
      href: iki((dil) => SAYFALAR[k][dil]),
      renk: null,
      // sayfanın adı, açıklaması ve giriş metinleri (iki dilde)
      metin: DILLER.flatMap((dil) => {
        const bolum = (metin(dil) as unknown as Record<string, Record<string, unknown>>)[k] ?? {};
        const yazilar = Object.values(bolum).filter((v): v is string => typeof v === 'string');
        return [metin(dil).sayfaAdlari[k], ...yazilar, k === 'hakkinda' ? metin(dil).site.ozet : ''];
      }).join(' '),
    })),
  ];
  return new Response(JSON.stringify(kayitlar), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
