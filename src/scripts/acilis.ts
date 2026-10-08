// Harf harf açılış: şiir, yazılıyormuş gibi harf harf belirir. Metin baştan sayfada durur (yer kaplar,
// ekran okuyucular okur); yalnızca harflerin görünürlüğü değişir, satırlar zıplamaz.
// Dokununca ya da bir tuşa basınca hepsi gelir. Hareketi azalt ayarı açıksa hepsi hemen görünür.

const hareketsiz = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Yazim {
  harfler: HTMLElement[];
  zamanlar: number[];
  sure: number;
  kare?: number;
}
const yazimlar = new WeakMap<HTMLElement, Yazim>();

/** Mısraları harf harf <span>'lere böler (bir kez). Metin ve satır kırılımı aynı kalır. */
function bol(govde: HTMLElement): HTMLElement[] {
  const harfler: HTMLElement[] = [];
  for (const misra of govde.querySelectorAll<HTMLElement>('.misra')) {
    if (!misra.dataset.bolundu) {
      const metin = misra.textContent ?? '';
      misra.replaceChildren(
        ...Array.from(metin).map((c) => {
          const s = document.createElement('span');
          s.className = 'harf';
          s.textContent = c;
          return s;
        }),
      );
      misra.dataset.bolundu = '1';
    }
    harfler.push(...misra.querySelectorAll<HTMLElement>('.harf'));
  }
  return harfler;
}

/** Her harfin ne zaman belireceği: düzenli bir hız, satır sonunda kısa, kıta sonunda uzun bir nefes */
function zamanla(govde: HTMLElement, harfler: HTMLElement[]): { zamanlar: number[]; sure: number } {
  const stil = getComputedStyle(govde);
  const hiz = parseFloat(stil.getPropertyValue('--hiz')) || 32; // harf / saniye
  const satirArasi = parseFloat(stil.getPropertyValue('--satir-arasi')) || 260; // ms
  const kitaArasi = parseFloat(stil.getPropertyValue('--kita-arasi')) || 650; // ms
  const zamanlar: number[] = [];
  let t = 350;
  let oncekiMisra: Element | null = null;
  for (const h of harfler) {
    const misra = h.parentElement;
    if (oncekiMisra && misra !== oncekiMisra) {
      t += misra?.parentElement !== oncekiMisra.parentElement ? kitaArasi : satirArasi;
    }
    oncekiMisra = misra;
    zamanlar.push(t);
    t += h.textContent === ' ' ? 1000 / hiz / 2 : 1000 / hiz;
  }
  return { zamanlar, sure: t + 400 };
}

function durdur(govde: HTMLElement) {
  const y = yazimlar.get(govde);
  if (y?.kare) cancelAnimationFrame(y.kare);
}

export function hepsiniGoster(govde: HTMLElement) {
  if (govde.classList.contains('hepsi')) return;
  durdur(govde);
  govde.classList.add('hepsi');
  govde.classList.remove('yaziliyor');
  govde.dispatchEvent(new CustomEvent('hepsi'));
}

/** Açılışın kaç milisaniye süreceği (ipucunu zamanında söndürmek için) */
export function acilisSuresi(govde: HTMLElement): number {
  return yazimlar.get(govde)?.sure ?? 0;
}

function oynat(govde: HTMLElement) {
  durdur(govde);
  const harfler = bol(govde);
  const { zamanlar, sure } = zamanla(govde, harfler);
  const y: Yazim = { harfler, zamanlar, sure };
  yazimlar.set(govde, y);
  harfler.forEach((h) => h.classList.remove('acik'));
  govde.classList.remove('hepsi', 'gec');
  govde.classList.add('yaziliyor');
  if (hareketsiz()) {
    hepsiniGoster(govde);
    return;
  }
  const bas = performance.now();
  let i = 0;
  const adim = (simdi: number) => {
    const gecen = simdi - bas;
    while (i < harfler.length && zamanlar[i] <= gecen) harfler[i++].classList.add('acik');
    if (i < harfler.length) y.kare = requestAnimationFrame(adim);
    else {
      govde.classList.remove('yaziliyor');
      govde.classList.add('hepsi');
      govde.dispatchEvent(new CustomEvent('hepsi'));
    }
  };
  y.kare = requestAnimationFrame(adim);
}

/** Açılışı başlatır; dokunma "hepsi gelsin" olarak bağlanır */
export function satirSatir(govde: HTMLElement) {
  oynat(govde);
  if (govde.dataset.bagli) return;
  govde.dataset.bagli = '1';
  govde.addEventListener('click', () => {
    if (!govde.classList.contains('secim')) hepsiniGoster(govde);
  });
}

/** Açılışı baştan oynatır */
export function bastanOku(govde: HTMLElement) {
  oynat(govde);
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
    { threshold: 0.12 },
  );
  govdeler.forEach((g) => gozcu.observe(g));
}
