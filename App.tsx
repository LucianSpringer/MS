
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, MapPin, Phone, Instagram, Search, Clock, CheckCircle, Star, User as UserIcon, RefreshCw, Crown } from 'lucide-react';
import FloatingButtons from './components/FloatingButtons';
import MenuSection from './components/MenuSection';
import PriceCalculator from './components/PriceCalculator';
import PromoPopup from './components/PromoPopup';
import Button from './components/Button';
import { MENU_ITEMS, TESTIMONIALS, BLOG_POSTS, FAQS, WHATSAPP_NUMBER } from './src/core/engine/MenuKnowledgeGraph';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomMenuBuilder from './pages/CustomMenuBuilder';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OrderTracking from './pages/OrderTracking';
import BlogPost from './pages/BlogPost';
import MealPlanner from './pages/MealPlanner';

// --- Header Component ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Theme Init
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Menu', href: '/#menu' },
    { name: 'Build Menu', href: '/custom-menu' },
    { name: 'Meal Planner', href: '/meal-planner' },
    { name: 'Lacak Order', href: '/tracking' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const elementId = href.substring(2);
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
    }
  };

  const handleQuickReorder = () => {
    if (user && user.orders.length > 0) {
      const lastOrder = user.orders[0];
      const text = `Halo Mpok Sari, saya ${user.name} (Member ${user.membershipTier}).\nSaya mau Repeat Order pesanan terakhir saya (${lastOrder.id}):\n"${lastOrder.items}"\nTotal: Rp ${lastOrder.total.toLocaleString('id-ID')}.\n\nMohon diproses untuk tanggal...`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      navigate('/custom-menu');
    }
  };

  // Determine if we should show the "Scrolled" style (Solid background)
  // Show solid background if scrolled OR if NOT on the home page
  const isHomePage = location.pathname === '/';
  const effectiveScrolled = isScrolled || !isHomePage;

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${effectiveScrolled
      ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md py-3 shadow-md border-b border-gray-200 dark:border-gray-800'
      : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <span className="text-white font-bold text-xl font-display">MS</span>
          </div>
          <span className={`font-display font-bold text-xl md:text-2xl ${effectiveScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
            Mpok Sari
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors hover:text-primary ${effectiveScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-200'}`}
            >
              {link.name}
            </button>
          ))}

          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${effectiveScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white' : 'text-white hover:bg-white/10'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.orders.length > 0 && (
                <button onClick={handleQuickReorder} className="hidden lg:flex items-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-green-200 transition-colors" title="Pesan Ulang Terakhir">
                  <RefreshCw size={14} /> Repeat Order
                </button>
              )}
              <Link to="/dashboard" className="flex items-center gap-2 pl-1 pr-4 py-1 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary transition-all group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-xs relative">
                  {user.name.charAt(0)}
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-0.5 rounded-full border border-white" title={user.membershipTier}>
                    <Crown size={8} fill="black" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold leading-none group-hover:text-primary ${effectiveScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>{user.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-medium leading-none mt-0.5 ${effectiveScrolled ? 'text-primary' : 'text-gray-300'}`}>{user.loyaltyPoints} Pts</span>
                </div>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="outline" className={!effectiveScrolled ? 'border-white text-white hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black' : ''}>
                Login
              </Button>
            </Link>
          )}

          {!user && (
            <Button size="sm" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
              Order WA
            </Button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className={`p-2 rounded-full ${effectiveScrolled ? 'text-gray-700 dark:text-white' : 'text-white'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={effectiveScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-darkSurface shadow-2xl p-6 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 md:hidden animate-fade-in-down">
          {navLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-left text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
            >
              {link.name}
            </button>
          ))}
          {user ? (
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-xs text-primary">{user.membershipTier} Member • {user.loyaltyPoints} Pts</div>
              </div>
            </Link>
          ) : (
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-primary py-2">
              Login / Register
            </Link>
          )}
          <Button fullWidth onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
            Order Sekarang
          </Button>
        </div>
      )}
    </header>
  );
};

