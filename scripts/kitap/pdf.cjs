// kitap-cikti/*.html → PDF (Chromium). Önce scripts/kitap/kitap.py çalışmalı.
// playwright-core yerelde yoksa PLAYWRIGHT_CORE ile yolu verilir; Chromium yolu CHROMIUM ile.
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const CIKTI = path.resolve(__dirname, '../../kitap-cikti');
const olcu = Object.fromEntries(
  fs.readFileSync(path.join(CIKTI, 'olcu.txt'), 'utf8').trim().split('\n').map((s) => s.split('=')),
);

(async () => {
  const tarayici = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const sayfa = await tarayici.newPage();
  const isler = [
    ['ic-prova.html', 'ic-prova.pdf', '154mm', '216mm'],
    ['ic-baski.html', 'ic-baski.pdf', '154mm', '216mm'],
    ['kapak.html', 'kapak.pdf', `${3 + 148 + Number(olcu.sirt_mm) + 148 + 3}mm`, '216mm'],
  ];
  for (const [girdi, cikti, en, boy] of isler) {
    await sayfa.goto('file://' + path.join(CIKTI, girdi));
    await sayfa.waitForFunction(() => document.body.dataset.hazir === '1', null, { timeout: 60000 });
    await sayfa.pdf({ path: path.join(CIKTI, cikti), width: en, height: boy, printBackground: true, preferCSSPageSize: true });
    console.log(cikti, (fs.statSync(path.join(CIKTI, cikti)).size / 1048576).toFixed(1) + ' MB');
  }
  await tarayici.close();
})();
