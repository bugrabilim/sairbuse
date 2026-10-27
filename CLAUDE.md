# Duyguların Peşinde — master dosya

Eylül Bitse imzalı, basılamamış bir şiir kitabının sitesi: 30 şiir; duygu, yer ve zaman üzerinden okunuyor.
Canlı adres: https://duygularinpesinde.bumba.tr · Bumba Life ürünü (Bumba Group).
Ayrıntılı plan ve tasarım geçmişi: @PLAN.md · kurulum ve içerik ekleme: @README.md

## Proje

- **Tür:** statik site. Astro 7 (SSG), nginx ile sunulur (`Dockerfile`, `nginx.conf`). Veritabanı ve sunucu
  tarafı yok; bu yüzden Standartlar §7 (üyelik) ve §10 (panel) uygulanmaz.
- **İçerik:** `src/content/siirler/*.md`. Fotoğraflar `src/assets/foto/`, künyeleri `src/data/fotograflar.ts`
  (İngilizce açıklamaları `src/i18n/fotograflar-en.ts`).
- **Diller:** Türkçe kökte, İngilizce `/en/` altında. Arayüz metinleri `src/i18n/tr.ts` ve `en.ts`;
  adres eşlemesi `src/i18n/index.ts`. Sayfa gövdeleri `src/sayfalar/`, `src/pages/` ve `src/pages/en/` ince
  yönlendirmeler. Yeni sayfa = bir bileşen + iki yönlendirme + `SAYFALAR` kaydı + iki sözlük girdisi.
