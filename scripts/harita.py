"""Haritaların kıyı şeridini üretir: İstanbul (src/data/harita.json) ve
İstanbul'un dışındaki yerler için geniş harita (src/data/harita-genis.json).

Veri: OpenStreetMap "simplified land polygons" (© OpenStreetMap katkıcıları, ODbL)
  https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip

Kullanım:
  pip install pyshp shapely
  python3 scripts/harita.py <simplified_land_polygons.shp yolu>            # İstanbul
  python3 scripts/harita.py <simplified_land_polygons.shp yolu> --genis    # Paris'ten Marmaris'e
"""
import json
import math
import sys

import shapefile
from shapely.geometry import box, shape
from shapely.ops import unary_union

HARITALAR = {
    # Cihangir'den Büyükada'ya
    'istanbul': {
        'sinir': (28.90, 40.835, 29.17, 41.075),
        'cikti': 'src/data/harita.json',
        'sadelestir': 0,  # piksel
        'en_kucuk': 0,  # piksel kare
    },
    # Paris'ten Marmaris'e: Eyfel, İstanbul, İzmir, Söğüt
    'genis': {
        'sinir': (-1.5, 35.4, 32.5, 50.8),
        'cikti': 'src/data/harita-genis.json',
        'sadelestir': 1.2,
        'en_kucuk': 6,
    },
}
GENISLIK = 800  # SVG birimi


def merkator(lon, lat):
    return lon * 20037508.34 / 180, math.log(math.tan((90 + lat) * math.pi / 360)) * 20037508.34 / math.pi


def chaikin(noktalar, tur=2):
    """Köşeleri yumuşatır; harita el çizimi gibi dursun diye."""
    for _ in range(tur):
        yeni = []
        n = len(noktalar)
        for i in range(n):
            (x0, y0), (x1, y1) = noktalar[i], noktalar[(i + 1) % n]
            yeni += [(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1), (0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1)]
        noktalar = yeni
    return noktalar


def main(yol, ad):
    h = HARITALAR[ad]
    bati, guney, dogu, kuzey = h['sinir']
    x0, y0 = merkator(bati, guney)
    x1, y1 = merkator(dogu, kuzey)
    olcek = GENISLIK / (x1 - x0)
    yukseklik = round((y1 - y0) * olcek)
    # kırpma kutusu biraz geniş tutulur ki kenarlarda yumuşatma kesik görünmesin
    pay = 0.02 * (x1 - x0)
    kutu = box(x0 - pay, y0 - pay, x1 + pay, y1 + pay)

    parcalar = []
    r = shapefile.Reader(yol)
    for s in r.shapes():
        a, b, c, d = s.bbox
        if c < kutu.bounds[0] or a > kutu.bounds[2] or d < kutu.bounds[1] or b > kutu.bounds[3]:
            continue
        k = shape(s.__geo_interface__).intersection(kutu)
        if not k.is_empty:
            parcalar.append(k)
    kara = unary_union(parcalar)
    if h['sadelestir']:
        kara = kara.simplify(h['sadelestir'] / olcek, preserve_topology=True)

    yollar = []
    for p in sorted(getattr(kara, 'geoms', [kara]), key=lambda g: -g.area):
        if p.area * olcek * olcek < h['en_kucuk']:
            continue
        halka = [((x - x0) * olcek, (y1 - y) * olcek) for x, y in list(p.exterior.coords)[:-1]]
        halka = chaikin(halka, 2 if len(halka) > 12 else 3)
        yollar.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in halka) + 'Z')

    veri = {
        'kaynak': '© OpenStreetMap katkıcıları (ODbL)',
        'genislik': GENISLIK,
        'yukseklik': yukseklik,
        'sinir': {'bati': bati, 'guney': guney, 'dogu': dogu, 'kuzey': kuzey},
        'kara': yollar,
    }
    with open(h['cikti'], 'w', encoding='utf-8') as f:
        json.dump(veri, f, ensure_ascii=False)
    print(f"{h['cikti']}: {len(yollar)} kara parçası, {GENISLIK}×{yukseklik}")


if __name__ == '__main__':
    main(sys.argv[1], 'genis' if '--genis' in sys.argv[2:] else 'istanbul')
