// src/components/ReferralWidget.tsx
import React, { useState } from 'react';
import { Copy, CheckCircle, Gift } from 'lucide-react';
import { WatercolorPhysicsEngine } from '../core/theme/WatercolorPhysicsEngine';

interface ReferralWidgetProps {
    code: string;
    friendsCount: number;
    targetCount: number; // 10
    totalCredit: number;
}

const ReferralWidget: React.FC<ReferralWidgetProps> = ({ code, friendsCount, targetCount, totalCredit }) => {
    const [copied, setCopied] = useState(false);
    // const wcEngine = new WatercolorPhysicsEngine(); // Reuse the engine - commented out as it's not used in the render yet but imported for future use or side effects if needed.

    // Logic: Calculate Progress
    const progress = Math.min(100, (friendsCount / targetCount) * 100);
    const remaining = Math.max(0, targetCount - friendsCount);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="relative p-6 rounded-3xl overflow-hidden text-gray-800"
            style={{
                background: `linear-gradient(135deg, #FFF 0%, #FDF2F8 100%)`,
                boxShadow: '0 10px 30px -10px rgba(255, 105, 180, 0.3)'
            }}
        >
            {/* Watercolor Splash Background */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20"
                style={{ background: '#FF9E9D', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Gift className="text-pink-500" size={24} />
                    <h3 className="font-bold text-lg font-display">Ajak Teman, Gratis Pesta!</h3>
                </div>

                {/* The Code Box */}
                <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border-2 border-dashed border-pink-200 mb-4">
                    <span className="font-mono text-2xl font-bold tracking-wider text-gray-700">{code}</span>
                    <button
                        onClick={handleCopy}
                        className="ml-auto bg-pink-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-pink-600 transition-colors flex items-center gap-2"
                    >
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                {/* Gamified Progress Bar */}
                <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                    <span>Progres: {friendsCount} Teman</span>
                    <span>Target: {targetCount}</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                    {remaining > 0
                        ? `Ajak ${remaining} teman lagi untuk Unlock Gratis Catering Ultah (50 Pax)!`
                        : '🎉 SELAMAT! Hadiah Ultah 50 Pax Terbuka!'}
                </p>

                <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Total Kredit Anda: Rp {totalCredit.toLocaleString('id-ID')}
                </div>
            </div>
        </div>
    );
};

export default ReferralWidget;
