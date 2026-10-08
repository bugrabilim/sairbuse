# Duyguların Peşinde

> Proje kuralları, sunucu bilgileri ve Bumba Genel Standartlar: [CLAUDE.md](CLAUDE.md).

Basılı kitap olarak çıkamayan bir şiir kitabının web hâli. Kitap gibi sayfa sayfa okunmuyor; her şiir tek bir ekranda, yazıldığı yerin fotoğrafıyla açılıyor ve okur ona duygu, yer ya da zaman üzerinden ulaşıyor.

Adres: **https://duygularinpesinde.bumba.tr**

Plan, şiir envanteri ve yol haritası: [PLAN.md](PLAN.md)

## Sitede neler var

| Sayfa | Ne yapıyor |
|---|---|
| `/` | Her ziyarette başka bir "renk mısrası" (*Turuncu bir gemide olsam şimdi*, *Üstünde kaldı sarı kediler*…) kendi şiirinin fotoğrafıyla açılır; sayfa açıkken mısralar 9 saniyede bir yavaşça birbirine geçer ("Durdur" ile durur, hareketi azaltılmış cihazlarda geçiş yok). Altında "Bugün neyin peşindesin?" ve 7 duygu, fotoğraflı duygu şeritleri. Bugünün tarihinde yazılmış bir şiir varsa o da gösterilir. |
| `/duygu/…` | Bir duygunun bütün şiirleri, her biri kendi fotoğrafıyla. Her şiir ekrana girince harf harf yazılır. |
| `/yer/…` | Bir yerde (Moda, Burgazada, Söğüt…) yazılmış şiirler. |
| `/siir/…` | Tek bir şiir. Yazıldığı yerin fotoğrafıyla açılır (bilgisayarda fotoğraf solda sabit durur). Şiir yazılıyormuş gibi harf harf belirir; hız ve beliriş duyguya göre değişir: hüzün buğulu ve yavaş, ayrılık kesik, özgürlük akıcı. Şiire dokununca ya da bir tuşa basınca hepsi gelir; "Baştan oku" açılışı yeniden oynatır. "Mısra kartı", "Paylaş" (bağlantı, Facebook, Instagram, WhatsApp, SMS, LinkedIn) ve ortam sesi (deniz, yağmur, vapur, gece; ses düzeyi ayarlı) düğmeleri var. Kayıt varsa sesli dinlenebilir. Altta üç kapı: aynı duygudan, aynı yerden, aynı yıldan bir şiir. |
| `/siirler/` | Bütün şiirlerin listesi, duyguya göre süzülebilir. |
| `/harita/` | Şiirlerin yazıldığı yerler İstanbul haritasında; her nokta bir şiir, rengi o şiirin duygusu. Altında İstanbul'un dışındaki yerler (İzmir, Marmaris Söğüt, Paris) için Paris'ten Marmaris'e uzanan ikinci bir harita. |
| `/zaman/` | 2008–2021 duygu tayfı, yıl yıl şiirler ve takvimde kesişen günler. |
| `/fal/` | Şiir falı: fincanı kapat ya da duygu × yer çarkını çevir, bir şiir çıksın. |
| `/hakkinda/` | Kitabın hikâyesi, renklerin şiirlerdeki kaynağı, imza; fotoğraf künyeleri ve gizlilik düğmeyle açılan pencerelerde, haklar ve sık sorulanlar aşağı açılır. |
| `/admin/` | Şiir paneli: kod bilmeden şiir ekleme ve düzenleme (aşağıda). |

Derleme sırasında her şiir için WhatsApp ve Instagram'da görünen bir önizleme görseli, şiirin fotoğrafıyla otomatik üretilir (`/og/<şiir>.jpg`). Mısra kartı ise okurun tarayıcısında çizilir; okur seçtiği mısraları şiirin fotoğrafının üstünde, hikâye boyutunda bir görsel olarak indirir ya da paylaşır.

## Fotoğraflar

Her şiir yazıldığı yerin fotoğrafıyla açılıyor. Fotoğrafların hepsi gerçek; Wikimedia Commons'ta özgür lisansla (CC BY, CC BY-SA, CC0) paylaşılmış ve fotoğrafçısının adıyla kullanılıyor. Sitede siyah beyaza çekilip şiirin duygusunun rengine boyanıyorlar; bu renk değişikliği künyelerde belirtiliyor. Yeri belli olmayan şiirlerde fotoğraf, şiirdeki bir imgeyi gösteriyor.

