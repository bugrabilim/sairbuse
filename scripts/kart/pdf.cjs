// kart-cikti/kart-<zemin>.html → kart-<zemin>.pdf (kesim paylı, matbaaya) ve kart-<zemin>.png (kesilmiş hâli, bakmak için).
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
  const pay = Number(olcu.pay_mm) * MM;
  for (const ad of olcu.zeminler.split(',')) {
    await sayfa.goto('file://' + path.join(CIKTI, `kart-${ad}.html`));
    await sayfa.waitForFunction(() => document.body.dataset.hazir === '1', null, { timeout: 30000 });
    await sayfa.pdf({ path: path.join(CIKTI, `kart-${ad}.pdf`), width: `${olcu.en_mm}mm`, height: `${olcu.boy_mm}mm`, printBackground: true, preferCSSPageSize: true });
    const k = await sayfa.locator('.yuz').boundingBox();
    await sayfa.screenshot({ path: path.join(CIKTI, `kart-${ad}.png`), clip: { x: k.x + pay, y: k.y + pay, width: k.width - 2 * pay, height: k.height - 2 * pay } });
    console.log(`kart-${ad}.pdf, kart-${ad}.png`);
  }
  await tarayici.close();
})();
