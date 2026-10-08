// Paylaşım görselleri (1200×630, JPEG). Derleme sırasında şiirin fotoğrafı sharp ile siyah beyaza çekilip
// duygunun rengine boyanır (sitedeki gibi), üstüne satori ile yazı basılır.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '../data/site';
import { duyguAdi, type Duygu } from '../data/duygular';
import { buyuk, type Dil } from '../i18n';
import { anaDuygu, kitalar, sahneBasligi, type Siir } from './siirler';
import { kunye, siirFotografi } from './foto';

type Dugum = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Dugum => ({
  type,
  props: { style, children },
});

const W = 1200;
const H = 630;
const YAZI = '#f1eadf';
const SOLUK = '#c9c0b2';
const FRAUNCES = 'Fraunces, Fraunces Ext';
const INTER = 'Inter, Inter Ext';

async function yaziTipi(paket: string, dosya: string) {
  return readFile(join(process.cwd(), 'node_modules', '@fontsource', paket, 'files', dosya));
}

let onbellek: Awaited<ReturnType<typeof yaziTipleriniYukle>> | undefined;
async function yaziTipleriniYukle() {
  const liste: { name: string; file: [string, string]; weight: 300 | 600; style: 'normal' | 'italic' }[] = [];
  // Türkçe harfler (ş, ğ, İ) latin-ext alt kümesinde; satori aynı adlı dosyalar arasında geçiş yapmadığı
  // için alt kümeler ayrı adlarla yüklenip font-family listesinde yedek olarak verilir.
  for (const [alt, ek] of [['latin', ''], ['latin-ext', ' Ext']]) {
    liste.push(
      { name: `Fraunces${ek}`, file: ['fraunces', `fraunces-${alt}-300-italic.woff`], weight: 300, style: 'italic' },
      { name: `Fraunces${ek}`, file: ['fraunces', `fraunces-${alt}-300-normal.woff`], weight: 300, style: 'normal' },
      { name: `Inter${ek}`, file: ['inter', `inter-${alt}-600-normal.woff`], weight: 600, style: 'normal' },
    );
  }
  return Promise.all(
    liste.map(async (f) => ({ name: f.name, weight: f.weight, style: f.style, data: await yaziTipi(...f.file) })),
  );
}

function renk(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Sitedeki CSS'in aynısı: gri ton × ışık rengi (multiply), en az gölge rengi kadar aydınlık (lighten) */
async function ikiliTon(s: Siir, d: Duygu): Promise<Buffer | null> {
  const f = siirFotografi(s);
  if (!f) return null;
  const yol = join(process.cwd(), 'src', 'assets', 'foto', `${f.id}.jpg`);
  const meta = await sharp(yol).metadata();
  const olcek = Math.max(W / meta.width!, H / meta.height!);
  const rw = Math.ceil(meta.width! * olcek);
  const rh = Math.ceil(meta.height! * olcek);
  const [ox, oy] = (f.odak ?? '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
  const gri = await sharp(yol)
    .resize(rw, rh)
    .extract({ left: Math.round((rw - W) * ox), top: Math.round((rh - H) * oy), width: W, height: H })
    .toColourspace('b-w')
    .raw()
    .toBuffer();
  const ust = renk(d.isik[0]);
  const alt = renk(d.isik[1]);
  const golge = renk(d.golge);
  const cikti = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    const isik = [0, 1, 2].map((k) => ust[k] + (alt[k] - ust[k]) * t);
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      // contrast(1.18) brightness(.92)
      const l = Math.min(1, Math.max(0, (gri[i] / 255 - 0.5) * 1.18 + 0.5)) * 0.92;
      for (let k = 0; k < 3; k++) cikti[i * 3 + k] = Math.max(golge[k], l * isik[k]);
    }
  }
  return sharp(cikti, { raw: { width: W, height: H, channels: 3 } })
    .png()
    .toBuffer();
}

