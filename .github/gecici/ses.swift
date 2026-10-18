// GEÇİCİ DENEME (birleştirmeden önce silinir): uygulamadaki WKWebView'de fetch ile mp3 okunuyor mu?
// Yanıt mantığı Capacitor'ın WebViewAssetHandler'ıyla aynı: medya dosyası Range'siz istenirse HTTP olmayan URLResponse.
import Cocoa
import WebKit

let kok = URL(fileURLWithPath: CommandLine.arguments[1])

final class Sunucu: NSObject, WKURLSchemeHandler {
  func webView(_ w: WKWebView, start t: WKURLSchemeTask) {
    let url = t.request.url!
    let yol = url.path == "/" ? "/deneme.html" : url.path
    let dosya = kok.appendingPathComponent(String(yol.dropFirst()))
    guard let veri = try? Data(contentsOf: dosya) else { t.didFailWithError(URLError(.fileDoesNotExist)); return }
    let medya = ["mp3", "m4a", "wav"].contains(url.pathExtension)
    let tur = url.pathExtension == "mp3" ? "audio/mpeg" : "text/html"
    if medya && t.request.value(forHTTPHeaderField: "Range") == nil {
      t.didReceive(URLResponse(url: url, mimeType: tur, expectedContentLength: veri.count, textEncodingName: nil))
    } else {
      t.didReceive(HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: ["Content-Type": tur])!)
    }
    t.didReceive(veri)
    t.didFinish()
  }
  func webView(_ w: WKWebView, stop t: WKURLSchemeTask) {}
}

final class Yazici: NSObject, WKScriptMessageHandler {
  func userContentController(_ u: WKUserContentController, didReceive m: WKScriptMessage) {
    print("SONUÇ:", m.body)
    exit(0)
  }
}

let app = NSApplication.shared
let ayar = WKWebViewConfiguration()
ayar.setURLSchemeHandler(Sunucu(), forURLScheme: "capacitor")
ayar.userContentController.add(Yazici(), name: "yaz")
let w = WKWebView(frame: .init(x: 0, y: 0, width: 400, height: 400), configuration: ayar)
w.load(URLRequest(url: URL(string: "capacitor://localhost/")!))
DispatchQueue.main.asyncAfter(deadline: .now() + 60) { print("SONUÇ: zaman aşımı"); exit(2) }
app.run()
