package tr.bumba.duygularinpesinde;

import android.content.res.AssetManager;
import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.ProcessedRoute;
import com.getcapacitor.RouteProcessor;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        bridgeBuilder.setRouteProcessor(new DizinYonlendirici(getAssets()));
        super.onCreate(savedInstanceState);
        // Uygulama açıkken ekran kararmaz ve kilitlenmez (şiir okunurken, ses çalarken); arka plana geçince bırakılır
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    /**
     * Site çok sayfalı: /siir/x/ adresi siir/x/index.html dosyasına bağlanır, bulunamayan adres 404.html'e gider.
     * Capacitor'ın tek sayfa kipi (html5mode) capacitor.config.ts'de kapalı. iOS'taki karşılığı AppDelegate.swift.
     */
    static class DizinYonlendirici implements RouteProcessor {

        private static final String KOK = "public";
        private final AssetManager varliklar;

        DizinYonlendirici(AssetManager varliklar) {
            this.varliklar = varliklar;
        }

        @Override
        public ProcessedRoute process(String basePath, String path) {
            ProcessedRoute sonuc = new ProcessedRoute();
            sonuc.setAsset(true);
            // Capacitor'ın kendi dosya ve içerik adreslerine dokunulmaz
            if (path.startsWith("/_capacitor_")) {
                sonuc.setPath(path);
                return sonuc;
            }
            String yol = path.isEmpty() ? "/" : path;
            String son = yol.substring(yol.lastIndexOf('/') + 1);
            if (yol.endsWith("/")) {
                yol += "index.html";
            } else if (!son.contains(".")) {
                yol += "/index.html";
            }
            if (!var(KOK + yol)) {
                yol = "/404.html";
            }
            // Ana sayfa isteğinde basePath "public" gelir; diğer isteklerde boş gelir ve Capacitor "public"i kendisi ekler
            sonuc.setPath(basePath + yol);
            return sonuc;
        }

        private boolean var(String yol) {
            try (InputStream akim = varliklar.open(yol)) {
                return true;
            } catch (IOException e) {
                return false;
            }
        }
    }
}
