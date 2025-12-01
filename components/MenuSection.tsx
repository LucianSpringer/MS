
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { Category } from '../types';
import Button from './Button';
import { Star, ShoppingBag } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const CATEGORIES: Category[] = ['All', 'Nasi Kotak', 'Tumpeng', 'Prasmanan', 'Wedding', 'Aqiqah', 'Snack Box', 'Kue', 'Syukuran'];

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleOrder = (itemName: string) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Halo,%20saya%20tertarik%20pesan%20${encodeURIComponent(itemName)}`, '_blank');
  };

  return (
    <section id="menu" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">Pilihan Menu Lezat</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-6">
          Menu Favorit <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Pelanggan</span>
        </h2>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="group bg-white dark:bg-darkSurface rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {item.popular && (
                <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Best Seller
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{item.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <span className="text-xs text-gray-400 block">Mulai dari</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Rp {item.price.toLocaleString('id-ID')}</span>
                  {item.pricingType === 'pax' && <span className="text-xs text-gray-500"> /pax</span>}
                </div>
                <button 
                  onClick={() => handleOrder(item.name)}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black p-3 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-colors shadow-lg"
                  aria-label="Order"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
