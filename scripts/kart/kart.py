"""Şaire armağan kartını üretir: tek yüz, dikey kartvizit boyu (55 × 85 mm, her kenarda 3 mm kesim payı).

Kitabı tanıtan bir kart; şair arkadaşlarına gösterebilsin diye: şairin adı, Damla logosuyla kitabın adı ve
sitenin ana sayfasına giden QR. İki zemin üretilir, biri seçilir:
gece (sitenin koyu zemini) ve saman (kitabın kâğıdı). QR her iki kartta da açık zeminde koyu basılır ki her
telefon okusun. Kart sitede yayımlanmaz; çıktılar kart-cikti/ klasörüne gider (git'e girmez).

Kullanım:
    python3 scripts/kart/kart.py && node scripts/kart/pdf.cjs   → kart-cikti/kart-<zemin>.pdf ve .png

Gerekenler: segno (QR), Chromium + playwright-core (pdf.cjs).
"""
from pathlib import Path

import segno

KOK = Path(__file__).resolve().parents[2]
CIKTI = KOK / 'kart-cikti'
FONT = KOK / 'node_modules' / '@fontsource'
ADRES = 'https://duygularinpesinde.bumba.tr'
EN_MM, BOY_MM, PAY_MM = 55, 85, 3  # kesim ölçüsü ve her kenardaki kesim payı
SAIR = 'Antigoni'
SAMAN, MUREKKEP, SARI = '#efe6cf', '#1c1915', '#ebcb52'
ZEMINLER = {
    'gece': {'zemin': '#12100e', 'yazi': '#efe9df', 'soluk': '#a49c90', 'damla': SARI},
    'saman': {'zemin': SAMAN, 'yazi': MUREKKEP, 'soluk': '#6b6255', 'damla': '#d4a91f'},
}
# Logo "Damla": biçim ve ölçüler src/data/logo.ts ve scripts/kitap/kitap.py ile aynı
DAMLA_YOLU = 'M50 6C44 22 22 42 22 62a28 28 0 0 0 56 0C78 42 56 22 50 6Z'


def logo(renk: str) -> str:
    damla = f'<span class="damla-i"><span>i</span><svg viewBox="0 0 100 100"><path d="{DAMLA_YOLU}" fill="{renk}"/></svg></span>'
    return f'Duyguların<br>Peş{damla}nde'


def font_css() -> str:
    dosyalar = ['fraunces/300.css', 'inter/500.css']
    return '\n'.join(f'<link rel="stylesheet" href="{(FONT / d).as_uri()}">' for d in dosyalar)


def kart(ad: str, z: dict) -> str:
    en, boy = EN_MM + 2 * PAY_MM, BOY_MM + 2 * PAY_MM
    ic = PAY_MM + 5  # yazılar kesim çizgisinden en az 5 mm içeride
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>
  @page {{ size: {en}mm {boy}mm; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  .yuz {{ width: {en}mm; height: {boy}mm; position: relative; overflow: hidden; background: {z['zemin']}; color: {z['yazi']}; }}
  .ic {{ position: absolute; inset: {ic + 1}mm {ic}mm {ic}mm; display: flex; flex-direction: column; align-items: center; text-align: center; }}
  .damla-i {{ position: relative; }}
  .damla-i > span {{ display: inline-block; line-height: 1; clip-path: inset(.33em 0 0 0); }}
  .damla-i svg {{ position: absolute; top: .172em; left: 50%; width: .25em; height: .25em; transform: translateX(-50%); }}
  .sair {{ font-family: 'Inter', sans-serif; font-weight: 500; font-size: 5.6pt; letter-spacing: .34em; text-transform: uppercase; color: {z['soluk']}; padding-left: .34em; }}
  .ad {{ margin-top: 3.2mm; font-family: 'Fraunces', serif; font-weight: 300; font-size: 21pt; line-height: .98; letter-spacing: -.015em; }}
  .qr {{ margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 2mm; }}
  .qr img {{ width: 24mm; height: 24mm; display: block; border-radius: 1.6mm; }}
  .qr span {{ font-family: 'Inter', sans-serif; font-weight: 500; font-size: 5pt; letter-spacing: .03em; color: {z['soluk']}; }}
</style></head><body>
<section class="yuz"><div class="ic">
  <div class="sair">{SAIR}</div>
  <div class="ad">{logo(z['damla'])}</div>
  <div class="qr"><img src="qr.svg" alt=""><span>duygularinpesinde.bumba.tr</span></div>
</div></section>
<script>document.fonts.ready.then(() => {{ document.body.dataset.hazir = '1'; }});</script>
</body></html>"""


def main():
    CIKTI.mkdir(exist_ok=True)
    # QR her iki kartta da saman üstünde mürekkep (koyu zeminde açık karenin içinde)
    segno.make(ADRES, error='q').save(str(CIKTI / 'qr.svg'), scale=4, border=3, dark=MUREKKEP, light=SAMAN)
    for ad, z in ZEMINLER.items():
        (CIKTI / f'kart-{ad}.html').write_text(kart(ad, z))
    (CIKTI / 'olcu.txt').write_text(
        f'en_mm={EN_MM + 2 * PAY_MM}\nboy_mm={BOY_MM + 2 * PAY_MM}\npay_mm={PAY_MM}\nzeminler={",".join(ZEMINLER)}\n')
    print(', '.join(f'kart-cikti/kart-{ad}.html' for ad in ZEMINLER))


if __name__ == '__main__':
    main()
