// iOS uygulaması (App Store): sitenin derlenmiş hâli uygulamanın içine gömülür, çevrimdışı çalışır.
// Derleme: npm run uygulama (dist-uygulama/ üretir ve iOS projesine kopyalar). Ayrıntı: uygulama/README.md
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
  plugins: {
    SplashScreen: { launchShowDuration: 600, backgroundColor: '#0d0c0b', showSpinner: false },
  },
};

export default config;
