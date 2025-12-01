
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Package, MapPin, LogOut, Plus, Trash2, Award, Gift, Filter, Calendar, 
  Crown, RefreshCw, Briefcase, FileText, Upload, Heart, Zap, Lock, ChevronRight, Clock
} from 'lucide-react';
import Button from '../components/Button';
import { Address, Order } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const Dashboard: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'corporate' | 'family' | 'saved' | 'addresses'>('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Filtering State
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All Time');

  // Address Form State
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRepeatOrder = (order: Order) => {
    const text = `Halo Mpok Sari, saya ${user.name} (Member ${user.membershipTier}).\nSaya mau Repeat Order:\n"${order.items}"\nTotal: Rp ${order.total.toLocaleString('id-ID')}.\n\nMohon diproses segera.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleClaimReward = () => {
     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Mpok%20Sari,%20saya%20mau%20klaim%20reward%20poin%20(${user.loyaltyPoints}%20pts)!`, '_blank');
  };

  const handlePromoDetail = () => {
     const text = `Halo Mpok Sari, saya ${user.name} (Member ${user.membershipTier}).\nSaya ingin menanyakan detail promo Flash Sale Besok (Diskon 30% Aqiqah).`;
     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadInvoice = () => {
    alert("Invoice PDF sedang diunduh...");
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    let orders = user.orders;
    if (statusFilter !== 'All') {
      orders = orders.filter(o => o.status === statusFilter);
    }
    if (dateFilter !== 'All Time') {
       const now = new Date();
       now.setHours(0,0,0,0);
       const oneMonthAgo = new Date(now);
       oneMonthAgo.setMonth(now.getMonth() - 1);
       const threeMonthsAgo = new Date(now);
       threeMonthsAgo.setMonth(now.getMonth() - 3);

       orders = orders.filter(o => {
          const orderDate = new Date(o.date); 
          if (isNaN(orderDate.getTime())) return true; 
          if (dateFilter === 'Last Month') return orderDate >= oneMonthAgo;
          else if (dateFilter === 'Last 3 Months') return orderDate >= threeMonthsAgo;
          return true;
       });
    }
    return orders;
  }, [user.orders, statusFilter, dateFilter]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* TOP HERO: Membership Card & Flash Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Membership Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-gray-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 p-1">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <Crown size={12} fill="currentColor" /> {user.membershipTier} Member
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">Member since {user.joinedDate}</p>
                        </div>
                    </div>
                    <div className="text-left md:text-right bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 w-full md:w-auto">
                        <p className="text-sm text-gray-400 mb-1">Loyalty Points</p>
                        <p className="text-3xl font-bold text-primary">{user.loyaltyPoints} <span className="text-sm text-white">pts</span></p>
                        <p className="text-xs text-gray-500 mt-1">100 pts = Free Nasi Kotak</p>
                    </div>
                </div>
                
                {/* Quick Action: Repeat Order */}
                {user.orders.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Last Order</p>
                            <p className="font-medium truncate max-w-xs">{user.orders[0].items}</p>
                        </div>
                        <button 
                            onClick={() => handleRepeatOrder(user.orders[0])}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/50"
                        >
                            <RefreshCw size={16} /> Pesan Ulang (1-Click)
                        </button>
                    </div>
                )}
            </div>

            {/* Early Access Flash Sale */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-lg">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
                <div className="relative z-10">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block backdrop-blur-sm">
                        <Zap size={12} className="inline mr-1" fill="currentColor"/> EARLY ACCESS
                    </span>
                    <h3 className="text-2xl font-bold mb-2">Flash Sale Besok!</h3>
                    <p className="text-white/90 text-sm mb-6">Diskon 30% khusus Gold Member untuk booking paket Aqiqah bulan depan.</p>
                    <button 
                        onClick={handlePromoDetail}
                        className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold text-sm w-full hover:bg-gray-50 transition-colors"
                    >
                        Lihat Detail Promo
                    </button>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-64 flex-shrink-0 space-y-2">
            {[
                { id: 'orders', label: 'Riwayat & Langganan', icon: Package },
                { id: 'loyalty', label: 'Loyalty Points', icon: Award },
                { id: 'corporate', label: 'Corporate Dashboard', icon: Briefcase },
                { id: 'family', label: 'Family & Birthday', icon: Heart },
                { id: 'saved', label: 'Saved Menus', icon: FileText },
                { id: 'addresses', label: 'Alamat Tersimpan', icon: MapPin },
            ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all font-medium text-sm ${
                        activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-white dark:bg-darkSurface text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors">
                    <LogOut size={18} /> Logout
                </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-[500px]">
            
            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Riwayat Pesanan</h3>
                  {/* Filters UI */}
                  <div className="flex gap-2">
                     <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-9 pr-4 py-2 bg-white dark:bg-darkSurface border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none dark:text-white">
                           <option value="All">Semua Status</option>
                           <option value="Pending">Pending</option>
                           <option value="Diproses">Diproses</option>
                           <option value="Diantar">Diantar</option>
                           <option value="Selesai">Selesai</option>
                        </select>
                        <Filter size={14} className="absolute left-3 top-3 text-gray-400" />
                     </div>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                   <div className="text-center py-12 bg-white dark:bg-darkSurface rounded-3xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">Belum ada pesanan.</p>
                     <Button className="mt-4" onClick={() => navigate('/custom-menu')}>Buat Pesanan Baru</Button>
                   </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-darkSurface p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">Order #{order.id}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                            </div>
                            <span className="font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl mb-4 text-sm text-gray-700 dark:text-gray-300">
                            {order.items}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/tracking')} className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Lacak Order</button>
                            <button onClick={() => handleRepeatOrder(order)} className="flex-1 bg-primary text-white py-2 rounded-lg font-medium text-sm hover:bg-orange-600 flex items-center justify-center gap-2">
                                <RefreshCw size={14} /> Pesan Lagi
                            </button>
                        </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- LOYALTY TAB --- */}
            {activeTab === 'loyalty' && (
              <div className="bg-white dark:bg-darkSurface p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                 <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift size={48} className="text-primary" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Rewards</h3>
                 <p className="text-gray-500 mb-8">Setiap pembelian Rp 100.000 mendapatkan 1 Poin.</p>
                 
                 <div className="max-w-md mx-auto bg-gray-900 text-white rounded-2xl p-6 mb-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                     <p className="text-sm text-gray-400 mb-1">Total Poin Aktif</p>
                     <p className="text-5xl font-bold text-yellow-400 mb-4">{user.loyaltyPoints}</p>
                     <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${Math.min(user.loyaltyPoints, 100)}%` }}></div>
                     </div>
                     <p className="text-xs text-right text-gray-400">{100 - (user.loyaltyPoints % 100)} poin lagi untuk reward berikutnya</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                     {[
                         { pts: 50, reward: 'Voucher Potongan 50rb', color: 'bg-blue-100 text-blue-700' },
                         { pts: 100, reward: 'Gratis 5 Box Nasi Ayam', color: 'bg-green-100 text-green-700' },
                         { pts: 250, reward: 'Gratis Tumpeng Mini', color: 'bg-purple-100 text-purple-700' },
                         { pts: 500, reward: 'Voucher Belanja 1 Juta', color: 'bg-orange-100 text-orange-700' },
                     ].map((r, i) => (
                         <div key={i} className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center ${user.loyaltyPoints >= r.pts ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                             <div>
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded mb-1 inline-block ${r.color}`}>{r.pts} Pts</span>
                                 <p className="font-bold text-gray-900 dark:text-white text-sm">{r.reward}</p>
                             </div>
                             {user.loyaltyPoints >= r.pts ? (
                                 <button onClick={handleClaimReward} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg">Klaim</button>
                             ) : (
                                 <Lock size={16} className="text-gray-400" />
                             )}
                         </div>
                     ))}
                 </div>
              </div>
            )}

            {/* --- CORPORATE DASHBOARD --- */}
            {activeTab === 'corporate' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl text-blue-600 dark:text-blue-300">
                            <Briefcase size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Corporate Dashboard</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Kelola pesanan kantor, download invoice, dan atur logo perusahaan untuk stiker box katering Anda.</p>
                            <div className="flex flex-wrap gap-3">
                                <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50">
                                    <Upload size={14} /> Upload Logo PT
                                </button>
                                <button onClick={handleDownloadInvoice} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700">
                                    <FileText size={14} /> Download Rekap Bulanan
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Invoice & Faktur</h4>
                            <ul className="space-y-3">
                                {[
                                    { id: 'INV/2023/10/001', date: '20 Okt 2023', amount: '2.500.000' },
                                    { id: 'INV/2023/09/045', date: '15 Sep 2023', amount: '4.200.000' },
                                ].map((inv, i) => (
                                    <li key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-white">{inv.id}</p>
                                            <p className="text-xs text-gray-500">{inv.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-800 dark:text-white">Rp {inv.amount}</p>
                                            <button onClick={handleDownloadInvoice} className="text-xs text-primary hover:underline">Download PDF</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                             <h4 className="font-bold text-gray-900 dark:text-white mb-4">Pengaturan Perusahaan</h4>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Nama Perusahaan</label>
                                    <input type="text" value={user.companyName} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm mt-1 dark:text-white" readOnly />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">NPWP</label>
                                    <input type="text" value="09.123.456.7-000.000" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm mt-1 dark:text-white" readOnly />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SAVED MENUS --- */}
            {activeTab === 'saved' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Saved Menu Configurations</h3>
                    {user.savedMenus && user.savedMenus.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.savedMenus.map(menu => (
                                <div key={menu.id} className="bg-white dark:bg-darkSurface p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                                            <Package size={20} />
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary">{menu.name}</h4>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{menu.itemsSummary}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-bold text-gray-900 dark:text-white">Est. Rp {menu.totalPrice.toLocaleString('id-ID')}</span>
                                        <button className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Order Now</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => navigate('/custom-menu')} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-gray-400 hover:text-primary">
                                <Plus size={32} className="mb-2" />
                                <span className="font-bold text-sm">Create New Menu</span>
                            </button>
                        </div>
                    ) : (
                         <div className="text-center py-12 text-gray-500">No saved menus yet.</div>
                    )}
                </div>
            )}
            
            {/* --- FAMILY & BIRTHDAY --- */}
            {activeTab === 'family' && (
                <div>
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl flex items-center gap-6 mb-8">
                        <div className="bg-pink-100 dark:bg-pink-800 p-4 rounded-full text-pink-600 dark:text-pink-300">
                            <Gift size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Birthday Reminder</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tambahkan data keluarga/karyawan. Kami akan mengirimkan diskon spesial saat mereka ulang tahun!</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {user.familyMembers?.map(member => (
                            <div key={member.id} className="flex items-center justify-between bg-white dark:bg-darkSurface p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.relation} • Lahir: {member.birthDate}</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                            </div>
                        ))}
                        <button className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center gap-2 text-sm font-bold">
                            <Plus size={16} /> Tambah Anggota Keluarga
                        </button>
                    </div>
                </div>
            )}
            
            {/* --- EXCLUSIVE MENU (Visible in all tabs or specific tab) --- */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Lock size={18} className="text-yellow-500" /> Exclusive Member Menu
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-gray-900 text-white p-6 rounded-2xl relative overflow-hidden group cursor-pointer">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&w=500&q=80')] bg-cover opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
                         <div className="relative z-10">
                             <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">GOLD ONLY</span>
                             <h4 className="text-xl font-bold mb-1">Kambing Guling Mini</h4>
                             <p className="text-sm text-gray-300 mb-4">Hanya Rp 3.500.000 (Normal 4.5jt)</p>
                             <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Saya%20Mau%20Order%20Exclusive%20Kambing%20Guling%20Mini`, '_blank')} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">
                                 Pesan Sekarang
                             </button>
                         </div>
                     </div>
                     <div className="bg-gray-900 text-white p-6 rounded-2xl relative overflow-hidden group cursor-pointer">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80')] bg-cover opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
                         <div className="relative z-10">
                             <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">GOLD ONLY</span>
                             <h4 className="text-xl font-bold mb-1">Premium Seafood Platter</h4>
                             <p className="text-sm text-gray-300 mb-4">Lobster & Kepiting Jumbo (Rp 1.2jt)</p>
                             <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Saya%20Mau%20Order%20Exclusive%20Seafood%20Platter`, '_blank')} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">
                                 Pesan Sekarang
                             </button>
                         </div>
                     </div>
                 </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
