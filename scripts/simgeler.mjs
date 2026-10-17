// Sekme ve uygulama simgeleri: koyu karede hüznün sarısı bir damla (logo "Damla", src/data/logo.ts).
// Çalıştırma: node scripts/simgeler.mjs → public/favicon.svg, apple-touch-icon.png, icon-192.png,
// icon-512.png, icon-maskable-512.png; iOS uygulamasının simgesi (1024, saydamlıksız) ve açılış görseli
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ZEMIN = '#0d0c0b';
const RENK = '#ebcb52';
// DAMLA_YOLU (src/data/logo.ts). 100×100 kutuda damla x 22–78, y 6–90: kutunun ortasına konunca
// damla gözle ortada durur (gövdesi altta olduğu için hafif yukarıda).
const YOL = 'M50 6C44 22 22 42 22 62a28 28 0 0 0 56 0C78 42 56 22 50 6Z';

/** boyut: kenar (px); kose: köşe yarıçapı oranı (0 = tam kare); boy: damlanın yüksekliğinin kenara oranı */
function simge(boyut, kose, boy) {
  const olcek = (boyut * boy) / 84;
  const kaydir = boyut / 2 - 50 * olcek;
  const r = +(boyut * kose).toFixed(2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${boyut}" height="${boyut}" viewBox="0 0 ${boyut} ${boyut}">` +
    `<rect width="${boyut}" height="${boyut}"${r ? ` rx="${r}"` : ''} fill="${ZEMIN}"/>` +
    `<path transform="translate(${+kaydir.toFixed(3)} ${+kaydir.toFixed(3)}) scale(${+olcek.toFixed(4)})" d="${YOL}" fill="${RENK}"/>` +
    `</svg>`
  );
}

const hedef = new URL('../public/', import.meta.url);
// Sekme simgesi küçük çizildiği için damla karenin üçte ikisi kadar
await writeFile(new URL('favicon.svg', hedef), simge(64, 0.22, 0.66) + '\n');
const pngler = [
  // iOS köşeleri kendisi yuvarlar: tam kare
  ['apple-touch-icon.png', simge(180, 0, 0.58)],
  ['icon-192.png', simge(192, 0.22, 0.6)],
  ['icon-512.png', simge(512, 0.22, 0.6)],
  // Android kendi biçimiyle keser; damla ortadaki güvenli dairenin (çap %80) içinde kalır
  ['icon-maskable-512.png', simge(512, 0, 0.5)],
];
for (const [ad, svg] of pngler) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL(ad, hedef)));
}

// iOS uygulaması: App Store simgesi saydamlık içeremez; açılış ekranında koyu zeminde küçük bir damla
const ios = new URL('../uygulama/ios/App/App/Assets.xcassets/', import.meta.url);
const yaz = (svg, ad) => sharp(Buffer.from(svg)).flatten({ background: ZEMIN }).removeAlpha().png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL(ad, ios)));
await yaz(simge(1024, 0, 0.58), 'AppIcon.appiconset/AppIcon-512@2x.png');
for (const ek of ['', '-1', '-2']) await yaz(simge(2732, 0, 0.07), `Splash.imageset/splash-2732x2732${ek}.png`);

console.log('simgeler yazıldı:', ['favicon.svg', ...pngler.map(([ad]) => ad)].join(', '));
