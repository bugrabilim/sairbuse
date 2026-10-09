"""Ortam seslerini Wikimedia Commons'taki özgün kayıtlardan üretir: public/ortam/*.mp3

Her kayıttan en dingin (ses düzeyi en az dalgalanan, ani sıçraması olmayan) bölüm seçilir, kesilir,
düzeyi eşitlenir ve 128 kbps stereo mp3 olarak yazılır. Döngü dikişi tarayıcıda çapraz geçişle örtülür
(src/scripts/ortam.ts). Saat tıkırtısında kesit, tık aralığının tam katı (+ geçiş payı) uzunluğundadır;
böylece döngüde tıklar aksamaz.

Kullanım:
    python3 scripts/ortam.py <klasör>     # özgün .ogg dosyaları bu klasörde; yoksa Commons'tan indirilir

Kaynaklar ve künyeler: src/data/ortam-sesleri.ts. Gerekenler: ffmpeg, numpy.
.github/workflows/ortam-sesleri.yml bu betiği elle tetiklenince çalıştırır.
"""

import hashlib
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np

KOK = Path(__file__).resolve().parent.parent
CIKIS = KOK / 'public' / 'ortam'
EK = ' - SoundCloud - Beeld en Geluid.ogg'

# hedef: (özgün kayıt, saniye, hedef ses düzeyi LUFS)
SESLER = {
    'deniz': ('Meeuwen en het ruisen van de branding' + EK, 80, -24),
    'yagmur': ('Regen op een pannendak' + EK, 80, -25),
    'vapur': ('Het varen van de IJ-pont' + EK, 80, -25),
    'gece': ('Krekels en kikkers' + EK, 80, -27),
    'kafe': ('Rustige sfeer in een café' + EK, 80, -26),
    'sehir': ('Sfeer in binnenstad' + EK, 80, -26),
    'kuslar': ('Wind door de bomen en kwetteren van vogels' + EK, 80, -26),
    'ev': ('Het tikken van een staande klok' + EK, 60, -28),
}
DUDUK = ('Het fluiten van de IJ-pont' + EK, 'vapur-duduk', -22)
SAAT_GECIS = 0.25  # src/scripts/ortam.ts'teki GECIS.ev ile aynı olmalı
UA = 'DuygularinPesindeSite/1.0 (https://duygularinpesinde.bumba.tr; bilgi@bumbagroup.com)'


def indir(klasor: Path, ad: str) -> Path:
    yol = klasor / ad
    if yol.exists() and yol.stat().st_size > 100_000:
        return yol
    n = ad.replace(' ', '_')
    h = hashlib.md5(n.encode()).hexdigest()
    adres = f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(n)}'
    for deneme in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(adres, headers={'User-Agent': UA})) as y:
                yol.write_bytes(y.read())
            print(f'indirildi: {ad} ({yol.stat().st_size // 1024} KB)')
            time.sleep(3)
            return yol
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(30 * (deneme + 1))
    raise SystemExit(f'indirilemedi: {ad}')


def mono(dosya: Path, oran: int) -> np.ndarray:
    ham = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(dosya), '-ac', '1', '-ar', str(oran), '-f', 's16le', '-'],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(ham, dtype=np.int16).astype(np.float32) / 32768


def saniyelik_duzey(x: np.ndarray, oran: int) -> np.ndarray:
    n = len(x) // oran
    kare = x[: n * oran].reshape(n, oran) ** 2
    return 10 * np.log10(kare.mean(axis=1) + 1e-10)


def dingin_bolum(dosya: Path, sure: float) -> int:
    """Ses düzeyinin en az dalgalandığı ve ani sıçrama olmayan bölümün başlangıç saniyesi"""
    db = saniyelik_duzey(mono(dosya, 8000), 8000)
    s = int(np.ceil(sure))
    bas, son = 5, len(db) - 5 - s
    if son <= bas:
        return 0
    puanlar = [(db[i : i + s].std() + 0.5 * (db[i : i + s].max() - np.median(db[i : i + s])), i) for i in range(bas, son)]
    return min(puanlar)[1]


def tik_araligi(dosya: Path, bas: float, sure: float) -> float:
    """Saat tıkırtısının aralığı (saniye): zarfın öz ilintisinden"""
    oran = 1000
    x = mono(dosya, 16000)[int(bas * 16000) : int((bas + sure) * 16000)]
    d = np.abs(np.diff(x))
    zarf = d[: len(d) // 16 * 16].reshape(-1, 16).mean(axis=1)  # 1 ms çözünürlük
    zarf = zarf - zarf.mean()
    ilinti = np.correlate(zarf, zarf, mode='full')[len(zarf) - 1 :]
    en_az, en_cok = int(0.3 * oran), int(2.5 * oran)
    return (en_az + int(np.argmax(ilinti[en_az:en_cok]))) / oran


def en_yuksek_bolum(dosya: Path, sure=9) -> int:
    db = saniyelik_duzey(mono(dosya, 8000), 8000)
    toplam = np.convolve(db, np.ones(sure), mode='valid')
    return max(0, int(np.argmax(toplam)) - 1)


def yaz(girdi: Path, cikti: Path, bas: float, sure: float, lufs: int, kenar=0.0):
    suzgec = f'highpass=f=30,loudnorm=I={lufs}:TP=-2:LRA=11'
    if kenar:
        suzgec += f',afade=t=in:d={kenar},afade=t=out:st={sure - kenar * 2}:d={kenar * 2}'
    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-ss', f'{bas:.3f}', '-t', f'{sure:.3f}', '-i', str(girdi),
         '-af', suzgec, '-ar', '44100', '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '128k',
         '-map_metadata', '-1', str(cikti)],
        check=True,
    )
    print(f'{cikti.name}: {bas:.2f}. saniyeden {sure:.2f} sn, {cikti.stat().st_size // 1024} KB')


def main():
    kaynak = Path(sys.argv[1])
    kaynak.mkdir(parents=True, exist_ok=True)
    CIKIS.mkdir(parents=True, exist_ok=True)
    for ad, (dosya, sure, lufs) in SESLER.items():
        girdi = indir(kaynak, dosya)
        bas = dingin_bolum(girdi, sure)
        if ad == 'ev':
            aralik = tik_araligi(girdi, bas, sure)
            sure = round(sure / aralik) * aralik + SAAT_GECIS
            print(f'saat: tık aralığı {aralik:.3f} sn')
        yaz(girdi, CIKIS / f'{ad}.mp3', bas, sure, lufs)
    dosya, ad, lufs = DUDUK
    girdi = indir(kaynak, dosya)
    yaz(girdi, CIKIS / f'{ad}.mp3', en_yuksek_bolum(girdi), 9, lufs, kenar=0.3)


if __name__ == '__main__':
    main()
