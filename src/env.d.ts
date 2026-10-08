interface Window {
  /** Umami olayı (Temel.astro); sayaç yoksa sessizce geçer */
  bumbaOlay?: (ad: string, veri?: Record<string, string | number>) => void;
}
