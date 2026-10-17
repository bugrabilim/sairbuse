# Duyguların Peşinde · iPhone uygulaması

Uygulama, sitenin derlenmiş hâlini içinde taşır (Capacitor). Şiirler, fotoğraflar ve sesler telefondadır;
internet gerekmez. Mac gerekmez: derleme, imzalama ve App Store Connect'e yükleme GitHub Actions'ın Mac
makinesinde yapılır.

- Paket kimliği: `tr.bumba.duygularinpesinde` · ad: Duyguların Peşinde · yalnız iPhone, dikey
- iOS projesi: `uygulama/ios/` (Xcode projesi `App/App.xcodeproj`, Capacitor eklentileri Swift Package Manager ile)
- Mağaza metinleri ve ekran görüntüleri: `uygulama/magaza/`

## Sitenin uygulamadaki farkları

`npm run uygulama` siteyi `PUBLIC_UYGULAMA=1` ile `dist-uygulama/`'ya derler, uygulamada işe yaramayan dosyaları
çıkarır (`scripts/uygulama/hazirla.mjs`) ve iOS projesine kopyalar (`cap sync ios`).

- Ziyaret sayacı (Umami) yok; uygulama veri toplamaz (App Store gizlilik etiketi: "Data Not Collected").
- E-posta listesi formu yok; alt bilgideki bağlantı sitenin listesini Safari'de açar (rıza akışı tek yerde).
- Paylaş düğmesi ve mısra kartı iOS'un kendi paylaşım ekranını açar (kart "Görüntüyü Kaydet" ile de kaydedilir).
- Menünün en altında **Günün şiiri**: açılırsa her sabah 09.00'da bir şiir bildirimi (telefonda zamanlanır,
  önümüzdeki 60 gün; o gün yazılmış şiir varsa o). Bildirime dokununca şiir açılır.
- Dış bağlantılar (fotoğraf künyeleri, Bumba rozeti) Safari'de açılır.
- Site çok sayfalı olduğu için iOS tarafında `DizinYonlendirici` var (`App/App/AppDelegate.swift`): `/siir/x/`
  adresini `siir/x/index.html` dosyasına bağlar, bulamazsa `404.html`.

**Önemli:** Uygulama şiirleri içinde taşıdığı için siteye eklenen yeni şiir, ses kaydı ya da düzeltme
uygulamaya ancak yeni bir sürümle gelir (aşağıdaki yayın iş akışını yeniden çalıştırıp App Store'a göndermek).

## Denetim

Her PR'da `iOS` iş akışı (`.github/workflows/ios.yml`) uygulamayı simülatör için derler, simülatörde açar ve
ekran görüntüsünü indirilebilir çıktı olarak bırakır (Actions → iOS → `ios-simulator-ekran`).

## İlk kurulum (bir kez, App Store hesabının sahibi yapar)

1. **Paket kimliği:** https://developer.apple.com/account/resources/identifiers → **+** → App IDs → App →
   Description "Duygularin Pesinde", Bundle ID **Explicit** `tr.bumba.duygularinpesinde` → Continue → Register.
   Ek yetenek (capability) seçmeye gerek yok.
2. **Uygulama kaydı:** https://appstoreconnect.apple.com → Uygulamalar → **+** → Yeni Uygulama: platform iOS,
   ad "Duyguların Peşinde", ana dil Türkçe, paket kimliği yukarıdaki, SKU `duygularinpesinde-ios`, erişim tam.
   (Ad başka bir uygulamada kullanılıyorsa App Store kabul etmez; o zaman "Duyguların Peşinde · Şiirler" gibi.)
3. **API anahtarı:** App Store Connect → Kullanıcılar ve Erişim → Entegrasyonlar → App Store Connect API →
   Ekip Anahtarları → **+** : ad "GitHub", erişim **Admin** (sertifika ve profil oluşturabilmesi için).
   **Issuer ID** ve **Key ID**'yi not edin, `.p8` dosyasını indirin (yalnız bir kez indirilebilir).
4. **Sertifika anahtarı:** dağıtım sertifikasının özel anahtarı. Bir terminalde (Mac/Linux; Windows'ta Git Bash)
   `ssh-keygen -t rsa -b 2048 -m PEM -f sertifika_anahtari -q -N ""` çalıştırın; `sertifika_anahtari` dosyası
   (`.pub` olmayan) anahtardır. Bu dosyayı saklayın: her yayında aynı sertifika bununla kullanılır.
5. **GitHub sırları:** https://github.com/bugrabilim/sairbuse/settings/secrets/actions → New repository secret:
   | Ad | Değer |
   |---|---|
   | `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID |
   | `APP_STORE_CONNECT_KEY_IDENTIFIER` | Key ID |
   | `APP_STORE_CONNECT_PRIVATE_KEY` | `.p8` dosyasının tamamı (BEGIN/END satırlarıyla) |
   | `CERTIFICATE_PRIVATE_KEY` | `sertifika_anahtari` dosyasının tamamı |

   Bu değerler kimseyle (Claude dahil) paylaşılmaz, yalnız GitHub'a girilir.

## Yayın

1. GitHub → Actions → **iOS yayın (TestFlight)** → Run workflow (dal: `main`). İş akışı uygulamayı derler,
   imzalar ve App Store Connect'e yükler (~15–20 dk). Yapı numarası iş akışının sıra numarasıdır.
2. Yükleme işlenince (birkaç dakika–yarım saat) App Store Connect → TestFlight'ta görünür. iPhone'a TestFlight
   uygulamasını kurup kendinizi iç test kullanıcısı olarak ekleyin ve deneyin.
3. App Store Connect → uygulama → iOS sürümü 1.0: `magaza/bilgiler.md`'deki metinleri girin, `magaza/ekran/`'daki
   görüntüleri 6,9" iPhone alanına yükleyin (Türkçe sayfaya `tr-*`, İngilizce sayfaya `en-*`), yapıyı seçin,
   Uygulama Gizliliği'nde "Veri toplanmıyor", yaş derecelendirmesi anketini doldurun → **İncelemeye Gönder**.

Sonraki sürümler: `uygulama/ios/App/App.xcodeproj/project.pbxproj` içindeki `MARKETING_VERSION`'ı artırın
(1.0 → 1.1), iş akışını çalıştırın, App Store Connect'te yeni sürüm açıp yapıyı seçin.

## Yerelde (Mac varsa)

```sh
npm ci
npm run uygulama
npx cap open ios     # Xcode açılır; bir simülatör seçip ▶
```

Simgeler ve açılış görseli `node scripts/simgeler.mjs` ile üretilir (koyu karede hüznün sarısı damla).
