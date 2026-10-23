"""Şaire armağan kutusundaki kartı üretir: tek yüz, kartvizit boyu (85 × 55 mm, her kenarda 3 mm kesim payı).

Saman zeminde tek bir cümle ve rastgele şiir adresine (/cek/) giden QR, altında adres yazıyla.
Kart sitede yayımlanmaz; çıktılar kart-cikti/ klasörüne gider (git'e girmez).

Kullanım:
    python3 scripts/kart/kart.py && node scripts/kart/pdf.cjs   → kart-cikti/kart.pdf, kart.png

Gerekenler: segno (QR), Chromium + playwright-core (pdf.cjs). Ölçü değişecekse EN_MM / BOY_MM, cümle CUMLE.
"""
from pathlib import Path

import segno

KOK = Path(__file__).resolve().parents[2]
CIKTI = KOK / 'kart-cikti'
FONT = KOK / 'node_modules' / '@fontsource'
ADRES = 'https://duygularinpesinde.bumba.tr/cek/'
EN_MM, BOY_MM, PAY_MM = 85, 55, 3  # kesim ölçüsü ve her kenardaki kesim payı
SAMAN, MUREKKEP = '#efe6cf', '#1c1915'
# Açılış dizesine ("Şiir kitabım ağlıyor!", 18.07.2011, Moda) karşılık
CUMLE = 'Şiir kitabın artık ağlamıyor.'


def font_css() -> str:
    dosyalar = ['fraunces/300-italic.css', 'inter/500.css']
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
  .yuz {{ width: {en}mm; height: {boy}mm; position: relative; overflow: hidden; background: {SAMAN}; color: {MUREKKEP}; }}
  .ic {{ position: absolute; inset: {ic}mm; display: flex; align-items: center; gap: 6mm; }}
  .cumle {{ flex: 1; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 15pt; line-height: 1.12; letter-spacing: -.005em; }}
  .qr {{ flex: none; width: 25mm; display: flex; flex-direction: column; align-items: center; gap: 1.4mm; }}
  .qr img {{ width: 25mm; height: 25mm; display: block; }}
  .qr span {{ font-family: 'Inter', sans-serif; font-weight: 500; font-size: 4.2pt; letter-spacing: .02em; color: #5d554a; white-space: nowrap; }}
</style></head><body>
<section class="yuz"><div class="ic">
  <div class="cumle">{CUMLE}</div>
  <div class="qr"><img src="qr.svg" alt=""><span>duygularinpesinde.bumba.tr/cek</span></div>
</div></section>
<script>document.fonts.ready.then(() => {{ document.body.dataset.hazir = '1'; }});</script>
</body></html>"""
    (CIKTI / 'kart.html').write_text(html)
    (CIKTI / 'olcu.txt').write_text(f'en_mm={en}\nboy_mm={boy}\npay_mm={PAY_MM}\n')
    print('kart-cikti/kart.html')


if __name__ == '__main__':
    main()
