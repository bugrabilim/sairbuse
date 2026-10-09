// Ortam seslerinin künyeleri. Kayıtlar Beeld en Geluid'in (Hollanda Ses ve Görüntü Enstitüsü) arşivinden,
// Wikimedia Commons'ta CC BY-SA 3.0 ile paylaşılmış. Sitede kesilip düzeyleri eşitlendi (scripts/ortam.py);
// bu hâlleri de aynı lisansla kullanılabilir.
export interface OrtamKaydi {
  ses: 'deniz' | 'yagmur' | 'vapur' | 'gece';
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
];

export const commonsAdresi = (dosya: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(dosya.replace(/ /g, '_'))}`;
