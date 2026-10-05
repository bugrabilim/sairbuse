# Duyguların Peşinde

Basılı kitap olarak çıkamayan bir şiir kitabının web hâli. Kitap gibi sayfa sayfa okunmuyor; her şiir tek bir ekranda duruyor ve okur ona duygu, yer ya da zaman üzerinden ulaşıyor.

Adres: **https://duygularinpesinde.bumba.tr**

Plan, şiir envanteri ve yol haritası: [PLAN.md](PLAN.md)

## Sitede neler var

| Sayfa | Ne yapıyor |
|---|---|
| `/` | Açılışta *"Şiir kitabım ağlıyor!"* mısraı ve "Bugün neyin peşindesin?" sorusu, altında 7 duygu. Bugünün tarihinde yazılmış bir şiir varsa o da gösterilir. |
| `/duygu/…` | Bir duygunun bütün şiirleri. Sayfa o duygunun rengine boyanır. Ayrılık sayfası gündüz temasında da siyah kalır. |
| `/siir/…` | Tek bir şiir. "Yavaş oku" ve "Paylaş" düğmeleri var. Altta üç kapı: aynı duygudan, aynı yerden, aynı yıldan bir şiir. |
| `/siirler/` | Bütün şiirlerin listesi, duyguya göre süzülebilir. |
| `/zaman/` | 2008–2021 duygu tayfı, yıl yıl şiirler ve takvimde kesişen günler. |
| `/fal/` | Şiir falı: niyet tut, fincanı kapat, soğuyunca rastgele bir şiir çıkar. |
| `/hakkinda/` | Kitabın hikâyesi, renklerin şiirlerdeki kaynağı, imza ve haklar. |

Her şiirin WhatsApp ve Instagram'da paylaşıldığında görünen önizleme görseli derleme sırasında otomatik üretilir (`/og/<şiir>.png`).

## Şiir eklemek ya da düzeltmek

Şiirler `src/content/siirler/` klasöründe, her biri ayrı bir `.md` dosyası olarak duruyor. Dosyayı GitHub'ın web arayüzünden de ekleyip düzenleyebilirsiniz. Kaydedince site kendiliğinden yeniden yayınlanır.

```md
---
baslik: "Sarı"            # isteğe bağlı; yoksa başlık yerine "tarih – yer" görünür
tarih: "2020-04-19"       # isteğe bağlı, YYYY-AA-GG
yer: "Feneryolu"          # isteğe bağlı, şairin yazdığı gibi
yerGrubu: "Burgazada"     # isteğe bağlı; "Antigoni" gibi farklı adlar aynı yer sayılsın diye
duygular: ["huzun"]       # en az bir; ilki şiirin rengini belirler
---
Şimdi sakince beynimizi uyuşturuyoruz
Kahveyle
Rakıyla
```

- Her mısra ayrı bir satırda yazılır. Satırlar asla birleştirilmez.
- Kıtaları ayırmak için bir boş satır bırakılır.
- Geçerli duygular: `ask`, `ozlem`, `huzun`, `yalnizlik`, `ayrilik`, `karanlik`, `ozgurluk`. Renkleri ve kaynak mısraları `src/data/duygular.ts` dosyasında.
- Dosyanın adı şiirin adresi olur: `sari.md` dosyası `/siir/sari/` adresinde yayınlanır.

Şairin imzası (şu an *Antigoni*) `src/data/site.ts` dosyasında tek satırda tanımlı.

## Yerelde çalıştırmak

Node 22.12 veya üstü gerekir.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ klasörüne statik site
npx astro check    # tip denetimi
```

## Yayına almak (Cloudflare Pages)

`bumba.tr` alan adı zaten Cloudflare'de olduğu için en kısa yol bu:

1. Cloudflare panelinde **Workers & Pages → Create → Pages → Connect to Git** adımlarını izleyip `bugrabilim/sairbuse` reposunu seçin.
2. Derleme ayarları:
   - Production branch: şimdilik `claude/charming-goldberg-chy691` (repodaki tek dal; bir `main` dalı açılınca onunla değiştirin)
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node sürümü `.nvmrc` dosyasından okunur (22).
3. İsteğe bağlı ziyaretçi sayacı: `istatistik.bumba.tr` (Umami) üzerinde yeni bir site oluşturun. Website ID'sini Pages projesinin ortam değişkenlerine `PUBLIC_UMAMI_ID` adıyla ekleyin. Çerezsiz olduğu için çerez bandı gerekmez. Değişken boşsa sayaç hiç yüklenmez.
4. **Custom domains** bölümüne `duygularinpesinde.bumba.tr` adresini ekleyin. DNS kaydı otomatik oluşur. `*.bumba.tr` joker kaydı olsa da belirli kayıt ondan önce gelir.

Alternatif olarak `dist/` klasörü herhangi bir statik sunucudan da yayınlanabilir. `public/_headers` dosyası Cloudflare'e özel önbellek ve güvenlik başlıklarını içerir.

## Kaynak dosyalar

`kaynak/` klasöründe Google Drive'daki özgün dosyalar duruyor: `şiirler.docx`, `şiirlerim.docx` (aynı içerik) ve beş `.txt`. Türkçe karakterler bozulmasın diye `.txt` dosyaları UTF-8'e çevrildi; içerikleri aynen korundu. Kişisel yazışma olan aşk metni bilinçli olarak eklenmedi.

Şiirler bu dosyalardan birebir aktarıldı. Yazım düzeltmeleri şairin onayını bekliyor (bkz. [PLAN.md §8](PLAN.md)).

## Haklar

© 2026 Antigoni. Bu depodaki bütün şiirlerin ve metinlerin tüm hakları saklıdır. İzinsiz çoğaltılamaz, kopyalanıp başka bir yerde yayımlanamaz.
