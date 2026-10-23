"""Şaire armağan kutusundaki kartı üretir: iki yüzlü, kartvizit boyu (85 × 55 mm, her kenarda 3 mm kesim payı).

Ön yüz gece: kitabın adı (Damla logosu), açılış dizesi "Şiir kitabım ağlıyor!" ve imzası.
Arka yüz saman: rastgele şiir adresine (/cek/) giden QR, kutudaki iki mumun anlamı ve elle yazılacak bir satır.
Kart sitede yayımlanmaz; çıktılar kart-cikti/ klasörüne gider (git'e girmez).

Kullanım:
    python3 scripts/kart/kart.py && node scripts/kart/pdf.cjs   → kart-cikti/kart.pdf, on.png, arka.png

Gerekenler: segno (QR), Chromium + playwright-core (pdf.cjs). Ölçü değişecekse EN_MM / BOY_MM yeter.
"""
from pathlib import Path

import segno

KOK = Path(__file__).resolve().parents[2]
CIKTI = KOK / 'kart-cikti'
FONT = KOK / 'node_modules' / '@fontsource'
ADRES = 'https://duygularinpesinde.bumba.tr/cek/'
EN_MM, BOY_MM, PAY_MM = 85, 55, 3  # kesim ölçüsü ve her kenardaki kesim payı
GECE, SAMAN, MUREKKEP, SARI = '#12100e', '#efe6cf', '#1c1915', '#ebcb52'
# Logo "Damla": biçim ve ölçüler src/data/logo.ts ve scripts/kitap/kitap.py ile aynı
DAMLA_YOLU = 'M50 6C44 22 22 42 22 62a28 28 0 0 0 56 0C78 42 56 22 50 6Z'


def logo(renk: str) -> str:
    damla = f'<span class="damla-i"><span>i</span><svg viewBox="0 0 100 100"><path d="{DAMLA_YOLU}" fill="{renk}"/></svg></span>'
    return f'Duyguların<br>Peş{damla}nde'


def font_css() -> str:
    dosyalar = ['newsreader/400.css', 'newsreader/400-italic.css', 'fraunces/300.css',
                'fraunces/300-italic.css', 'inter/500.css']
    return '\n'.join(f'<link rel="stylesheet" href="{(FONT / d).as_uri()}">' for d in dosyalar)


def main():
    CIKTI.mkdir(exist_ok=True)
    segno.make(ADRES, error='q').save(str(CIKTI / 'qr.svg'), scale=4, border=2, dark=MUREKKEP, light=SAMAN)
    en, boy = EN_MM + 2 * PAY_MM, BOY_MM + 2 * PAY_MM
    # Yazılar kesim çizgisinden en az 4 mm içeride durur (güvenli alan)
    ic = PAY_MM + 4.5
    html = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>
  @page {{ size: {en}mm {boy}mm; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  .yuz {{ width: {en}mm; height: {boy}mm; position: relative; overflow: hidden; break-after: page; }}
  .damla-i {{ position: relative; }}
  .damla-i > span {{ display: inline-block; line-height: 1; clip-path: inset(.33em 0 0 0); }}
  .damla-i svg {{ position: absolute; top: .172em; left: 50%; width: .25em; height: .25em; transform: translateX(-50%); }}

  .on {{ background: {GECE}; color: #efe9df; }}
  .on .ic {{ position: absolute; inset: {ic}mm {ic + 1}mm; display: flex; flex-direction: column; }}
  .on .sair {{ font-family: 'Inter', sans-serif; font-weight: 500; font-size: 5.6pt; letter-spacing: .32em; text-transform: uppercase; color: #a49c90; }}
  .on .ad {{ margin-top: 2.2mm; font-family: 'Fraunces', serif; font-weight: 300; font-size: 19pt; line-height: .98; letter-spacing: -.015em; }}
  .on .dize {{ margin-top: auto; font-family: 'Newsreader', serif; font-style: italic; font-size: 9.5pt; color: #efe9df; }}
  .on .imza {{ margin-top: 1mm; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 6.6pt; color: #a49c90; }}
  .on .renkler {{ position: absolute; right: 0; bottom: .6mm; display: flex; gap: 1.1mm; }}
  .on .renkler i {{ width: 1.5mm; height: 1.5mm; border-radius: 50%; }}

  .arka {{ background: {SAMAN}; color: {MUREKKEP}; }}
  .arka .ic {{ position: absolute; inset: {ic}mm {ic}mm; display: flex; gap: 4.5mm; }}
  .arka .qr {{ flex: none; width: 25mm; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1.3mm; }}
  .arka .qr img {{ width: 25mm; height: 25mm; display: block; }}
  .arka .qr span {{ font-family: 'Inter', sans-serif; font-weight: 500; font-size: 4.2pt; letter-spacing: .02em; color: #5d554a; white-space: nowrap; }}
  .arka .yazi {{ flex: 1; display: flex; flex-direction: column; font-family: 'Newsreader', serif; font-size: 7.4pt; line-height: 1.38; }}
  .arka .cek {{ font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 11pt; line-height: 1.1; }}
  .arka .alt {{ margin-top: 1.4mm; color: #5d554a; }}
  .arka .mum {{ margin-top: 2.6mm; font-style: italic; }}
  .arka .el {{ margin-top: auto; border-bottom: .25mm solid #b9ad97; height: 5mm; }}
</style></head><body>
<section class="yuz on"><div class="ic">
  <div class="sair">Antigoni</div>
  <div class="ad">{logo(SARI)}</div>
  <div class="dize">Şiir kitabım ağlıyor!</div>
  <div class="imza">18.07.2011 — Moda</div>
  <div class="renkler">{''.join(f'<i style="background:{r}"></i>' for r in ['#e891b2', '#f2a766', SARI, '#9aa1a9', '#4a4540', '#a77ade', '#f4874f'])}</div>
</div></section>
<section class="yuz arka"><div class="ic">
  <div class="qr"><img src="qr.svg" alt=""><span>duygularinpesinde.bumba.tr/cek</span></div>
  <div class="yazi">
    <div class="cek">Okut, bir şiir çek.</div>
    <div class="alt">Her okutuşta başka bir şiir açılır.</div>
    <div class="mum">İki mum: 18 Temmuz’da, Moda’da, dokuz yıl arayla yazılan iki şiir için.</div>
    <div class="el"></div>
  </div>
</div></section>
<script>document.fonts.ready.then(() => {{ document.body.dataset.hazir = '1'; }});</script>
</body></html>"""
    (CIKTI / 'kart.html').write_text(html)
    (CIKTI / 'olcu.txt').write_text(f'en_mm={en}\nboy_mm={boy}\npay_mm={PAY_MM}\n')
    print('kart-cikti/kart.html')


if __name__ == '__main__':
    main()
