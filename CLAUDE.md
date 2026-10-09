# Duyguların Peşinde — master dosya

Antigoni imzalı, basılamamış bir şiir kitabının sitesi: 30 şiir; duygu, yer ve zaman üzerinden okunuyor.
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

## Sahibin kalıcı kararları

- Şiirlerin tüm hakları saklıdır; lisans yok. Şiirler çevrilmez: İngilizce sayfalarda Türkçe kalır, `lang="tr"`.
- "sevgimiz percinlensin-aşkmetni.txt" şiir değildir, sitede yayımlanmaz.
- Yapay sesle okuma yok (kaldırıldı).
- **Varsayılan tema koyu (gece).** Açık tema (gündüz) yalnız düğmeyle seçilir ve hatırlanır. Standartlar §3
  "ilk açılışta sistem tercihi" der; sahibi 8 Ekim 2026'da açıkça koyu varsayılan istedi, bu karar geçerli.
  Seçim `localStorage` `tema-secimi` anahtarında; eski `tema` anahtarı (sistem tercihini yazmış olabilir) okunmaz.
  Sayfalar `Cache-Control: no-cache` ile gider ki eski HTML tarayıcıda takılı kalmasın.
- Şiir sayfasında şiir **harf harf yazılarak** açılır (satır satır değil); hız duyguya göre.
- Ana sayfada "Yazıldıkları yerler" ve "ya da niyet tut" satırı yok; duygu şeritleri dar (72rem) kalır.
- Alt bilgi tek satır, üç sütun: solda telif, fotoğraf notu ve güncelleme tarihi; ortada e-posta listesi; sağda
  Bumba rozeti. Gizlilik ve "Haklar" bağlantısı alt bilgide yok.
- Hakkında'da "Fotoğraflar" ve "Gizlilik ve çerezler" düğmeyle açılan pencerelerde (`#fotograflar`,
  `#gizlilik`); "Haklar" ve "Sık sorulanlar" aşağı açılır (`#haklar`, `#sorular`). `/gizlilik/` sayfası da
  durur (KVKK bağlantıları için), metin tek yerden: `GizlilikMetni.astro`.
- Şiir paylaşımı kendi menüsüyle: bağlantıyı kopyala, Facebook, Instagram (altında küçük not: bağlantı
  kopyalanır), WhatsApp, SMS, LinkedIn. Başka kanal eklenmez. Telefonda paylaş ve ortam sesi menüleri ekranın
  altından açılır (sayfa yana taşmaz).
- Ortam sesi **varsayılan açık, %10 düzeyde** (9 Ekim 2026): her şiirin kendi sesi var (şiir dosyasında
  `ortam:`; yoksa ana duygunun sesi, `DUYGU_ORTAMI`), duygu sayfasında duygunun sesi. Tarayıcı kuralı gereği ilk
  dokunuşta başlar. Menüde kapalı, "şiirin sesi" ve genel sesler (deniz, yağmur, vapur, gece, kafe, şehir,
  kuşlar, ev) var; seçim ve düzey hatırlanır. Sesler gerçek saha kayıtları (sentez sesler kalitesiz bulundu):
  Beeld en Geluid, Commons, CC BY-SA 3.0. Dosyalar `public/ortam/`, üretimi `scripts/ortam.py` (Wikimedia bu
  sunucunun IP'sine sınır koyduğu için GitHub Actions'ta: `.github/workflows/ortam-sesleri.yml`), künyeler
  `src/data/ortam-sesleri.ts` ve Hakkında → Haklar.
- Telefonda arama, dil (TR/EN) ve tema düğmeleri üst şeritte değil, menünün en altında. Masaüstünde üst şeritte.
- **Fon müziği varsayılan kapalı** (ortam sesi menüsünde "fon müziği · makam"): her duygunun makamında taksim
  gibi bir ezgi (hüzün Hicaz, özlem Uşşak, aşk Hüzzam, özgürlük Rast, karanlık Saba, ayrılık Kürdi, yalnızlık
  Segah). `public/muzik/<duygu>.mp3`, üretimi `scripts/muzik.py` (fluidsynth + FluidR3_GM, MIT; koma aralıkları
  perde bükmeyle). Açılınca hatırlanır, ortam sesi biraz kısılır.
- **Mum ışığı varsayılan kapalı:** şiir sayfasında "Mum ışığı" düğmesi; ekran kararır, şiir imleci/parmağı
  izleyen titrek bir ışıkta okunur. Ziyaret boyunca açık kalır (sessionStorage), "Mumu söndür" ya da Esc kapatır.
- **Standart işleri için birleştirme yetkisi:** Bumba Genel Standartlar işlerinde PR açılır, kontroller
  geçince sormadan main'e birleştirilir ve yayın izlenir. Diğer işlerde de sahibi "herşeye yetkin var" dedi.

## Sunucu ve yayın

