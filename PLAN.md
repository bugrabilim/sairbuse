# Duyguların Peşinde — Web Sitesi Planı

> *"Şiir kitabım ağlıyor! / Gözyaşlarını tutamamış öyle söyledi. / … / Yaşayamazmış"*
> — 18.07.2011, Moda

Basılamayan kitap, kendi ilk şiirinde zaten ağlıyor. Bu site o kitabı yaşatmanın yolu. Amaç kitabı ekrana taşımak değil. Okurun bir duygunun peşine düştüğü, sessiz ve yoğun bir yer kurmak istiyoruz.

---

## 0. Kısaca

| | |
|---|---|
| **Malzeme** | 26 tarihli şiir (2008–2021) ve 4 kısa metin. Her şiirin altında **tarih ve yer** imzası var. |
| **Konsept** | Her ekranda tek şiir. Okur şiirlere üç yoldan ulaşır: **Duygu** (ne), **Yer** (nerede), **Zaman** (ne zaman). |
| **Giriş** | "Bugün neyin peşindesin?" sorusunun altında 7 duygu var ve her duygunun rengi şiirlerin içinden geliyor. |
| **Teknik** | Astro (statik site), GitHub ve Cloudflare Pages. Adres: `duygularinpesinde.bumba.tr` |
| **Maliyet** | Neredeyse sıfır: alan adı, barındırma ve analitik ücretsiz. |
| **Yasal yük** | Yayınevi, ISBN, bandrol ve matbaa gerekmiyor. Kişisel ve ticari olmayan bir sitenin yükü çok düşük (bkz. §6). |
| **Durum** | Faz 1 ve Faz 2 tamam. Yayına alma (Coolify ya da Cloudflare Pages) ve Faz 3 kaldı. Adımlar `README.md`'de. |

---

## 1. Drive'daki malzeme — envanter

Kaynak: `drive.google.com/drive/folders/1J3rA5YSF-pquwNZE3n_5n14shxXrv144` (8 dosya)

