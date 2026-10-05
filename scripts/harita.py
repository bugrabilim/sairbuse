"""İstanbul kıyı şeridini src/data/harita.json olarak üretir.

Veri: OpenStreetMap "simplified land polygons" (© OpenStreetMap katkıcıları, ODbL)
  https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip

Kullanım:
  pip install pyshp shapely
  python3 scripts/harita.py <simplified_land_polygons.shp yolu>
"""
import json
import math
import sys

import shapefile
from shapely.geometry import box, shape
from shapely.ops import unary_union

# Haritanın kapsadığı alan (boylam, enlem): Cihangir'den Büyükada'ya
BATI, GUNEY, DOGU, KUZEY = 28.90, 40.835, 29.17, 41.075
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


def main(yol):
    x0, y0 = merkator(BATI, GUNEY)
    x1, y1 = merkator(DOGU, KUZEY)
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

    yollar = []
    for p in sorted(getattr(kara, 'geoms', [kara]), key=lambda g: -g.area):
        halka = [((x - x0) * olcek, (y1 - y) * olcek) for x, y in list(p.exterior.coords)[:-1]]
        halka = chaikin(halka, 2 if len(halka) > 12 else 3)
        yollar.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in halka) + 'Z')

    veri = {
        'kaynak': '© OpenStreetMap katkıcıları (ODbL)',
        'genislik': GENISLIK,
        'yukseklik': yukseklik,
        'sinir': {'bati': BATI, 'guney': GUNEY, 'dogu': DOGU, 'kuzey': KUZEY},
        'kara': yollar,
    }
    with open('src/data/harita.json', 'w', encoding='utf-8') as f:
        json.dump(veri, f, ensure_ascii=False)
    print(f'{len(yollar)} kara parçası, {GENISLIK}×{yukseklik}')


if __name__ == '__main__':
    main(sys.argv[1])
