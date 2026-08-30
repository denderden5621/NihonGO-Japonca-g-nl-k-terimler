import React from 'react';
import { 
  X, 
  BookOpen, 
  DollarSign, 
  CreditCard, 
  Trash2, 
  Smartphone, 
  Footprints, 
  Bath, 
  UtensilsCrossed, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface EtiquetteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EtiquetteGuideModal: React.FC<EtiquetteGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const etiquetteList = [
    {
      icon: <DollarSign className="w-5 h-5 text-rose-600" />,
      title: '1. Bahşiş (Tip) Asla Bırakmayın!',
      tag: 'En Önemli Kural',
      tagColor: 'bg-rose-100 text-rose-800',
      description:
        'Japonya\'da bahşiş kültürü kesinlikle yoktur ve hatta hakaret olarak algılanabilir. Fatura neyse tam tutarı ödeyin. Masada para bırakırsanız garson arkanızdan paranızı düşürdünüz diyerek sokakta koşabilir!',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      title: '2. Para ve Kart Tepsisi (Tsurisen Tray)',
      tag: 'Ödeme Adabı',
      tagColor: 'bg-emerald-100 text-emerald-800',
      description:
        'Konbini, restoran veya mağazalarda nakit para veya kredi kartını doğrudan kasiyerin eline uzatmayın. Kasanın önündeki küçük plastik/metal tepsiye koyun. Para üstü de aynı tepside iki elle size teslim edilir.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-600" />,
      title: '3. Tren & Metroda Sessizlik (Manner Mode)',
      tag: 'Toplu Taşıma',
      tagColor: 'bg-sky-100 text-sky-800',
      description:
        'Toplu taşımada telefonla sesli konuşmak kesinlikle yasaktır ve kaba sayılır. Telefonunuzu sessize alın. Arkadaşlarınızla konuşurken fısıltı seviyesinde konuşun. Kulaklıkla müzik dinlerken sesin dışarı taşmamasına özen gösterin.',
    },
    {
      icon: <Trash2 className="w-5 h-5 text-amber-600" />,
      title: '4. Sokakta Çöp Kutusu Yoktur (Çöpünüzü Yanınızda Taşıyın)',
      tag: 'Temizlik Kültürü',
      tagColor: 'bg-amber-100 text-amber-800',
      description:
        'Tokyo ve diğer şehirlerde sokakta çöp kutusu bulamazsınız. Herkes çöpünü küçük bir poşette gün boyu çantasında taşır ve otele dönünce atar. Çöp kutuları çoğunlukla sadece konbini marketlerin önünde ve otomatların yanında (sadece teneke/şişe için) bulunur.',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-indigo-600" />,
      title: '5. Yemek Çubuğu (Hashi) Tabuları',
      tag: 'Restoran Adabı',
      tagColor: 'bg-indigo-100 text-indigo-800',
      description:
        'Çubukları asla pirinç kasesine dik batırarak bırakmayın (bu Budist cenaze ritüelidir). Yiyeceği çubuktan çubuğa aktarmayın. Tabağı çubukla kendinize doğru çekmeyin. Kullanmadığınızda çubuk altlığına (hashioki) yatay koyun.',
    },
    {
      icon: <Footprints className="w-5 h-5 text-purple-600" />,
      title: '6. Ayakkabı Çıkarma (Genkan)',
      tag: 'Mekan Kuralları',
      tagColor: 'bg-purple-100 text-purple-800',
      description:
        'Evlere, Ryokanlara, geleneksel restoranlara, tapınakların iç kısımlarına ve mağazalardaki deneme kabinlerine girerken ayakkabınızı çıkartın. Çıkarılan ayakkabının burnunu kapıya doğru çevirin. Tatami hasırlarına asla terlikle basmayın.',
    },
    {
      icon: <Bath className="w-5 h-5 text-teal-600" />,
      title: '7. Kaplıca & Onsen Kuralları',
      tag: 'Onsen & Hamam',
      tagColor: 'bg-teal-100 text-teal-800',
      description:
        'Sıcak kaplıca suyuna girmeden önce mutlaka oturaklı yıkama alanında vücudunuzu tamamen sabunlayıp durulayın. Suya mayo ile girilmez; çıplak girilir. Küçük havlunuzu asla sıcak suyun içine sokmayın, başınızın üzerine koyun.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      title: '8. Yürürken Yiyip İçmeme (Aruki-gui)',
      tag: 'Sokak Adabı',
      tagColor: 'bg-yellow-100 text-yellow-800',
      description:
        'Japonya\'da sokakta yürürken yiyecek yemek veya içecek içmek hoş görülmez. Otomat veya konbini önünde durarak tüketin ya da bir park bankında oturun.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="etiquette-guide-modal"
        className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">
                JAPONYA GÖRGÜ KURALLARI
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Rahat ve saygılı bir seyahat için altın kurallar
              </p>
            </div>
          </div>
          <button
            id="close-etiquette-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-950 flex items-start gap-3 font-medium">
            <ShieldCheck className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-black text-[#E63946]">Gezgin Notu:</strong> Japon halkı yabancı turistlere karşı son derece hoşgörülüdür. 
              Bu kurallara dikkat etmeniz ve temel teşekkür ifadelerini (<strong className="font-black">Arigatou gozaimasu</strong>) kullanmanız 
              size inanılmaz bir sempati ve güler yüz kazandıracaktır!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {etiquetteList.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white shadow-2xs border border-gray-100">
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-[#1A1A1A] tracking-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400 font-bold">
            🎌 İyi Yolculuklar & Yoi Tabi o! (良い旅を！)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
