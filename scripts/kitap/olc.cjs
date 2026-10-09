// kitap-cikti/olcum.html'deki şiirlerin yüksekliğini (mm) ölçer → olcum.json. kitap.py kendisi çağırır.
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const CIKTI = path.resolve(__dirname, '../../kitap-cikti');

(async () => {
  const tarayici = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const sayfa = await tarayici.newPage();
  await sayfa.goto('file://' + path.join(CIKTI, 'olcum.html'));
  await sayfa.evaluate(() => document.fonts.ready);
  const olcum = await sayfa.evaluate(() =>
    Object.fromEntries([...document.querySelectorAll('.olc')].map((k) => [k.dataset.id, k.getBoundingClientRect().height * 25.4 / 96])),
  );
  fs.writeFileSync(path.join(CIKTI, 'olcum.json'), JSON.stringify(olcum, null, 1));
  await tarayici.close();
})();