// --- Footer Component ---
const Footer = () => (
  <footer className="bg-white dark:bg-black pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <span className="text-white font-bold text-xl font-display">MS</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              Mpok Sari
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            Catering rumahan premium dengan cita rasa otentik Indonesia. Melayani Nasi Kotak, Tumpeng, Prasmanan, dan Aqiqah untuk seluruh wilayah Jakarta & sekitarnya.
          </p>
          <div className="flex gap-4">
            <a href="#" className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"><Instagram size={20} /></a>
            <a href="#" className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"><Phone size={20} /></a>
            <a href="#" className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"><MapPin size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Menu Favorit</h4>
          <ul className="space-y-3 text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">Nasi Kotak Ayam Bakar</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Tumpeng Mini</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Paket Aqiqah</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Prasmanan Wedding</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Area Layanan</h4>
          <ul className="space-y-3 text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Jakarta Selatan</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Jakarta Pusat</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Jakarta Timur</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Depok & Tangerang</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Kontak Kami</h4>
          <ul className="space-y-4 text-gray-500 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="shrink-0 text-primary mt-1" size={20} />
              <span>Jl. Tebet Raya No. 12, Jakarta Selatan, 12810</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="shrink-0 text-primary" size={20} />
              <span>0812-3456-7890 (WhatsApp)</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="shrink-0 text-primary" size={20} />
              <span>Senin - Minggu: 06.00 - 20.00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} Mpok Sari Catering. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/tracking" className="hover:text-gray-900 dark:hover:text-white">Track Order</Link>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Home Page ---
const HomePage = () => {
  return (
    <>
      <PromoPopup />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like effect via fixed position logic or simple object-cover */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Indonesian Food Spread"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20">
          <div className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
            <span className="text-secondary font-semibold tracking-wide uppercase text-sm">✨ 100% Halal & Homemade</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
            Catering Rumahan Lezat <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Rasa Istimewa</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Solusi praktis untuk makan siang kantor, acara syukuran, aqiqah, dan ulang tahun. Dimasak dengan cinta, diantar hangat ke tempat Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Button size="lg" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
              Pesan Sekarang
            </Button>
            <Link to="/custom-menu">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black dark:text-white dark:border-white">
                Build Your Menu
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8 animate-fade-in-up delay-500">
            {[
              { label: 'Porsi Terjual', val: '12.4k+' },
              { label: 'Pelanggan Happy', val: '2.5k+' },
              { label: 'Menu Varian', val: '50+' },
              { label: 'Tahun Pengalaman', val: '8+' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 bg-white dark:bg-darkSurface border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {['HALAL MUI', 'HIGIENIS TERJAMIN', 'TANPA MSG', 'ON-TIME DELIVERY', 'FRESH INGREDIENTS'].map((badge) => (
            <div key={badge} className="flex items-center gap-2 font-bold text-gray-400 dark:text-gray-500">
              <CheckCircle size={20} className="text-primary" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </section>

      <MenuSection />

      {/* Calculator Section */}
      <section id="calculator" className="py-20 bg-gray-50 dark:bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Transparansi Harga</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-6">
              Hitung Budget Acara <br /> Tanpa Ribet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Gunakan kalkulator pintar kami untuk mendapatkan estimasi biaya catering acara Anda. Dapatkan diskon spesial untuk pemesanan dalam jumlah besar!
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Diskon 5% untuk pesanan > 100 porsi',
                'Diskon 10% untuk pesanan > 300 porsi',
                'Gratis Ongkir radius 5km',
                'Bonus buah potong segar'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400">
                    <CheckCircle size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <PriceCalculator />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 bg-white dark:bg-darkSurface">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-16">
            Apa Kata <span className="text-primary">Mereka?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(item => (
              <div key={item.id} className="bg-gray-50 dark:bg-black p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-left relative group hover:border-primary/50 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{item.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-orange-600 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-orange-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Siap Menikmati Hidangan Lezat?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Jangan biarkan tamu Anda kelaparan. Percayakan konsumsi acara Anda pada ahlinya.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
              Hubungi Kami via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">Blog & Tips</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2">
                Cerita Dapur
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(0, 3).map(post => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer block">
                <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[4/3] bg-gray-200 dark:bg-gray-800">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/blog/tips-menu-catering" className="inline-block text-primary font-medium hover:text-orange-600 border-b border-primary pb-0.5">
              Lihat Artikel Lainnya →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-darkSurface">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 dark:text-white mb-12">Sering Ditanyakan</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-gray-50 dark:bg-black/50">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// --- App Layout ---
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/custom-menu" element={<CustomMenuBuilder />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tracking" element={<OrderTracking />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />

          {/* Floating Buttons handles both Bottom-Right (WA/Scroll) and Bottom-Left (Phone) */}
          <FloatingButtons />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
