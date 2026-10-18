// iPhone (App Store) ve Android (Google Play) uygulaması: sitenin derlenmiş hâli uygulamanın içine gömülür, çevrimdışı
// çalışır. Derleme: npm run uygulama (dist-uygulama/ üretir, iOS ve Android projelerine kopyalar). Ayrıntı: uygulama/README.md
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tr.bumba.duygularinpesinde',
  appName: 'Duyguların Peşinde',
  webDir: 'dist-uygulama',
  ios: {
    path: 'uygulama/ios',
    // Sayfa ekranın tamamını kullanır; çentik ve alt çubuk payını site kendisi bırakır (safe-area)
    contentInset: 'never',
    backgroundColor: '#0d0c0b',
  },
  android: {
    path: 'uygulama/android',
    backgroundColor: '#0d0c0b',
  },
  // Site çok sayfalı: /siir/x/ → siir/x/index.html eşlemesini Android'de DizinYonlendirici (MainActivity.java),
  // iOS'ta AppDelegate.swift yapar
  plugins: {
    SplashScreen: { launchShowDuration: 600, backgroundColor: '#0d0c0b', showSpinner: false },
  },
};

export default config;
