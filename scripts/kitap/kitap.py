"""Basılı kitabın (A5) sayfalarını siteyle aynı kaynaktan üretir. Kitap sitede yayımlanmaz.

Çıktılar kitap-cikti/ klasörüne gider (git'e girmez):
    ic.html, kapak.html  → scripts/kitap/pdf.cjs bunları PDF'e çevirir:
    ic-prova.pdf   iç sayfalar, saman zeminle (ekranda bakmak için)
    ic-acik-sayfa.pdf  kitap açılınca görünen hâli: 2|3, 4|5 … yan yana (bakmak için)
    ic-baski.pdf   iç sayfalar, zeminsiz, yalnız siyah (matbaaya)
    kapak.pdf      kapak açılımı, dış yüz: arka kapak, sırt, ön kapak (renkli, matbaaya)
    kapak-ic.pdf   kapak açılımı, iç yüz: ön kapağın içinde kitabın adı, arka kapağın içinde künye (tek renk, matbaaya)

Kullanım:
    python3 scripts/kitap/kitap.py && node scripts/kitap/pdf.cjs

Gerekenler: ffmpeg, PyYAML, segno (QR), Chromium + playwright-core (pdf.cjs).

Ölçüler: A5 (148 × 210 mm), her kenarda 3 mm kesim payı. Ön sayfalar: 1 başlık, 2 epigraf, 3 içindekiler; kitabın
adı ön kapağın, künye arka kapağın içinde; yıl ayracı yok. Şiirler 4. sayfadan başlar, adı olmayan şiirde ilk mısra
başlık olur. Şiir fotoğrafıyla tek sayfaya sığıyorsa fotoğraf üstte, şiir altta aynı sayfada; sığmıyorsa fotoğraf ve şiir aynı açık
sayfada yan yana (fotoğraf solda, şiir sağda). Tek sütuna da sığmayan çok uzun şiir kendi sayfasında iki sütun olur.
Şiirlerin boyu önce tarayıcıda ölçülür (scripts/kitap/olc.cjs), yerleşim ona göre yapılır.
Sırt kalınlığı tahminidir (YAPRAK_MM); kesin ölçüyü matbaa kâğıda göre verir.
"""

import html
import json
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
ALAN_MM = 166      # yazı alanının yüksekliği (216 − üst 23 − alt 27)
FOTO_EN_AZ_MM = 50  # şiirle aynı sayfadaki fotoğrafın en küçük yüksekliği
TEK_SAYFA_MM = ALAN_MM - FOTO_EN_AZ_MM - 12  # fotoğraf altı yazı ve boşluk: 12 mm


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
        kunyeler[alan('id')] = {'aciklama': alan('aciklama'), 'yazar': alan('yazar'), 'lisans': alan('lisans'),
                                'odak': alan('odak') or 'center'}
    return kunyeler



def ad(s):
    """Şiirin kitaptaki başlığı: adı varsa adı, yoksa ilk mısrası (sondaki noktalama atılır)"""
    return s['baslik'] or s['govde'].strip().splitlines()[0].strip().rstrip('.,;:!?…-–')


