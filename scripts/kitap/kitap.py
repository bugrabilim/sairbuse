"""Basılı kitabın (A5) sayfalarını siteyle aynı kaynaktan üretir. Kitap sitede yayımlanmaz.

Çıktılar kitap-cikti/ klasörüne gider (git'e girmez):
    ic.html, kapak.html  → scripts/kitap/pdf.cjs bunları PDF'e çevirir:
    ic-prova.pdf   iç sayfalar, saman zeminle (ekranda bakmak için)
    ic-baski.pdf   iç sayfalar, zeminsiz, yalnız siyah (matbaaya)
    kapak.pdf      kapak açılımı: arka kapak, sırt, ön kapak (renkli, matbaaya)

Kullanım:
    python3 scripts/kitap/kitap.py && node scripts/kitap/pdf.cjs

Gerekenler: ffmpeg, PyYAML, segno (QR), Chromium + playwright-core (pdf.cjs).

Ölçüler: A5 (148 × 210 mm), her kenarda 3 mm kesim payı. Düzen: her şiir bir açık sayfa, solda siyah beyaz
fotoğraf, sağda şiir. Her yılın ilk şiirinde sol sayfa yıl ayracı olur, fotoğraf şiirin üstüne küçük konur.
Sırt kalınlığı tahminidir (SIRT_MM); kesin ölçüyü matbaa kâğıda göre verir.
"""

import html
import re
import subprocess
from pathlib import Path

import segno
import yaml

KOK = Path(__file__).resolve().parents[2]
CIKTI = KOK / 'kitap-cikti'
FOTO = KOK / 'src' / 'assets' / 'foto'
SIIRLER = KOK / 'src' / 'content' / 'siirler'
FONT = KOK / 'node_modules' / '@fontsource'
SITE = 'https://duygularinpesinde.bumba.tr'
SAIR = 'Antigoni'
YAPRAK_MM = 0.11  # 80–90 g saman kâğıtta bir yaprağın yaklaşık kalınlığı


def e(s: str) -> str:
    return html.escape(s, quote=True)


def siirleri_oku():
    siirler = []
    for dosya in sorted(SIIRLER.glob('*.md')):
        metin = dosya.read_text(encoding='utf-8')
        _, on, govde = metin.split('---', 2)
        veri = yaml.safe_load(on)
        tarih = veri.get('tarih')
        siirler.append({
            'id': dosya.stem,
            'baslik': veri.get('baslik'),
            'tarih': str(tarih) if tarih else None,
            'yer': veri.get('yer'),
            'foto': veri.get('foto'),
            'govde': govde.strip('\n'),
        })
    tarihli = sorted([s for s in siirler if s['tarih']], key=lambda s: s['tarih'])
    tarihsiz = [s for s in siirler if not s['tarih']]
    return tarihli + tarihsiz


def fotograflari_oku():
    """src/data/fotograflar.ts'deki künyeler: id → {aciklama, yazar, lisans}"""
    kaynak = (KOK / 'src' / 'data' / 'fotograflar.ts').read_text(encoding='utf-8')
    kunyeler = {}
    for blok in re.findall(r'\{\s*id:\s*"[^"]+".*?\n  \}', kaynak, re.S):
        alan = lambda ad: (re.search(rf'{ad}:\s*"([^"]*)"', blok) or [None, ''])[1]
        kunyeler[alan('id')] = {'aciklama': alan('aciklama'), 'yazar': alan('yazar'), 'lisans': alan('lisans')}
    return kunyeler


def ad(s):
    return s['baslik'] or s['govde'].splitlines()[0].rstrip('.,;:!?…')


def imza(s):
    p = []
    if s['tarih']:
        y, a, g = s['tarih'].split('-')
        p.append(f'{g}.{a}.{y}')
    if s['yer']:
        p.append(s['yer'])
    return ' – '.join(p)


def yil(s):
    return s['tarih'][:4] if s['tarih'] else 'Tarihsiz'


def gri_foto(kimlik: str) -> str:
    """Fotoğrafı tam çözünürlükte gri tonlu JPEG'e çevirir; dosya adını döndürür"""
    (CIKTI / 'foto').mkdir(parents=True, exist_ok=True)
    hedef = CIKTI / 'foto' / f'{kimlik}.jpg'
    if not hedef.exists():
        kaynak = next(FOTO.glob(f'{kimlik}.*'))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(kaynak), '-vf', 'format=gray,eq=contrast=1.04',
                        '-q:v', '3', str(hedef)], check=True)
    return f'foto/{kimlik}.jpg'


