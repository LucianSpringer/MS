import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Package, MapPin, LogOut, Plus, Trash2, Award, Gift, Filter, Calendar,
    Crown, RefreshCw, Briefcase, Building, FileText, Upload, Heart, Zap, Lock, ChevronRight, Clock, CheckCircle, HeartHandshake, ScrollText
} from 'lucide-react';
import Button from '../components/Button';
import { Address, Order } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { LivestockTraceabilityEngine, LivestockData } from '../src/core/ceremony/LivestockTraceabilityEngine';
import { CeremonialOrchestrator, CeremonialTier } from '../src/core/ceremony/CeremonialPackageEngine';
import { MatrimonialLogisticsEngine, MatrimonialTier, WeddingAmenities } from '../src/core/wedding/MatrimonialLogisticsEngine';
import { LiturgicalComplianceEngine } from '../src/core/compliance/LiturgicalValidator';
import { RetentionNeuralNet, UserState } from '../src/core/ux/RetentionNeuralNet';
import { FinancialRoutingMesh, PaymentChannel } from '../src/core/payment/FinancialRoutingMesh';
import { PredictiveUXGraph, DashboardWidget } from '../src/core/ux/PredictiveUXGraph';
import { CorporateGovernanceEngine, BudgetLedger } from '../src/core/b2b/CorporateGovernance';
import ReferralWidget from '../src/components/ReferralWidget';
import { ReferralGraphNode } from '../src/core/viral/ReferralGraphNode';

