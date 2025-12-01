import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ChevronUp } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const FloatingButtons: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Mpok%20Sari,%20saya%20mau%20tanya%20tentang%20catering...`, '_blank');
  };

  return (
    <>
      {/* Bottom Right Group: WhatsApp & Scroll Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        {showScroll && (
          <button 
            onClick={scrollToTop}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all opacity-80 hover:opacity-100"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </button>
        )}

        <div className="group relative flex items-center">
          <span className="absolute right-full mr-3 bg-white dark:bg-darkSurface text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
            Konsultasi Gratis
          </span>
          <button 
            onClick={openWhatsApp}
            className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce-slow"
            aria-label="Chat WhatsApp"
          >
            <MessageCircle size={32} />
          </button>
        </div>
      </div>

      {/* Bottom Left: Phone Call Button */}
      <a 
        href={`tel:${WHATSAPP_NUMBER}`}
        className="fixed bottom-6 left-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
        aria-label="Call Now"
      >
        <Phone size={28} />
      </a>
    </>
  );
};

export default FloatingButtons;