def imza(s):
    p = []
    if s['tarih']:
        y, a, g = s['tarih'].split('-')
        p.append(f'{g}.{a}.{y}')
    if s['yer']:
        p.append(s['yer'])
    return ' – '.join(p)



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
  .siir { font-size: 10.5pt; line-height: 1.5; hyphens: none; }
  .kita { margin-bottom: 1.5em; }
  .kita:last-child { margin-bottom: 0; }
  .m { padding-left: 1.2em; text-indent: -1.2em; }
  .siir-ad { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 15pt; margin-bottom: 5mm; }
  .imza { margin-top: auto; padding-top: 4mm; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 9pt; color: #5d554a; }
  .iki-sutun .siir { column-count: 2; column-gap: 8mm; }
  .iki-sutun .m { break-inside: avoid; orphans: 2; widows: 2; }
  .fotolu { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .fotolu img { display: block; max-width: 100%; max-height: 135mm; object-fit: contain; margin: 0 auto; }
  .tek-foto { flex: 1 1 auto; min-height: 0; max-height: 92mm; }
  .tek-foto img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .tek-alan .alt-yazi { margin: 2mm 0 7mm; text-align: left; }
  .prova .fotolu img, .prova .tek-foto img { mix-blend-mode: multiply; }
  .alt-yazi { margin-top: 4mm; font-style: italic; font-size: 7.5pt; line-height: 1.4; color: #5d554a; text-align: center; }
  .ortala { justify-content: center; align-items: center; text-align: center; }
  .buyuk-ad { font-family: 'Fraunces', serif; font-weight: 300; font-size: 30pt; line-height: 1.02; }
  .alt-ad { margin-top: 5mm; font-style: italic; font-size: 10.5pt; color: #5d554a; }
  .sair { margin-top: 18mm; font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; }
  .epigraf { margin: auto 0; font-style: italic; font-size: 10.5pt; line-height: 1.5; color: #5d554a; white-space: pre-line; }
  .kunye { margin-top: auto; font-size: 7.5pt; line-height: 1.55; color: #4a433a; }
  .fotolar-baslik { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 15pt; margin-bottom: 6mm; }
  .icindekiler { list-style: none; font-size: 9pt; line-height: 1.55; }
  .icindekiler li { display: flex; gap: 2mm; align-items: baseline; }
  .icindekiler li .nokta { flex: 1; border-bottom: 0.25pt dotted #8a8072; transform: translateY(-1mm); }
  .fotolar-alan .fotolar-baslik { margin-bottom: 2mm; }
  .fotolar-not { font-size: 7pt; line-height: 1.4; color: #5d554a; margin-bottom: 5mm; }
  .fotolar { list-style: none; font-size: 7.6pt; line-height: 1.36; column-count: 2; column-gap: 7mm; }
  .fotolar li { break-inside: avoid; margin-bottom: 2.6mm; }
  .fotolar span { color: #5d554a; }
  .olc { width: 112mm; }
  .olc .imza { margin-top: 0; }
"""


def sayfa(sinif, icerik, no=None):
    parca = [f'<section class="sayfa {sinif}">', icerik]
    if no is not None:
        parca.append(f'<div class="no">{no}</div>')
    parca.append('</section>')
    return ''.join(parca)


def govde_html(govde):
    """Her kıta bir blok, her mısra bir satır; taşan mısra asılı girintiyle alta kayar"""
    kitalar = re.split(r'\n[ \t]*\n', govde.strip('\n'))
    return ''.join('<div class="kita">' + ''.join(f'<div class="m">{e(m.strip())}</div>' for m in k.split('\n'))
                   + '</div>' for k in kitalar)


def siir_icerik(s):
    p = [f'<div class="siir-ad">{e(ad(s))}</div>']
    p.append(f'<div class="siir">{govde_html(s["govde"])}</div>')
    if imza(s):
        p.append(f'<div class="imza">{e(imza(s))}</div>')
    return ''.join(p)


def olc(siirler):
    """Her şiirin tek sütunda, yazı alanı genişliğinde kaç mm tuttuğunu tarayıcıda ölçer"""
    kutular = ''.join(f'<div class="olc" data-id="{e(s["id"])}">{siir_icerik(s)}</div>' for s in siirler)
    (CIKTI / 'olcum.html').write_text(
        f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{ORTAK_CSS}</style></head>'
        f'<body>{kutular}</body></html>', encoding='utf-8')
    subprocess.run(['node', str(Path(__file__).with_name('olc.cjs'))], check=True)
    return json.loads((CIKTI / 'olcum.json').read_text(encoding='utf-8'))


def yerlestir(birimler, ilk):
    """Birimlere sayfa numarası verir. Yan yana birim (fotoğraf + şiir) bir açık sayfaya sığmalı, yani çift
    numaralı (sol) sayfadan başlamalı. Sıra hiç değişmez; gerekirse tek sayfalık bir şiir fotoğrafı karşısında
    olacak şekilde iki sayfaya açılır (bedeli 1) ya da boş sayfa konur (bedeli 20).
    En az bedelli yerleşim dinamik programlamayla bulunur."""
    BOS, ACMA = 20, 1
    # durum: sonraki sayfanın teklik/çiftliği → (bedel, geçmiş)
    durum = {ilk % 2: (0, [])}
    for i, b in enumerate(birimler):
        yeni = {}
        for tek, (bedel, gecmis) in durum.items():
            secenekler = [(tek, bedel, gecmis), (1 - tek, bedel + BOS, gecmis + [('bos', i)])]  # ya da önüne boş sayfa
            for t0, c0, g0 in secenekler:
                if b['tur'] in ('yan', 'cift'):
                    yollar = [(2, 0, b['tur'])] if t0 == 0 else []
                elif b['tur'] == 'tek':
                    yollar = [(1, 0, 'tek')] + ([(2, ACMA, 'yan')] if t0 == 0 else [])
                for uzunluk, ek, tur in yollar:
                    sonraki = (t0 + uzunluk) % 2
                    aday = (c0 + ek, g0 + [(tur, i)])
                    if sonraki not in yeni or aday[0] < yeni[sonraki][0]:
                        yeni[sonraki] = aday
        durum = yeni
    _, gecmis = min(durum.values(), key=lambda d: d[0])
    yer, p = [], ilk
    for tur, i in gecmis:
        if tur == 'bos':
            yer.append({'tur': 'bos', 'p': p})
            p += 1
            continue
        b = dict(birimler[i], tur=tur, p=p)
        yer.append(b)
        p += 2 if tur in ('yan', 'cift') else 1
    return yer


def taraf(no):
    return 'sag' if no % 2 else 'sol'


def ic_sayfalar(siirler, kunyeler, olcum):
    # Ön sayfalar: 1 başlık, 2 epigraf, 3 içindekiler. Yarım başlık ön kapağın, künye arka kapağın içinde (kapak-ic).
    on = [sayfa('sag', '<div class="alan ortala"><div class="buyuk-ad">Duyguların<br>Peşinde</div>'
                f'<div class="alt-ad">Şiirler · 2008–2021</div><div class="sair">{SAIR}</div></div>'),
          sayfa('sol', '<div class="alan"><div class="epigraf">“Kim bilir belki de sen\nturuncu bir gemidesin”</div></div>'),
          None]  # içindekiler, sayfa numaraları belli olunca

    # Birimler: tek (fotoğraf + şiir 1 sayfa), yan (fotoğraf | şiir), cift (fotoğraf | iki sütun)
    birimler = []
    for s in siirler:
        boy = olcum[s['id']]
        tur = 'tek' if boy <= TEK_SAYFA_MM else 'yan' if boy <= ALAN_MM else 'cift'
        birimler.append({'tur': tur, 's': s})

    yer = yerlestir(birimler, len(on) + 1)
    sayfalar = []
    satirlar = []
    for b in yer:
        p = b['p']
        if b['tur'] == 'bos':
            sayfalar.append(sayfa(taraf(p), ''))
        else:
            s = b['s']
            k = kunyeler.get(s['foto'], {})
            foto = gri_foto(s['foto'])
            aciklama = e(k.get('aciklama', ''))
            siir_no = p if b['tur'] == 'tek' else p + 1
            satirlar.append(f'<li><span>{e(ad(s))}</span><span class="nokta"></span><span>{siir_no}</span></li>')
            if b['tur'] == 'tek':
                sayfalar.append(sayfa(taraf(p), f'<div class="alan siir-alan tek-alan"><div class="tek-foto">'
                                      f'<img src="{foto}" alt="{aciklama}" style="object-position:{k.get("odak", "center")}">'
                                      f'</div><div class="alt-yazi">{aciklama}</div>{siir_icerik(s)}</div>', p))
            else:
                sayfalar.append(sayfa(taraf(p), f'<div class="alan"><div class="fotolu"><img src="{foto}" alt="{aciklama}">'
                                      f'<div class="alt-yazi">{aciklama}</div></div></div>', p))
                ek = ' iki-sutun' if b['tur'] == 'cift' else ''
                sayfalar.append(sayfa(taraf(p + 1), f'<div class="alan siir-alan{ek}">{siir_icerik(s)}</div>', p + 1))
    on[2] = sayfa('sag', '<div class="alan siir-alan"><div class="fotolar-baslik">İçindekiler</div>'
                  f'<ul class="icindekiler">{"".join(satirlar)}</ul></div>', 3)
    sayfalar = on + sayfalar

    # Son sayfa: fotoğraf künyeleri, iki sütun
    kullanilan = []
    for s in siirler:
        if s['foto'] not in kullanilan:
            kullanilan.append(s['foto'])
    satir = [f'<li>{e(kunyeler[i]["aciklama"])}<br><span>{e(kunyeler[i]["yazar"])} · {e(kunyeler[i]["lisans"])}</span></li>'
             for i in kullanilan if i in kunyeler]
    no = len(sayfalar) + 1
    sayfalar.append(sayfa(taraf(no), '<div class="alan siir-alan fotolar-alan"><div class="fotolar-baslik">Fotoğraflar</div>'
                          '<div class="fotolar-not">Fotoğraflar Wikimedia Commons’ta özgür lisansla paylaşılmıştır '
                          '(CC BY, CC BY-SA, CC0); bu kitapta siyah beyaza çevrilerek kullanılmıştır.</div>'
                          f'<ul class="fotolar">{"".join(satir)}</ul></div>', no))
    # Toplam sayfa 4'ün katı olsun (forma)
    while len(sayfalar) % 4:
        sayfalar.append(sayfa(taraf(len(sayfalar) + 1), ''))
    return sayfalar


UYDUR_JS = """
<script>
// Sayfaya sığmayan şiirde önce fotoğraf (aynı sayfadaysa), sonra yazı biraz küçülür
document.fonts.ready.then(() => {
  for (const alan of document.querySelectorAll('.siir-alan')) {
    const yazi = alan.querySelector('.siir, .fotolar, .icindekiler');
    const foto = alan.querySelector('.tek-foto');
    let boy = parseFloat(getComputedStyle(yazi).fontSize) * 0.75;
    const tasiyor = () => alan.scrollHeight > alan.clientHeight + 1 || yazi.scrollWidth > yazi.clientWidth + 1;
    if (foto && foto.getBoundingClientRect().height < 50 * 3.78) foto.style.flex = 'none', foto.style.height = '50mm';
    while (tasiyor() && boy > 7.5) { boy -= 0.25; yazi.style.fontSize = boy + 'pt'; }
  }
  document.body.dataset.hazir = '1';
});
</script>
"""


# Kapağın iç yüzleri, kesilmiş 148 × 210 mm alana göre: ön kapağın içinde yarım başlık, arka kapağın içinde künye
KAPAK_ICI = ('<div style="height:100%;display:flex;align-items:center;justify-content:center;font-family:Fraunces,serif;'
             'font-style:italic;font-weight:300;font-size:16pt">Duyguların Peşinde</div>')
ARKA_KAPAK_ICI = ('<div style="position:absolute;left:16mm;right:20mm;bottom:24mm;font-family:Newsreader,serif;'
                  'font-size:7.5pt;line-height:1.55;color:#4a433a">'
                  f'© 2008–2026 {SAIR}. Tüm hakları saklıdır.<br>Bu kitaptaki şiirler izinsiz çoğaltılamaz, '
                  'kopyalanıp başka bir yerde yayımlanamaz.<br><br>Fotoğraflar Wikimedia Commons’tan, '
                  'fotoğrafçılarının adı ve lisansıyla kullanılmıştır; siyah beyaza çevrilmiştir. '
                  'Künyeleri kitabın sonundadır.<br><br>Birinci baskı, 2026. Sınırlı sayıda basılmıştır.</div>')


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
    # Kapağın iç yüzü: içeriden bakınca solda ön kapağın içi, ortada sırt, sağda arka kapağın içi
    ic_css = f"""
  @page {{ size: {genislik}mm 216mm; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ width: {genislik}mm; height: 216mm; position: relative; overflow: hidden; color: #1c1915; }}
  .on-ic, .arka-ic {{ position: absolute; top: 3mm; width: 148mm; height: 210mm; }}
  .on-ic {{ left: 3mm; }}
  .arka-ic {{ left: {3 + 148 + sirt}mm; }}
"""
    ic_govde = f'<div class="on-ic">{KAPAK_ICI}</div><div class="arka-ic">{ARKA_KAPAK_ICI}</div>'
    return css, govde, sirt, ic_css, ic_govde


def main():
    CIKTI.mkdir(exist_ok=True)
    siirler = siirleri_oku()
    kunyeler = fotograflari_oku()
    sayfalar = ic_sayfalar(siirler, kunyeler, olc(siirler))
    for tur in ('prova', 'baski'):
        (CIKTI / f'ic-{tur}.html').write_text(
            f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{ORTAK_CSS}</style></head>'
            f'<body class="{tur}">{"".join(sayfalar)}{UYDUR_JS}</body></html>', encoding='utf-8')
    # Kitap açılınca görünen hâli: kesilmiş sayfalar yan yana; 1. sayfa ön kapağın içinin karşısında, sonra solda çift numara,
    # sağda tek numara (2|3, 4|5 …). Yalnız bakmak için; matbaaya ic-baski gider.
    kapak_ici = lambda icerik: ('<section class="sayfa kapak-ici"><div style="position:absolute;left:3mm;top:3mm;'
                                f'width:148mm;height:210mm">{icerik}</div></section>')
    # Sayfa sayısı 4'ün katı, yani çift: son sayfa solda, karşısında arka kapağın içi
    yayimlar = ([(kapak_ici(KAPAK_ICI), sayfalar[0])] + [(sayfalar[i], sayfalar[i + 1]) for i in range(1, len(sayfalar) - 1, 2)]
                + [(sayfalar[-1], kapak_ici(ARKA_KAPAK_ICI))])
    acik = ''.join(f'<div class="yayim"><div class="kesik">{a or ""}</div><div class="kesik">{b or ""}</div></div>'
                   for a, b in yayimlar)
    acik_css = ORTAK_CSS.replace('@page { size: 154mm 216mm; margin: 0; }', '@page { size: 296mm 210mm; margin: 0; }') + '''
  .yayim { width: 296mm; height: 210mm; display: flex; position: relative; break-after: page; }
  .yayim::after { content: ''; position: absolute; left: 148mm; top: 0; bottom: 0; border-left: .3pt solid #b9ad94; }
  .kesik { width: 148mm; height: 210mm; overflow: hidden; position: relative; }
  .kesik .sayfa { position: absolute; left: -3mm; top: -3mm; break-after: auto; page-break-after: auto; }
  .prova .sayfa.kapak-ici { background: #f7f5f0; }
'''
    (CIKTI / 'ic-acik.html').write_text(
        f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{acik_css}</style></head>'
        f'<body class="prova">{acik}{UYDUR_JS}</body></html>', encoding='utf-8')
    css, govde, sirt, ic_css, ic_govde = kapak(len(sayfalar))
    (CIKTI / 'kapak-ic.html').write_text(
        f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{ic_css}</style></head>'
        f'<body>{ic_govde}<script>document.fonts.ready.then(() => document.body.dataset.hazir = "1")</script></body></html>',
        encoding='utf-8')
    (CIKTI / 'kapak.html').write_text(
        f'<!doctype html><html lang="tr"><head><meta charset="utf-8">{font_css()}<style>{css}</style></head>'
        f'<body>{govde}<script>document.fonts.ready.then(() => document.body.dataset.hazir = "1")</script></body></html>',
        encoding='utf-8')
    (CIKTI / 'olcu.txt').write_text(f'sayfa={len(sayfalar)}\nsirt_mm={sirt}\n', encoding='utf-8')
    print(f'{len(siirler)} şiir, {len(sayfalar)} iç sayfa, sırt ≈ {sirt} mm')


if __name__ == '__main__':
    main()
