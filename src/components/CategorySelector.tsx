import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  Tag, 
  Train, 
  Building, 
  Coffee, 
  Compass, 
  Camera, 
  ShieldAlert 
} from 'lucide-react';
import { LOCATION_CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';

interface CategorySelectorProps {
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  phraseCounts: Record<CategoryId, number>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  phraseCounts,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5" />;
      case 'Tag':
        return <Tag className="w-5 h-5" />;
      case 'Train':
        return <Train className="w-5 h-5" />;
      case 'Building':
        return <Building className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 bg-[#E63946] rounded-full" />
          <h2 className="text-xs font-black text-[#1A1A1A] tracking-widest uppercase">
            Neredesiniz? Mekan Seçin
          </h2>
        </div>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {LOCATION_CATEGORIES.length} Kategori
        </span>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {LOCATION_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = phraseCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`place-select-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-[#E63946] text-white border-[#E63946] shadow-xl shadow-red-200/60 scale-[1.02]'
                  : 'bg-white hover:bg-gray-50/80 border-[#EEEEEE] text-[#1A1A1A] hover:border-gray-300 shadow-2xs'
              }`}
            >
              {/* Top Row: Icon & Count */}
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-gray-100 text-[#1A1A1A] group-hover:scale-105'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </div>

              {/* Bottom: Title & Japanese Name */}
              <div>
                <h3
                  className={`text-sm font-black leading-tight tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                >
                  {cat.name}
                </h3>
                <p
                  className={`text-[11px] font-bold font-['Noto_Sans_JP'] truncate mt-0.5 ${
                    isSelected ? 'text-white/80' : 'text-gray-400'
                  }`}
                >
                  {cat.japaneseName}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