def renkli_kapak_fotosu(kimlik: str) -> str:
    """Kapak için: siyah beyaz, ışıklar hüznün sarısına, gölgeler koyu kahveye (sitedeki gibi)"""
    hedef = CIKTI / 'foto' / f'{kimlik}-kapak.jpg'
    kaynak = next(FOTO.glob(f'{kimlik}.*'))
    # gölge #2a1d06 → ışık #efc444
    geq = "r='42+(239-42)*r(X,Y)/255':g='29+(196-29)*g(X,Y)/255':b='6+(68-6)*b(X,Y)/255'"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(kaynak), '-vf', f'format=gray,format=gbrp,geq={geq}',
                    '-q:v', '3', str(hedef)], check=True)
    return f'foto/{kimlik}-kapak.jpg'


def font_css() -> str:
    dosyalar = ['newsreader/400.css', 'newsreader/400-italic.css', 'fraunces/300.css',
                'fraunces/300-italic.css', 'inter/500.css', 'inter/600.css']
    return '\n'.join(f'<link rel="stylesheet" href="{(FONT / d).as_uri()}">' for d in dosyalar)


ORTAK_CSS = """
  @page { size: 154mm 216mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Newsreader', Georgia, serif; color: #1c1915; }
  .sayfa { width: 154mm; height: 216mm; position: relative; overflow: hidden; page-break-after: always; break-after: page; }
  .prova .sayfa { background: #efe6cf; }
  /* Yazı alanı: kesimden üst 20, alt 24, iç (cilt) 20, dış 16 mm; +3 mm kesim payı */
  .alan { position: absolute; top: 23mm; bottom: 27mm; display: flex; flex-direction: column; }
  .sag .alan { left: 23mm; right: 19mm; }
  .sol .alan { left: 19mm; right: 23mm; }
  .no { position: absolute; bottom: 13mm; font-family: 'Inter', sans-serif; font-size: 6.5pt; letter-spacing: .14em; color: #6b6255; }
  .sag .no { right: 19mm; }
  .sol .no { left: 19mm; }
  .ust { position: absolute; top: 12mm; left: 0; right: 0; text-align: center; font-family: 'Inter', sans-serif; font-size: 6pt; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: #6b6255; }
  .siir { font-size: 10.5pt; line-height: 1.5; white-space: pre-line; hyphens: none; }
  .siir-ad { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 15pt; margin-bottom: 5mm; }
  .imza { margin-top: auto; padding-top: 4mm; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 9pt; color: #5d554a; }
  .fotolu { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .fotolu img { display: block; max-width: 100%; max-height: 135mm; object-fit: contain; margin: 0 auto; }
  .baski .fotolu img, .baski .kucuk img { filter: none; }
  .prova .fotolu img, .prova .kucuk img { mix-blend-mode: multiply; }
  .alt-yazi { margin-top: 4mm; font-style: italic; font-size: 7.5pt; line-height: 1.4; color: #5d554a; text-align: center; }
  .kucuk { flex: none; margin-bottom: 6mm; }
  .kucuk img { display: block; width: 100%; height: 52mm; object-fit: cover; }
  .yil-rakam { margin: auto 0; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 72pt; line-height: 1; }
  .yil-rakam.uzun { font-size: 40pt; }
  .yil-alt { margin-top: 5mm; font-size: 9.5pt; font-style: italic; color: #5d554a; }
  .ortala { justify-content: center; align-items: center; text-align: center; }
  .buyuk-ad { font-family: 'Fraunces', serif; font-weight: 300; font-size: 30pt; line-height: 1.02; }
  .yarim-ad { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 16pt; }
  .alt-ad { margin-top: 5mm; font-style: italic; font-size: 10.5pt; color: #5d554a; }
  .sair { margin-top: 18mm; font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; }
  .epigraf { margin: auto 0; font-style: italic; font-size: 10.5pt; line-height: 1.5; color: #5d554a; white-space: pre-line; }
  .kunye { margin-top: auto; font-size: 7.5pt; line-height: 1.55; color: #4a433a; }
  .icindekiler-baslik, .fotolar-baslik { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 15pt; margin-bottom: 6mm; }
  .icindekiler { list-style: none; font-size: 8.2pt; line-height: 1.32; }
  .icindekiler li { display: flex; gap: 2mm; align-items: baseline; }
  .icindekiler li.yil-satir { margin-top: 2.2mm; font-family: 'Inter', sans-serif; font-size: 6pt; letter-spacing: .25em; color: #6b6255; }
  .icindekiler li .nokta { flex: 1; border-bottom: 0.25pt dotted #8a8072; transform: translateY(-1mm); }
  .fotolar { list-style: none; font-size: 7pt; line-height: 1.35; display: grid; gap: 1.6mm; }
  .fotolar span { color: #5d554a; }
"""


