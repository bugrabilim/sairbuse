import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { DUYGU_SLUGLARI } from './data/duygular';
import { ORTAMLAR } from './data/ortam-sesleri';

const siirler = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/siirler' }),
  schema: z.object({
    /** Şiirin adı. Yoksa listelerde ilk mısra kullanılır. */
    baslik: z.string().optional(),
    /** YYYY-AA-GG. Tırnaksız yazılıp tarih olarak okunursa da metne çevrilir (içerik paneli öyle kaydedebilir). */
    tarih: z
      .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((t) => t.toISOString().slice(0, 10))])
      .optional(),
    /** Şairin yazdığı hâliyle yer. */
    yer: z.string().optional(),
    /** "Aynı yerden" bağlantısı için ortak ad (ör. Antigoni → Burgazada). */
    yerGrubu: z.string().optional(),
    /** İlki şiirin ana duygusudur, rengini o belirler. */
    duygular: z.array(z.enum(DUYGU_SLUGLARI)).min(1),
    /** Şairin sesiyle okuma: public/ses/ altındaki dosyanın yolu, ör. "/ses/sari.mp3" */
    ses: z.string().optional(),
    /** Birden çok okuma (ör. örnek yapay sesler). ornek: true olanlar sayfada "örnek" diye belirtilir. */
    sesler: z
      .array(z.object({ dosya: z.string(), etiket: z.string(), ornek: z.boolean().optional() }))
      .optional(),
    /** Şiirin ortam sesi (public/ortam/). Yoksa ana duygusunun sesi çalar (src/data/ortam-sesleri.ts). */
    ortam: z.enum(ORTAMLAR).optional(),
    /** src/data/fotograflar.ts'deki bir fotoğrafın kimliği. Yoksa yazıldığı yerin fotoğrafı kullanılır. */
    foto: z.string().optional(),
    /** Şiirin geldiği özgün dosya (kaynak/ klasöründe). */
    kaynak: z.string().optional(),
  }),
});

export const collections = { siirler };