- Netverim VPS (İstanbul), Coolify 4: https://panel.bumba.tr. SSH yok; sunucuda dizin aranmaz.
  Vercel/Netlify/Supabase'de yayın yok.
- Coolify uygulaması: ad `duygularinpesinde`, **uuid `x4s4woc3tff78dkjnegnoffy`**, derleme `dockerfile`,
  izlenen dal `main`, port 80, adres https://duygularinpesinde.bumba.tr.
- main'e her push kendiliğinden yayına girer. Sunucu aynı anda tek derleme yapar; sırada beklemek normal
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
  **HSTS 8 Ekim 2026'da `max-age=86400` ile başladı; 15 Ekim 2026'dan sonra sorun yoksa `31536000` yapılacak.**
  includeSubDomains ve preload kullanılmaz.
- Umami: site kimliği `3cc5cb50-4663-4436-b371-92cc3feb723b`, `data-domains="duygularinpesinde.bumba.tr"`.
  Olaylar: `tema-degistir`, `dil-degistir`, `arama`, `liste-katil`, `duygu-sec`, `paylas`, `ortam-sesi`,
  `fon-muzigi`, `mum-isigi`.
- Ortak e-posta listesi anahtarı: `duygularin-pesinde` (`src/data/site.ts`).

## SEO / GEO kaydı

**Hedef sorgular:** "Duyguların Peşinde", "Antigoni şiirleri", "İstanbul şiirleri", "Moda şiiri", "Kadıköy
şiiri", "vapur şiiri", "aşk şiiri", "özlem şiiri", "hüzünlü şiirler", "ayrılık şiiri", "Burgazada Antigoni",
"Turkish poems Istanbul".

**Sayfa başlıkları ve açıklamaları** (kaynak: `src/i18n/*.ts`; İngilizce başlıklarda "(In Pursuit of Emotions)"
eki, şiirlerde "· poem by Antigoni"):

| Sayfa | TR başlık / açıklama | EN başlık / açıklama |
|---|---|---|
| Ana sayfa | Duyguların Peşinde / `site.aciklama` | Duyguların Peşinde — In Pursuit of Emotions / `site.aciklama` |
| Bütün şiirler | Bütün şiirler / "30 şiir, yazıldıkları sırayla." | All poems / "30 poems in the order they were written. The poems are in Turkish." |
| Şiir | ad ya da ilk mısra… / "ilk mısra — tarih – yer" | … · poem by Antigoni / "A poem in Turkish by Antigoni: “…” (tarih – yer)." |
| Duygu | Aşk… / "Aşk üzerine N şiir. Rengi pembe; …" | Love… / "N poems of love. Its colour is pink, …" |
| Yer | Moda… / "Moda'da yazılmış N şiir." | Moda… / "N poems written in Moda." |
| Harita | Harita / "Şiirlerin yazıldığı yerler: …" | Map / "Where the poems were written: …" |
| Zaman | Zaman / "2008–2021 arasında yazılmış N tarihli şiir." | Time / "N dated poems written between 2008 and 2021." |
| Fal | Şiir falı / "Bir niyet tut: …" | Poem fortune / "Make a wish: …" |
| Hakkında | Hakkında / "Antigoni imzalı, basılamamış …" | About / "The home of an unpublished book of poems …" |
| Arama | Arama / "Şiirlerde, duygularda ve yerlerde ara." | Search / "Search the poems, emotions and places." |
| Gizlilik | Gizlilik ve çerezler / KVKK özeti | Privacy and cookies / KVKK özeti |

**Şemalar (JSON-LD, `src/lib/sema.ts`):** her sayfada Organization (parentOrganization: Bumba Group),
WebSite (SearchAction → arama sayfası), Person (Antigoni); alt sayfalarda BreadcrumbList; şiirde
CreativeWork (genre Şiir/Poetry, author, dateCreated, locationCreated, copyrightNotice); duygu, yer ve bütün
şiirler sayfalarında CollectionPage; Hakkında'da FAQPage (sayfada görünen "Sık sorulanlar" ile aynı); ana
sayfada WebPage. Sosyal hesap yok, `sameAs` yok.

**Kararlar:**
- `sitemap-index.xml` (@astrojs/sitemap): iki dil, her adreste `hreflang` tr/en/x-default; 404, 500 ve
  `/admin` haritada yok. robots.txt'de `Sitemap:` satırı var.
- robots.txt: herkes açık (`/admin/` hariç). Yapay zekâ arama ve kullanıcı adına getiren botlar açık
  (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User). Şiirlerin
  hakları saklı olduğu için yalnız model eğitimi botları kapalı (GPTBot, ClaudeBot, Google-Extended,
  Applebot-Extended, CCBot, Meta-ExternalAgent); bu, yapay zekâ aramalarında görünürlüğü etkilemez.