def sayfa(sinif, icerik, no=None, ust=None):
    yan = 'sag' if sinif.startswith('sag') else 'sol'
    parca = [f'<section class="sayfa {sinif}">']
    if ust:
        parca.append(f'<div class="ust">{e(ust)}</div>')
    parca.append(icerik)
    if no is not None:
        parca.append(f'<div class="no">{no}</div>')
    parca.append('</section>')
    return ''.join(parca)


def siir_govdesi(s, kucuk_foto=None):
    p = ['<div class="alan siir-alan">']
    if kucuk_foto:
        p.append(f'<div class="kucuk"><img src="{kucuk_foto}" alt=""></div>')
    if s['baslik']:
        p.append(f'<div class="siir-ad">{e(s["baslik"])}</div>')
    p.append(f'<div class="siir">{e(s["govde"])}</div>')
    if imza(s):
        p.append(f'<div class="imza">{e(imza(s))}</div>')
    p.append('</div>')
    return ''.join(p)


def ic_sayfalar(siirler, kunyeler):
    sayfalar = []
    no = lambda: len(sayfalar) + 1

    # Ön sayfalar: 1 yarım başlık, 2 epigraf, 3 başlık, 4 künye, 5 içindekiler
    sayfalar.append(sayfa('sag', '<div class="alan ortala"><div class="yarim-ad">Duyguların Peşinde</div></div>'))
    sayfalar.append(sayfa('sol', '<div class="alan"><div class="epigraf">“Kim bilir belki de sen\nturuncu bir gemidesin”</div></div>'))
    sayfalar.append(sayfa('sag', '<div class="alan ortala"><div class="buyuk-ad">Duyguların<br>Peşinde</div>'
                          f'<div class="alt-ad">Şiirler · 2008–2021</div><div class="sair">{SAIR}</div></div>'))
    sayfalar.append(sayfa('sol', '<div class="alan"><div class="kunye">'
                          f'© 2008–2026 {SAIR}. Tüm hakları saklıdır.<br>Bu kitaptaki şiirler izinsiz çoğaltılamaz, '
                          'kopyalanıp başka bir yerde yayımlanamaz.<br><br>Fotoğraflar Wikimedia Commons’tan, '
                          'fotoğrafçılarının adı ve lisansıyla kullanılmıştır; siyah beyaza çevrilmiştir. '
                          'Künyeleri kitabın sonundadır.<br><br>Birinci baskı, 2026. Sınırlı sayıda basılmıştır.'
                          '</div></div>'))
    icindekiler_yeri = len(sayfalar)
    sayfalar.append(None)  # içindekiler sonra doldurulur

    satirlar = []
    onceki_yil = None
    for s in siirler:
        foto = gri_foto(s['foto'])
        k = kunyeler.get(s['foto'], {})
        if yil(s) != onceki_yil:
            onceki_yil = yil(s)
            ayni = [x for x in siirler if yil(x) == onceki_yil]
            yerler = []
            for x in ayni:
                if x['yer'] and x['yer'] not in yerler:
                    yerler.append(x['yer'])
            alt = f'{len(ayni)} şiir' + (f' · {", ".join(yerler)}' if yerler else '')
            uzun = ' uzun' if not onceki_yil.isdigit() else ''
            sayfalar.append(sayfa('sol', f'<div class="alan"><div class="yil-rakam{uzun}">{e(onceki_yil)}'
                                  f'<div class="yil-alt">{e(alt)}</div></div></div>', no()))
            satirlar.append(f'<li class="yil-satir">{e(onceki_yil.upper())}</li>')
            satirlar.append(f'<li><span>{e(ad(s))}</span><span class="nokta"></span><span>{no()}</span></li>')
            sayfalar.append(sayfa('sag', siir_govdesi(s, kucuk_foto=foto), no(), ust=onceki_yil))
        else:
            alt = e(k.get('aciklama', ''))
            sayfalar.append(sayfa('sol', f'<div class="alan"><div class="fotolu"><img src="{foto}" alt="{alt}">'
                                  f'<div class="alt-yazi">{alt}</div></div></div>', no()))
            satirlar.append(f'<li><span>{e(ad(s))}</span><span class="nokta"></span><span>{no()}</span></li>')
            sayfalar.append(sayfa('sag', siir_govdesi(s), no(), ust=onceki_yil))

    sayfalar[icindekiler_yeri] = sayfa('sag', '<div class="alan"><div class="icindekiler-baslik">İçindekiler</div>'
                                       f'<ul class="icindekiler">{"".join(satirlar)}</ul></div>', 5)

    # Son sayfalar: fotoğraf künyeleri (iki sütuna sığmazsa iki sayfa)
    kullanilan = []
    for s in siirler:
        if s['foto'] not in kullanilan:
            kullanilan.append(s['foto'])
    satir = [f'<li>{e(kunyeler[i]["aciklama"])}<br><span>{e(kunyeler[i]["yazar"])} · {e(kunyeler[i]["lisans"])}</span></li>'
             for i in kullanilan if i in kunyeler]
    yarim = (len(satir) + 1) // 2
    sayfalar.append(sayfa('sol', '<div class="alan"><div class="fotolar-baslik">Fotoğraflar</div>'
                          f'<ul class="fotolar">{"".join(satir[:yarim])}</ul></div>', no()))
    sayfalar.append(sayfa('sag', f'<div class="alan"><ul class="fotolar" style="margin-top:12mm">{"".join(satir[yarim:])}</ul>'
                          '<div class="kunye">Fotoğraflar Wikimedia Commons’ta özgür lisansla paylaşılmıştır '
                          '(CC BY, CC BY-SA, CC0); bu kitapta siyah beyaza çevrilerek kullanılmıştır.</div></div>', no()))
    # Toplam sayfa 4'ün katı olsun (forma)
    while len(sayfalar) % 4:
        sayfalar.append(sayfa('sol' if len(sayfalar) % 2 else 'sag', ''))
    return sayfalar


