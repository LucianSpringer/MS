
import React, { useState, useEffect } from 'react';
import { X, Gift, Clock } from 'lucide-react';
import Button from './Button';
import { WHATSAPP_NUMBER, PROMO_DATA } from '../constants';

const PromoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 1. Check if promo is active and in the future
    const now = new Date();
    const endTime = new Date(PROMO_DATA.endTime);

    if (!PROMO_DATA.isActive || now >= endTime) {
      return; // Do not show if expired or inactive
    }

    // 2. Check localStorage (show once per user session/browser)
    const hasSeen = localStorage.getItem('hasSeenPromo');
    if (hasSeen) {
      return; 
    }

    // 3. Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // 4. Countdown Logic
    const countdownInterval = setInterval(() => {
      const currentTime = new Date();
      const difference = endTime.getTime() - currentTime.getTime();

      if (difference <= 0) {
        clearInterval(countdownInterval);
        setIsVisible(false); // Hide if time runs out while open
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenPromo', 'true');
  };

  const claimPromo = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Mpok%20Sari,%20saya%20mau%20klaim%20promo%20${PROMO_DATA.code}%20(${PROMO_DATA.discountPercent}%25)!`, '_blank');
    closePopup();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
      <div className="relative bg-white dark:bg-darkSurface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/20">
        
        {/* Header Image Pattern */}
        <div className="h-32 bg-gradient-to-r from-red-600 to-orange-600 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-20"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <Gift size={56} className="text-white relative z-10 animate-bounce" />
            <button onClick={closePopup} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-1">
                <X size={20} />
            </button>
        </div>

        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Clock size={14} /> Berakhir Dalam
          </div>
          
          <div className="flex justify-center gap-4 mb-6 font-mono text-gray-800 dark:text-white">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-16">
              <span className="block text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs text-gray-500">Jam</span>
            </div>
            <div className="self-center font-bold">:</div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-16">
              <span className="block text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs text-gray-500">Mnt</span>
            </div>
            <div className="self-center font-bold">:</div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-16">
              <span className="block text-2xl font-bold text-red-500">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs text-gray-500">Dtk</span>
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {PROMO_DATA.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            {PROMO_DATA.description} <br/>
            Kode: <span className="font-bold font-mono bg-gray-100 dark:bg-gray-700 px-2 rounded">{PROMO_DATA.code}</span>
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={claimPromo} fullWidth className="bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-red-500/30">
              Ambil Diskon Sekarang
            </Button>
            <button onClick={closePopup} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              Lewati tawaran ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
