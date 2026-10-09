"""Ortam seslerini Wikimedia Commons'taki özgün kayıtlardan üretir: public/ortam/*.mp3

Her kayıttan en dingin (ses düzeyi en az dalgalanan) bölüm seçilir, kesilir, düzeyi eşitlenir ve
128 kbps stereo mp3 olarak yazılır. Döngü dikişi tarayıcıda çapraz geçişle örtülür (src/scripts/ortam.ts).

Kullanım:
    python3 scripts/ortam.py <özgün kayıtların klasörü>

Özgün dosyaların adları ve kaynakları: src/data/ortam-sesleri.ts. Gerekenler: ffmpeg, numpy.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np

KOK = Path(__file__).resolve().parent.parent
CIKIS = KOK / 'public' / 'ortam'

# hedef dosya: (özgün dosya adı, saniye, hedef ses düzeyi LUFS)
SESLER = {
    'deniz': ('Meeuwen en het ruisen van de branding - SoundCloud - Beeld en Geluid.ogg', 80, -24),
    'yagmur': ('Regen op een pannendak - SoundCloud - Beeld en Geluid.ogg', 80, -25),
    'vapur': ('Het varen van de IJ-pont - SoundCloud - Beeld en Geluid.ogg', 80, -25),
    'gece': ('Krekels en kikkers - SoundCloud - Beeld en Geluid.ogg', 80, -27),
}
DUDUK = ('Het fluiten van de IJ-pont - SoundCloud - Beeld en Geluid.ogg', 'vapur-duduk', -22)


def mono(dosya: Path, oran=8000) -> np.ndarray:
    ham = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(dosya), '-ac', '1', '-ar', str(oran), '-f', 's16le', '-'],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(ham, dtype=np.int16).astype(np.float32) / 32768


def saniyelik_duzey(x: np.ndarray, oran=8000) -> np.ndarray:
    n = len(x) // oran
    kare = x[: n * oran].reshape(n, oran) ** 2
    return 10 * np.log10(kare.mean(axis=1) + 1e-10)


def dingin_bolum(dosya: Path, sure: int) -> int:
    """Ses düzeyinin en az dalgalandığı ve ani sıçrama olmayan bölümün başlangıç saniyesi"""
    db = saniyelik_duzey(mono(dosya))
    bas, son = 5, len(db) - 5 - sure
    if son <= bas:
        return 0
    puanlar = []
    for i in range(bas, son):
        p = db[i : i + sure]
        puanlar.append((p.std() + 0.5 * (p.max() - np.median(p)), i))
    return min(puanlar)[1]


def en_yuksek_bolum(dosya: Path, sure=9) -> int:
    db = saniyelik_duzey(mono(dosya))
    toplam = np.convolve(db, np.ones(sure), mode='valid')
    return max(0, int(np.argmax(toplam)) - 1)


def yaz(girdi: Path, cikti: Path, bas: int, sure: int, lufs: int, kenar=0.0):
    suzgec = f'highpass=f=30,loudnorm=I={lufs}:TP=-2:LRA=11'
    if kenar:
        suzgec += f',afade=t=in:d={kenar},afade=t=out:st={sure - kenar * 2}:d={kenar * 2}'
    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-ss', str(bas), '-t', str(sure), '-i', str(girdi),
         '-af', suzgec, '-ar', '44100', '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '128k',
         '-map_metadata', '-1', str(cikti)],
        check=True,
    )
    print(f'{cikti.name}: {bas}. saniyeden {sure} sn, {cikti.stat().st_size // 1024} KB')


def main():
    kaynak = Path(sys.argv[1])
    CIKIS.mkdir(parents=True, exist_ok=True)
    for ad, (dosya, sure, lufs) in SESLER.items():
        girdi = kaynak / dosya
        yaz(girdi, CIKIS / f'{ad}.mp3', dingin_bolum(girdi, sure), sure, lufs)
    dosya, ad, lufs = DUDUK
    girdi = kaynak / dosya
    yaz(girdi, CIKIS / f'{ad}.mp3', en_yuksek_bolum(girdi), 9, lufs, kenar=0.3)


if __name__ == '__main__':
    main()
