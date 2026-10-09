"""Her duygunun fon müziğini üretir: public/muzik/<duygu>.mp3

Her duygu kendi makamında, taksim gibi serbest ölçülü, yavaş bir ezgi çalar: hüzün Hicaz, özlem Uşşak,
aşk Hüzzam, özgürlük Rast, karanlık Saba, ayrılık Kürdi, yalnızlık Segah. Ezgi makamın seyrine benzer
kurallarla (güçlüde asılı kalma, durakta bitme, çoğunlukla adım adım ilerleme) her seferinde aynı tohumla
kurulur; notalar makamın koma aralıklarıyla (perde bükerek) çalınır.

Çalgılar FluidR3_GM ses kütüphanesinden (MIT lisanslı; gerçek çalgı örnekleri): ney yerine shakuhachi
(nefesli bambu flüt), kanun yerine koto, dem için viyolonsel ve yaylılar.

Kullanım:
    python3 scripts/muzik.py [ses-kütüphanesi.sf2]

Gerekenler: fluidsynth, ffmpeg, mido (pip). Ses kütüphanesi verilmezse /usr/share/sounds/sf2/FluidR3_GM.sf2.
"""

import random
import subprocess
import sys
import tempfile
from pathlib import Path

import mido

KOK = Path(__file__).resolve().parent.parent
CIKIS = KOK / 'public' / 'muzik'
SF2 = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/usr/share/sounds/sf2/FluidR3_GM.sf2')

SANIYE = 960  # tık: 480 tık/vuruş, 0,5 sn/vuruş
SURE = 110  # saniye

# Makamların perdeleri: durağa göre sent (yaklaşık AEU aralıkları; 1 koma ≈ 22,6 sent)
MAKAMLAR = {
    'hicaz': [0, 113, 384, 498, 702, 792, 996, 1200],
    'ussak': [0, 181, 294, 498, 702, 792, 996, 1200],
    'huzzam': [0, 113, 317, 430, 702, 815, 1019, 1200],
    'rast': [0, 204, 385, 498, 702, 906, 1086, 1200],
    'saba': [0, 181, 294, 407, 702, 792, 996, 1200],
    'kurdi': [0, 90, 294, 498, 702, 792, 996, 1200],
    'segah': [0, 113, 317, 521, 702, 815, 1019, 1200],
}

# GM çalgı numaraları
SHAKUHACHI, KOTO, CELLO, YAYLILAR, SICAK_PAD = 77, 107, 42, 48, 89

# duygu: (makam, durak MIDI perdesi (kesirli), ana çalgı, eşlik, hız çarpanı, tohum)
DUYGULAR = {
    'huzun': ('hicaz', 62, SHAKUHACHI, 'dem', 1.15, 11),
    'ozlem': ('ussak', 62, SHAKUHACHI, 'dem', 1.0, 12),
    'ask': ('huzzam', 58.7, SHAKUHACHI, 'kanun', 0.95, 13),
    'ozgurluk': ('rast', 55, KOTO, 'ney', 0.8, 14),
    'karanlik': ('saba', 50, CELLO, 'dem', 1.2, 15),
    'ayrilik': ('kurdi', 50, CELLO, 'yaylı', 1.1, 16),
    'yalnizlik': ('segah', 58.7, SHAKUHACHI, None, 1.35, 17),
}


def perde(durak: float, makam: list[int], derece: int) -> float:
    """Makamın derece'inci perdesi (negatif ve sekizliği aşan dereceler de olur), kesirli MIDI"""
    sekizli, d = divmod(derece, len(makam) - 1)
    return durak + 12 * sekizli + makam[d] / 100


class Kanal:
    """Tek sesli bir kanal: her notadan önce perde bükme gönderir (koma aralıkları için)"""

    def __init__(self, iz: mido.MidiTrack, kanal: int, calgi: int, ses: int):
        self.iz, self.kanal, self.olaylar = iz, kanal, []
        self.olaylar.append((0, mido.Message('program_change', channel=kanal, program=calgi)))
        self.olaylar.append((0, mido.Message('control_change', channel=kanal, control=7, value=ses)))
        # Perde bükme aralığı ±2 yarım ses (varsayılan); açıkça yazılır
        for c, v in ((101, 0), (100, 0), (6, 2), (38, 0)):
            self.olaylar.append((0, mido.Message('control_change', channel=kanal, control=c, value=v)))

    def nota(self, bas: float, sure: float, yukseklik: float, guc: int):
        nota = round(yukseklik)
        bukme = int((yukseklik - nota) / 2 * 8191)
        t = int(bas * SANIYE)
        self.olaylar.append((t, mido.Message('pitchwheel', channel=self.kanal, pitch=bukme)))
        self.olaylar.append((t, mido.Message('note_on', channel=self.kanal, note=nota, velocity=guc)))
        self.olaylar.append((t + int(sure * SANIYE), mido.Message('note_off', channel=self.kanal, note=nota, velocity=0)))

    def yaz(self):
        simdi = 0
        for t, m in sorted(self.olaylar, key=lambda x: (x[0], x[1].type != 'note_off')):
            self.iz.append(m.copy(time=t - simdi))
            simdi = t


