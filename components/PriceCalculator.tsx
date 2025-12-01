import React, { useState } from 'react';
import { MENU_ITEMS, WHATSAPP_NUMBER } from '../constants';
import Button from './Button';
import { Calculator } from 'lucide-react';

const PriceCalculator: React.FC = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<number>(MENU_ITEMS[0].id);
  const [pax, setPax] = useState<number>(50);

  const selectedItem = MENU_ITEMS.find(item => item.id === selectedMenuId) || MENU_ITEMS[0];
  
  // Logic: Discount 5% if > 100 pax, 10% if > 300 pax
  const calculateTotal = () => {
    const baseTotal = selectedItem.price * pax;
    let discount = 0;
    if (pax >= 300) discount = baseTotal * 0.10;
    else if (pax >= 100) discount = baseTotal * 0.05;
    
    return {
      total: baseTotal - discount,
      discount: discount,
      perPax: (baseTotal - discount) / pax
    };
  };

  const { total, discount, perPax } = calculateTotal();

  const handleOrder = () => {
    const text = `Halo Mpok Sari, saya mau estimasi order:\nMenu: ${selectedItem.name}\nJumlah: ${pax} pax\nEstimasi Total: Rp ${total.toLocaleString('id-ID')}\n\nApakah tanggal ini tersedia?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-darkSurface p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <Calculator size={24} />
        </div>
        <h3 className="text-2xl font-bold font-display text-gray-800 dark:text-white">Hitung Budget Catering</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Menu / Paket</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
            value={selectedMenuId}
            onChange={(e) => setSelectedMenuId(Number(e.target.value))}
          >
            {MENU_ITEMS.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} - Rp {item.price.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah Porsi (Pax)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min={selectedItem.minOrder || 10} 
              max="1000" 
              step="10"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input 
              type="number" 
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-center dark:text-white font-semibold"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimal order: {selectedItem.minOrder} pax</p>
        </div>

        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-6 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">Harga per porsi (Est)</span>
            <span className="font-medium dark:text-gray-200">Rp {Math.round(perPax).toLocaleString('id-ID')}</span>
          </div>
          {discount > 0 && (
             <div className="flex justify-between items-center mb-2 text-green-600">
             <span className="text-sm">Diskon Volume</span>
             <span className="font-medium">- Rp {discount.toLocaleString('id-ID')}</span>
           </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-gray-800 dark:text-white">Total Estimasi</span>
            <span className="text-2xl font-bold text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <Button fullWidth onClick={handleOrder} className="mt-4">
          Pesan Sekarang via WA
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculator;