// Paylaşım görselleri (1200×630). Derleme sırasında satori ile SVG, sharp ile PNG üretilir.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '../data/site';
import { DUYGULAR } from '../data/duygular';
import { ad, anaDuygu, basliksiz, imza, kitalar, type Siir } from './siirler';

type Dugum = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Dugum => ({
  type,
  props: { style, children },
});

const YAZI = '#ece5d8';
const CORMORANT = 'Cormorant, Cormorant Ext';
const GARAMOND = 'Garamond, Garamond Ext';
const SOLUK = '#98a1b3';

async function yaziTipi(paket: string, dosya: string) {
  return readFile(join(process.cwd(), 'node_modules', '@fontsource', paket, 'files', dosya));
}

let onbellek: Awaited<ReturnType<typeof yaziTipleriniYukle>> | undefined;
async function yaziTipleriniYukle() {
  const liste: { name: string; file: [string, string]; weight: 400 | 500; style: 'normal' | 'italic' }[] = [];
  // Türkçe harfler (ş, ğ, İ) latin-ext alt kümesinde; satori aynı adlı dosyalar arasında geçiş yapmadığı
  // için alt kümeler ayrı adlarla yüklenip font-family listesinde yedek olarak verilir.
  for (const [alt, ek] of [['latin', ''], ['latin-ext', ' Ext']]) {
    liste.push(
      { name: `Cormorant${ek}`, file: ['cormorant-garamond', `cormorant-garamond-${alt}-500-italic.woff`], weight: 500, style: 'italic' },
      { name: `Cormorant${ek}`, file: ['cormorant-garamond', `cormorant-garamond-${alt}-500-normal.woff`], weight: 500, style: 'normal' },
      { name: `Garamond${ek}`, file: ['eb-garamond', `eb-garamond-${alt}-400-normal.woff`], weight: 400, style: 'normal' },
    );
  }
  return Promise.all(
    liste.map(async (f) => ({ name: f.name, weight: f.weight, style: f.style, data: await yaziTipi(...f.file) })),
  );
}

async function png(agac: Dugum): Promise<Uint8Array> {
  onbellek ??= await yaziTipleriniYukle();
  const svg = await satori(agac as never, { width: 1200, height: 630, fonts: onbellek });
  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}

/** Görselde gösterilecek mısralar: en fazla ~4 görsel satır */
function secilenMisralar(s: Siir): string[] {
  const sonuc: string[] = [];
  let satir = 0;
  for (const m of kitalar(s)[0]) {
    const kac = Math.max(1, Math.ceil(m.length / 38));
    if (sonuc.length && satir + kac > 4) break;
    sonuc.push(m.length > 120 ? `${m.slice(0, 118)}…` : m);
    satir += kac;
  }
  return sonuc;
}

export async function siirGorseli(s: Siir): Promise<Uint8Array> {
  const d = anaDuygu(s);
  const misralar = secilenMisralar(s);
  const devami = misralar.length < kitalar(s).flat().length;
  return png(
    h(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 80px',
        background: d.zeminGece,
        color: YAZI,
        fontFamily: GARAMOND,
      },
      [
        h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 30 }, [
          h('div', { display: 'flex', fontFamily: CORMORANT, fontStyle: 'italic', color: SOLUK }, SITE.ad),
          h('div', { display: 'flex', alignItems: 'center', color: d.gece, fontSize: 26, letterSpacing: 3 }, [
            h('div', {
              width: 18,
              height: 18,
              borderRadius: 9,
              background: d.nokta,
              border: `1px solid ${d.hepGece ? '#5a5650' : d.nokta}`,
              marginRight: 12,
            }),
            d.ad.toLocaleUpperCase('tr'),
          ]),
        ]),
        h(
          'div',
          { display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${d.gece}`, paddingLeft: 36 },
          [
            ...(!basliksiz(s)
              ? [h('div', { display: 'flex', fontFamily: CORMORANT, fontSize: 34, color: d.gece, marginBottom: 14 }, ad(s))]
              : []),
            ...misralar.map((m, i) =>
              h(
                'div',
                { display: 'flex', fontFamily: CORMORANT, fontStyle: 'italic', fontSize: 58, lineHeight: 1.18 },
                devami && i === misralar.length - 1 ? `${m} …` : m,
              ),
            ),
          ],
        ),
        h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 28, color: SOLUK }, [
          h('div', { display: 'flex' }, imza(s) || 'tarihsiz'),
          h('div', { display: 'flex', fontFamily: CORMORANT, fontStyle: 'italic' }, SITE.sair),
        ]),
      ],
    ),
  );
}

export async function siteGorseli(): Promise<Uint8Array> {
  return png(
    h(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 84px',
        background: '#0b1220',
        color: YAZI,
        fontFamily: GARAMOND,
      },
      [
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { display: 'flex', fontFamily: CORMORANT, fontStyle: 'italic', fontSize: 104, lineHeight: 1.05 }, SITE.ad),
          h(
            'div',
            { display: 'flex', fontFamily: CORMORANT, fontStyle: 'italic', fontSize: 44, color: SOLUK, marginTop: 24 },
            'Şiir kitabım ağlıyor!',
          ),
        ]),
        h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
          h(
            'div',
            { display: 'flex' },
            DUYGULAR.map((d) =>
              h('div', {
                width: 34,
                height: 34,
                borderRadius: 17,
                background: d.nokta,
                border: `1px solid ${d.hepGece ? '#5a5650' : d.nokta}`,
                marginRight: 14,
              }),
            ),
          ),
          h('div', { display: 'flex', fontSize: 28, color: SOLUK }, 'duygularinpesinde.bumba.tr'),
        ]),
      ],
    ),
  );
}
