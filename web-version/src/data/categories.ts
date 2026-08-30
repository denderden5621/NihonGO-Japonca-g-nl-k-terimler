import { LocationCategory } from '../types';

export const LOCATION_CATEGORIES: LocationCategory[] = [
  {
    id: 'general',
    name: 'Genel & Her Yerde',
    japaneseName: '基本・どこでも (Kihon)',
    iconName: 'Sparkles',
    tagline: 'Tüm seyahat boyunca hayat kurtaran temel ifadeler',
    description: 'Selamlaşma, teşekkür, evet/hayır, tuvalet sorma, İngilizce sorma ve acil durum ifadeleri.',
    themeColor: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      accent: '#e11d48',
      gradient: 'from-rose-500 to-red-600',
    },
    etiquetteTips: [
      'Japonya\'da hafifçe eğilerek selam vermek (Ojigi) derin bir saygı göstergesidir.',
      '"Sumimasen" kelimesi hem "Afedersiniz", hem "Özür dilerim", hem de garsonu çağırırken kullanılır; seyahatin en önemli kelimesidir.',
      'Sokakta yüksek sesle telefonla konuşmak veya bağırarak konuşmak hoş karşılanmaz.',
      'İnsanları parmakla göstermek yerine tüm elinizi açarak yön gösterin.'
    ],
  },
  {
    id: 'konbini',
    name: 'Konbini & Market',
    japaneseName: 'コンビニ (7-Eleven / Lawson / FamilyMart)',
    iconName: 'ShoppingBag',
    tagline: '7-Eleven, Lawson, FamilyMart kasiyer diyalogları',
    description: 'Poşet isteme, yemek ısıtma (atatamemasu ka?), kaşık/çubuk seçimi, fiş ve ödeme kalıpları.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      accent: '#059669',
      gradient: 'from-emerald-500 to-teal-600',
    },
    etiquetteTips: [
      'Kasiyerler sıcak bento aldığınızda ısıtmak isteyip istemediğinizi "Atatamemasu ka?" diye sorar.',
      'Plastik poşetler Japonya genelinde 3 ila 5 Yen arasında ücretlidir.',
      'Ödemeyi doğrudan kasiyerin eline vermek yerine kasanın önündeki küçük tepsiye (tsurisen tray) koyun.',
      'Çöp kutuları genellikle sadece konbini önünde bulunur; çöplerinizi pet şişe, teneke ve yanıcı olarak ayrıştırın.'
    ],
  },
  {
    id: 'restaurant',
    name: 'Restoran & Ramen & Suşi',
    japaneseName: 'レストラン・ラーメン・寿司',
    iconName: 'Utensils',
    tagline: 'Sipariş verme, kaç kişi olduğunuzu söyleme, hesap isteme',
    description: 'Masa bekleme, kişi sayısı, su isteme, alerji/domuz eti sorma, hesap ve "Gochisousama" adabı.',
    themeColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      accent: '#d97706',
      gradient: 'from-amber-500 to-orange-600',
    },
    etiquetteTips: [
      'Japonya\'da ASLA bahşiş (tip) verilmez! Bahşiş bırakırsanız peşinizden paranızı düşürdünüz diye koşabilirler.',
      'Garson çağırmak için çekinmeden "Sumimasen!" diyebilirsiniz, bu tamamen normaldir.',
      'Restoranlarda soğuk veya sıcak su (o-hiya) ve ıslak mendil (o-shibori) her zaman ücretsiz ikram edilir.',
      'Yemek çubuklarını (hashi) asla pirince dik saplamayın (cenaze adetidir) ve yiyeceği çubuktan çubuğa aktarmayın.'
    ],
  },
  {
    id: 'store',
    name: 'Alışveriş & Mağaza (Tax-Free)',
    japaneseName: '買い物・免税 (Kaimono & Tax-Free)',
    iconName: 'Tag',
    tagline: 'Vergisiz alışveriş, kıyafet deneme, beden ve fiyat sorma',
    description: 'Don Quijote, Bic Camera, Uniqlo, hediyelik eşya dükkanları ve Tax-Free (%10 vergi iadesi) işlemleri.',
    themeColor: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      accent: '#4f46e5',
      gradient: 'from-indigo-500 to-blue-600',
    },
    etiquetteTips: [
      '5000 Yen üzeri alışverişlerde Tax-Free (%10 KDV muafiyeti) için fiziksel pasaportunuzun yanınızda olması zorunludur.',
      'Kıyafet deneme kabinine girmeden önce ayakkabılarınızı çıkartmanız veya kadınlar için makyaj örtüsü takmanız istenebilir.',
      'Tax-Free mühürlü paketleri Japonya sınırları içinde açmamanız gerekir (kozmetik/gıda ürünleri için).'
    ],
  },
  {
    id: 'train',
    name: 'Tren & Metro & Shinkansen',
    japaneseName: '電車・地下鉄・新幹線 (Densha & Shinkansen)',
    iconName: 'Train',
    tagline: 'Peron bulma, Suica/Pasmo kartları, bilet ve Shinkansen',
    description: 'Metro hatları, bilet otomatları, aktarmalar, JR pass ve hızlı tren koltuk rezervasyonları.',
    themeColor: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      badge: 'bg-sky-100 text-sky-800',
      accent: '#0284c7',
      gradient: 'from-sky-500 to-cyan-600',
    },
    etiquetteTips: [
      'Tren ve metroda telefonla sesli konuşmak yasaktır (telefonu sessiz moda "Manner Mode"a alın).',
      'Peronda beklerken yerdeki çizgileri takip ederek düzenli sırada bekleyin.',
      'Yürüyen merdivenlerde Tokyo\'da solda durulur (sağ yürüyenler içindir), Osaka\'da ise sağda durulur.'
    ],
  },
  {
    id: 'hotel',
    name: 'Otel & Ryokan & Konaklama',
    japaneseName: 'ホテル・旅館 (Hoteru & Ryokan)',
    iconName: 'Building',
    tagline: 'Giriş/çıkış, bavul emaneti, oda servisi ve Onsen adabı',
    description: 'Check-in, bavul bırakma, Wi-Fi bilgisi, klima/ısıtıcı ayarı ve geleneksel Ryokan kaplıca kuralları.',
    themeColor: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      badge: 'bg-violet-100 text-violet-800',
      accent: '#7c3aed',
      gradient: 'from-violet-500 to-purple-600',
    },
    etiquetteTips: [
      'Ryokan veya geleneksel odalara girerken ayakkabınızı giriş kısmında (Genkan) çıkarıp terlik giyin. Tatami hasırına terlikle de basılmaz (sadece çorapla basılır).',
      'Kaplıcaya (Onsen) girmeden önce tüm vücudunuzu yıkayıp durulamanız zorunludur. Havuzu sabunlamayın veya suya mayo ile girmeyin.',
      'Bazı Onsen\'lerde dövme (tattoo) kapatıcı bant istenebilir.'
    ],
  },
  {
    id: 'cafe_izakaya',
    name: 'Kafe & Çay Evi & Izakaya',
    japaneseName: 'カフェ・居酒屋 (Kafe & Izakaya)',
    iconName: 'Coffee',
    tagline: 'Matcha, kahve siparişi, Izakaya atıştırmalıkları ve kadehler',
    description: 'Sıcak/soğuk içecek seçimi (Hotto/Aisu), paket alma (Teikuauto), Izakaya kadeh kaldırma (Kanpai!).',
    themeColor: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      accent: '#ea580c',
      gradient: 'from-orange-500 to-amber-600',
    },
    etiquetteTips: [
      'Izakaya\'larda masaya oturduğunuzda sipariş etmediğiniz küçük bir meze (Otoshi) gelir; bu kuver/masa ücretidir.',
      'Kadeh tokuştururken "Kanpai!" (Şerefe) denir. Japonca "Chin chin" demeyin (farklı uygunsuz bir anlama gelir!).',
      'Kahve siparişinde "Hotto" sıcak, "Aisu" buzlu anlamına gelir.'
    ],
  },
  {
    id: 'taxi_directions',
    name: 'Taksi & Yol Tarifi',
    japaneseName: 'タクシー・道案内 (Takushī & Michi)',
    iconName: 'Compass',
    tagline: 'Adres gösterme, taksi kapısı, sağ/sol ve konum sorma',
    description: 'Taksiye binme, varış noktası söyleme, "burada durun", haritada yer sorma ve navigasyon.',
    themeColor: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-900',
      accent: '#ca8a04',
      gradient: 'from-yellow-500 to-amber-600',
    },
    etiquetteTips: [
      'Japonya\'da taksi arka kapıları şoför tarafından otomatik olarak açılır ve kapanır. Asla kapıyı elle açıp kapatmaya çalışmayın!',
      'Gideceğiniz otel veya yerin Japonca adresini ya da harita işaretini telefondan göstermek her zaman en hızlı yoldur.'
    ],
  },
  {
    id: 'sightseeing',
    name: 'Tapınak & Turistik Gezi',
    japaneseName: '観光・神社・寺 (Kankou & Jinja)',
    iconName: 'Camera',
    tagline: 'Tapınak adabı, fotoğraf çekme izni, bilet ve hediyeler',
    description: 'Şinto tapınağı (Jinja) ve Budist tapınağı (Otera) ziyaretleri, fotoğraf sorma ve hatıra damgası (Goshuin).',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-800',
      accent: '#0d9488',
      gradient: 'from-teal-500 to-emerald-600',
    },
    etiquetteTips: [
      'Tapınak girişindeki su çeşmesinde (Temizuya) kepçe ile sırayla sol elinizi, sağ elinizi ve ağzınızı çalkalayarak arının.',
      'Şinto tapınağında dua ederken: 2 kez eğilin, 2 kez el çırpın, dileğinizi tutun ve 1 kez tekrar eğilin (2 Bow, 2 Claps, 1 Bow).',
      'İç tapınak alanlarında fotoğraf çekiminin yasak olduğu tabelalara ("Satsuei Kinshi") dikkat edin.'
    ],
  },
  {
    id: 'pharmacy_emergency',
    name: 'Eczane & Acil & Sağlık',
    japaneseName: '薬局・緊急 (Yakkyoku & Kinkyuu)',
    iconName: 'ShieldAlert',
    tagline: 'İlaç sorma, ağrı/hastalık tarif etme, polis ve acil durum',
    description: 'Baş ağrısı, mide ilacı, alerji, kayıp eşya (Kouban polis kulübesi) ve 119 acil hatları.',
    themeColor: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      accent: '#dc2626',
      gradient: 'from-red-500 to-rose-700',
    },
    etiquetteTips: [
      'Japonya\'da Acil Çağrı Numaraları: Ambulans ve İtfaiye: 119, Polis: 110.',
      'Japonya dünyanın en güvenli ülkelerindendir; kaybettiğiniz pasaport veya cüzdan çoğunlukla en yakın "Kouban" (Polis noktası) merkezine teslim edilir.'
    ],
  },
];
