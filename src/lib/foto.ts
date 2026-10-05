// Şiirlerin fotoğrafları. Dosyalar src/assets/foto/<id>.jpg, künyeleri src/data/fotograflar.ts'de.
import type { ImageMetadata } from 'astro';
import { FOTOGRAFLAR, YER_FOTOGRAFLARI, type Fotograf } from '../data/fotograflar';
import { yerGrubu, type Siir } from './siirler';

const dosyalar = import.meta.glob<{ default: ImageMetadata }>('../assets/foto/*.jpg', { eager: true });

export function fotograf(id: string): Fotograf {
  const f = FOTOGRAFLAR.find((x) => x.id === id);
  if (!f) throw new Error(`Bilinmeyen fotoğraf: "${id}". src/data/fotograflar.ts dosyasına ekleyin.`);
  return f;
}

export function gorsel(f: Fotograf): ImageMetadata {
  const g = dosyalar[`../assets/foto/${f.id}.jpg`];
  if (!g) throw new Error(`Fotoğraf dosyası yok: src/assets/foto/${f.id}.jpg`);
  return g.default;
}

/** Şiirin kendi fotoğrafı; yoksa yazıldığı yerin fotoğrafı; o da yoksa hiç. */
export function siirFotografi(s: Siir): Fotograf | undefined {
  if (s.data.foto) return fotograf(s.data.foto);
  const yer = yerGrubu(s);
  const id = yer ? YER_FOTOGRAFLARI[yer] : undefined;
  return id ? fotograf(id) : undefined;
}

/** Lisansın sitede yazılacak adı: "CC BY-SA 4.0", "CC0", "kamu malı" */
export function lisansAdi(f: Fotograf): string {
  return /^public domain$/i.test(f.lisans) ? 'kamu malı' : f.lisans;
}

/** Künye satırı: "Fotoğraf: Ad Soyad · CC BY-SA 4.0" */
export function kunye(f: Fotograf): string {
  return `Fotoğraf: ${f.yazar} · ${lisansAdi(f)}`;
}