async function png(agac: Dugum, arka: Buffer | null, zemin: string): Promise<Uint8Array> {
  onbellek ??= await yaziTipleriniYukle();
  const svg = await satori(agac as never, { width: W, height: H, fonts: onbellek });
  const taban = arka ? sharp(arka) : sharp({ create: { width: W, height: H, channels: 3, background: zemin } });
  return new Uint8Array(await taban.composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
}

/** Görselde gösterilecek mısralar: en fazla ~2 görsel satır */
function secilenMisralar(s: Siir): string[] {
  const sonuc: string[] = [];
  let satir = 0;
  for (const m of kitalar(s)[0]) {
    const kac = Math.max(1, Math.ceil(m.length / 42));
    if (sonuc.length && satir + kac > 2) break;
    sonuc.push(m.length > 90 ? `${m.slice(0, 88)}…` : m);
    satir += kac;
  }
  return sonuc;
}

function etiket(metin: string, renk = YAZI): Dugum {
  return h('div', { display: 'flex', fontFamily: INTER, fontWeight: 600, fontSize: 20, letterSpacing: 5, color: renk }, metin);
}

export async function siirGorseli(s: Siir, dil: Dil = 'tr'): Promise<Uint8Array> {
  const d = anaDuygu(s);
  const foto = siirFotografi(s);
  const b = sahneBasligi(s, dil);
  const misralar = secilenMisralar(s);
  const devami = misralar.length < kitalar(s).flat().length;
  const baslikBoyu = b.baslik.length > 22 ? 58 : b.baslik.length > 12 ? 78 : 104;
  return png(
    h(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        color: YAZI,
        backgroundImage: `linear-gradient(90deg, ${d.zeminGece}f2 0%, ${d.zeminGece}b3 45%, ${d.zeminGece}00 80%)`,
      },
      [
        h('div', { display: 'flex', alignItems: 'center' }, [
          etiket(SITE.ad.toLocaleUpperCase('tr')),
          h('div', { display: 'flex', width: 12, height: 12, borderRadius: 6, background: d.nokta, margin: '0 16px', border: `1px solid ${YAZI}55` }),
          etiket(buyuk(duyguAdi(d, dil), dil)),
        ]),
        h('div', { display: 'flex', flexDirection: 'column', maxWidth: 760 }, [
          h(
            'div',
            {
              display: 'flex',
              fontFamily: FRAUNCES,
              fontWeight: 300,
              fontStyle: b.tur === 'ilk' ? 'italic' : 'normal',
              fontSize: baslikBoyu,
              lineHeight: 1,
              letterSpacing: -2,
            },
            b.baslik,
          ),
          ...(b.alt
            ? [h('div', { display: 'flex', fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: 30, color: SOLUK, marginTop: 14 }, b.alt)]
            : []),
          h(
            'div',
            { display: 'flex', flexDirection: 'column', marginTop: 34 },
            misralar.map((m, i) =>
              h(
                'div',
                { display: 'flex', fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: 36, lineHeight: 1.25 },
                devami && i === misralar.length - 1 ? `${m} …` : m,
              ),
            ),
          ),
        ]),
        h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, [
          h('div', { display: 'flex', fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: 30, color: SOLUK }, `— ${SITE.sair}`),
          // Fotoğrafın künyesi (CC lisansları fotoğrafçının adını istiyor)
          ...(foto ? [h('div', { display: 'flex', fontFamily: INTER, fontWeight: 600, fontSize: 14, color: SOLUK }, `${kunye(foto, dil)} · Wikimedia Commons`)] : []),
        ]),
      ],
    ),
    await ikiliTon(s, d),
    d.zeminGece,
  );
}

export async function siteGorseli(acilis?: Siir, dil: Dil = 'tr'): Promise<Uint8Array> {
  const d = acilis ? anaDuygu(acilis) : undefined;
  const acilisFotosu = acilis ? siirFotografi(acilis) : undefined;
  return png(
    h(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        color: YAZI,
        backgroundImage: 'linear-gradient(90deg, #0d0c0bf2 0%, #0d0c0b99 50%, #0d0c0b00 85%)',
      },
      [
        etiket('ANTİGONİ · 2008–2021'),
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { display: 'flex', fontFamily: FRAUNCES, fontWeight: 300, fontSize: 112, lineHeight: 0.95, letterSpacing: -3 }, 'Duyguların'),
          h('div', { display: 'flex', fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: 112, lineHeight: 1.05, letterSpacing: -3 }, 'Peşinde'),
          h(
            'div',
            { display: 'flex', fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: 36, color: SOLUK, marginTop: 22 },
            'Şiir kitabım ağlıyor!',
          ),
        ]),
        h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, [
          etiket('DUYGULARINPESINDE.BUMBA.TR', SOLUK),
          ...(acilisFotosu
            ? [h('div', { display: 'flex', fontFamily: INTER, fontWeight: 600, fontSize: 14, color: SOLUK }, `${kunye(acilisFotosu, dil)} · Wikimedia Commons`)]
            : []),
        ]),
      ],
    ),
    acilis && d ? await ikiliTon(acilis, d) : null,
    '#0d0c0b',
  );
}