UYDUR_JS = """
<script>
// Uzun şiirler sayfaya sığana kadar önce küçük fotoğraf, sonra yazı biraz küçülür
document.fonts.ready.then(() => {
  for (const alan of document.querySelectorAll('.siir-alan')) {
    const siir = alan.querySelector('.siir');
    const foto = alan.querySelector('.kucuk img');
    let boy = 10.5, fotoBoy = 52;
    const tasiyor = () => alan.scrollHeight > alan.clientHeight + 1;
    while (tasiyor() && foto && fotoBoy > 30) { fotoBoy -= 2; foto.style.height = fotoBoy + 'mm'; }
    while (tasiyor() && boy > 8) { boy -= 0.25; siir.style.fontSize = boy + 'pt'; siir.style.lineHeight = boy < 9.5 ? '1.4' : '1.5'; }
  }
  document.body.dataset.hazir = '1';
});
</script>
"""


def kapak(sayfa_sayisi):
    sirt = round(sayfa_sayisi / 2 * YAPRAK_MM + 0.6, 1)
    genislik = 3 + 148 + sirt + 148 + 3
    foto = renkli_kapak_fotosu('moda-gunbatimi')
    qr = segno.make(SITE, error='m')
    qr.save(str(CIKTI / 'qr.svg'), scale=4, border=2, dark='#1c1915', light='#efe6cf')
    renkler = ''.join(f'<i style="background:{r}"></i>' for r in
                      ['#e891b2', '#f2a766', '#ebcb52', '#9aa1a9', '#000000', '#a77ade', '#f4874f'])
    css = f"""
  @page {{ size: {genislik}mm 216mm; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{ width: {genislik}mm; height: 216mm; background: #12100e; color: #efe9df; position: relative; overflow: hidden; font-family: 'Newsreader', serif; }}
  .arka {{ position: absolute; left: 3mm; top: 0; width: 148mm; height: 216mm; }}
  .sirt {{ position: absolute; left: {3 + 148}mm; top: 0; width: {sirt}mm; height: 216mm; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 18mm 0 16mm; }}
  .on {{ position: absolute; left: {3 + 148 + sirt}mm; top: 0; width: 151mm; height: 216mm; }}
  .on .foto {{ position: absolute; top: -3mm; left: 0; right: 0; height: 138mm; background: url('{foto}') center/cover; }}
  .on .foto::after {{ content: ''; position: absolute; inset: 0; background: linear-gradient(transparent 55%, #12100e); }}
  .on .yazi {{ position: absolute; left: 16mm; right: 19mm; bottom: 22mm; }}
  .on .sair {{ font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: #cfc6b8; }}
  .on .ad {{ margin-top: 4mm; font-family: 'Fraunces', serif; font-weight: 300; font-size: 40pt; line-height: .98; letter-spacing: -.02em; }}
  .renkler {{ display: flex; gap: 2.2mm; margin-top: 7mm; }}
  .renkler i {{ flex: 1; height: 1.6mm; border-radius: 1mm; }}
  .arka .ic {{ position: absolute; left: 19mm; right: 16mm; top: 26mm; bottom: 22mm; display: flex; flex-direction: column; }}
  .alinti {{ font-style: italic; font-size: 13pt; line-height: 1.5; white-space: pre-line; }}
  .tanitim {{ margin-top: 12mm; font-size: 9.5pt; line-height: 1.55; color: #b9b0a2; max-width: 92mm; }}
  .qr {{ margin-top: auto; display: flex; align-items: center; gap: 5mm; }}
  .qr img {{ width: 24mm; height: 24mm; display: block; border-radius: 1mm; }}
  .qr span {{ font-family: 'Inter', sans-serif; font-size: 6.5pt; letter-spacing: .18em; text-transform: uppercase; color: #8f877b; line-height: 1.6; }}
  .sirt .ad {{ writing-mode: vertical-rl; font-family: 'Fraunces', serif; font-weight: 300; font-size: {max(5.5, min(9, sirt * 1.6)):.1f}pt; white-space: nowrap; }}
  .sirt .serit {{ width: 52%; display: grid; gap: 1.2mm; }}
  .sirt .serit i {{ display: block; height: 1.2mm; border-radius: .5mm; }}
  .kilavuz {{ position: absolute; top: 0; bottom: 0; width: 0; border-left: .2pt dashed rgba(255,255,255,.35); }}
"""
    govde = f"""
<div class="arka"><div class="ic">
  <div class="alinti">“Şiir kitabım ağlıyor!
Gözyaşlarını tutamamış öyle söyledi.
Harfler iç kanatırmış,
Kelimeler batarmış kalbine…
Cümleler canını acıtırmış.
Yaşayamazmış
Böyle ağlarmış”</div>
  <div class="tanitim">2008–2021 arasında İstanbul’un vapurlarında, adalarında, sokaklarında; İzmir’de, Paris’te ve Söğüt’te yazılmış otuz şiir. Basılamayan bir kitap önce bir sitede yaşadı; şimdi kâğıtta.</div>
  <div class="qr"><img src="qr.svg" alt="QR"><span>Şiirlerin<br>sitesi</span></div>
</div></div>
<div class="sirt"><span class="ad">Duyguların Peşinde · {SAIR}</span><div class="serit">{renkler}</div></div>
<div class="on"><div class="foto"></div><div class="yazi"><div class="sair">{SAIR}</div><div class="ad">Duyguların<br>Peşinde</div><div class="renkler">{renkler}</div></div></div>
"""
    return css, govde, sirt


def main():
    CIKTI.mkdir(exist_ok=True)
    siirler = siirleri_oku()
    kunyeler = fotograflari_oku()
    sayfalar = ic_sayfalar(siirler, kunyeler)
    for tur in ('prova', 'baski'):
        (CIKTI / f'ic-{tur}.html').write_text(
            f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{ORTAK_CSS}</style></head>'
            f'<body class="{tur}">{"".join(sayfalar)}{UYDUR_JS}</body></html>', encoding='utf-8')
    css, govde, sirt = kapak(len(sayfalar))
    (CIKTI / 'kapak.html').write_text(
        f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{css}</style></head>'
        f'<body>{govde}<script>document.fonts.ready.then(() => document.body.dataset.hazir = "1")</script></body></html>',
        encoding='utf-8')
    (CIKTI / 'olcu.txt').write_text(f'sayfa={len(sayfalar)}\nsirt_mm={sirt}\n', encoding='utf-8')
    print(f'{len(siirler)} şiir, {len(sayfalar)} iç sayfa, sırt ≈ {sirt} mm')


if __name__ == '__main__':
    main()
