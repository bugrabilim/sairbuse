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
| `bus.txt` | "ben bir evim / içim karanlık / bilincim yalnız bir ışık…" | Üslubu diğerlerinden farklı ("içinizde", "bizi"). Çeviri metne benziyor. İnternette kaynağını bulamadım ama **başka bir eserden çeviriyse yayınlamayalım** (telif). Size aitse sorun yok. |
| `sevgimiz percinlensin-aşkmetni.txt` | Kişisel bir mesajlaşma | Şiir değil, özel yazışma. **Yayınlanmamasını öneririm.** |

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
5. **Gece gibi:** Koyu zemin varsayılan, gündüz için açık tema seçeneği.

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

- **"Bu şiir bana … hissettirdi":** Okur tek bir kelime ya da renk bırakır (Unsent Project'ten esinle). Anonim olur, şair onaylamadan görünmez.
- **Haftanın şiiri:** e-posta bülteni. E-posta kişisel veri olduğu için KVKK aydınlatma metni gerekir (§6).

### 4.5 Ağır şiirler için nazik bir not (şairin kararı)

Üç şiir (⚠︎) kendine zarar ya da ölüm imgesi içeriyor. Seçenekler:
- Hiçbir şey yapmamak: şiir olduğu gibi durur.
- Şiirin üstüne küçük, sade bir not: *"Bu şiir ağır duygular taşıyor."* Okur isterse devam eder.
- Sayfanın en altına tek satır: *"Zor bir dönemden geçiyorsan yalnız değilsin. Acil durumda: 112."*

Online edebiyat dergilerinde yaygın bir uygulama. Şiiri sansürlemez, okuru korur.

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
| KVKK | — | Form, çerez ve dış yazı tipi yoksa ve analitik çerezsizse toplanan kişisel veri yok denecek kadar az. **Yorum ya da bülten eklenirse** aydınlatma metni gerekir. |
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
- [ ] Son hâller: `sarı.txt` mi docx mi? Karantina 2 nerede?
- [ ] Yazım düzeltmelerini onaylamak (§8)
- [ ] Başlıklar: ilk mısra mı, tarih–yer mi, yeni başlık mı?
- [ ] Her şiire 1–2 duygu etiketi
- [ ] Yayından çıkacaklar: aşk metni (öneri). `bus.txt` için kaynak teyidi.
- [ ] Tarihsiz üç şiire tarih ve yer (biliniyorsa)
- [ ] Şair adı ya da mahlası, "Hakkında" metni, lisans tercihi
- [ ] Alt alan adı seçimi

### Faz 1 — İlk yayın (MVP)
- [ ] Astro iskeleti, tasarım dili (renk paleti, yazı tipi, koyu/açık tema)
- [ ] 29 şiirin Markdown'a aktarılması (mısra kırılımları birebir)
- [ ] Giriş ("Şiir kitabım ağlıyor!" ve duygu seçimi), duygu sayfaları, şiir sayfası, tam liste, Hakkında
- [ ] Şiir sayfasında 3 kapı (aynı duygu / yer / yıl)
- [ ] Paylaşım önizleme görselleri
- [ ] Cloudflare Pages, alan adı, Umami
- [ ] Telefonda test, erişilebilirlik kontrolü (kontrast, ekran okuyucu, hareket azaltma)

### Faz 2 — Deneyim
- [ ] Harita, zaman şeridi
- [ ] Şiir Falı, Duygu × Yer çarkı
- [ ] "Bugün yazılmış şiir"
- [ ] Yavaş okuma modu, duygulara özel geçiş hareketleri
- [ ] Mısra paylaş kartı
- [ ] Şairin sesiyle okumalar, ortam sesleri
- [ ] Sveltia CMS paneli (şair kendi şiirini ekleyebilsin)

### Faz 3 — Okurla bağ (isteğe bağlı)
- [ ] Okurun bir şiire renk ya da kelime bırakması (moderasyonlu)
- [ ] Haftanın şiiri bülteni
- [ ] Instagram hesabı ve mısra kartlarıyla düzenli paylaşım

### Faz 4 — Belki bir gün kitap
- [ ] Siteden otomatik derlenen PDF ya da e-kitap. Site büyüdükçe baskı yeniden düşünülebilir, okur kitlesi artık hazır olur.

---

## 8. Şairin onayını bekleyen yazım notları

Bazıları bilinçli bir üslup tercihi olabilir (küçük harf, bitişik yazım). **Hiçbiri sorulmadan değiştirilmeyecek.**

| Şiir | Şu an | Öneri |
|---|---|---|
| 24.02.2017 Sirkeci | "Ben **araların** olamam" | "aralarında" (şiirin devamında öyle geçiyor) |
| 24.02.2017 Sirkeci | "Ama **onlarda** çilek sevmez" | "onlar da" |
| 19.04.2020 Sarı | "Ne hikmetse artık **onlarda** sizi özlüyor" | "onlar da" |
| 24.10.2011 Antigoni | "Diye **birses** duyuyorum" | "bir ses" |
| 08.10.2015 | "**birbir** dökülecekse derilerim?" | "bir bir" |
| 23.06.2009 Cihangir | "**Bıçalar** işlemez oluyor" | "Bıçaklar" |
| 23.06.2009 Cihangir | "**Uların** içi kanlanıyor" | ? (belirsiz, şair bilir) |
| 05.04.2009 Baba! | "Belli **edemememi yanıyorum** yoksa" | "edemememe mi yanıyorum"? |
| 07.10.2017 karga | "Saat on olur-**onbir** sonra **onik**" | "on bir … on iki" |
| 07.10.2017 karga | "Sabah **lur**" / "Akşam, **yazgelir**" | "Sabah olur" / "yaz gelir" |
| 21.12.2019 Feneryolu | "Seni **budenli** sevdim diye" | "bu denli" |
| 04.12.2020 | "Hani sen **değimliydin**" | "değil miydin" |
| 21.05.2012 İzmir | "Aman”gece”" | "Aman “gece”" |
| 21.12.2012 Eminönü | "…sağımdan, solumdan, **.**" | fazla noktalama |
| 24.06.2021 Söğüt | "Her şeye rağmen **,** bulutlara rağmen…" | boşluk |
| aklımda.txt | "yalnızkalmam gereksadece" | bitişik yazım bilinçli mi? |
| karantina.txt | "bugünsıradanibirgünhergüngibi…", "büüyk" | bitişik yazım bilinçli mi? "büüyk" → "büyük"? |

---

## 9. Karar bekleyen sorular

1. **Şair adı:** Sitede hangi ad ya da mahlas görünecek?
2. **Başlıklar:** İlk mısra mı, "tarih — yer" mi, yeni başlıklar mı?
3. **Yayından çıkacaklar:** aşk metni, `bus.txt`?
4. **Adres:** `duygularinpesinde.bumba.tr` mi, `duygular.bumba.tr` mi?
5. **Lisans:** "Tüm hakları saklıdır" mı, CC BY-NC-ND mi?
6. **Ses:** Şair şiirlerini kendi sesiyle okuyacak mı?
7. **İmza:** Bumba Group'un ürün imzası kuralına uygun olarak sayfanın altında tek bir sessiz satır olsun mu? (*"Duyguların Peşinde bir Bumba Life projesidir."*) Yoksa tamamen kişisel mi kalsın?
8. **Ağır şiirler:** §4.5'teki seçeneklerden hangisi?

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