- `/llms.txt` derlemede üretilir (`src/pages/llms.txt.ts`): iki dilde özet, sayfalar, duygular, yerler, şiirler.
- Ana sayfanın başında sitenin kısa özeti (`site.ozet`), Hakkında'da soru-cevap blokları, alt bilgide son
  güncelleme tarihi (derleme günü).
- Paylaşım görselleri derlemede üretilir: `/og/<id>.jpg`, `/og/en/<id>.jpg`, `/og/site.jpg`, `/og/en/site.jpg`.

## Genel Standartlar

Bumba Genel Standartlar · Sürüm 3.2 · 8 Ekim 2026

Yeni sürüm gelirse bu bölüm bütünüyle onunla değiştirilir; sürüm satırı korunur. Maddeler zorunludur; varsa
korunur, eksikse tamamlanır, yoksa oluşturulur. Tasarım ya da eski bir karar engel olursa karar değişir
(gizlilik kararları hariç). Bumba Group bilgilerinde tek kaynak https://bumbagroup.com.

Sabit bilgiler: veri sorumlusu Bumba Teknoloji Limited Şirketi (Ataşehir / İstanbul); iletişim, KVKK ve
yönetici e-postası bilgi@bumbagroup.com; Umami https://istatistik.bumba.tr; ortak liste
https://bumbagroup.com/api/liste/katil; marka kiti https://bumbagroup.com/marka.

1. **Bumba imzası:** her sayfanın alt bilgisinde Bumba Life rozeti (açık + koyu, temaya göre biri görünür).
   Birleştirmelerde kaybolmasın.
2. **SEO/GEO:** benzersiz title/description (iki dil), tek H1, canonical, hreflang, OG/Twitter, ikonlar,
   sitemap + robots (Sitemap satırı), JSON-LD (Organization + parentOrganization Bumba Group, WebSite,
   BreadcrumbList, içeriğe göre diğerleri), alt metin, gerçek 404. GEO: içerik JS'siz okunur, AI arama botları
   açık, /llms.txt, sayfa başında özet, soru-cevap, güncelleme tarihi. Kayıt bu dosyada.
3. **Tema:** açık ve koyu, görünür düğme, seçim hatırlanır, flash yok, renkler tek merkezden (CSS
   değişkenleri), iki temada WCAG AA. (Varsayılan koyu: sahibin kararı, yukarıda.)
4. **Arama:** bütün içerik, Türkçe harf ve büyük/küçük harf duyarsız, klavyeyle kullanılır, anlamlı boş
   durum. Statik sitede derleme dizini + istemci araması.
5. **TR/EN:** bütün metinler çeviri dosyalarından, her sayfada dil değiştirici (karşılığa gider, hatırlar),
   dile özgü adres, doğru `<html lang>`, dile göre tarih/sayı, doğal İngilizce.
6. **E-posta listesi:** ortak servis formu (JS'siz çalışır), önceden işaretsiz rıza kutusu, bot tuzağı,
   iki dilde mesajlar, Umami `liste-katil`. Siteler kendi başına duyuru e-postası göndermez.
7. Üyelik ve 10. Panel: statik site, uygulanmaz.
8. **HTTPS:** http→https 301 ve www→kök 301 sunucuda (ana oturum); HSTS (1 gün → bir hafta sonra 1 yıl),
   nosniff, Referrer-Policy, CSP (istatistik.bumba.tr script/connect; bumbagroup.com img/connect/form-action).
9. **Umami:** her herkese açık sayfada, `data-domains` asıl adres; olaylar: arama, dil, tema, liste-katil.
   Kişisel bilgi gönderilmez. Çerez yok, çerez bandı yok; gizlilik metninde anlatılır.
11. **Taban kalite:** mobil uyum, erişilebilirlik, 404/500 iki dilde ve iki temada, anahtarlar repoda yok,
   KVKK aydınlatma/gizlilik/çerez metni.
12. **Kalıcılık:** bu dosya master; çelişen eski kararlar güncellenir.

Ana altyapı oturumunun işleri (kendin yapma): yeni uygulama, alan adı/DNS, www yönlendirmesi, ortam değişkeni,
veritabanı, kalıcı disk, zamanlanmış görev, Umami kaydı, ortak liste, e-posta anahtarı, duyuru e-postası, İYS.

### Her geliştirmede kontrol listesi

- TR ve EN metin (bütün ekranlar)
- Açık ve koyu tema
- SEO/GEO: meta, şema, sitemap, hreflang, llms.txt ve bu dosyadaki kayıt
- Erişim: herkese açık mı, yöneticiye özel mi; buna göre index ya da noindex
- Arama dizini (`src/pages/arama.json.ts`)
- Umami: sayfa sayılıyor mu, yeni önemli eylem için olay tanımlı mı
- E-posta listesi formu
- Mobil uyum ve erişilebilirlik
- Alt bilgide Bumba rozeti (birleştirmelerde kaybolmadı mı)
- Push'lar toplu mu, derleme yalnız repodakiyle mi çalışıyor