- Dosyalar: `src/assets/foto/<kimlik>.jpg` (uzun kenarı en çok 2000 px)
- Künyeler (açıklama, fotoğrafçı, lisans, kaynak, isteğe bağlı odak noktası): `src/data/fotograflar.ts`
- Bir şiirin fotoğrafı: şiir dosyasındaki `foto:` alanı. Yoksa yazıldığı yerin fotoğrafı (`YER_FOTOGRAFLARI`), o da yoksa duygunun renginde bir ışık.
- Künyeler şiir sayfasında fotoğrafın köşesinde ve Hakkında sayfasının "Fotoğraflar" bölümünde listeleniyor.
- Şiir dışı sayfalar da (Bütün şiirler, Harita, Zaman, Fal, Hakkında, 404) bir fotoğrafla açılıyor; bunların künyesinde `sayfa` alanı var.

Kendi fotoğrafınızı koymak için dosyayı aynı kimlikle `src/assets/foto/` klasörüne koyup `fotograflar.ts`'de yazarı ve lisansı güncellemeniz yeterli.

Ortam sesleri bir ses dosyası değil, tarayıcıda Web Audio ile anında üretiliyor: telif sorunu ve ek ağ trafiği yok. Varsayılan olarak kapalı.

## Şiir eklemek ya da düzeltmek

### Şiir paneliyle (önerilen)

1. https://duygularinpesinde.bumba.tr/admin/ adresine girin.
2. **"Erişim token'ı kullanarak giriş yap"** seçeneğini seçin.
3. Anahtarı GitHub'da oluşturun: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Repository access: yalnızca `bugrabilim/sairbuse`
   - Permissions → Contents: **Read and write**
4. Şiirleri listeden açıp düzenleyin ya da **Yeni** ile ekleyin. Kaydettiğiniz her değişiklik `main` dalına bir commit olarak gider ve site kendiliğinden yeniden yayınlanır.

Şairin sesiyle yapılmış bir kayıt varsa şiirin **Şairin sesi** alanından yüklenebilir. Dosya `public/ses/` klasörüne gider ve şiir sayfasında "Şairin sesinden dinle" düğmesi belirir. Başka okumalar (ör. farklı sesler) **Diğer okumalar** listesine eklenir; her biri ayrı bir düğme olur.

Şu an sitede kayıt yok. Yapay sesle denenen örnekler şiiri düz okuduğu için kaldırıldı; kayıtların insan sesiyle yapılması bekleniyor (bkz. `PLAN.md` §10.4).

### Dosyayı doğrudan düzenleyerek

Şiirler `src/content/siirler/` klasöründe, her biri ayrı bir `.md` dosyası olarak duruyor:

```md
---
baslik: "Sarı"            # isteğe bağlı; yoksa başlık yerine "tarih – yer" görünür
tarih: "2020-04-19"       # isteğe bağlı, YYYY-AA-GG
yer: "Feneryolu"          # isteğe bağlı, şairin yazdığı gibi
yerGrubu: "Burgazada"     # isteğe bağlı; "Antigoni" gibi farklı adlar aynı yer sayılsın diye
duygular: ["huzun"]       # en az bir; ilki şiirin rengini belirler
foto: "feneryolu-kediler" # isteğe bağlı; src/data/fotograflar.ts'deki kimlik
ses: "/ses/sari.mp3"      # isteğe bağlı, şairin sesiyle okuma
sesler:                   # isteğe bağlı, başka okumalar
  - { dosya: "/ses/sari-ornek.mp3", etiket: "Kadın sesi · örnek", ornek: true }
---
Şimdi sakince beynimizi uyuşturuyoruz
Kahveyle
Rakıyla
```

- Her mısra ayrı bir satırda yazılır. Satırlar asla birleştirilmez.
- Kıtaları ayırmak için bir boş satır bırakılır.
- Geçerli duygular: `ask`, `ozlem`, `huzun`, `yalnizlik`, `ayrilik`, `karanlik`, `ozgurluk`. Renkleri ve kaynak mısraları `src/data/duygular.ts` dosyasında.
- Dosyanın adı şiirin adresi olur: `sari.md` dosyası `/siir/sari/` adresinde yayınlanır.
- Yeni bir yer haritada görünsün isterseniz konumunu `src/data/yerler.ts` dosyasına ekleyin; o yerin varsayılan fotoğrafı `src/data/fotograflar.ts` → `YER_FOTOGRAFLARI`.

