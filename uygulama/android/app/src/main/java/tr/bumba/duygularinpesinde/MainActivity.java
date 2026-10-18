package tr.bumba.duygularinpesinde;

import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bridge.setWebViewClient(new DizinYonlendirici(bridge, getAssets()));
        // Uygulama açıkken ekran kararmaz ve kilitlenmez (şiir okunurken, ses çalarken); arka plana geçince bırakılır
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    /**
     * Site çok sayfalı: /siir/x/ adresi siir/x/index.html dosyasına bağlanır, bulunamayan adres 404.html'e gider.
     * Capacitor uzantısız adresleri ya tek sayfaya (html5mode) bağlar ya da hiç sunmaz; bu yüzden istek Capacitor'a
     * gitmeden önce dosya adına çevrilir. iOS'taki karşılığı AppDelegate.swift.
     */
    static class DizinYonlendirici extends BridgeWebViewClient {

        private static final String KOK = "public";
        private final Bridge kopru;
        private final AssetManager varliklar;

        DizinYonlendirici(Bridge kopru, AssetManager varliklar) {
            super(kopru);
            this.kopru = kopru;
            this.varliklar = varliklar;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return super.shouldInterceptRequest(view, yonlendir(request));
        }

        private WebResourceRequest yonlendir(WebResourceRequest istek) {
            Uri adres = istek.getUrl();
            String yol = adres.getPath();
            // Yalnız uygulamanın kendi adresleri; Capacitor'ın kendi dosya ve içerik adreslerine dokunulmaz
            if (yol == null || !kopru.getHost().equals(adres.getHost()) || yol.startsWith("/_capacitor_")) {
                return istek;
            }
            String yeni = yol.isEmpty() ? "/" : yol;
            String son = yeni.substring(yeni.lastIndexOf('/') + 1);
            if (yeni.endsWith("/")) {
                yeni += "index.html";
            } else if (!son.contains(".")) {
                yeni += "/index.html";
            }
            if (!var(KOK + yeni)) {
                yeni = "/404.html";
            }
            if (yeni.equals(yol)) {
                return istek;
            }
            return new Yonlenmis(istek, adres.buildUpon().path(yeni).build());
        }

        private boolean var(String yol) {
            try (InputStream akim = varliklar.open(yol)) {
                return true;
            } catch (IOException e) {
                return false;
            }
        }
    }

    /** Adresi değişmiş istek; geri kalan her şey özgün istekten gelir. */
    static class Yonlenmis implements WebResourceRequest {

        private final WebResourceRequest asil;
        private final Uri adres;

        Yonlenmis(WebResourceRequest asil, Uri adres) {
            this.asil = asil;
            this.adres = adres;
        }

        @Override
        public Uri getUrl() {
            return adres;
        }

        @Override
        public boolean isForMainFrame() {
            return asil.isForMainFrame();
        }

        @Override
        public boolean isRedirect() {
            return asil.isRedirect();
        }

        @Override
        public boolean hasGesture() {
            return asil.hasGesture();
        }

        @Override
        public String getMethod() {
            return asil.getMethod();
        }

        @Override
        public Map<String, String> getRequestHeaders() {
            return asil.getRequestHeaders();
        }
    }
}