def taksim(rnd: random.Random, hiz: float) -> list[tuple[float, float, int, int]]:
    """(başlangıç, süre, derece, güç) listesi: güçlüde asılı kalan, durakta biten cümleler"""
    notalar, t, derece = [], 1.0, 0
    while t < SURE - 14:
        hedef = rnd.choice([4, 4, 0, 7, 2])  # cümle sonu: güçlü, durak, tiz durak ya da üçüncü
        uzunluk = rnd.randint(4, 9)
        for i in range(uzunluk):
            if i == uzunluk - 1:
                derece = hedef
            else:
                adim = rnd.choice([-1, -1, 1, 1, 1, -2, 2, 0])
                derece = max(-2, min(9, derece + adim))
            sure = rnd.choice([0.5, 0.7, 0.9, 1.2]) * hiz
            if i == uzunluk - 1:
                sure = rnd.choice([2.2, 3.0, 3.8]) * hiz
            notalar.append((t, sure * 0.94, derece, rnd.randint(58, 84)))
            t += sure
        t += rnd.uniform(1.6, 3.6) * hiz
    # Son cümle: güçlüden durağa iniş
    for derece in (4, 3, 2, 1, 0):
        sure = (1.0 if derece else 6.0) * hiz
        notalar.append((t, sure * 0.94, derece, 66))
        t += sure
    return notalar


def uret(ad: str, makam_adi: str, durak: float, calgi: int, eslik: str | None, hiz: float, tohum: int):
    rnd = random.Random(tohum)
    makam = MAKAMLAR[makam_adi]
    mid = mido.MidiFile(ticks_per_beat=480)
    iz = mido.MidiTrack()
    mid.tracks.append(iz)
    iz.append(mido.MetaMessage('set_tempo', tempo=500000, time=0))

    ana = Kanal(iz, 0, calgi, 100)
    cumle = taksim(rnd, hiz)
    for bas, sure, derece, guc in cumle:
        ana.nota(bas, sure, perde(durak, makam, derece), guc)
    kanallar = [ana]

    son = max(b + s for b, s, _, _ in cumle)
    if eslik in ('dem', 'yaylı'):
        # Dem: durak ve beşlisi, uzun ve çok kısık; arada güçlüye geçer
        dem = Kanal(iz, 1, YAYLILAR if eslik == 'yaylı' else CELLO, 46)
        dem2 = Kanal(iz, 2, SICAK_PAD, 30)
        t = 0.0
        while t < son:
            uzun = rnd.uniform(9, 14)
            derece = rnd.choice([0, 0, 4])
            dem.nota(t, uzun - 0.3, perde(durak - 12, makam, derece), 50)
            dem2.nota(t, uzun - 0.3, perde(durak - 12, makam, derece + 4), 40)
            t += uzun
        kanallar += [dem, dem2]
    elif eslik == 'kanun':
        # Kanun: cümle aralarında makamın perdelerinden kısa arpejler
        kanun = Kanal(iz, 1, KOTO, 52)
        for bas, sure, derece, _ in cumle:
            if sure > 1.8 and rnd.random() < 0.7:
                for k, d in enumerate((derece, derece + 2, derece + 4)):
                    kanun.nota(bas + 0.25 + k * 0.18, 1.2, perde(durak, makam, d), 50)
        kanallar.append(kanun)
    elif eslik == 'ney':
        # Rast: kanun (koto) önde, ney uzun seslerle arkada
        ney = Kanal(iz, 1, SHAKUHACHI, 48)
        t = 2.0
        while t < son - 6:
            uzun = rnd.uniform(5, 8)
            ney.nota(t, uzun - 0.5, perde(durak + 12, makam, rnd.choice([0, 4, 2])), 46)
            t += uzun + rnd.uniform(3, 6)
        kanallar.append(ney)
    for k in kanallar:
        k.yaz()

    with tempfile.TemporaryDirectory() as gecici:
        midi = Path(gecici) / f'{ad}.mid'
        wav = Path(gecici) / f'{ad}.wav'
        mid.save(midi)
        subprocess.run(
            ['fluidsynth', '-ni', '-g', '0.6', '-r', '44100',
             '-o', 'synth.reverb.active=1', '-o', 'synth.reverb.room-size=0.85',
             '-o', 'synth.reverb.damp=0.35', '-o', 'synth.reverb.width=1', '-o', 'synth.reverb.level=0.7',
             '-o', 'synth.chorus.active=0', '-F', str(wav), str(SF2), str(midi)],
            check=True, capture_output=True,
        )
        cikti = CIKIS / f'{ad}.mp3'
        subprocess.run(
            ['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-t', str(son + 6),
             '-af', 'highpass=f=40,loudnorm=I=-26:TP=-3:LRA=14,afade=t=in:d=1.5',
             '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '112k', '-map_metadata', '-1', str(cikti)],
            check=True,
        )
    print(f'{cikti.name}: {makam_adi}, {son + 6:.0f} sn, {cikti.stat().st_size // 1024} KB')


def main():
    CIKIS.mkdir(parents=True, exist_ok=True)
    for ad, ayar in DUYGULAR.items():
        uret(ad, *ayar)


if __name__ == '__main__':
    main()
