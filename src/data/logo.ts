// Logo "Damla" (12 Ekim 2026): adın tek noktası, Peşinde'nin i'si, bir gözyaşı damlasıdır. Açılış şiirinin
// ilk dizesinden: "Şiir kitabım ağlıyor!" Damla sayfanın duygusunun renginde; duygusu olmayan sayfada
// hüznün sarısı, tek renk baskıda mürekkep. Tek başına damla küçük işarettir (sekme ve uygulama simgesi).
// Aynı ölçüler: global.css (.damla-i), scripts/simgeler.mjs ve scripts/kitap/kitap.py.

/** Damlanın biçimi, 100×100 kutuda, sivri ucu yukarıda */
export const DAMLA_YOLU = 'M50 6C44 22 22 42 22 62a28 28 0 0 0 56 0C78 42 56 22 50 6Z';

/** Fraunces 300'de, em cinsinden: damlanın kutusunun üstü taban çizgisinin `ust` kadar yukarısında, kenarı
 *  `boy`, ortası harfin ortasında. Satır yüksekliği 1 olan kutuda taban çizgisi üstten `taban` aşağıda; i'nin
 *  noktası kutunun üstünden 0.18–0.28, gövdesi 0.39'dan aşağıda. Damlanın alt ucu noktanın altıyla aynı hizada. */
export const DAMLA = { ust: 0.806, boy: 0.25, taban: 0.861 } as const;

/** Adı damlanın oturacağı i'den böler: "Duyguların Peşinde" → ["Duyguların Peş", "nde"] */
export function logoParcalari(ad: string): [string, string] {
  const i = ad.lastIndexOf('i');
  return [ad.slice(0, i), ad.slice(i + 1)];
}
