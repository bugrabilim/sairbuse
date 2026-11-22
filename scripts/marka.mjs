// Ürün marka kiti (bumbagroup.com/marka/duygularin-pesinde): kökte marka/ klasörü. Pazarlamanın kararı
// (DENETIM K45, MARKA §4 "Ürün marka kitleri"). Yalnız sitede bugün kullanılan: logo sitedeki yazının (Fraunces
// 300) satori ile yola çevrilmiş hâli, damla src/data/logo.ts'deki yol; simge ve paylaşım görselleri sitenin kendi
// dosyaları. Logo, renk ya da yazı tipi değişirse bu betik aynı commit'te yeniden çalıştırılır.
// Çalıştırma: npm run build && node scripts/marka.mjs
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const KOK = process.cwd();
const HEDEF = join(KOK, 'marka');
await mkdir(HEDEF, { recursive: true });

// src/data/logo.ts ile aynı
const DAMLA_YOLU = 'M50 6C44 22 22 42 22 62a28 28 0 0 0 56 0C78 42 56 22 50 6Z';
const DAMLA = { ust: 0.806, boy: 0.25, taban: 0.861 };

const yazi = (alt, stil) => readFile(join(KOK, 'node_modules/@fontsource/fraunces/files', `fraunces-${alt}-300-${stil}.woff`));
const FONTLAR = [
  { name: 'Fraunces', weight: 300, style: 'normal', data: await yazi('latin', 'normal') },
  { name: 'Fraunces Ext', weight: 300, style: 'normal', data: await yazi('latin-ext', 'normal') },
];

const h = (type, style, children) => ({ type, props: { style, children } });
const IMLEC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/** Satırlar: düz yazı ya da damlalı satır ["Peş", "nde"]. Damla yerine bir yer tutucu konur, sonra yola çevrilir. */
function agac(satirlar, boyut, aralik, renk) {
  const kenar = DAMLA.boy * boyut;
  const satir = (s) =>
    typeof s === 'string'
      ? h('div', { display: 'flex' }, s)
      : h('div', { display: 'flex' }, [
          h('div', { display: 'flex' }, s[0]),
          h('div', { display: 'flex', position: 'relative', lineHeight: 1 }, [
            'ı',
            {
              type: 'img',
              props: {
                src: IMLEC,
                width: kenar,
                height: kenar,
                style: { position: 'absolute', top: (DAMLA.taban - DAMLA.ust) * boyut, left: '50%', marginLeft: -kenar / 2, width: kenar, height: kenar },
              },
            },
          ]),
          h('div', { display: 'flex' }, s[1]),
        ]);
  return h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Fraunces, Fraunces Ext',
      fontWeight: 300,
      fontSize: boyut,
      lineHeight: 1,
      letterSpacing: aralik * boyut,
      color: renk,
      padding: boyut * 0.2,
    },
    satirlar.map(satir),
  );
}

/** Satori'nin yer tutucu <image>'ını damla yoluna çevirir; çerçeveyi yazıya sıkıştırır. */
async function logo(satirlar, { boyut = 100, aralik = -0.01, yazi, damla, en, boy }) {
  let svg = await satori(agac(satirlar, boyut, aralik, yazi), { width: en, height: boy, fonts: FONTLAR });
  svg = svg.replace(/<image\b[^>]*?x="([\d.]+)"[^>]*?y="([\d.]+)"[^>]*?width="([\d.]+)"[^>]*?height="([\d.]+)"[^>]*?\/>/g, (_, x, y, w) => {
    const o = +w / 100;
    return `<path transform="translate(${+(+x).toFixed(2)} ${+(+y).toFixed(2)}) scale(${+o.toFixed(4)})" d="${DAMLA_YOLU}" fill="${damla}"/>`;
  });
  if (/<image|<text|<script|<foreignObject|\son[a-z]+=|href=/i.test(svg)) throw new Error('SVG denetimden geçmez');
  // Yazının gerçek sınırları: görüntüye çevirip boş kenarları kırp
  const { info } = await sharp(Buffer.from(svg)).png().trim({ threshold: 0 }).toBuffer({ resolveWithObject: true });
  const pay = Math.round(boyut * 0.04);
  const x = -info.trimOffsetLeft - pay;
  const y = -info.trimOffsetTop - pay;
  const w = info.width + 2 * pay;
  const hh = info.height + 2 * pay;
  return svg.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hh}" viewBox="${x} ${y} ${w} ${hh}">`) + '\n';
}

// Renkler: açık zemin (gündüz teması) ve koyu zemin (gece teması), src/styles/global.css
const ACIK = { yazi: '#1c1815', damla: '#735c00' };
const KOYU = { yazi: '#f1eadf', damla: '#ebcb52' };
const YATAY = [['Duyguların Peş', 'nde']];
const DIKEY = ['Duyguların', ['Peş', 'nde']];

await writeFile(join(HEDEF, 'logo.svg'), await logo(YATAY, { ...ACIK, en: 1100, boy: 160 }));
await writeFile(join(HEDEF, 'logo-koyu.svg'), await logo(YATAY, { ...KOYU, en: 1100, boy: 160 }));
// İki satırlı hâli sitenin paylaşım görselinde (og/site.jpg) kullanılıyor
await writeFile(join(HEDEF, 'logo-dikey.svg'), await logo(DIKEY, { ...ACIK, aralik: -0.015, en: 700, boy: 260 }));
await writeFile(join(HEDEF, 'logo-dikey-koyu.svg'), await logo(DIKEY, { ...KOYU, aralik: -0.015, en: 700, boy: 260 }));

// Kare işaret ve simgeler: sitenin kendi dosyaları (scripts/simgeler.mjs üretir)
await copyFile(join(KOK, 'public/favicon.svg'), join(HEDEF, 'isaret.svg'));
await copyFile(join(KOK, 'public/favicon.svg'), join(HEDEF, 'ikon.svg'));
await copyFile(join(KOK, 'public/icon-512.png'), join(HEDEF, 'ikon-512.png'));
await copyFile(join(KOK, 'public/apple-touch-icon.png'), join(HEDEF, 'ikon-180.png'));

// Paylaşım görseli: sitenin kullandığı og/site.jpg (derleme üretir), PNG olarak
await sharp(join(KOK, 'dist/og/site.jpg')).png().toFile(join(HEDEF, 'paylasim.png'));
await sharp(join(KOK, 'dist/og/en/site.jpg')).png().toFile(join(HEDEF, 'paylasim-en.png'));

for (const d of ['ikon-512.png', 'ikon-180.png', 'paylasim.png', 'paylasim-en.png']) {
  const m = await sharp(join(HEDEF, d)).metadata();
  console.log(d, `${m.width}×${m.height}`);
}
console.log('marka/ hazır');