| Dosya | İçerik | Durum / karar |
|---|---|---|
| `şiirler.docx` | 26 tarihli şiir, sonunda "26şiir" notu | **Ana kaynak** |
| `şiirlerim.docx` | `şiirler.docx` ile kelimesi kelimesine aynı, sadece "Aralık Yok" biçimi uygulanmış | Yinelenen kopya, kullanılmayacak |
| `sarı.txt` | "Sarı" şiirinin küçük harfli, eski bir hâli (docx'te 19.04.2020 Feneryolu) | Farklar var ("öznelebilir/özlenebilir", "uyurmuş/uyumuş"). **Son hâl hangisi?** |
| `aklımda.txt` | "Aklımda" — Cerrahpaşa, Çamlıca, boza. Tarihsiz | Yeni şiir. Tarih ve yer eklenebilir mi? |
| `buz.txt` | "sana bakarken" — tarihsiz aşk şiiri | Yeni şiir. Tarih ve yer? |
| `karantina.txt` | "karantina günleri 1", 29.03.20, bitişik yazımla | Bitişik yazım bilinçli mi? Dosyada "karantinagünleri2" başlığı var ama metni yok. **2. bölüm nerede?** |
| `bus.txt` | "ben bir evim / içim karanlık / bilincim yalnız bir ışık…" | **Yayında.** Bütün metinler size ait (karar: Ekim 2026). |
| `sevgimiz percinlensin-aşkmetni.txt` | Kişisel bir mesajlaşma | **Yayına alınmadı, repoya da eklenmedi** (karar: şiir değil). |

> Not: Drive klasörü "bağlantıya sahip herkes" ayarında, özel yazışma da içinde. Siteye taşıdıktan sonra klasörü kısıtlamak iyi olur.

### 1.1 Şiir listesi (kronolojik)

Başlığı olmayan şiirlerde ilk mısrayı **geçici başlık** olarak kullandım. Duygular sadece öneri, son sözü şair söyler.

| # | Tarih | Yer | Geçici başlık (ilk mısra) | Önerilen duygu |
|---|---|---|---|---|
| 1 | 21.05.2008 | — | Aktım | Özgürlük |
| 2 | 05.04.2009 | evde | Baba! *("Bu sana yazdığım ilk şiirim")* | Özlem |
| 3 | 23.06.2009 | Cihangir | Sırtım kan içinde | Karanlık ⚠︎ |
| 4 | 18.07.2011 | Moda | Şiir kitabım ağlıyor! | Hüzün — **açılış şiiri** |
| 5 | 24.10.2011 | Antigoni (Burgazada) | İçimdeki savaş | Ayrılık |
| 6 | 21.01.2012 | Kalkedon | Kalemle sevişircesine yaz | Özgürlük |
| 7 | 22.01.2012 | Kalkedon | Ne kadar zaman olmuş? | Özlem |
| 8 | 21.05.2012 | İzmir | Aman "gece" | Aşk |
| 9 | 03.06.2012 | Eyfel Kulesi'nin altı | Günümü kara eden sensizlik | Ayrılık |
| 10 | 21.12.2012 | Eminönü vapuru | Kar soğuğu | Özgürlük |
| 11 | 28.05.2014 | Moda | Her bir yüz bir hikâye | Aşk |
| 12 | 08.10.2015 | — | Eğer ellerim | Karanlık |
| 13 | 19.06.2016 | "yer yok" | Kasım ayında ölmek | Karanlık ⚠︎ |
| 14 | 24.02.2017 | Sirkeci | Ben aralarında olamam | Yalnızlık |
| 15 | 24.05.2017 | Altunizade | Erik ağacının | Yalnızlık, Hüzün |
| 16 | 07.10.2017 | karga | Saat on olur | Hüzün |
| 17 | 24.11.2017 | Walter's Cafe, Kadıköy | Çok kalabalık | Yalnızlık |
| 18 | 04.02.2018 | Burgazada | Senin sayende | Ayrılık ⚠︎ |
| 19 | 25.06.2018 | Cihangir | Yağmur damlaları düşüyor şimdi | Hüzün |
| 20 | 18.08.2018 | Büyükada | Arkadaşsız kalmış gibi | Özlem |
| 21 | 21.12.2019 | Feneryolu, ev | Sevgimi başka bir sevgiyle sevdim | Ayrılık |
| 22 | 19.04.2020 | Feneryolu | **Sarı** | Hüzün |
| 23 | 18.07.2020 | Moda | Şimdi daha benim değilsin ya hani | Aşk |
| 24 | 04.12.2020 | — | Hani sen değil miydin | Ayrılık |
| 25 | 23.06.2021 | Söğüt | Sen duyduğum en güzel melodi | Aşk |
| 26 | 24.06.2021 | Söğüt | Uçmak isteyen bir kuştum | Özgürlük |
| + | 29.03.2020 | — | **Karantina Günleri 1** | Yalnızlık |
| + | tarihsiz | — | **Aklımda** | Özlem |
| + | tarihsiz | — | Sana bakarken | Aşk |

⚠︎ = kendine zarar ya da ölüm imgesi içeriyor (bkz. §4.5).

### 1.2 Şiirlerde gördüğüm ve siteye taşınabilecek şeyler

- **13 yıllık bir yolculuk:** İlk şiir "Aktım" 2008 tarihli. "Baba!" 2009'da "ilk şiirim" diye başlıyor. 2020'nin son şiiri "Zaten senden sonra şiir yazmamışım" diye bitiyor, ama 2021'de Söğüt'te "Bitmeyecek bu sevda, gökyüzü hep benim" diye yeniden açılıyor. Bu, bir zaman çizgisi için hazır bir hikâye.
- **Bir İstanbul haritası:** Moda, Kalkedon, Kadıköy, Feneryolu, Altunizade, Cihangir, Sirkeci, Eminönü vapuru, Büyükada, Burgazada/Antigoni, Kalamış. Şiirlerin çoğu Anadolu yakasında, Adalar'da ve vapurda yazılmış. Dışarıda Söğüt, İzmir ve Paris var.
- **Tekrar eden imgeler:** deniz, vapur, martı, kedi, kahve, rakı, eller, bulut, yağmur.
- **Takvimde kesişmeler:**
  - **18 Temmuz'da, Moda'da, dokuz yıl arayla iki şiir var** (2011 ve 2020).
  - **21 Aralık'ta, yılın en uzun gecesinde, iki şiir var** (2012 ve 2019).
  - 21 Mayıs ve 23 Haziran'da da ikişer şiir var. Bu da "Bugün yazılmış şiir" özelliğine kapı açıyor (§4.3).
- **Renkler şiirlerin içinde:** sarı, siyah, turuncu, mor, gri, pembe, kayısı. Duygu paletini şiirlerin kendisinden çıkarabiliriz (§4.2).

---

## 2. Benzer siteler — ne yapıyorlar, biz nasıl uyarlarız

| Örnek | Ne yapıyor | Bize uyarlaması |
|---|---|---|
| **POETRY** uygulaması (Poetry Foundation) | "SPIN" düğmesi iki kelime çeviriyor: bir **duygu** (özlem, minnet…) ve bir **konu** (gençlik, doğa…). Eşleşen şiirleri listeliyor. | **Duygu × Yer çarkı:** "Özlem × Deniz", "Yalnızlık × Kadıköy" gibi. Malzeme küçük olduğu için çark her seferinde tek bir şiire iner. |
| **Poetry in Voice** — Poem Roulette | Çarkı çevir, rastgele şiir gelsin, beğendiğini kalple işaretle | Rastgele şiir, Türk kültüründeki karşılığıyla birlikte (aşağıda Hafız falı) |
| **Hafız falı** (*tefeül*) | Yüzyıllardır niyet tutulup Hafız Divanı rastgele açılır, çıkan gazel yorumlanır | **Şiir Falı:** "Niyet tut, fincanı çevir." Şiirlerde kahve sık geçiyor, kahve fincanı görseli doğal duruyor. Bizdeki en güçlü kültürel kanca bu. |
| **The Poetry Pharmacy** (Deborah Alma / William Sieghart'ın kitabı) | Duygusal "rahatsızlığa" şiir reçetesi yazıyor | **Şiir Eczanesi:** "Uyuyamıyorum", "Birini özlüyorum", "Kalabalıkta yalnızım" seçilince bir şiir reçete ediliyor. Duygu girişinin daha oyunbaz bir hâli. |
| **The Unsent Project** (Rora Blue, 2015) | Gönderilmemiş mesajlar, her biri gönderenin seçtiği bir **renkle**. Renge göre gezilebiliyor. | (1) Renk = duygu fikri. (2) İleride okur bir şiire **bir renk ya da bir kelime** bırakabilir (Faz 3). |
| **Atlas of Emotions** (Paul Ekman & Stamen) | Duyguların atlası. Her duygunun kendi görsel dili var: hüzün bulanık kenarlı, korku geri kaçan şekilli. | **Her duygunun kendi hareket dili:** Hüzün yavaşça bulanıklaşarak gelsin, Öfke/Ayrılık sert kesilerek, Özgürlük süzülerek. Animasyon az olsun ama anlamlı. |
| **Poetry Atlas**, Niagara Poetry Map, Toronto Halk Kütüphanesi şair haritası | Şiirler yazıldıkları ya da anlattıkları yerlere iğnelenmiş | **İstanbul haritası:** el çizimi tarzında, sade bir SVG harita. Moda'ya dokununca Moda'da yazılan 3 şiir açılır. Google Maps değil (ağır ve çerezli). |
| **David Whyte Experience** (Immersive Garden) | Suluboya görseller, ses manzaraları, WebGL. Gezinmenin kendisi şiirsel. | **Ses katmanı:** şairin kendi sesiyle okuma ve isteğe bağlı ortam sesi (vapur düdüğü, martı, yağmur). WebGL'in ağırlığını almadan atmosferini alalım. |
| **e-şiir örnekleri** (*Window*, *The Flat*) | Fotoğraf, ses ve minimal arayüzle atmosfer kuruyorlar | Bazı şiirlere yerin kendi fotoğrafı ve sesi (Eminönü vapuru, Cihangir'de yağmur) |
| **Türkçe şiir platformları** | Çoğunlukla binlerce şairin arşivi ya da topluluk sitesi: liste ağırlıklı, kalabalık arayüz | **Boşluk burada:** Türkçede tek bir şairin reklamsız, sessiz, duygu odaklı bir sitesi çok az. Bizim farkımız kalabalık değil, **yoğunluk**. |

---

## 3. Konsept: "Kitap değil, bir yolculuk"

**Duyguların Peşinde**'de okur bir duygunun peşine düşer. Sitenin üç ekseni var ve her şiir zaten üçünü de taşıyor:

```
          DUYGU (ne?)            YER (nerede?)             ZAMAN (ne zaman?)
   Aşk · Özlem · Hüzün ·     Moda · Kalkedon · Adalar ·     2008 ──────────── 2021
   Yalnızlık · Ayrılık ·     Cihangir · vapur · Söğüt …     "ilk şiirim"    "gökyüzü hep benim"
   Karanlık · Özgürlük
```

Her şiir sayfasının altında üç kapı olur: **"aynı duygudan bir şiir"**, **"aynı yerden bir şiir"**, **"aynı yıldan bir şiir"**. Okur sayfa çevirmez, bir iz sürer.

### İlkeler

1. **Sessizlik:** Reklam, açılır pencere, bildirim izni ve otomatik çalan ses yok.
2. **Bir ekran, bir şiir:** Bol boşluk, büyük ve okunaklı yazı, mısra kırılımları aynen korunur.
3. **Yavaşlık isteğe bağlı:** "Yavaş oku" modunda mısralar tek tek gelir. Varsayılanda şiirin tamamı görünür (erişilebilirlik), cihazında "hareketi azalt" ayarı açık olana animasyon yok.
4. **Önce telefon:** Okurların çoğu Instagram ve WhatsApp'tan telefonla gelecek.
5. **Gece gibi:** Site koyu (gece) temayla açılıyor; okur isterse düğmeyle açık (gündüz) temaya geçebilir (8 Ekim 2026, Bumba Standartları §3). Her şiir yazıldığı yerin fotoğrafıyla açılıyor (§11).

---

## 4. Site haritası ve özellikler

### 4.1 Sayfalar

| Adres | Ne var |
|---|---|
| `/` **Giriş** | Koyu ekranda tek mısra belirir: *"Şiir kitabım ağlıyor!"*. Ardından **"Bugün neyin peşindesin?"** sorusu ve 7 duygu kelimesi gelir. Altta küçük harflerle: "ya da rastgele bir şiir çek". |
| `/duygu/[duygu]` | Zemin o duygunun rengine döner, o duygunun şiirleri kaydırdıkça tek tek gelir |
| `/siir/[ad]` | Tek şiir. İmza ("19.04.2020 — Feneryolu"), "Sesli dinle", "Mısra paylaş" ve 3 kapı (duygu / yer / zaman) |
| `/harita` | İstanbul (ve dışarısı) haritası, yer yer şiirler |
| `/zaman` | 2008→2021 şeridi. Her yıl, o yılın şiirlerinin duygu renkleriyle boyanır. Bir hayatın duygu tayfı. |
| `/fal` | **Şiir Falı:** niyet tut, fincanı çevir, bir şiir çıksın |
| `/siirler` | Sade, tam liste (erişilebilirlik ve arama motorları için) |
| `/hakkinda` | Şairin kısa notu, basılamayan kitabın hikâyesi, iletişim |

### 4.2 Duygu paleti — renkler şiirlerin içinden

| Duygu | Renk | Kaynak mısra |
|---|---|---|
| **Aşk** | pembe | *"Koklamaya kıyamadığım pembe küpe çiçeğim"* (23.06.2021) |
| **Özlem** | kayısı | *"Kayısılarım / Çocukluğum kayıp"* (18.08.2018) |
| **Hüzün** | sarı | *"Üstünde kaldı sarı kediler"* (19.04.2020) |
| **Yalnızlık** | gri | *"Gri bir kahve içerim"* (24.11.2017) |
| **Ayrılık** | siyah | *"Sensizliğin rengi 'siyah'"* (03.06.2012) |
| **Karanlık** | mor | *"parmaklarım var, mor mosmor"* (24.10.2011) |
| **Özgürlük** | turuncu | *"Turuncu bir gemide olsam şimdi"* (21.12.2012) |
| *(zemin)* | deniz / gece laciverti | *"Kar soğuğu / Deniz rengi"* (21.12.2012) |

Duygu sayfasına girildiğinde zemin bu renge doğru yavaşça kayar. Paletin hikâyesi "Hakkında" sayfasında da anlatılabilir.

### 4.3 Öne çıkan özellikler

- **Bugün yazılmış şiir:** Bugünün gün ve ayı bir şiirin tarihiyle eşleşiyorsa girişte o şiir çıkar. Örnek: 18 Temmuz'da *"Bu iki şiir bugün, Moda'da, dokuz yıl arayla yazıldı."* 21 Aralık'ta *"Yılın en uzun gecesi."*
- **Şiir Falı:** Kahve fincanı ikonu, "niyet tut" ve kısa bir bekleme ardından rastgele şiir. Yorum yazmıyoruz, şiir kendi konuşur.
- **Duygu × Yer çarkı:** POETRY uygulamasındaki SPIN gibi. İki kelime döner ve bir şiirde durur.
- **Mısra paylaş:** Okur bir mısrayı seçer ve duygu rengiyle bir görsel kart oluşur (Instagram hikâyesi boyutunda). Sitenin kendiliğinden yayılma yolu bu.
- **Paylaşım önizlemesi:** Her şiirin bağlantısı WhatsApp'ta ya da Instagram'da ilk mısrası ve rengiyle görünür (görsel derleme sırasında otomatik üretilir).
- **Ses:**
  - *Şairin sesi:* Her şiir için isteğe bağlı kayıt. Sessiz bir odada telefonla çekilmesi yeterli.
  - *Ortam sesi:* vapur, martı, yağmur, deniz. Varsayılan kapalı, okur açar. Kaynak olarak telif serbest (CC0) kayıtlar kullanılır.

### 4.4 Okurla bağ (Faz 3, isteğe bağlı)

- ~~**"Bu şiir bana … hissettirdi":**~~ Okur tek bir kelime ya da renk bırakır fikri. **Karar (Ekim 2026): yapılmayacak**; site statik kalır, okur notu ve onay paneli yok.
- **E-posta listesi:** Bumba ortak liste servisiyle (alt bilgideki form, çift onay). Duyurular ortak servisten gider; site kendi başına e-posta göndermez. Aydınlatma metni ortak, sitenin gizlilik sayfası ona bağlanır.

### 4.5 Ağır şiirler için nazik bir not (şairin kararı)

Üç şiir (⚠︎) kendine zarar ya da ölüm imgesi içeriyor. Seçenekler:
- Hiçbir şey yapmamak: şiir olduğu gibi durur.
- Şiirin üstüne küçük, sade bir not: *"Bu şiir ağır duygular taşıyor."* Okur isterse devam eder.
- Sayfanın en altına tek satır: *"Zor bir dönemden geçiyorsan yalnız değilsin. Acil durumda: 112."*

Online edebiyat dergilerinde yaygın bir uygulama. Şiiri sansürlemez, okuru korur.

> **Karar (Ekim 2026):** Not yok. Şiirler olduğu gibi duruyor.

---

## 5. Teknik mimari

### 5.1 Yığın

| Katman | Seçim | Neden |
|---|---|---|
| Site üretici | **Astro** (statik) | Her şiir bir Markdown dosyası. Varsayılanda sıfır JavaScript olduğu için çok hızlı. Fal, harita ve çark gibi etkileşimler küçük "adacıklar" olarak eklenir. *Not: Bumba ekibi Next.js kullanıyor. Bakımı o ekip yapacaksa Next.js statik dışa aktarım (`output: 'export'`) da olur, ama bu tür bir içerik sitesi için Astro daha hafif.* |
| İçerik | `src/content/siirler/*.md` | Git'te sürüm geçmişiyle duran, sade metin dosyaları |
| İçerik paneli | **Sveltia CMS** (`/admin`) | Şair kod bilmeden telefondan bile şiir ekleyip düzeltebilir. Değişiklikler GitHub'a kaydedilir, site kendiliğinden güncellenir. |
| Barındırma | **Cloudflare Pages** | Ücretsiz, sınırsız trafik, otomatik HTTPS. Push edince otomatik yayın. |
| Alan adı | `duygularinpesinde.bumba.tr` | `bumba.tr` DNS'i zaten Cloudflare'de olduğu için özel alan adı eklemek tek adım |
| Analitik | **Umami** (`istatistik.bumba.tr`, zaten çalışıyor) | Çerezsiz, bu yüzden çerez bandı gerekmez. Hangi şiir ve hangi duygu ne kadar okunuyor görürüz. |
| Yazı tipi | Türkçe karakterleri (ş ğ ı İ) tam destekleyen bir serif. Aday: *Cormorant Garamond*, *EB Garamond*, *Literata* | Yazı tipi **sitenin kendi dosyalarından** sunulur, Google Fonts sunucusundan çekilmez (KVKK/GDPR). |

### 5.2 Bir şiir dosyası

```md
---
baslik: "Sarı"
ilkMisra: "Şimdi sakince beynimizi uyuşturuyoruz"
tarih: 2020-04-19
yer: "Feneryolu"
koordinat: [40.973, 29.050]
duygular: ["huzun"]
ses: "/ses/sari.mp3"        # isteğe bağlı
icerikNotu: false
---
Şimdi sakince beynimizi uyuşturuyoruz
Kahveyle
Rakıyla
Kargayla
…
```

> **Önemli teknik ayrıntı:** Markdown tek satır kırılımlarını birleştirir, şiirde bu felaket olur. Şiir gövdesi `white-space: pre-line` ile ve bir boş satır = bir kıta kuralıyla işlenecek. Mısralar asla birleşmeyecek.

### 5.3 Alan adı ve DNS — üç yol

`bumba.tr`'nin ad sunucuları Cloudflare'de ve `*.bumba.tr` için bir **joker kayıt** var. Şu an her alt alan adı Bumba'nın kendi sunucusuna gidiyor. Belirli bir kayıt eklendiğinde joker kaydın önüne geçer.

| Yol | Ne yapılır | Yorum |
|---|---|---|
| **A. Cloudflare Pages** *(önerilen)* | Pages projesinde GitHub reposunu bağla. "Custom domains" bölümüne `duygularinpesinde.bumba.tr` yaz. DNS kaydı otomatik oluşur. | En kolay ve tamamen ücretsiz yol |
| B. GitHub Pages | Repo ayarlarından Pages'i aç. Cloudflare'e `duygularinpesinde CNAME bugrabilim.github.io` kaydını ekle. | O da ücretsiz, bir adım fazla |
| C. Bumba sunucusu | Derlenen `dist/` klasörü mevcut altyapıda statik olarak sunulur | Altyapı zaten varsa olur. Bakımı size kalır. |

**Alt alan adı seçenekleri:** `duygularinpesinde.bumba.tr` (tam ad) ya da `duygular.bumba.tr` (kısa). Türkçe karakterli alan adı (ş, ı) önermiyorum: paylaşıldığında `xn--…` gibi bozuk görünür.

---

## 6. Yasal çerçeve ve maliyet

| Konu | Basılı kitapta | Web sitesinde |
|---|---|---|
| Yayınevi sözleşmesi, ISBN, bandrol, matbaa, dağıtım | Gerekli, masraflı | **Hiçbiri gerekmez** |
| Telif | — | Fikir ve Sanat Eserleri Kanunu'na göre eser yaratıldığı anda korunur, tescil şart değil. Sitenin altında *"© [Şairin adı]. Tüm hakları saklıdır."* yazar, ya da isterseniz **CC BY-NC-ND 4.0** (kaynak gösterilerek paylaşılabilir, değiştirilemez, ticari kullanılamaz). |
| 5651 sayılı Kanun, tanıtıcı bilgi | — | Yönetmelik bu yükümlülüğü **ticari ya da ekonomik amaçlı** içerik sağlayıcılarla sınırlıyor. Kişisel ve ticari olmayan bir şiir sitesi kapsam dışında. *(Bir "Bumba ürünü" olarak ticari konumlanırsa iletişim sayfasına tanıtıcı bilgiler eklenir.)* |
| KVKK | — | Form, çerez ve dış yazı tipi yoksa ve analitik çerezsizse toplanan kişisel veri yok denecek kadar az. E-posta listesi eklendi (ortak servis); gizlilik ve çerez metni `/gizlilik/` ve `/en/privacy/`. |
| Repo görünürlüğü | — | Repo herkese açıksa şiirlerin ham metni de açık olur. Zaten yayınlanacakları için sorun değil, ama taslak ve özel metinler repoya girmemeli. İsterseniz repo gizli kalabilir, Cloudflare Pages gizli repolarla da çalışır. |

**Maliyet:**

| Kalem | Fiyat |
|---|---|
| Alt alan adı | 0 ₺ |
| Barındırma | 0 ₺ |
| Analitik | 0 ₺ (mevcut Umami) |
| İsteğe bağlı | Ses kaydı için iyi bir mikrofon, bir illüstratörden harita ya da kapak çizimi |

---

## 7. Yol haritası

### Faz 0 — Hazırlık (şair ve editör)
- [x] Son hâller: "Sarı" için docx'teki hâl kullanıldı. *(Karantina 2 hâlâ bulunamadı.)*
- [ ] Yazım düzeltmelerini onaylamak (§8)
- [x] Başlıklar: ad, tarih ve yer. Adı olmayan şiirlerde başlık yerine "tarih – yer" duruyor, listelerde ilk mısra kullanılıyor.
- [x] Her şiire 1–2 duygu etiketi (§1.1'deki öneriler; şair değiştirebilir)
- [x] Yayından çıkacaklar: aşk metni çıkarıldı, `bus.txt` yayında.
- [ ] Tarihsiz üç şiire tarih ve yer (biliniyorsa)
- [x] Mahlas: *Antigoni* (öneri, `src/data/site.ts`). "Hakkında" metni yazıldı. Lisans: tüm hakları saklıdır.
- [x] Alt alan adı: `duygularinpesinde.bumba.tr`

### Faz 1 — İlk yayın (MVP)
- [x] Astro iskeleti, tasarım dili (renk paleti, yazı tipi, koyu/açık tema)
- [x] 30 şiirin Markdown'a aktarılması (mısra kırılımları birebir)
- [x] Giriş ("Şiir kitabım ağlıyor!" ve duygu seçimi), duygu sayfaları, şiir sayfası, tam liste, Hakkında
- [x] Şiir sayfasında 3 kapı (aynı duygu / yer / yıl)
- [x] Paylaşım önizleme görselleri (her şiir için ayrı)
- [x] Yayın: Coolify (uuid `x4s4woc3tff78dkjnegnoffy`), duygularinpesinde.bumba.tr, Umami. Ayrıntılar CLAUDE.md'de.
- [x] Telefonda test, erişilebilirlik kontrolü (kontrast ≥ 4.5:1, hareket azaltma, yatay taşma yok)

### Faz 2 — Deneyim
- [x] Harita (OpenStreetMap kıyı şeridi, duygu renkli noktalar)
- [x] Zaman şeridi
- [x] Şiir Falı
- [x] Duygu × Yer çarkı (fal sayfasında)
- [x] "Bugün yazılmış şiir"
- [x] Harf harf açılış (önce satır satırdı; 8 Ekim 2026'da sahibinin isteğiyle değişti): dokununca hepsi, "Baştan oku" ile yeniden
- [x] Duygulara özel geçiş hareketleri
- [x] Mısra paylaş kartı (1080×1920, tarayıcıda çizilir)
- [x] Şairin sesiyle okuma altyapısı *(kayıtlar bekleniyor)*
- [x] Ortam sesleri: deniz, yağmur, vapur, gece (Ekim 2026'dan beri gerçek saha kayıtları, Beeld en Geluid / Commons)
- [x] Sveltia CMS paneli `/admin/` (GitHub erişim anahtarıyla giriş)

### Faz 2.5 — Atmosfer (öneri, §10)
- [ ] ~~Mum ışığı modu~~ (denendi, sahibi gereksiz buldu; Ekim 2026'da kaldırıldı)
- [x] Duygunun makamında fon müziği (varsayılan kapalı; `scripts/muzik.py` ile üretilmiş taksimler, Ekim 2026)
- [ ] Şairin ya da bir insanın sesiyle kayıtlar *(yapay ses denendi, düz okuduğu için kaldırıldı; §10.4)*
- [ ] Yağmurlu cam, vapur salınımı gibi küçük dokunuşlar

### Faz 2.6 — Yeni tasarım: "Vapur" (§11)
- [x] Tasarım araştırması, dört yön, şairin seçimi: B "Vapur"
- [x] Her şiir yazıldığı yerin gerçek fotoğrafıyla açılıyor (siyah beyaz + duygu rengi + film greni)
- [x] Ana sayfa: her ziyarette bir "renk mısrası" kendi şiirinin fotoğrafıyla; yedi duygu şeridi; yerler
- [x] Ana sayfa vitrini: sayfa açıkken mısralar yavaşça birbirine geçer; durdurulabilir
- [x] Yer sayfaları (`/yer/…`)
- [x] Mısra kartı ve paylaşım önizlemeleri şiirin fotoğrafıyla
- [ ] Şairin kendi fotoğrafları gelirse Commons fotoğraflarının yerine konması

### Faz 3 — Okurla bağ (isteğe bağlı)
- [ ] ~~Okurun bir şiire renk ya da kelime bırakması~~ (sahibi istemedi, Ekim 2026: site statik kalır)
- [x] E-posta listesi (Bumba ortak liste servisi)
- [x] Bumba Genel Standartlar 3.2: TR/EN, açık/koyu tema, arama, SEO/GEO, llms.txt, HSTS/CSP, gizlilik (CLAUDE.md)
- [ ] Instagram hesabı ve mısra kartlarıyla düzenli paylaşım

### Faz 4 — Belki bir gün kitap
- [ ] Basılı kitap, A5 (sahibinin seçimi, Ekim 2026): saman kâğıt, siyah beyaz fotoğraflar, renkli kapak; baskı dosyaları sitenin dışında üretilir, sitede yayımlanmaz. Seçimler yapıldı (Moda kapağı, kitabın adı ön kapağın, künye arka kapağın içinde, her şiirde fotoğraf ve başlık, içindekiler var, yıl ayracı yok, arka kapakta QR; sığan şiir fotoğrafıyla aynı sayfada, sığmayan karşısında, çok uzun olan iki sütun; künyeler tek sayfa); tam prova `scripts/kitap/` ile üretiliyor, matbaa seçimi bekleniyor.

---

## 8. Yazım düzeni (TDK)

**Karar (Ekim 2026):** Şiirler TDK Yazım Kılavuzu'na göre düzeltildi. Bilgisayara geçirirken oluşan harf hataları da giderildi. Özgün hâlleri `kaynak/` klasöründe aynen duruyor.

| Ne yapıldı | Örnekler |
|---|---|
| Harf hataları | Sabah ~~lur~~ olur · ~~Bıçalar~~ Bıçaklar · ~~büüyk~~ büyük · ne ~~hissedileblirse~~ hissedilebilirse · ~~araların~~ aralarında |
| Ayrı / bitişik yazım | ~~birses~~ bir ses · ~~birbir~~ bir bir · ~~onbir~~ on bir · ~~onik~~ on iki · ~~yazgelir~~ yaz gelir · ~~budenli~~ bu denli · ~~oysa ki~~ oysaki · ~~baş parmağında~~ başparmağında · ~~Göz yaşlarım~~ Gözyaşlarım · ~~yalnızkalmam gereksadece~~ yalnız kalmam gerek sadece |
| de/da bağlacı, mi soru eki | onlar da (2 yerde) · ~~değimliydin~~ değil miydin · ~~edemememi~~ edemememe mi |
| Düzeltme işareti | hikâye · rüzgâr (2 yerde) · hâlâ · hâle |
| Özel adlar | Kalamış’a · Burgaz’a · Antigoni’de · Karaköy’de |
| İkilemeler | ~~Senli-sensiz~~ Senli sensiz · ~~yaz-kış~~ yaz kış |
| Noktalama ve boşluk | Aman “gece” · solumdan~~, .~~ · rağmen~~ ,~~ |
| Sözlük yazımı | ~~umrumda~~ umurumda · ~~sushi~~ suşi · 8. ~~Harikam~~ harikam |
| Dize başı büyük harf | "Dizeler büyük harfle başlar." kuralı 10 şiirde 97 dizeye uygulandı. Noktalamayla başlayan devam dizelerine (…orada., -bırakmam seni-) dokunulmadı. |
| Karantina Günleri 1 | Bitişik yazılmış dizeler kelimelerine ayrıldı ("Bugün sıradan bir gün her gün gibi"). Bitişik yazım bilinçli bir üsluptuysa söyleyin, geri alınır. |

**Açık kalan tek nokta:** 23.06.2009 Cihangir şiirindeki "**Uların** içi kanlanıyor" dizesi. Hangi kelimenin kastedildiği anlaşılamadı, olduğu gibi bırakıldı.

Kısa çizgiyle yapılan duraklamalar ("Ölmek-ne berbat", "Bulutlu-yağmurlu", "Karanlık-sürekli") şairin noktalama üslubu sayıldı ve korundu.

---

## 9. Kararlar

| Soru | Karar |
|---|---|
| Şair adı | *Antigoni* (şimdilik böyle kalıyor). Burgazada'nın eski adı, "İçimdeki savaş" orada yazıldı. Değiştirmek için `src/data/site.ts` dosyasında tek satır. |
| Başlıklar | Ad, tarih, yer. Adı olmayan şiirde başlık yerine şairin kendi "tarih – yer" imzası duruyor. |
| Yayından çıkacaklar | Aşk metni çıkarıldı. `bus.txt` yayında. |
| Adres | `duygularinpesinde.bumba.tr` |
| Lisans | Tüm hakları saklıdır. |
| Ağır şiirler | Uyarı notu yok. |
| **Açık:** Ses kayıtları | Şairin kendi sesiyle kayıtlar bekleniyor. Yapay sesle denenen örnekler düz okuduğu için kaldırıldı (§10.4). |
| İmza | Alt bilgide Bumba Life rozeti var. |
| Tasarım | B "Vapur": yer fotoğrafları (§11). Varsayılan koyu; 8 Ekim 2026'dan beri açık tema düğmesi var (Standartlar §3). Arayüz Türkçe ve İngilizce; şiirler Türkçe. |
| Fotoğraflar | Gerçek fotoğraflar, Wikimedia Commons'tan özgür lisanslı; fotoğrafçı adı ve lisans her şiirde ve Hakkında sayfasında. |
| Yazım | TDK'ya göre düzeltildi (§8). Açık kalan tek nokta: "Uların". |

---

## 10. Atmosfer katmanı: fon müziği, mum ışığı ve ses

Ortam sesi (deniz, yağmur) ilk adımdı. Bu katmanın ilkeleri şunlar:
- Hepsi isteğe bağlı ve varsayılan olarak kapalı.
- Şiirin önüne geçmiyor, dosya yükünü artırmıyor.
- Telif riski taşımıyor.

### 10.1 Fon müziği

| Seçenek | Nasıl | Artısı | Eksisi |
|---|---|---|---|
| **A. Duygunun makamı** *(önerilen ilk adım)* | Ortam sesi gibi tarayıcıda üretilir. Her duygu kendi makamında, yavaş ve tekrarsız bir ezgi ya da uzun sesler çalar: hüzün → Hicaz, özlem → Uşşak, aşk → Hüzzam, özgürlük → Rast, karanlık → Saba, ayrılık → Kürdi, yalnızlık → tek bir ney gibi uzun ses. Web Audio koma aralıklarını da çalabildiği için makamın Türk müziği rengi korunur. | Dosya yok, telif yok, her açılışta farklı. Ortam sesiyle birlikte karışabilir. | Gerçek bir çalgı sıcaklığında olmaz; ses tasarımına zaman ister. |
| B. Telifsiz kayıtlar | Kamu malı ya da CC0/CC BY lisanslı piyano, ney, kanun kayıtları (ör. Musopen'daki kamu malı icralar). | Gerçek çalgı sesi. | Lisanslar tek tek doğrulanmalı. Parça başına 3–5 MB, mobil veriye yük. Herkes aynı parçayı duyar. |
| C. Özgün müzik | Bir müzisyen arkadaşın şiirlere özel kısa doğaçlamaları (ney, viyolonsel, piyano). | Sitenin ruhuna en uygunu; şiir ve müzik birlikte bir eser olur. | Emek ve izin gerekir. Haklar yazılı olarak netleştirilmeli. |

Arayüz önerisi: "ortam sesi" düğmesinin yanında bir "müzik" düğmesi. İkisi birlikte açıldığında ses dengesi otomatik ayarlanır. Sayfa değişince müzik, ortam sesi gibi ilk dokunuşta kaldığı yerden sürer. Şairin sesiyle okuma başlarsa müzik kısılır.

### 10.2 Mum ışığı

- **Mum modu:** Ekran kararır. Şiir, ortada ya da parmağın veya imlecin durduğu yerde titreyen sıcak bir ışık halkası içinde okunur. CSS'teki radyal geçişli maskeyle yapılır; ek dosya gerekmez.
- **Telefonda eğince ışık kayar** (cihaz yönü sensörü; iPhone'da izin ister, isteğe bağlı).
- **"Mumu üfle":** Şiir bitince ya da ışığa dokununca mum söner, zemin tamamen kararır, yalnızca imza kalır. Mikrofonla gerçekten üflemek mümkün ama izin istediği için önerilmez.
- **Gece yarısı:** 00:00'dan sonra açılan sayfalarda küçük bir "mum yakalım mı?" önerisi çıkar.
- **Erişilebilirlik:** Hareketi azaltma açıksa titreme olmaz. Işık halkası okumaya yetecek kadar geniş tutulur. Tek dokunuşla kapanır.

### 10.3 Diğer küçük dokunuşlar

- **Yağmurlu cam:** Yağmur sesi açıkken ekranda ince damla izleri (canvas).
- **Vapur salınımı:** Vapurda yazılmış şiirlerde ("Eminönü vapuru", "Beşiktaş vapurundayız") metin çok hafif sallanır.
- **Daktilo sesi:** Harf harf açılırken her mısrada kısık bir daktilo tuşu (isteğe bağlı).
- **Günün saati:** Zemin sabah, akşam ve gece hafifçe ton değiştirir.
- **El yazısı:** Şairin el yazısıyla taranmış imzalar ya da başlıklar varsa şiir sayfalarına eklenebilir.

### 10.4 Ses kayıtları

Asıl hedef, şiirlerin şairin kendi sesiyle okunması; bu iş **açık** duruyor. Kayıtlar panelden ("Şairin sesi" ya da "Diğer okumalar") veya `public/ses/` klasöründen eklenebilir. Oynatıcı hazır.

**Yapay ses denendi, kaldırıldı (Ekim 2026).** Açılış şiiri açık kaynak Türkçe ses modelleriyle (Chatterbox Multilingual, Piper `tr_TR-dfki`) bir kadın ve bir erkek sesiyle okutuldu. Kelimeler doğru çıktı (Whisper ile denetlendi), ama okuma düz ve vurgusuzdu; şiir böyle okunmaz. Bu modellerle duygulu bir şiir okuması elde edilemiyor, o yüzden örnekler siteden kaldırıldı. Kayıtların bir insan sesiyle yapılması gerekiyor.

**Kim okuyabilir:**
- Şairin kendisi (en anlamlısı).
- Sesi güzel, şiir okumayı seven bir kadın ve bir erkek arkadaş. İki sesli okuma isteniyorsa bu en doğal yol.
- Seslendirme sanatçısı ya da tiyatrocu bir tanıdık. Bu durumda kayıtların sitede kullanım izni yazılı olarak alınmalı.

**Kayıt ipuçları:**
- Sessiz, eşyalı bir oda (yankı yapmasın); telefon ağızdan bir karış uzakta, sabit dursun.
- Önce şiiri birkaç kez sesli okuyun, hangi kelimeye yaslanacağınıza karar verin.
- Mısra sonlarında nefes payı bırakın, acele etmeyin. Kıta aralarında daha uzun durun.
- Her şiiri iki üç kez okuyun, en içteninin seçilmesi yeterli. Kusursuz değil, sahici olsun.
- Dosyalar mp3 ya da m4a; 96–128 kbps yeterli.

---|---|---|
| Kadın | Chatterbox Multilingual (Resemble AI), Türkçe, hazır ses | MIT |
| Erkek | Chatterbox Multilingual; ses rengi Piper'ın `tr_TR-dfki-medium` sesinden alındı | MIT / CC BY-NC-SA 4.0 (ticari olmayan kullanım, atıf) |

Her mısra birkaç kez üretildi. Türkçe konuşma tanıma modeli Whisper'ın en doğru duyduğu seçildi; kadın sesi ortalama ~170 Hz, erkek sesi ~105 Hz. Dosyalar `public/ses/2011-07-18-moda-ornek-*.mp3` (mono, 96 kbps, ~23 sn, ~280 KB).

Kayıt ipuçları: sessiz bir oda, telefon ağızdan bir karış uzakta, mısralar arasında nefes payı. Dosyalar mp3, 96–128 kbps yeterli.

---

## 11. Tasarım: "Vapur"

Ekim 2026'da ilk tasarım (düz lacivert zemin, renkli italik kelimeler) beğenilmedi. 35 şiir ve edebiyat sitesi incelendi, dört yön telefonda aynı şiirle çizildi: Kâğıt, Vapur, Afiş, Hâle. Seçilen **Vapur**:

- **Fotoğraf:** Her şiir yazıldığı yerin fotoğrafıyla açılır. Fotoğraf siyah beyaza çekilir; ışıkları şiirin ana duygusunun rengine (`src/data/duygular.ts` → `isik`), gölgeleri o duygunun koyu tonuna (`golge`) boyanır, üstüne film greni biner. Böylece farklı fotoğrafçıların farklı makinelerle çektiği fotoğraflar tek bir kitabın sayfaları gibi durur.
- **Yazı:** Başlıklar Fraunces (ince, iri), şiir Newsreader, küçük etiketler Inter (büyük harf, aralıklı).
- **Düzen:** Telefonda fotoğraf üstte, şiir altta koyu zeminde. Bilgisayarda fotoğraf solda sabit durur, şiir sağda akar.
- **Ana sayfa:** Her ziyarette başka bir "renk mısrası" (pembe küpe çiçeği, sarı kediler, turuncu gemi…) kendi şiirinin yerinde açılır; sayfa açık kaldıkça mısralar yavaşça birbirine geçer. Altında duygular, yedi fotoğraflı şerit ve yerler.
- **Fotoğrafsız şiir:** Fotoğrafı olmayan şiirde duygunun renginde bulanık bir ışık durur.

### 11.1 Fotoğraflar

Hepsi gerçek fotoğraf; Wikimedia Commons'ta özgür lisansla (CC BY, CC BY-SA, CC0) paylaşılmış. Yer, Commons kategorisinden ve açıklamasından doğrulandı (ör. Söğüt fotoğrafları "Söğütköy, Marmaris" kategorisinde, Karga'nın sokağı açıklamada "Kadife Sok."). Yapay zekâ ile üretilmiş görünen görseller (ör. 1344×1004 PNG) elendi. Yeri belli olmayan dokuz şiirde fotoğraf yeri değil, şiirdeki bir imgeyi gösteriyor (sisteki ağaç, kırağı, boza, boş İstiklal…).

Künyeler `src/data/fotograflar.ts` dosyasında; her şiirin fotoğrafı şiirin dosyasındaki `foto:` alanında. Şairin kendi fotoğrafları gelirse aynı kimlikle `src/assets/foto/` klasörüne konması yeterli; künyede yazar ve lisans güncellenir.

---

## Kaynaklar

- POETRY uygulaması ve SPIN özelliği: [Common Sense Education](https://www.commonsense.org/education/app/poetry-from-the-poetry-foundation), [Poetry Foundation blog](https://poetryfoundation.org/blog/uncategorized/54976/an-essential-poetry-app-as-addictive-as-raspberries), [Tierra Innovation](https://tierra-innovation.com/work/poetry-app)
- Poem Roulette: [Poetry in Voice](https://poetryinvoice.ca/read)
- The Unsent Project: [briefly.co.za](https://briefly.co.za/facts-lifehacks/205558-what-unsent-project-key-facts-know/), [Goodreads](https://www.goodreads.com/author_blog_posts/25726947-the-unsent-project-anonymous-confessions-of-love-regret-healing?tab=book)
- Atlas of Emotions: [Stamen](https://stamen.com/press/stamens-atlas-of-emotions/), [Scientific American](https://www.scientificamerican.com/blog/sa-visual/data-visualization-and-feelings), [Communication Arts](https://www.commarts.com/webpicks/atlas-of-emotions)
- Şiir haritaları: [Poetry Atlas](https://archives.internetscout.org/r48485/poetry_atlas), [UW ecopoetry map](https://artsci.washington.edu/news/2019-03/putting-poetry-map), [Niagara Poetry Map](https://niagarapoetry.ca/map/)
- The Poetry Pharmacy: [Secret London](https://secretldn.com/the-poetry-pharmacy/), [Curly Tales](https://curlytales.com/london-is-home-to-a-pharmacy-that-prescribes-poems-instead-of-pills-for-every-emotional-need-p-s-it-also-has-a-cosy-cafe/amp/)
- Hafız falı geleneği: [Royal Collection Trust — Divan-ı Hafız](https://www.rct.uk/collection/1005018), [İSAM](https://makale.isam.org.tr/bitstreams/3911f662-ba43-4370-b91c-b9c9cffc6f9f/download)
- Sürükleyici şiir siteleri: [David Whyte Experience — Immersive Garden](https://immersive-g.com/projects/david-whyte-experience), [I ♥ E-Poetry — Window](https://iloveepoetry.org/en/2012/window-by-katharine-norman/), [The Flat](https://iloveepoetry.org/en/2005/the-flat-by-andy-campbell/)
- 5651 sayılı Kanun ve aktörler: [Erdem & Erdem](https://www.erdem-erdem.av.tr/bilgi-bankasi/5651-sayili-kanun-kapsaminda-internet-aktorleri), [Yönetmelik metni](https://www.alomaliye.com/2007/11/30/internet-ortaminda-yapilan-yayinlarin-duzenlenmesine-dair-usul-ve-esaslar-hakkinda-yonetmelik/)
- Sveltia CMS: [README](https://unpkg.com/@sveltia/cms@0.173.0/README.md)
- Astro ve Cloudflare Pages: [Bitdoze rehberi](https://www.bitdoze.com/deploy-astrojs-cloudflare/), [LogSnag rehberi](https://logsnag.com/blog/deploy-astro-cloudflare-pages-guide)
