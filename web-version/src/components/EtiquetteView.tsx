import React, { useState } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  CreditCard, 
  Trash2, 
  Smartphone, 
  Footprints, 
  Bath, 
  UtensilsCrossed, 
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { playJapaneseAudio } from '../utils/audio';

interface EtiquetteViewProps {
  onGoBackToPlaces: () => void;
}

export const EtiquetteView: React.FC<EtiquetteViewProps> = ({ onGoBackToPlaces }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'money' | 'transport' | 'food' | 'onsen' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const etiquetteRules = [
    {
      id: 'tip',
      category: 'money',
      icon: <DollarSign className="w-5 h-5 text-[#E63946]" />,
      title: '1. Bahşiş (Tip) Asla Bırakmayın!',
      badge: 'En Önemli Kural',
      badgeColor: 'bg-red-50 text-[#E63946] border-red-100',
      dos: [
        'Hesap fişinde yazan tutarı tam ve eksiksiz ödeyin.',
        'Hizmetten memnun kaldıysanız içten bir "Gochisousama deshita" (Yemek için teşekkürler) deyin.'
      ],
      donts: [
        'Masada bozuk para veya ekstra bahşiş bırakmayın.',
        'Garsona veya taksi şoförüne üstü kalsın demeyin (arkanızdan parayı vermek için koşabilirler!).'
      ],
      description: 'Japonya\'da mükemmel hizmet zaten işin doğal bir parçası kabul edilir. Bahşiş vermek karşı tarafı küçük düşürücü veya kafa karıştırıcı olarak algılanır.',
      japanesePhrase: {
        text: 'ごちそうさまでした',
        romaji: 'Gochisousama deshita',
        meaning: 'Yemek ve hizmet için çok teşekkürler (Ayrılırken söylenir)'
      }
    },
    {
      id: 'tray',
      category: 'money',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      title: '2. Para ve Kart Tepsisi (Tsurisen Tray)',
      badge: 'Ödeme Adabı',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dos: [
        'Nakit paranızı veya kredi kartınızı kasanın önündeki küçük tepsiye bırakın.',
        'Para üstünü ve kartınızı iki elle teslim alın ve hafifçe başınızla selam verin.'
      ],
      donts: [
        'Parayı veya kartı doğrudan kasiyerin eline uzatmayın.'
      ],
      description: 'Konbini, restoran ve dükkanlarda hijyen ve nezaket amacıyla elden ele para teması yapılmaz.',
      japanesePhrase: {
        text: 'カードでお願いします',
        romaji: 'Kaado de onegaishimasu',
        meaning: 'Kartla ödemek istiyorum lütfen'
      }
    },
    {
      id: 'train',
      category: 'transport',
      icon: <Smartphone className="w-5 h-5 text-sky-600" />,
      title: '3. Tren & Metroda Tam Sessizlik (Manner Mode)',
      badge: 'Toplu Taşıma',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-100',
      dos: [
        'Telefonunuzu daima sessize (Manner Mode) alın.',
        'Yanınızdaki arkadaşınızla sadece fısıltı seviyesinde konuşun.',
        'Sıraya girerken yerdeki çizgileri takip edin ve inenlere yol verin.'
      ],
      donts: [
        'Tren ve metro vagonlarında ASLA sesli telefon görüşmesi yapmayın.',
        'Kulaklıkla dinlediğiniz müziğin sesini dışarıya duyuracak kadar açmayın.'
      ],
      description: 'Japonya\'da trenler insanların dinlenme ve huzur alanıdır; sesli telefonla konuşmak en büyük saygısızlıklardan biridir.',
      japanesePhrase: {
        text: 'すみません、降ります',
        romaji: 'Sumimasen, orimasu',
        meaning: 'Pardon, ineceğim (Trenden inerken yol istemek için)'
      }
    },
    {
      id: 'trash',
      category: 'social',
      icon: <Trash2 className="w-5 h-5 text-amber-600" />,
      title: '4. Sokakta Çöp Kutusu Yoktur (Çöpünüzü Taşıyın)',
      badge: 'Temizlik Kültürü',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      dos: [
        'Yanınızda her zaman küçük bir poşet bulundurun ve çöplerinizi çantanızda saklayın.',
        'Çöpleri otelinizdeki geri dönüşüm kutularına veya konbini önlerine atın.'
      ],
      donts: [
        'Otomat yanındaki kutulara genel çöp atmayın (onlar sadece pet şişe ve teneke içindir).'
      ],
      description: '1995 Tokyo olaylarından sonra güvenlik ve sorumluluk bilinciyle sokaklardan çöp kutuları kaldırılmıştır.',
      japanesePhrase: {
        text: 'ごみ箱はどこですか？',
        romaji: 'Gomibako wa doko desu ka?',
        meaning: 'Çöp kutusu nerede?'
      }
    },
    {
      id: 'chopsticks',
      category: 'food',
      icon: <UtensilsCrossed className="w-5 h-5 text-indigo-600" />,
      title: '5. Yemek Çubuğu (Hashi) Kuralları',
      badge: 'Restoran Adabı',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      dos: [
        'Çubukları kullanmadığınız zaman çubuk altlığına (hashioki) yatay yerleştirin.',
        'Çorba kasesini veya ramen kasesini iki elle kaldırıp suyunu içebilirsiniz.'
      ],
      donts: [
        'Çubukları pirinç kasesine ASLA dik batırmayın (Cenaze ritüelidir - Tsukitate-bashi).',
        'Yiyeceği çubuktan çubuğa aktarmayın (Hashi-watashi).'
      ],
      description: 'Yemek çubukları kutsal kabul edilir ve cenaze ritüelleriyle karıştırılmaması gereken katı tabuları vardır.',
      japanesePhrase: {
        text: 'いただきます',
        romaji: 'Itadakimasu',
        meaning: 'Afiyetle yiyorum (Yemeğe başlarken söylenir)'
      }
    },
    {
      id: 'shoes',
      category: 'social',
      icon: <Footprints className="w-5 h-5 text-purple-600" />,
      title: '6. Ayakkabı Çıkarma (Genkan)',
      badge: 'Geleneksel Mekanlar',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      dos: [
        'Giriş eşiğinde (Genkan) ayakkabılarınızı çıkarıp terlikleri giyin.',
        'Çıkardığınız ayakkabının burnunu kapıya (çıkışa) doğru çevirin.'
      ],
      donts: [
        'Tatami hasırlarına ASLA terlikle veya ayakkabıyla basmayın (Sadece çorapla basılır).'
      ],
      description: 'Evler, geleneksel restoranlar, ryokanlar, tapınak içi ve mağaza deneme kabinlerinde ayakkabı çıkarılır.',
      japanesePhrase: {
        text: 'お邪魔します',
        romaji: 'Ojama shimasu',
        meaning: 'Rahatsızlık verdiğim için özür dilerim (Bir mekana/eve girerken)'
      }
    },
    {
      id: 'onsen',
      category: 'onsen',
      icon: <Bath className="w-5 h-5 text-teal-600" />,
      title: '7. Kaplıca & Onsen Kuralları',
      badge: 'Onsen & Sento',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-100',
      dos: [
        'Sıcak havuza girmeden önce oturaklı yıkama alanında saçınızı ve vücudunuzu tamamen yıkayın.',
        'Küçük el havlusunu başınızın üstüne koyun.'
      ],
      donts: [
        'Sıcak havuza mayo ile girmeyin (tamamen çıplak girilir).',
        'Havlunuzu sıcak suyun içine daldırmayın.'
      ],
      description: 'Onsenler yıkanma yeri değil, temizlendikten sonra şifalı sıcak suda arınma ve rahatlama yeridir.',
      japanesePhrase: {
        text: '気持ちいい',
        romaji: 'Kimochi ii',
        meaning: 'Çok rahatlatıcı / Harika hissettiriyor'
      }
    },
    {
      id: 'walking-food',
      category: 'food',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: '8. Yürürken Yiyip İçmeme (Aruki-gui)',
      badge: 'Sokak Adabı',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      dos: [
        'Otomat veya konbini önünde durarak yiyip için veya bir park bankında oturun.',
        'Sokak lezzetlerini dükkanın belirlediği alanda tüketin.'
      ],
      donts: [
        'Kalabalık sokaklarda veya mağazalarda yürürken yemek yemeyin.'
      ],
      description: 'Yürürken yiyecek kırıntısı düşürmek veya başkalarının kıyafetine çarpmak hoş karşılanmaz.',
      japanesePhrase: {
        text: 'ここで食べます',
        romaji: 'Koko de tabemasu',
        meaning: 'Burada yiyeceğim'
      }
    }
  ];

  const filteredRules = etiquetteRules.filter((rule) => {
    const matchesCategory = activeCategory === 'all' || rule.category === activeCategory;
    const matchesSearch = 
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.dos.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rule.donts.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={onGoBackToPlaces}
              className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#1A1A1A] flex items-center gap-1.5 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Mekan İfadelerine Dön</span>
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-red-50 text-[#E63946] border border-red-100 tracking-wider">
                マナーガイド (MANNER GUIDE)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              JAPONYA GÖRGÜ KURALLARI & SEYAHAT ADABI
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 max-w-3xl">
              Japonya'da yerel halkla saygılı, keyifli ve sorunsuz bir seyahat geçirmeniz için bilmeniz gereken en önemli 8 altın kural.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-red-50 border border-red-100 max-w-xs space-y-1">
            <div className="flex items-center gap-2 text-[#E63946] font-black text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Gezgin Güvencesi</span>
            </div>
            <p className="text-[11px] font-medium text-gray-600 leading-relaxed">
              Japonlar turistlerin küçük hatalarını hoş görür. Ancak bu kurallara uymanız size büyük bir sempati kazandıracaktır!
            </p>
          </div>
        </div>

        {/* Search and Category Filter Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({etiquetteRules.length})
            </button>
            <button
              onClick={() => setActiveCategory('money')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                activeCategory === 'money'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Para & Bahşiş
            </button>
            <button
              onClick={() => setActiveCategory('transport')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                activeCategory === 'transport'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tren & Ulaşım
            </button>
            <button
              onClick={() => setActiveCategory('food')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                activeCategory === 'food'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yemek & Restoran
            </button>
            <button
              onClick={() => setActiveCategory('onsen')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                activeCategory === 'onsen'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Onsen & Hamam
            </button>
          </div>

          {/* Quick In-page Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kural veya konu ara..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 focus:bg-white text-xs font-bold rounded-xl border border-gray-200 focus:border-[#E63946]/50 focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-2xs">
                    {rule.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${rule.badgeColor}`}>
                    {rule.badge}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-black text-[#1A1A1A] tracking-tight">
                {rule.title}
              </h2>

              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                {rule.description}
              </p>

              {/* Do's and Don'ts */}
              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    DOĞRU DAVRANIŞ (YAPILMASI GEREKENLER)
                  </span>
                  <ul className="text-xs text-emerald-950 font-medium space-y-1 pl-5 list-disc">
                    {rule.dos.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-red-50/70 border border-red-100/80 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    YANLIŞ DAVRANIŞ (KAÇINILMASI GEREKENLER)
                  </span>
                  <ul className="text-xs text-red-950 font-medium space-y-1 pl-5 list-disc">
                    {rule.donts.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Useful Japanese Phrase for this situation */}
            {rule.japanesePhrase && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/70 p-3 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    Bu Durumda Ne Denir?
                  </span>
                  <p className="text-sm font-black text-[#1A1A1A] font-['Noto_Sans_JP']">
                    {rule.japanesePhrase.text}
                  </p>
                  <p className="text-xs font-bold text-[#E63946]">
                    {rule.japanesePhrase.romaji} — <span className="text-gray-600 font-medium">{rule.japanesePhrase.meaning}</span>
                  </p>
                </div>
                <button
                  onClick={() => playJapaneseAudio(rule.japanesePhrase.text)}
                  className="p-2.5 rounded-xl bg-white hover:bg-red-50 text-[#E63946] border border-gray-200 shadow-2xs transition-colors shrink-0"
                  title="Seslendir"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