Şairin imzası (şu an *Antigoni*) `src/data/site.ts` dosyasında tek satırda tanımlı.

## Yerelde çalıştırmak

Node 22.12 veya üstü gerekir.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ klasörüne statik site
npx astro check    # tip denetimi
```

`main` dalına yapılan her push'ta ve her pull request'te GitHub Actions bu denetimleri kendisi çalıştırır (`.github/workflows/denetim.yml`).

## Yayına almak

Yayın dalı `main`. Aşağıdaki iki yoldan biri yeterli.

### A. Coolify (bumba.tr sunucusu)

`*.bumba.tr` için joker DNS kaydı zaten Bumba'nın sunucusunu gösteriyor. Bu yüzden DNS'e dokunmak gerekmez.

1. Coolify'da **New Resource → Public/Private Repository** ile `bugrabilim/sairbuse` reposunu seçin, dal olarak `main`.
2. Build pack: **Dockerfile**. Repodaki `Dockerfile` siteyi derler ve `nginx.conf` ile 80 numaralı porttan sunar.
3. Domain: `https://duygularinpesinde.bumba.tr`. Sertifikayı Coolify kendisi alır.
4. Ziyaretçi sayacının kimliği `src/data/site.ts`'de yazılı; başka bir Umami sitesine bağlamak için **Build Variable** olarak `PUBLIC_UMAMI_ID` verilebilir.
5. Otomatik yayın için Coolify'ın GitHub entegrasyonunu ya da webhook'unu açın.

### B. Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git** adımlarını izleyip `bugrabilim/sairbuse` reposunu seçin. Production branch `main` olsun.
2. Framework preset **Astro**, build command `npm run build`, output `dist`. Node sürümü `.nvmrc`'den okunur.
3. İsteğe bağlı: `PUBLIC_UMAMI_ID` ortam değişkeni (yoksa `src/data/site.ts`'deki kimlik).
4. **Custom domains** bölümüne `duygularinpesinde.bumba.tr` ekleyin. Belirli kayıt, `*.bumba.tr` joker kaydının önüne geçer. `public/_headers` Cloudflare'e özel önbellek ve güvenlik başlıklarını içerir.

## Harita verisi

Kıyı şeridi OpenStreetMap'in sadeleştirilmiş kara poligonlarından üretildi (© OpenStreetMap katkıcıları, ODbL); kaynak sayfada da belirtiliyor. Yeniden üretmek için:

```sh
pip install pyshp shapely
# https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip indirip açın
python3 scripts/harita.py <klasör>/simplified_land_polygons.shp           # İstanbul: src/data/harita.json
python3 scripts/harita.py <klasör>/simplified_land_polygons.shp --genis   # Paris–Marmaris: src/data/harita-genis.json
```

## Kaynak dosyalar

`kaynak/` klasöründe Google Drive'daki özgün dosyalar duruyor: `şiirler.docx`, `şiirlerim.docx` (aynı içerik) ve beş `.txt`. Türkçe karakterler bozulmasın diye `.txt` dosyaları UTF-8'e çevrildi; içerikleri aynen korundu. Kişisel yazışma olan aşk metni bilinçli olarak eklenmedi.

Şiirler bu dosyalardan aktarıldı ve yazımları TDK Yazım Kılavuzu'na göre düzeltildi. Yapılan düzeltmelerin listesi [PLAN.md §8](PLAN.md)'de.

## Haklar

© 2008–2026 Antigoni. Bu depodaki bütün şiirlerin ve metinlerin tüm hakları saklıdır. İzinsiz çoğaltılamaz, kopyalanıp başka bir yerde yayımlanamaz.

`src/assets/foto/` klasöründeki fotoğraflar bu kapsamda değildir; her biri `src/data/fotograflar.ts`'de adı geçen fotoğrafçıya aittir ve kendi lisansıyla (CC BY, CC BY-SA ya da CC0) kullanılmaktadır.