- **Kontroller:** `npx astro check` (0 hata), `npm run build`. Derleme yalnız repodakiyle çalışır.
- **İçerik paneli:** `/admin/` (Sveltia CMS, noindex, kendi gevşek CSP'si).

# Genel Standartlar

Bu proje Bumba Genel Standartlar'a tabidir. Metin tek yerde durur: https://bumbagroup.com/standartlar.md
(düz metin). Her oturumun başında oku (`curl -s https://bumbagroup.com/standartlar.md` ya da web getirme
aracı) ve ona göre çalış; metni bu dosyaya kopyalama. Okunamazsa uydurma, sahibine bildir.
Uygulanan sürüm: 5.5 (25 Ekim 2026). Daha yeni sürüm varsa "Sürüm notları"ndaki farkı uygula, sonra bu satırı güncelle.
Sunucuya basmanın (izlenen dala birleştirme ya da push, Coolify yayını) zamanı her seferinde sahibine sorulur.
Ajan (alt ajan, iş akışı) gerekmedikçe kullanılmaz; kullanmadan önce tahmini süre ve kullanımla sahibine sorulur.

## Bu projeye özel kararlar ve sapmalar

- **Mahlas "Eylül Bitse"** (27 Ekim 2026, sahibinin bildirdiği; önceki geçici imza "Antigoni" idi): tek yerden
  `src/data/site.ts` → `SITE.sair`; kart ve kitap betiklerinde `SAIR`. Sitede "Antigoni" görünmez: 24.10.2011
  şiirinin yeri "Burgazada" yazılır, adresi `/siir/2011-10-24-burgazada/` (eski `…-antigoni` adresleri ve paylaşım
  görselleri `nginx.conf`'ta 301 ile yönlenir). Yalnız şiirin kendi dizesinde ("Antigoni’de yemek yiyen bir kedi") geçer.
- Şiirlerin tüm hakları saklıdır; lisans yok. Şiirler çevrilmez: İngilizce sayfalarda Türkçe kalır, `lang="tr"`.
- "sevgimiz percinlensin-aşkmetni.txt" şiir değildir, sitede yayımlanmaz.
- Şiirler listesinde (Bütün şiirler, Harita, Zaman) sesli okuması olan şiirin adının yanında hoparlör işareti var
  (`sesli()` → `SiirListesi.astro`, `.liste-ses`; ekran okuyucuya "Sesli okuması var").
- Yapay sesle okuma yok (kaldırıldı). İnsan sesiyle kayıtlar şiir dosyasında `ses:` (düğme "Sesli dinle"; kayıtlar şairin sesi
  değil, sahibi 9 Ekim 2026'da düzeltti, "şairin sesi" denmez),
  dosyalar `public/ses/<şiir>.mp3`, düzey −18 LUFS'e eşitlenir; okuma sürerken ortam sesi ve fon müziği kısılır.
  9 Ekim 2026: üç şiirin kaydı var (2017-05-24-altunizade, 2019-12-21-feneryolu, 2020-07-18-moda).
- **Varsayılan tema koyu (gece)** (sahibinin kararı, 8 Ekim 2026; 27 Ekim 2026'da yinelendi): Standartlar §3'teki
  "ilk açılışta sistem tercihi" bu projede uygulanmaz, istisnanın standarda eklenmesi ana altyapı oturumundan
  istendi. Açık tema (gündüz) yalnız düğmeyle seçilir; seçim `localStorage` `tema-secimi` anahtarında hatırlanır.
  Eski `tema` anahtarı (sistem tercihini yazmış olabilir) okunmaz.
  Sayfalar `Cache-Control: no-cache` ile gider ki eski HTML tarayıcıda takılı kalmasın.
- Şiir sayfasında şiir **harf harf yazılarak** açılır (satır satır değil); hız duyguya göre.
- Ana sayfada "Yazıldıkları yerler" ve "ya da niyet tut" satırı yok; duygu şeritleri dar (72rem) kalır.
- Ana sayfa vitrininin (hero) tamamı tıklanır ve o mısranın şiirine gider (18 Ekim 2026; sitede ve uygulamada).
  Fotoğraf künyesi ve Durdur düğmesi kendi işini yapar.
- **Alt bilgi masaüstünde tek satır** (sahibinin kararı, 12 Ekim 2026; 27 Ekim 2026'da yinelendi, Standartlar §1'deki
  "solda liste, sağda imza" düzeni bu projede uygulanmaz, istisnanın standarda eklenmesi ana altyapı oturumundan
  istendi): solda telif ("© 2008'den itibaren Eylül Bitse. Şiirlerin tüm hakları saklıdır."; bitiş yılı yazılmaz) ve
  altında küçük "Gizlilik" bağlantısı ile "Çerez tercihleri" düğmesi (§9, §14), ortada e-posta listesi (başlık, adres,
  Katıl), sağda "App Store'dan indir" (yayına girince) ve Bumba Life rozeti. Orta genişlikte iki satır, telefonda alt
  alta. Uygulamada liste yerine siteyi Safari'de açan bağlantı, çerez düğmesi yok. Görünür son güncelleme tarihi
  Hakkında'nın sonunda (derleme günü); makineler için JSON-LD `dateModified` ve llms.txt.
- **E-posta listesi Katıl penceresi** (Standartlar §6): Katıl'a basınca pencere açılır, aydınlatma metni ortak
  servisten (`/api/liste/aydinlatma?dil=`) yüklenir, "Tam metin" bağlantısı ve asıl "Kabul ediyorum" düğmesi
  (metin yüklenene dek kapalı) orada. JavaScript yoksa formun altında işaretsiz rıza kutusu durur, form yine çalışır
  (`ListeFormu.astro`).
- **Çerez bandı** (Standartlar §14): ilk ziyarette altta Kabul et, Reddet, Tercihler (eşit). Umami "İstatistik"
  grubunda, yalnız izinle yüklenir; seçim `bumba-cerez` anahtarında (politika sürümü `src/data/cerez.ts`).
  Politika merkezde (bumbagroup.com/cerez-politikasi). Uygulamada bant yok (sayaç da yok). `CerezBandi.astro`.
- **Kazanım rozetleri yalnız telefon uygulamasında** (Standartlar §13; sahibinin kararı, 27 Ekim 2026: sitede yok).
  Sitede `/rozetler/` sayfası üretilmez, menüde yok, rozet verisi sayfaya konmaz (`UYGULAMA` ile). 18 rozet (`src/data/rozetler.ts`, adlar ve koşullar
  sözlükte), hesap `src/scripts/rozetler.ts`. Veri yalnız telefonda (`localStorage` `rozetler`: rozet kimliği,
  kazanma günü, okunan/dinlenen şiir kimlikleri, eylemler, seri); sunucuya gitmez. İlk kazanımda kısa bildirim ve
  bir kez not; `/rozetler/` (`/en/badges/`, `src/pages/[rozetler].astro`) listesi ve "Rozetleri sil". Uygulamada
  sayaç olmadığı için `rozet-kazanildi` olayı hiçbir yere gitmez. Sayfalar eylemi `rozet` olayıyla bildirir (şiir 5 sn
  açık kalınca okuma, kaydın %80'i dinlenince dinleme, fal, çark, paylaş, mısra kartı).
- Hakkında'da "Fotoğraflar", "Gizlilik ve çerezler", "Haklar" ve "Sık sorulanlar" düğmeyle açılan pencerelerde
  (`#fotograflar`, `#gizlilik`, `#haklar`, `#sorular` adresleri pencereyi açar; JS yoksa içerik sayfada açık).
  `/gizlilik/` sayfası da durur (KVKK bağlantıları için), metin tek yerden: `GizlilikMetni.astro`.
- Şiir paylaşımı kendi menüsüyle: bağlantıyı kopyala, Facebook, Instagram (altında küçük not: bağlantı
  kopyalanır), WhatsApp, SMS, LinkedIn. Başka kanal eklenmez. Telefonda paylaş ve ortam sesi menüleri ekranın
  altından açılır (sayfa yana taşmaz).
- Ortam sesi **varsayılan açık, %10 düzeyde** (9 Ekim 2026): her şiirin kendi sesi var (şiir dosyasında
  `ortam:`; yoksa ana duygunun sesi, `DUYGU_ORTAMI`), duygu sayfasında duygunun sesi. Tarayıcı kuralı gereği ilk
  dokunuşta başlar. Menüde kapalı, "şiirin sesi" ve genel sesler (deniz, yağmur, vapur, gece, kafe, şehir,
  kuşlar, ev) var; seçim ve düzey hatırlanır. iPhone sessiz moddayken ortam sesi ve fon müziği susar (sahibinin
  isteği, 18 Ekim 2026); "Sesli dinle" okurun bastığı oynatıcı olduğu için çalar. Ses düzeyi kaydırıcısı yalnız
  sitede; uygulamada yok, düzey %10 sabit, gerisini telefonun ses tuşları belirler. Sesler gerçek saha kayıtları (sentez sesler kalitesiz bulundu):
  Beeld en Geluid, Commons, CC BY-SA 3.0. Dosyalar `public/ortam/`, üretimi `scripts/ortam.py` (Wikimedia bu
  sunucunun IP'sine sınır koyduğu için GitHub Actions'ta: `.github/workflows/ortam-sesleri.yml`), künyeler
  `src/data/ortam-sesleri.ts` ve Hakkında → Haklar.
- Telefonda arama, dil (TR/EN) ve tema düğmeleri üst şeritte değil, menünün en altında. Masaüstünde üst şeritte.
- **Fon müziği varsayılan kapalı** (ortam sesi menüsünde "fon müziği · makam"): her duygunun makamında taksim
  gibi bir ezgi (hüzün Hicaz, özlem Uşşak, aşk Hüzzam, özgürlük Rast, karanlık Saba, ayrılık Kürdi, yalnızlık
  Segah). `public/muzik/<duygu>.mp3`, üretimi `scripts/muzik.py` (fluidsynth + FluidR3_GM, MIT; koma aralıkları
  perde bükmeyle). Açılınca hatırlanır, ortam sesi biraz kısılır.
- **Rastgele şiir adresi `/cek/`** (`/en/draw/`; 23 Ekim 2026, şaire armağan kutusundaki QR için): her açılışta
  rastgele bir şiire gider, aynı telefon gördüğü şiiri hepsi bitene dek tekrar çekmez (`localStorage`
  `cekilenler`). Farklı telefonlara farklı şiir garanti değil (sunucu yok). noindex; haritada, aramada, llms.txt'de
  yok. Umami olayı `siir-cek`. Adres basılı QR'da olduğu için değiştirilmez: `src/sayfalar/Cek.astro`.
  Kart (55 × 85 mm dikey, tek yüz: şairin adı, logo, 2008–2021, duygu renkleri, ana sayfaya QR, `?utm_source=kart` ile Umami'de ayrı sayılır; gece ve saman zemin; sitede yok): `python3 scripts/kart/kart.py && node scripts/kart/pdf.cjs` → `kart-cikti/`.
- Mum ışığı modu denendi, sahibi gereksiz buldu (9 Ekim 2026): kaldırıldı, geri eklenmez.
- **Logo "Damla"** (12 Ekim 2026, sahibinin seçimi): "Duyguların Peşinde" Fraunces 300; adın tek noktası,
  Peşinde'nin i'si, bir gözyaşı damlası (açılış dizesi "Şiir kitabım ağlıyor!"). Damla sayfanın duygusunun
  renginde (`--damla`; duygusuz sayfada hüznün sarısı), tek renk baskıda mürekkep. Harf gerçek i kalır, noktası
  CSS ile kırpılır, damla sözde öge (ekran okuyucu "Peşinde" okusun): `Logo.astro`, `.damla-i`, ölçüler
  `src/data/logo.ts`. Tek başına damla küçük işarettir: koyu karede sarı damla (`favicon.svg`, uygulama
  simgeleri; üretimi `node scripts/simgeler.mjs`). Üst şeritte, paylaşım görsellerinde, mısra kartında, kitabın
  kapağında ve başlık sayfasında; kitabın sırtında yok (yedi renk noktası kalır).
- **Okur notu yok** (9 Ekim 2026): okur şiire renk ya da kelime bırakmaz, şair onay vermez, şair için giriş/şifre
  yok. Site statik kalır; sunucu tarafı eklenmez.
- **Kitap (basılı, A5) siteye konmaz:** saman kâğıt, iç sayfalar tek renk (siyah), yalnız kapak renkli. Sahibinin
  seçimleri (9 Ekim 2026): kapakta sarıya boyanmış Moda fotoğrafı; her şiirde fotoğraf; arka kapakta adres yazısı
  değil QR kod. Ön kapağın içi boş, arka kapağın içinde künye. İç sayfalar 1 başlık, 2 epigraf,
  3 içindekiler, şiirler 4'ten. Her şiirin başlığı var (adı yoksa ilk mısrası). Yıl ayracı yok, sayfa başında yıl yok. Düzen: şiir fotoğrafıyla tek sayfaya sığıyorsa fotoğraf
  üstte, şiir altta; sığmıyorsa aynı açık sayfada yan yana (fotoğraf solda, şiir sağda); çok uzun şiir kendi
  sayfasında iki sütun. Fotoğraf künyeleri sonda tek sayfa, iki sütun. Boş sayfa ancak kaçınılmazsa.
  Sesli okuması olan şiirde (`ses:`/`sesler:` dolu) imzanın yanında "Sesli dinle" yazısı ve o şiirin site sayfasına
  giden QR kod durur (kendiliğinden, kayıt eklenince kitap da günceller).
  Üretim: `python3 scripts/kitap/kitap.py && node scripts/kitap/pdf.cjs` → `kitap-cikti/` (git'e girmez):
  `ic-prova.pdf` (saman zeminli, bakmak için), `ic-acik-sayfa.pdf` (açık sayfa görünümü: 2|3, 4|5 …), `ic-baski.pdf` (zeminsiz, matbaaya), `kapak.pdf` (dış açılım), `kapak-ic.pdf` (iç açılım).
- **iPhone uygulaması** (17 Ekim 2026, sahibinin isteği; önce Apple, sonra Google Play): Capacitor 8, sitenin
  derlenmiş hâli uygulamanın içinde (çevrimdışı). Paket kimliği `tr.bumba.duygularinpesinde`, yalnız iPhone,
  dikey. `npm run uygulama` (PUBLIC_UYGULAMA=1 → `dist-uygulama/` → `cap sync ios`); iOS projesi `uygulama/ios/`.
  Uygulamada: sayaç ve çerez bandı yok (veri toplanmaz), e-posta listesi siteyi Safari'de açar, paylaşım iOS'un kendi paylaşım
  ekranıyla (sitedeki kanal menüsü kuralının uygulamadaki istisnası), menüde "Günün şiiri" yerel bildirimi
  (09.00, telefonda zamanlanır, sunucu yok). Yeni şiir ya da düzeltme uygulamaya ancak yeni sürümle gelir.
  Denetim: `.github/workflows/ios.yml` (simülatör derlemesi, her PR). Yayın: `ios-yayin.yml` elle tetiklenir;
  Saat Tarih'teki gibi bulut imzalama (sertifika ya da .p12 yok; imzasız arşiv, `-exportArchive
  -allowProvisioningUpdates`, `uygulama/ios/ExportOptions.plist`). Sırlar `ASC_KEY_ID`, `ASC_ISSUER_ID`,
  `ASC_KEY_P8` GitHub'da (değerleri hiçbir yere yazılmaz).
  Kurulum, mağaza metinleri, ekran görüntüleri: `uygulama/README.md`, `uygulama/magaza/`.
  Uygulama açıkken ekran kararmaz (`isIdleTimerDisabled`, `SceneDelegate.swift`; 18 Ekim 2026).
  App Store kimliği (Apple ID) **6824072247**; mağaza durumu `ios-durum.yml` ile okunur, inceleme gönderimi
  `ios-inceleme.yml` ile okunur ve bilgi isteğine cevaptan sonra yeniden yollanır, mağaza bilgileri
  `ios-magaza.yml` ile yazılır (`scripts/uygulama/magaza.py`, metinler `uygulama/magaza/metinler.json`). Sitede alt bilginin sağında,
  Bumba rozetinin yanında "App Store'dan indir" bağlantısı ve iPhone Safari'de uygulama şeridi (`apple-itunes-app`)
  var; uygulama App Store'da yayına girince `src/data/uygulama.ts` → `APP_STORE.yayinda: true` ile açılır
  (yayında olmayan uygulamanın sayfası açılmadığı için o zamana dek kapalı). Uygulamanın içinde gösterilmez.
- **Android uygulaması** (18 Ekim 2026, sahibinin isteği): iOS'la aynı site ve aynı uygulama kipi, `uygulama/android/`
  (Capacitor 8, paket `tr.bumba.duygularinpesinde`, yalnız dikey). `/siir/x/` → `siir/x/index.html` eşlemesi
  `MainActivity.java` → `DizinYonlendirici` (istek Capacitor'a gitmeden adres dosya adına çevrilir). Ekran açık kalır
  (`FLAG_KEEP_SCREEN_ON`). Tam saatli alarm izni kaldırıldı (Play politikası; Günün şiiri yaklaşık 09.00).
  `npm run uygulama:android`; denetim `.github/workflows/android.yml` (APK + emülatörde deneme, her PR). Google Play
  yayını için Play Console hesabı ve imza anahtarı gerekiyor (`uygulama/README.md`).

## Sunucu ve yayın

- Netverim VPS (İstanbul), Coolify 4: https://panel.bumba.tr. SSH yok; sunucuda dizin aranmaz.
  Vercel/Netlify/Supabase'de yayın yok.
- Coolify uygulaması: ad `duygularinpesinde`, **uuid `x4s4woc3tff78dkjnegnoffy`**, derleme `dockerfile`,
  izlenen dal `main`, port 80, adres https://duygularinpesinde.bumba.tr.
- main'e her push kendiliğinden yayına girer; bu yüzden birleştirme, push ve yeniden yayın zamanı her seferinde
  sahibine sorulur (Standartlar "Yayın zamanı onayı"). Sunucu aynı anda tek derleme yapar; sırada beklemek normal
  (sıra: https://durum.bumba.tr "Canlı" kartı). Yeniden yayından önce sıraya bak, aynı commit'i iki kez sokma.
- `COOLIFY_URL` ve `COOLIFY_API_TOKEN` ortamda; yalnız okuma ve yeniden yayın için. Anahtarı ve `/envs`
  değerlerini asla yazdırma.
  - Son yayınlar: `curl -s -H "Authorization: Bearer $COOLIFY_API_TOKEN" "$COOLIFY_URL/api/v1/deployments/applications/x4s4woc3tff78dkjnegnoffy?take=3" | jq '.deployments[] | {status, commit, created_at, finished_at}'`
  - Hata günlüğü: aynı adres `?take=1` ve `jq -r '.deployments[0].logs | fromjson | .[] | select(.hidden | not) | .output' | tail -40`
  - Yeniden yayın: `curl -s -X POST -H "Authorization: Bearer $COOLIFY_API_TOKEN" -H "Content-Type: application/json" -d '{"uuid":"x4s4woc3tff78dkjnegnoffy"}' "$COOLIFY_URL/api/v1/deploy"`
- HTTPS ve http→https yönlendirmesi sunucunun ortak ayarı (Traefik): GET'te 301 (`curl -I` HEAD'de 308 gösterir,
  o da kalıcı). Ölçüm: `curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://duygularinpesinde.bumba.tr/`.
  bumba.tr altındaki adreslerde www kullanılmaz; www.duygularinpesinde.bumba.tr'nin açılmaması beklenen durum.
- Güvenlik başlıkları bu repoda, `nginx.conf` (yalnız server düzeyinde `add_header`).
  **HSTS `max-age=31536000` (1 yıl):** 8 Ekim 2026'da 1 günle başladı, sorunsuz geçen bir haftadan sonra 17 Ekim 2026'da 1 yıla çıktı.
  includeSubDomains ve preload kullanılmaz.
- Umami: site kimliği `3cc5cb50-4663-4436-b371-92cc3feb723b`, `data-domains="duygularinpesinde.bumba.tr"`;
  betik yalnız çerez bandında istatistiğe izin verilince yüklenir (`window.bumbaIstatistik`, `Temel.astro`).
  Olaylar: `tema-degistir`, `dil-degistir`, `arama`, `liste-katil`, `duygu-sec`, `paylas`, `ortam-sesi`,
  `fon-muzigi`, `siir-cek` (`rozet-kazanildi` tanımlı ama rozetler yalnız sayaçsız uygulamada).
- Node: `.nvmrc` ve `Dockerfile` 22.23.4 (22 hattının son güvenlik sürümü, 20 Ekim 2026). Coolify bu uygulamada
  Dockerfile ile derlediği için Node sürümünü `Dockerfile` belirler; derleme değişkeni gerekmez.
- Ortak e-posta listesi anahtarı: `duygularin-pesinde` (`src/data/site.ts`).

## SEO / GEO kaydı

**Hedef sorgular:** "Duyguların Peşinde", "Eylül Bitse şiirleri", "İstanbul şiirleri", "Moda şiiri", "Kadıköy
şiiri", "vapur şiiri", "aşk şiiri", "özlem şiiri", "hüzünlü şiirler", "ayrılık şiiri", "Burgazada şiiri",
"Turkish poems Istanbul".

**Sayfa başlıkları ve açıklamaları** (kaynak: `src/i18n/*.ts`; İngilizce başlıklarda "(In Pursuit of Emotions)"
eki, şiirlerde "· poem by Eylül Bitse"):

| Sayfa | TR başlık / açıklama | EN başlık / açıklama |
|---|---|---|
| Ana sayfa | Duyguların Peşinde / `site.aciklama` | Duyguların Peşinde — In Pursuit of Emotions / `site.aciklama` |
| Bütün şiirler | Bütün şiirler / "30 şiir, yazıldıkları sırayla." | All poems / "30 poems in the order they were written. The poems are in Turkish." |
| Şiir | ad ya da ilk mısra… / "ilk mısra — tarih – yer" | … · poem by Eylül Bitse / "A poem in Turkish by Eylül Bitse: “…” (tarih – yer)." |
| Duygu | Aşk… / "Aşk üzerine N şiir. Rengi pembe; …" | Love… / "N poems of love. Its colour is pink, …" |
| Yer | Moda… / "Moda'da yazılmış N şiir." | Moda… / "N poems written in Moda." |
| Harita | Harita / "Şiirlerin yazıldığı yerler: …" | Map / "Where the poems were written: …" |
| Zaman | Zaman / "2008–2021 arasında yazılmış N tarihli şiir." | Time / "N dated poems written between 2008 and 2021." |
| Fal | Şiir falı / "Bir niyet tut: …" | Poem fortune / "Make a wish: …" |
| Hakkında | Hakkında / "Eylül Bitse imzalı, basılamamış …" | About / "The home of an unpublished book of poems …" |
| Arama | Arama / "Şiirlerde, duygularda ve yerlerde ara." | Search / "Search the poems, emotions and places." |
| Gizlilik | Gizlilik ve çerezler / KVKK özeti | Privacy and cookies / KVKK özeti |

**Şemalar (JSON-LD, `src/lib/sema.ts`):** her sayfada Organization (parentOrganization: Bumba Group),
WebSite (SearchAction → arama sayfası), Person (Eylül Bitse); alt sayfalarda BreadcrumbList; şiirde
CreativeWork (genre Şiir/Poetry, author, dateCreated, locationCreated, copyrightNotice); duygu, yer ve bütün
şiirler sayfalarında CollectionPage; Hakkında'da FAQPage ("Sık sorulanlar" penceresindekiyle aynı); ana
sayfada WebPage. Sosyal hesap yok, `sameAs` yok.

**Kararlar:**
- `sitemap-index.xml` (@astrojs/sitemap): iki dil, her adreste `hreflang` tr/en/x-default; 404, 500 ve
  `/admin` haritada yok. robots.txt'de `Sitemap:` satırı var.
- robots.txt: herkes açık (`/admin/` hariç). Yapay zekâ arama ve kullanıcı adına getiren botlar açık
  (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User). Şiirlerin
  hakları saklı olduğu için yalnız model eğitimi botları kapalı (GPTBot, ClaudeBot, Google-Extended,
  Applebot-Extended, CCBot, Meta-ExternalAgent); bu, yapay zekâ aramalarında görünürlüğü etkilemez.
- `/llms.txt` derlemede üretilir (`src/pages/llms.txt.ts`): iki dilde özet, sayfalar, duygular, yerler, şiirler.
- Ana sayfanın başında sitenin kısa özeti (`site.ozet`), Hakkında'da soru-cevap blokları (Sık sorulanlar
  penceresi). Son güncelleme tarihi (derleme günü) WebSite şemasında `dateModified`, llms.txt'de ve Hakkında'nın
  sonunda görünür; alt bilgide yok (12 Ekim 2026).
- Paylaşım görselleri derlemede üretilir: `/og/<id>.jpg`, `/og/en/<id>.jpg`, `/og/site.jpg`, `/og/en/site.jpg`.
