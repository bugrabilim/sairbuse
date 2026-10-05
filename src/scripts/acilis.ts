// Satır satır açılış: mısralar CSS animasyonuyla sırayla gelir; dokununca hepsi gelir.

export function hepsiniGoster(govde: HTMLElement) {
  if (govde.classList.contains('hepsi')) return;
  govde.classList.add('hepsi');
  govde.dispatchEvent(new CustomEvent('hepsi'));
}

/** Açılışın kaç milisaniye süreceği (ipucunu zamanında söndürmek için) */
export function acilisSuresi(govde: HTMLElement): number {
  const misralar = govde.querySelectorAll<HTMLElement>('.misra');
  if (!misralar.length) return 0;
  const saniye = (v: string) => (v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v) || 0);
  const son = getComputedStyle(misralar[misralar.length - 1]);
  return (saniye(son.animationDelay) + saniye(son.animationDuration)) * 1000;
}

/** Açılışı başlatır; dokunma ve tuşla "hepsi gelsin" bağlanır */
export function satirSatir(govde: HTMLElement) {
  govde.classList.remove('gec', 'hepsi');
  govde.classList.add('satir-satir');
  if (govde.dataset.bagli) return;
  govde.dataset.bagli = '1';
  govde.addEventListener('click', () => {
    if (!govde.classList.contains('secim')) hepsiniGoster(govde);
  });
}

/** Açılışı baştan oynatır */
export function bastanOku(govde: HTMLElement) {
  govde.classList.remove('hepsi', 'satir-satir');
  void govde.offsetWidth; // animasyonları sıfırla
  govde.classList.add('satir-satir');
}

/** Duygu sayfası gibi uzun listelerde her şiir ekrana girince açılır */
export function gorununceAc(govdeler: HTMLElement[]) {
  if (!('IntersectionObserver' in window)) {
    govdeler.forEach(satirSatir);
    return;
  }
  const gozcu = new IntersectionObserver(
    (kayitlar) => {
      for (const k of kayitlar) {
        if (!k.isIntersecting) continue;
        satirSatir(k.target as HTMLElement);
        gozcu.unobserve(k.target);
      }
    },
    { threshold: 0.12 }
  );
  govdeler.forEach((g) => gozcu.observe(g));
}
