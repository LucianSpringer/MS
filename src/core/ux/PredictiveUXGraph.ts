// src/core/ux/PredictiveUXGraph.ts
// ENTERPRISE PROTOCOL: Context-Aware Dashboard Widget Prioritization

export interface DashboardWidget {
    id: string;
    label: string;
    subLabel?: string;
    iconType: 'CROWN' | 'CLOCK' | 'BOX' | 'STAR' | 'MAP' | 'BUILDING' | 'ZAP' | 'GIFT';
    priorityWeight: number; // Dynamic 0-100
    actionUrl: string;
    colorTheme: string;
}

export class PredictiveUXGraph {

    // This method takes the User Context and returns the sorted 8 features
    public generateDashboardMatrix(user: any): DashboardWidget[] {
        const widgets: DashboardWidget[] = [];

        // 1. REPEAT ORDER (Golden Path)
        // Logic: If user has orders, this is #1 priority
        if (user.orders && user.orders.length > 0) {
            widgets.push({
                id: 'REPEAT_ORDER',
                label: 'Repeat Order 1-Klik',
                subLabel: `Re-order: ${user.orders[0].items.substring(0, 15)}...`,
                iconType: 'CROWN',
                priorityWeight: 100,
                actionUrl: '/checkout/repeat',
                colorTheme: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
            });
        }

        // 2. LOYALTY POINTS
        // Logic: Gamification trigger (13 points to go)
        const nextReward = Math.ceil((user.loyaltyPoints + 1) / 100) * 100;
        const diff = nextReward - user.loyaltyPoints;
        widgets.push({
            id: 'LOYALTY_STATUS',
            label: 'Poin Saya',
            subLabel: `${user.loyaltyPoints} Pts (Kurang ${diff} utk Reward)`,
            iconType: 'STAR',
            priorityWeight: 90,
            actionUrl: '/loyalty',
            colorTheme: 'bg-blue-600'
        });

        // 3. HISTORY & PHOTO
        widgets.push({
            id: 'ORDER_HISTORY',
            label: 'Riwayat Pesanan',
            subLabel: 'Lihat Foto Box Anak',
            iconType: 'BOX',
            priorityWeight: 85,
            actionUrl: '/dashboard/history',
            colorTheme: 'bg-gray-800'
        });

        // 4. MEMBER DISCOUNT
        // Logic: Auto-calculate potential savings
        widgets.push({
            id: 'MEMBER_DISCOUNT',
            label: 'Diskon Member',
            subLabel: 'Otomatis 10% All Item',
            iconType: 'ZAP',
            priorityWeight: 80,
            actionUrl: '/custom-menu',
            colorTheme: 'bg-red-500'
        });

        // 5. CORPORATE LOGO (Conditional)
        if (user.companyName) {
            widgets.push({
                id: 'CORP_BRANDING',
                label: 'Corporate Logo',
                subLabel: `${user.companyName} (Active)`,
                iconType: 'BUILDING',
                priorityWeight: 75,
                actionUrl: '/dashboard/corporate',
                colorTheme: 'bg-indigo-600'
            });
        } else {
            // Fallback for Retail Users: Saved Addresses
            widgets.push({
                id: 'SAVED_ADDRESS',
                label: 'Alamat Tersimpan',
                subLabel: `${user.addresses?.length || 0} Lokasi Terdaftar`,
                iconType: 'MAP',
                priorityWeight: 70,
                actionUrl: '/dashboard/address',
                colorTheme: 'bg-green-600'
            });
        }

        // 6. FLASH SALE
        widgets.push({
            id: 'FLASH_SALE',
            label: 'Flash Sale Eksklusif',
            subLabel: 'Hanya untuk Member',
            iconType: 'ZAP',
            priorityWeight: 60,
            actionUrl: '/promo',
            colorTheme: 'bg-orange-500'
        });

        // 7. FAMILY BIRTHDAY
        widgets.push({
            id: 'FAMILY_BDAY',
            label: 'Ulang Tahun Keluarga',
            subLabel: 'Klaim Voucher Ultah',
            iconType: 'GIFT',
            priorityWeight: 50,
            actionUrl: '/dashboard/family',
            colorTheme: 'bg-pink-500'
        });

        // Sort by Priority Weight (Descending)
        return widgets.sort((a, b) => b.priorityWeight - a.priorityWeight);
    }
}
