// Ortam seslerinin künyeleri. Kayıtlar Beeld en Geluid'in (Hollanda Ses ve Görüntü Enstitüsü) arşivinden,
// Wikimedia Commons'ta CC BY-SA 3.0 ile paylaşılmış. Sitede kesilip düzeyleri eşitlendi (scripts/ortam.py);
// bu hâlleri de aynı lisansla kullanılabilir.
export const ORTAMLAR = ['deniz', 'yagmur', 'vapur', 'gece', 'kafe', 'sehir', 'kuslar', 'ev'] as const;
export type Ortam = (typeof ORTAMLAR)[number];

export interface OrtamKaydi {
  ses: Ortam;
  /** Commons'taki dosya adı (File: öneki olmadan) */
  dosya: string;
  tr: string;
  en: string;
}

export const ORTAM_LISANS = { ad: 'CC BY-SA 3.0', url: 'https://creativecommons.org/licenses/by-sa/3.0/' };
export const ORTAM_YAZAR = 'Beeld en Geluid';

export const ORTAM_KAYITLARI: OrtamKaydi[] = [
  { ses: 'deniz', dosya: 'Meeuwen en het ruisen van de branding - SoundCloud - Beeld en Geluid.ogg', tr: 'Martılar ve kıyıya vuran dalgalar', en: 'Gulls and breaking waves' },
  { ses: 'yagmur', dosya: 'Regen op een pannendak - SoundCloud - Beeld en Geluid.ogg', tr: 'Kiremit çatıda yağmur', en: 'Rain on a tiled roof' },
  { ses: 'vapur', dosya: 'Het varen van de IJ-pont - SoundCloud - Beeld en Geluid.ogg', tr: 'Amsterdam’da IJ vapuru yolda', en: 'The IJ ferry under way, Amsterdam' },
  { ses: 'vapur', dosya: 'Het fluiten van de IJ-pont - SoundCloud - Beeld en Geluid.ogg', tr: 'IJ vapurunun düdüğü', en: 'The IJ ferry’s horn' },
  { ses: 'gece', dosya: 'Krekels en kikkers - SoundCloud - Beeld en Geluid.ogg', tr: 'Cırcır böcekleri ve kurbağalar', en: 'Crickets and frogs' },
  { ses: 'kafe', dosya: 'Rustige sfeer in een café - SoundCloud - Beeld en Geluid.ogg', tr: 'Sakin bir kafe', en: 'A quiet café' },
  { ses: 'sehir', dosya: 'Sfeer in binnenstad - SoundCloud - Beeld en Geluid.ogg', tr: 'Şehir merkezinde bir sokak', en: 'A street in the city centre' },
  { ses: 'kuslar', dosya: 'Wind door de bomen en kwetteren van vogels - SoundCloud - Beeld en Geluid.ogg', tr: 'Ağaçlarda rüzgâr ve kuşlar', en: 'Wind in the trees and birdsong' },
  { ses: 'ev', dosya: 'Het tikken van een staande klok - SoundCloud - Beeld en Geluid.ogg', tr: 'Bir odada duvar saatinin tıkırtısı', en: 'A grandfather clock ticking in a room' },
];

export const commonsAdresi = (dosya: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(dosya.replace(/ /g, '_'))}`;

/** Ortam sesi seçilmemiş şiirde ve duygu sayfalarında ana duygunun sesi */
export const DUYGU_ORTAMI: Record<string, Ortam> = {
  ask: 'deniz',
  ozlem: 'vapur',
  huzun: 'yagmur',
  yalnizlik: 'kafe',
  ayrilik: 'sehir',
  karanlik: 'gece',
  ozgurluk: 'kuslar',
};

/** Fon müziği: her duygunun makamı (public/muzik/<duygu>.mp3, üretimi scripts/muzik.py) */
export const DUYGU_MAKAMI: Record<string, string> = {
  ask: 'Hüzzam',
  ozlem: 'Uşşak',
  huzun: 'Hicaz',
  yalnizlik: 'Segah',
  ayrilik: 'Kürdi',
  karanlik: 'Saba',
  ozgurluk: 'Rast',
};
