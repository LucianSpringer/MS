
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CUSTOM_MENU_ITEMS, WHATSAPP_NUMBER } from '../constants';
import { CustomMenuCategory, CustomMenuItem } from '../types';
import Button from '../components/Button';
import { Plus, Minus, Check, ShoppingBag, Utensils, Loader2, AlertCircle, TrendingDown, Trash2, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES: CustomMenuCategory[] = ['Karbo', 'Ayam', 'Daging', 'Seafood', 'Sayur', 'Pendamping', 'Dessert', 'Minuman'];

const CustomMenuBuilder: React.FC = () => {
  const { user, addOrder } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomMenuCategory>('Karbo');
  
  // State for items: { itemId: quantity }
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  
  // Pax State & Validation
  const [pax, setPax] = useState<number>(50);
  const [paxError, setPaxError] = useState<string>('');
  
  // API Fetch State
  const [menuItems, setMenuItems] = useState<CustomMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UX State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Items using API with fallback
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('custom-menu-items.json');
        if (!response.ok) {
           throw new Error('API not available');
        }
        const data = await response.json();
        setMenuItems(data); 
      } catch (error) {
        console.warn("Using fallback data");
        await new Promise(resolve => setTimeout(resolve, 600)); // Smooth loading simulation
        setMenuItems(CUSTOM_MENU_ITEMS); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // --- Scroll to top on category change ---
  useEffect(() => {
    const gridElement = document.getElementById('menu-grid-start');
    if (gridElement) {
       // Optional: smooth scroll to anchor
       // gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  // --- Toast Timer ---
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- Logic: Calculations ---

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(c => counts[c] = 0);
    menuItems.forEach(i => { 
        if(counts[i.category] !== undefined) counts[i.category]++;
    });
    return counts;
  }, [menuItems]);

  const handlePaxChange = (val: number) => {
    setPax(val);
    if (val < 10) {
      setPaxError('Min. order 10 pax');
    } else if (val > 1000) {
      setPaxError('Max. order 1000 pax (Hubungi Admin)');
    } else {
      setPaxError('');
    }
  };

  const { pricePerPax, rawTotal, discountAmount, discountLabel, finalTotal } = useMemo(() => {
    let baseItemsTotal = 0;
    const baseOperationalFee = 2500; // Packaging, cutlery, napkin per pax
    
    Object.entries(selectedItems).forEach(([itemId, qty]) => {
      const item = menuItems.find(i => i.id === itemId);
      if (item) {
        baseItemsTotal += item.price * Number(qty);
      }
    });

    const singlePaxCost = baseItemsTotal + baseOperationalFee;
    const total = singlePaxCost * pax;
    
    // Tiered Discount Logic
    let discount = 0;
    let label = '';

    if (pax >= 500) {
      discount = total * 0.10;
      label = 'Diskon Big Event (10%)';
    } else if (pax >= 100) {
      discount = total * 0.05;
      label = 'Diskon Volume (5%)';
    }

    return {
      pricePerPax: singlePaxCost,
      rawTotal: total,
      discountAmount: discount,
      discountLabel: label,
      finalTotal: total - discount
    };
  }, [selectedItems, menuItems, pax]);

  // --- Logic: Item Manipulation ---

  const showToast = (msg: string) => setToastMessage(msg);

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const nextVal = current + delta;
      
      const min = item.minQty || 1;
      const max = item.maxQty || 999;

      // Case: Removal by decrementing to 0 or below
      if (nextVal <= 0) {
        const nextState = { ...prev };
        delete nextState[itemId];
        showToast(`${item.name} dihapus dari paket`);
        return nextState;
      }

      // Case: Enforce Min Qty on Add (first time add)
      if (current === 0 && nextVal < min) {
          showToast(`${item.name} ditambahkan (Min. ${min})`);
          return { ...prev, [itemId]: min };
      }

      // Case: Enforce Min Qty on Decrease
      if (nextVal < min) {
          // If user decreases below min, assume they want to remove it
          if (current === min && delta < 0) {
              const nextState = { ...prev };
              delete nextState[itemId];
              showToast(`${item.name} dihapus`);
              return nextState;
          }
          // Otherwise snap to min (fallback)
          showToast(`Minimal order untuk ${item.name} adalah ${min}`);
          return { ...prev, [itemId]: min };
      }

      // Case: Max Limit
      if (nextVal > max) {
          showToast(`Maksimal ${max} untuk ${item.name}`);
          return prev; 
      }

      showToast(`${item.name} diupdate: ${nextVal}`);
      return { ...prev, [itemId]: nextVal };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    setSelectedItems(prev => {
      const nextState = { ...prev };
      delete nextState[itemId];
      return nextState;
    });
    showToast(`${item.name} dihapus dari paket`);
  };

  const handleClearAll = () => {
    if (Object.keys(selectedItems).length === 0) return;
    if (window.confirm("Yakin ingin menghapus semua pesanan?")) {
        setSelectedItems({});
        showToast("Semua pesanan dihapus");
    }
  };

  const handleCheckout = () => {
    if (Object.keys(selectedItems).length === 0) {
      showToast("Silakan pilih menu terlebih dahulu!");
      return;
    }
    if (paxError) {
      showToast("Mohon perbaiki jumlah pax terlebih dahulu.");
      return;
    }

    const itemsList = Object.entries(selectedItems).map(([itemId, qty]) => {
      const item = menuItems.find(i => i.id === itemId);
      return item ? `${item.name} (${qty}x)` : '';
    }).filter(Boolean).join(', ');

    const orderSummary = `
*ORDER CUSTOM MENU*
------------------
Pax: ${pax} orang
Menu:
${Object.entries(selectedItems).map(([itemId, qty]) => {
  const item = menuItems.find(i => i.id === itemId);
  return `- ${item?.name} x${qty}`;
}).join('\n')}

Harga dasar/pax: Rp ${pricePerPax.toLocaleString('id-ID')}
${discountAmount > 0 ? `Diskon: -Rp ${discountAmount.toLocaleString('id-ID')} (${discountLabel})` : ''}
*Total Akhir: Rp ${finalTotal.toLocaleString('id-ID')}*
    `.trim();

    if (user) {
      const now = new Date();
      addOrder({
        id: `ORD-${Date.now()}`,
        date: now.toISOString(),
        items: `Custom Menu (${itemsList.substring(0, 40)}...)`,
        total: finalTotal,
        status: 'Pending',
        pax: pax,
        timeline: { 'Pending': now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) }
      });
    }

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Halo Mpok Sari, saya mau pesan menu custom:\n\n${orderSummary}\n\nApakah tanggal ini tersedia?`
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Build Your Own <span className="text-primary">Menu</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Kreasikan paket catering sesuai selera dan budget. <br/>
            <span className="text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium mt-2 inline-block">
              Diskon 5% untuk pesanan di atas 100 pax!
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Menu Selection */}
          <div className="flex-1 w-full" id="menu-grid-start">
            {/* Filter Tabs */}
            <div className="sticky top-20 z-20 bg-gray-50/95 dark:bg-black/95 backdrop-blur-sm py-4 mb-4">
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`relative px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all text-sm md:text-base border flex items-center gap-2 ${
                      activeTab === cat 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-white dark:bg-darkSurface border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                    }`}
                  >
                    {cat}
                    {categoryCounts[cat] > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === cat ? 'bg-white text-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                            {categoryCounts[cat]}
                        </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Items */}
            {isLoading ? (
               <div className="flex justify-center items-center py-32 bg-white dark:bg-darkSurface rounded-3xl border border-gray-100 dark:border-gray-800">
                 <Loader2 className="animate-spin text-primary mr-3" size={32} />
                 <span className="text-gray-500 font-medium">Mengambil data menu...</span>
               </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6" ref={gridContainerRef}>
                {menuItems.filter(item => item.category === activeTab).map(item => {
                  const qty = selectedItems[item.id] || 0;
                  const isSelected = qty > 0;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`group relative bg-white dark:bg-darkSurface rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                        isSelected 
                          ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary' 
                          : 'border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Overlay Badge if Selected */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-fade-in-up">
                             <Check size={12} strokeWidth={3} /> {qty}x
                          </div>
                        )}
                        
                        {(item.minQty || item.maxQty) && (
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                <Info size={10} /> {item.minQty ? `Min ${item.minQty}` : ''} {item.maxQty ? `Max ${item.maxQty}` : ''}
                            </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-auto">
                          <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">{item.name}</h4>
                          <p className="text-primary font-bold text-lg">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        
                        {/* Direct Qty Controls */}
                        {isSelected ? (
                             <div className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-white shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-gray-900 dark:text-white">{qty}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-orange-600 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                             </div>
                        ) : (
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                Pilih Menu <Plus size={16} />
                              </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-darkSurface p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 z-10 transition-all duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Utensils size={24} />
                    </div>
                    <div>
                    <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">Estimasi</h3>
                    </div>
                </div>
                {Object.keys(selectedItems).length > 0 && (
                    <button 
                        onClick={handleClearAll}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                        <Trash2 size={14} /> Clear All
                    </button>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {Object.keys(selectedItems).length === 0 ? (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Menu pilihanmu akan muncul di sini.</p>
                  </div>
                ) : (
                  <>
                    {Object.entries(selectedItems).map(([itemId, qty]) => {
                      const item = menuItems.find(i => i.id === itemId);
                      return item ? (
                        <div key={itemId} className="flex justify-between items-center p-3 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                          <div className="flex-1 pr-3">
                            <div className="font-bold text-gray-800 dark:text-white line-clamp-1">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                               <span>Rp {item.price.toLocaleString('id-ID')}</span>
                               {item.minQty && qty === item.minQty && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">Min Qty</span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 h-8">
                                  <button 
                                    onClick={() => handleUpdateQuantity(itemId, -1)} 
                                    className="w-7 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 active:scale-90 transition-transform"
                                    aria-label="Decrease"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="font-bold text-gray-900 dark:text-white w-8 text-center text-sm select-none">{qty}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(itemId, 1)} 
                                    className="w-7 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-500 active:scale-90 transition-transform"
                                    aria-label="Increase"
                                  >
                                    <Plus size={14} />
                                  </button>
                              </div>
                              <button 
                                onClick={() => handleRemoveItem(itemId)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                aria-label="Remove item"
                              >
                                 <Trash2 size={16} />
                              </button>
                          </div>
                        </div>
                      ) : null;
                    })}
                     <div className="flex justify-between text-sm text-gray-500 px-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                        <span>Packaging & Alat Makan</span>
                        <span>Rp 2.500</span>
                      </div>
                  </>
                )}
              </div>

              {/* Total Calculation Area */}
              <div className="bg-gray-50 dark:bg-black/30 rounded-2xl p-5">
                {/* Pax Input */}
                <div className="mb-4">
                   <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Jumlah Pesanan (Pax)</label>
                      {paxError && <span className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {paxError}</span>}
                   </div>
                   <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 border-2 transition-all ${paxError ? 'border-red-400' : 'border-transparent focus-within:border-primary'}`}>
                     <button onClick={() => handlePaxChange(pax - 10)} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center text-gray-600 dark:text-white transition-colors" disabled={pax <= 10}>
                       <Minus size={18} />
                     </button>
                     <input 
                        type="number" 
                        value={pax} 
                        onChange={(e) => handlePaxChange(Number(e.target.value))}
                        className="flex-1 text-center bg-transparent font-bold text-xl text-gray-900 dark:text-white outline-none"
                     />
                     <button onClick={() => handlePaxChange(pax + 10)} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center text-gray-600 dark:text-white transition-colors">
                       <Plus size={18} />
                     </button>
                   </div>
                </div>

                <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500">Harga per pax</span>
                       <span className="font-bold text-gray-900 dark:text-white">Rp {pricePerPax.toLocaleString('id-ID')}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                         <span className="flex items-center gap-1"><TrendingDown size={14} /> {discountLabel}</span>
                         <span className="font-bold">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-end mt-4 pt-2">
                       <span className="text-gray-600 dark:text-gray-400 font-medium">Total Estimasi</span>
                       <div className="text-right">
                         <span className="block text-2xl font-bold text-primary">Rp {finalTotal.toLocaleString('id-ID')}</span>
                         {discountAmount > 0 && <span className="text-xs text-gray-400 line-through">Rp {rawTotal.toLocaleString('id-ID')}</span>}
                       </div>
                    </div>
                </div>
              </div>

              <Button fullWidth onClick={handleCheckout} className="mt-6 h-14 text-lg shadow-xl shadow-primary/20" disabled={!!paxError}>
                Pesan via WhatsApp
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4">
                Harga belum termasuk ongkir. Konsultasi gratis tersedia.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
            <div className="bg-gray-900 text-white dark:bg-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium border border-gray-800 dark:border-gray-200">
                <Check size={18} className="text-green-500" strokeWidth={3} />
                {toastMessage}
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomMenuBuilder;
