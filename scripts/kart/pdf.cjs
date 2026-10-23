// kart-cikti/kart.html → kart.pdf (iki sayfa: ön, arka; kesim paylı) ve önizleme için on.png, arka.png (kesilmiş hâli).
// Önce scripts/kart/kart.py çalışmalı. playwright-core yerelde yoksa PLAYWRIGHT_CORE, Chromium yolu CHROMIUM ile verilir.
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const CIKTI = path.resolve(__dirname, '../../kart-cikti');
const olcu = Object.fromEntries(
  fs.readFileSync(path.join(CIKTI, 'olcu.txt'), 'utf8').trim().split('\n').map((s) => s.split('=')),
);
const MM = 96 / 25.4; // CSS pikseli / mm

(async () => {
  const tarayici = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const sayfa = await tarayici.newPage({ deviceScaleFactor: 6 });
  await sayfa.goto('file://' + path.join(CIKTI, 'kart.html'));
  await sayfa.waitForFunction(() => document.body.dataset.hazir === '1', null, { timeout: 30000 });
  await sayfa.pdf({ path: path.join(CIKTI, 'kart.pdf'), width: `${olcu.en_mm}mm`, height: `${olcu.boy_mm}mm`, printBackground: true, preferCSSPageSize: true });
  const pay = Number(olcu.pay_mm) * MM;
  for (const [sinif, ad] of [['.on', 'on.png'], ['.arka', 'arka.png']]) {
    const k = await sayfa.locator(sinif).boundingBox();
    await sayfa.screenshot({ path: path.join(CIKTI, ad), clip: { x: k.x + pay, y: k.y + pay, width: k.width - 2 * pay, height: k.height - 2 * pay } });
  }
  console.log('kart.pdf, on.png, arka.png');
  await tarayici.close();
})();