const Dashboard: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'corporate' | 'family' | 'saved' | 'addresses' | 'ceremony' | 'wedding'>('orders');
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Filtering State
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [dateFilter, setDateFilter] = useState<string>('All Time');

    // Address Form State
    const [newAddress, setNewAddress] = useState<Partial<Address>>({});

    // Ceremonial Engines
    const [livestockEngine] = useState(() => new LivestockTraceabilityEngine());
    const [ceremonialEngine] = useState(() => new CeremonialOrchestrator());
    const [weddingEngine] = useState(() => new MatrimonialLogisticsEngine());
    const [complianceEngine] = useState(() => new LiturgicalComplianceEngine());
    const [retentionEngine] = useState(() => new RetentionNeuralNet());
    const [routingMesh] = useState(() => new FinancialRoutingMesh());
    const [uxGraph] = useState(() => new PredictiveUXGraph());
    const [governanceEngine] = useState(() => new CorporateGovernanceEngine());
    const [referralNode] = useState(() => new ReferralGraphNode());
    const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);

    const livestockData = useMemo(() => livestockEngine.getAvailableLivestock(), [livestockEngine]);
    const ceremonialPackages = useMemo(() => ceremonialEngine.getRenderableMatrix(), [ceremonialEngine]);
    const weddingTiers = useMemo(() => weddingEngine.getAvailableTiers(), [weddingEngine]);
    const complianceRules = useMemo(() => complianceEngine.getRules(), [complianceEngine]);

    // Dynamic Widget Resolution
    useEffect(() => {
        if (user) {
            const widgets = uxGraph.generateDashboardMatrix(user);
            setDashboardWidgets(widgets);
        }
    }, [user, uxGraph]);

    // Dynamic Feature Unlocking
    const unlockedFeatures = useMemo(() => {
        if (!user) return [];
        // Map current user to UserState for the engine
        const userState: UserState = {
            id: user.id,
            orderCount: user.orders.length,
            totalSpend: user.orders.reduce((acc, o) => acc + o.total, 0),
            lastLogin: Date.now(), // Simulated
            tier: user.membershipTier as 'SILVER' | 'GOLD' | 'PLATINUM'
        };
        return retentionEngine.resolveFeatureAccess(userState);
    }, [user, retentionEngine]);

    const reorderProbability = useMemo(() => {
        if (!user) return 0;
        const userState: UserState = {
            id: user.id,
            orderCount: user.orders.length,
            totalSpend: user.orders.reduce((acc, o) => acc + o.total, 0),
            lastLogin: Date.now(),
            tier: user.membershipTier as 'SILVER' | 'GOLD' | 'PLATINUM'
        };
        return retentionEngine.predictReorderProbability(userState);
    }, [user, retentionEngine]);

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
            now.setHours(0, 0, 0, 0);
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
                    {/* Dynamic Widgets Area (Predictive Grid) */}
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {dashboardWidgets.map(widget => (
                            <div
                                key={widget.id}
                                onClick={() => navigate(widget.actionUrl)}
                                className={`${widget.colorTheme} text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 opacity-10 transform translate-x-2 -translate-y-2">
                                    {/* Render Icon based on widget.iconType */}
                                    {widget.iconType === 'CROWN' && <Crown size={48} />}
                                    {widget.iconType === 'ZAP' && <Zap size={48} />}
                                    {widget.iconType === 'STAR' && <Award size={48} />}
                                    {widget.iconType === 'BOX' && <Package size={48} />}
                                    {widget.iconType === 'MAP' && <MapPin size={48} />}
                                    {widget.iconType === 'BUILDING' && <Briefcase size={48} />}
                                    {widget.iconType === 'GIFT' && <Gift size={48} />}
                                </div>

                                <div className="relative z-10">
                                    <h4 className="font-bold text-sm md:text-base leading-tight mb-1">{widget.label}</h4>
                                    <p className="text-xs text-white/80">{widget.subLabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>

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
                                <Zap size={12} className="inline mr-1" fill="currentColor" /> EARLY ACCESS
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
                            { id: 'orders', label: 'Riwayat & Langganan', icon: Package, requiredFeature: 'DASHBOARD_BASIC' },
                            { id: 'loyalty', label: 'Loyalty Points', icon: Award, requiredFeature: 'LOYALTY_LEDGER' },
                            { id: 'corporate', label: 'Corporate Dashboard', icon: Briefcase, requiredFeature: 'CORPORATE_DASHBOARD' },
                            { id: 'family', label: 'Family & Birthday', icon: Heart, requiredFeature: 'DASHBOARD_BASIC' },
                            { id: 'saved', label: 'Saved Menus', icon: FileText, requiredFeature: 'SAVED_MENUS' },
                            { id: 'ceremony', label: 'Ceremonial Matrix', icon: Crown, requiredFeature: 'DASHBOARD_BASIC' },
                            { id: 'wedding', label: 'Wedding Logistics', icon: HeartHandshake, requiredFeature: 'DASHBOARD_BASIC' },
                            { id: 'addresses', label: 'Alamat Tersimpan', icon: MapPin, requiredFeature: 'DASHBOARD_BASIC' },
                        ].filter(tab => unlockedFeatures.includes(tab.requiredFeature)).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
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
                                {/* Membership Card */}
                                <div className="bg-gradient-to-br from-primary to-pink-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <p className="text-white/80 text-sm mb-1">Membership Tier</p>
                                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                                    <Crown className="text-yellow-300 fill-yellow-300" /> {user?.membershipTier || 'Gold Member'}
                                                </h2>
                                            </div>
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <Zap className="text-yellow-300" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>Loyalty Points</span>
                                                    <span className="font-bold">{user?.loyaltyPoints || 0} pts</span>
                                                </div>
                                                <div className="w-full bg-black/20 rounded-full h-2">
                                                    <div className="bg-yellow-400 h-2 rounded-full w-[70%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                                </div>
                                                <p className="text-xs text-white/60 mt-2">130 pts to Platinum Tier</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Referral Widget (New) */}
                                <div className="lg:col-span-1">
                                    <ReferralWidget
                                        code={user ? referralNode.generateVanityCode(user.name, 12345) : 'LOADING'}
                                        friendsCount={3}
                                        targetCount={10}
                                        totalCredit={300000}
                                    />
                                </div>
                                {/* Governance & Budget Widget */}
                                <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    <Building size={24} className="text-indigo-300" /> Corporate Governance
                                                </h3>
                                                <p className="text-indigo-200 text-sm">Budget Control & Approval Workflow</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-indigo-300 uppercase tracking-widest">Fiscal Period</p>
                                                <p className="font-bold text-lg">OCT-2023</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                                <p className="text-xs text-indigo-200 mb-1">Total Allocation</p>
                                                <p className="text-2xl font-bold">Rp 50.000.000</p>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                                <p className="text-xs text-indigo-200 mb-1">Used Amount</p>
                                                <p className="text-2xl font-bold text-yellow-400">Rp 8.400.000</p>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                                <p className="text-xs text-indigo-200 mb-1">Remaining</p>
                                                <p className="text-2xl font-bold text-green-400">Rp 41.600.000</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span>Status: <span className="font-bold">COMPLIANT</span></span>
                                            </div>
                                            <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                                                View Audit Log
                                            </button>
                                        </div>
                                    </div>
                                </div>

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
                                                    <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
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
                        {unlockedFeatures.includes('EXCLUSIVE_MENU_ACCESS') && (
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
                        )}

                        {/* --- CEREMONIAL & LIVESTOCK TRACKING --- */}
                        {activeTab === 'ceremony' && (
                            <div className="space-y-8">
                                {/* Livestock Traceability */}
                                <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Livestock Traceability</h3>
                                            <p className="text-sm text-gray-500">Real-time tracking of premium livestock for your Aqiqah.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {livestockData.slice(0, 3).map(animal => (
                                            <div key={animal.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group hover:border-primary transition-colors">
                                                <div className="h-32 bg-gray-200 dark:bg-gray-800 relative">
                                                    <img src={animal.photoUrl} alt={animal.breed} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                        Score: {animal.healthScore}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{animal.id}</h4>
                                                        <span className="text-xs text-gray-500">{animal.breed}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                        <div>Weight: <span className="font-bold text-gray-900 dark:text-white">{animal.weightKg} kg</span></div>
                                                        <div>Age: <span className="font-bold text-gray-900 dark:text-white">{animal.ageMonths} mo</span></div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
                                                        <CheckCircle size={10} /> {animal.vaccinationStatus}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ceremonial Package Matrix */}
                                <div className="bg-gray-900 text-white p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                            <Crown size={24} className="text-yellow-400" /> Ceremonial Package Matrix
                                        </h3>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {ceremonialPackages.map(pkg => (
                                                <div key={pkg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-lg text-yellow-400">{pkg.tierName}</h4>
                                                            <p className="text-sm text-gray-400">Complexity Score: {pkg.complexityScore}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-xl">Rp {pkg.basePrice.toLocaleString('id-ID')}</p>
                                                            <p className="text-xs text-gray-400">{pkg.minPax} - {pkg.maxPax} Pax</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 mb-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {pkg.menuVector.slice(0, 3).map((m, i) => (
                                                                <span key={i} className="text-xs bg-black/30 px-2 py-1 rounded text-gray-300">{m}</span>
                                                            ))}
                                                            {pkg.menuVector.length > 3 && <span className="text-xs text-gray-500">+{pkg.menuVector.length - 3} more</span>}
                                                        </div>

                                                        {/* Bitwise Bonus Visualization */}
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {(pkg.bonusConfig & 1) ? <span className="text-[10px] border border-yellow-500/50 text-yellow-500 px-2 py-0.5 rounded">Certificate</span> : null}
                                                            {(pkg.bonusConfig & 8) ? <span className="text-[10px] border border-purple-500/50 text-purple-500 px-2 py-0.5 rounded">Batik Box</span> : null}
                                                            {(pkg.bonusConfig & 128) ? <span className="text-[10px] border border-blue-500/50 text-blue-500 px-2 py-0.5 rounded">Drone Video</span> : null}
                                                        </div>
                                                    </div>

                                                    <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Saya%20tertarik%20paket%20${pkg.tierName}`, '_blank')} className="w-full bg-white text-black font-bold py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                                        Select Protocol
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- WEDDING LOGISTICS & COMPLIANCE --- */}
                        {activeTab === 'wedding' && (
                            <div className="space-y-8">
                                {/* Compliance Validator Header */}
                                <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white p-6 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <ScrollText size={24} className="text-emerald-200" /> Liturgical Compliance Engine
                                        </h3>
                                        <p className="text-emerald-100 text-sm mt-1">Enterprise-grade validation for Syar'i event protocols.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {complianceRules.map(rule => (
                                            <div key={rule.ruleId} className="bg-black/20 px-3 py-1 rounded text-xs font-mono border border-white/10" title={rule.description}>
                                                {rule.severity === 'MANDATORY' ? '🔴' : '🟡'} {rule.ruleId.split('_')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Matrimonial Tiers */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {weddingTiers.map(tier => (
                                        <div key={tier.id} className="bg-white dark:bg-darkSurface border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{tier.venueType.replace('_', ' ')}</span>
                                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{tier.codeName}</h4>
                                                </div>
                                                <div className="text-right">
                                                    {tier.fixedPriceTotal ? (
                                                        <p className="text-xl font-bold text-primary">Rp {tier.fixedPriceTotal.toLocaleString('id-ID')}</p>
                                                    ) : (
                                                        <p className="text-xl font-bold text-primary">Rp {tier.basePricePerPax.toLocaleString('id-ID')} <span className="text-sm text-gray-500 font-normal">/pax</span></p>
                                                    )}
                                                    <p className="text-xs text-gray-400">{tier.minPax} - {tier.maxPax} Pax Capacity</p>
                                                </div>
                                            </div>

                                            {/* Bitwise Amenities Visualization */}
                                            <div className="space-y-3 mb-6">
                                                <p className="text-xs font-bold text-gray-500 uppercase">Included Amenities (Bitwise Decoded)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {(tier.amenityConfig & WeddingAmenities.DECOR_SIMPLE) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-green-500" /> Simple Decor</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.DECOR_PREMIUM) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-purple-500" /> Premium Decor</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.LIVE_STALL_STD) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-orange-500" /> 2 Standard Stalls</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.LIVE_STALL_PREM) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-red-500" /> 4 Premium Stalls</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.KAMBING_GULING_UT) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-yellow-600" /> Whole Roast Goat</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.WEDDING_CAKE_3T) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-pink-500" /> 3-Tier Cake</div> : null}
                                                    {(tier.amenityConfig & WeddingAmenities.DRONE_DOCS) ? <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle size={14} className="text-blue-500" /> Drone Documentation</div> : null}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-gray-500">Budget Simulation (100 Pax)</span>
                                                    <span className="text-xs font-mono text-gray-400">LOGISTICS_OVERHEAD: 0%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Est. Total</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        Rp {weddingEngine.simulateBudgetTrajectory(tier.id, 100).estimatedTotal.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>

                                            <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Saya%20tertarik%20Wedding%20Tier%20${tier.codeName}`, '_blank')} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                                                Consult Logistics
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
