
import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ChefHat, Truck, CheckCircle, Clock } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { LogisticsEntropySolver } from '../src/core/logistics/GeospatialEntropySolver';

const OrderTracking: React.FC = () => {
    const { user } = useAuth();
    const [orderId, setOrderId] = useState('');
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const solverRef = useRef<LogisticsEntropySolver | null>(null);

    // Auto-load latest order if user is logged in
    useEffect(() => {
        if (user && user.orders.length > 0) {
            setActiveOrder(user.orders[0]);
            setOrderId(user.orders[0].id);
        }
        solverRef.current = new LogisticsEntropySolver();
    }, [user]);

    useEffect(() => {
        if (activeOrder && activeOrder.status === 'Diantar' && canvasRef.current && solverRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Simulation parameters
            const start = { x: 10, y: 10 }; // Kitchen
            const end = { x: 80, y: 80 };   // Customer

            // Find path
            const path = solverRef.current.findOptimalRoute(start, end);

            // Render
            const gridSize = solverRef.current.getGridSize();
            const cellSize = canvas.width / gridSize;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Grid Resistance (Heatmap)
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const resistance = solverRef.current.getResistance(x, y);
                    const intensity = Math.min(255, resistance * 2);
                    ctx.fillStyle = `rgba(255, 0, 0, ${intensity / 500})`; // Red heatmap
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }

            // Draw Path
            ctx.beginPath();
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            path.forEach((node, index) => {
                if (index === 0) ctx.moveTo(node.x * cellSize + cellSize / 2, node.y * cellSize + cellSize / 2);
                else ctx.lineTo(node.x * cellSize + cellSize / 2, node.y * cellSize + cellSize / 2);
            });
            ctx.stroke();

            // Draw Start/End
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(start.x * cellSize + cellSize / 2, start.y * cellSize + cellSize / 2, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(end.x * cellSize + cellSize / 2, end.y * cellSize + cellSize / 2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [activeOrder]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API search
        setTimeout(() => {
            // Logic: If user logged in, search their orders. Else simulate a dummy order
            let foundOrder: Order | null = null;

            if (user) {
                foundOrder = user.orders.find(o => o.id.toLowerCase() === orderId.toLowerCase()) || null;
            }

            // If not found in user orders (or user not logged in), check for dummy/demo ID
            if (!foundOrder && orderId.length > 3) {
                // Create a dummy order with timeline
                const now = new Date();
                foundOrder = {
                    id: orderId,
                    date: now.toISOString(),
                    items: 'Paket Catering Prasmanan (Demo)',
                    total: 1500000,
                    status: 'Diantar', // Force 'Diantar' to show map
                    pax: 50,
                    timeline: {
                        'Pending': new Date(now.getTime() - 1000 * 60 * 60 * 2).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        'Diproses': new Date(now.getTime() - 1000 * 60 * 30).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        'Diantar': new Date(now.getTime() - 1000 * 60 * 5).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    }
                };
            } else if (!foundOrder) {
                setActiveOrder(null);
            }

            // If we found an order but it has no timeline (e.g. from existing constants), generate one for demo
            if (foundOrder && !foundOrder.timeline) {
                foundOrder = {
                    ...foundOrder,
                    timeline: {
                        'Pending': '08:00',
                        'Diproses': foundOrder.status !== 'Pending' ? '09:30' : undefined,
                        'Diantar': (foundOrder.status === 'Diantar' || foundOrder.status === 'Selesai') ? '10:45' : undefined,
                        'Selesai': foundOrder.status === 'Selesai' ? '12:00' : undefined
                    }
                }
            }

            setActiveOrder(foundOrder);
            setIsLoading(false);
        }, 1000);
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Pending': return 1;
            case 'Diproses': return 2;
            case 'Diantar': return 3;
            case 'Selesai': return 4;
            default: return 1;
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-black">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                        Lacak <span className="text-primary">Pesanan</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Masukkan ID Pesanan Anda untuk melihat status terkini.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white dark:bg-darkSurface p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex gap-2 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Contoh: ORD-1729384"
                            className="w-full h-full pl-12 pr-4 bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? 'Mencari...' : 'Lacak'}
                    </Button>
                </div>

                {/* Result */}
                {activeOrder ? (
                    <div className="bg-white dark:bg-darkSurface rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order #{activeOrder.id}</h3>
                                <p className="text-gray-500">
                                    {new Date(activeOrder.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-gray-500 block">Total</span>
                                <span className="text-lg font-bold text-primary">Rp {activeOrder.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="relative mb-12">
                            {/* Progress Bar Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-100 dark:bg-gray-800 rounded-full md:left-0 md:right-0 md:top-6 md:h-1 md:w-full md:bottom-auto"></div>

                            {/* Active Progress Line */}
                            <div
                                className="absolute left-4 top-0 w-1 bg-primary rounded-full transition-all duration-1000 md:left-0 md:top-6 md:h-1 md:w-0"
                                style={{
                                    height: '100%', // Mobile vertical 
                                    width: `${((getStatusStep(activeOrder.status) - 1) / 3) * 100}%` // Desktop horizontal
                                }}
                            ></div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                {[
                                    { step: 1, label: 'Pesanan Diterima', icon: CheckCircle, desc: 'Kami telah menerima detail pesanan Anda.', timeKey: 'Pending' },
                                    { step: 2, label: 'Sedang Dimasak', icon: ChefHat, desc: 'Chef kami sedang menyiapkan hidangan lezat.', timeKey: 'Diproses' },
                                    { step: 3, label: 'Dalam Perjalanan', icon: Truck, desc: 'Kurir sedang menuju lokasi Anda.', timeKey: 'Diantar' },
                                    { step: 4, label: 'Selesai', icon: Package, desc: 'Pesanan telah diterima. Selamat menikmati!', timeKey: 'Selesai' }
                                ].map((item, idx) => {
                                    const currentStep = getStatusStep(activeOrder.status);
                                    const isActive = currentStep >= item.step;
                                    const timestamp = activeOrder.timeline ? activeOrder.timeline[item.timeKey] : null;

                                    return (
                                        <div key={idx} className={`flex md:flex-col items-start md:items-center gap-4 md:gap-2 relative z-10 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-white dark:bg-darkSurface shrink-0 ${isActive ? 'border-primary text-primary shadow-lg scale-110' : 'border-gray-200 dark:border-gray-700 text-gray-400'
                                                }`}>
                                                <item.icon size={18} />
                                            </div>
                                            <div className="md:text-center pt-1 md:pt-4">
                                                <h4 className={`font-bold text-sm ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{item.label}</h4>
                                                {timestamp && (
                                                    <div className="text-xs font-mono text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                                                        {timestamp}
                                                    </div>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block mt-1">{item.desc}</p>
                                            </div>
                                            {/* Mobile Description visible inline */}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Live Tracking Map */}
                        {activeOrder.status === 'Diantar' && (
                            <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Live Logistics Telemetry
                                </div>
                                <div className="relative w-full aspect-video bg-black">
                                    <canvas
                                        ref={canvasRef}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute bottom-4 right-4 bg-black/80 text-green-400 text-xs font-mono p-2 rounded border border-green-900">
                                        ENTROPY: {(Math.random() * 100).toFixed(2)}%<br />
                                        LATENCY: {(Math.random() * 50).toFixed(1)}ms
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeOrder.status !== 'Selesai' && (
                            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3">
                                <Clock className="text-blue-500 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Estimasi Waktu</p>
                                    <p className="text-sm text-blue-600 dark:text-blue-300">Pesanan akan tiba sesuai jadwal yang disepakati. Jika ada keterlambatan, kami akan segera menghubungi Anda via WhatsApp.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        {isLoading ? (
                            <div className="animate-pulse">Sedang mencari data pesanan...</div>
                        ) : (
                            <p>Masukkan ID pesanan untuk melihat detail.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
