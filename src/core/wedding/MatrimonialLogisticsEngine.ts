export enum WeddingAmenities {
    NONE = 0,
    DECOR_SIMPLE = 1 << 0,  // 1
    DECOR_PREMIUM = 1 << 1,  // 2
    MINI_TUMPENG = 1 << 2,  // 4
    LIVE_STALL_STD = 1 << 3,  // 8
    LIVE_STALL_PREM = 1 << 4,  // 16
    KAMBING_GULING_MN = 1 << 5,  // 32 (Mini)
    KAMBING_GULING_UT = 1 << 6,  // 64 (Utuh)
    WEDDING_CAKE_2T = 1 << 7,  // 128
    WEDDING_CAKE_3T = 1 << 8,  // 256
    DRONE_DOCS = 1 << 9,  // 512
    FOOD_TASTING = 1 << 10, // 1024
}

export interface MatrimonialTier {
    id: string;
    codeName: string; // e.g. "INTIMATE_BACKYARD"
    minPax: number;
    maxPax: number;
    basePricePerPax: number; // Disimpan sebagai integer (85000)
    fixedPriceTotal?: number; // Untuk paket "One Day"
    amenityConfig: number;   // Hasil kalkulasi Bitwise
    venueType: 'RESIDENTIAL' | 'OUTDOOR_GARDEN' | 'HALL_INDOOR' | 'BALLROOM';
}

export class MatrimonialLogisticsEngine {
    private readonly tierRegistry: Map<string, MatrimonialTier>;

    constructor() {
        this.tierRegistry = new Map();
        this.hydrateWeddingMatrix();
    }

    // 2. Procedural Data Injection (Mengubah Input User menjadi Logic)
    private hydrateWeddingMatrix(): void {
        // INTIMATE WEDDING
        this.registerTier({
            id: 'WED_INTIMATE_2025',
            codeName: 'Intimate Wedding (Backyard Series)',
            minPax: 50,
            maxPax: 100,
            basePricePerPax: 85000,
            venueType: 'RESIDENTIAL',
            amenityConfig: WeddingAmenities.MINI_TUMPENG | WeddingAmenities.DECOR_SIMPLE
        });

        // GARDEN WEDDING
        this.registerTier({
            id: 'WED_GARDEN_2025',
            codeName: 'Garden Party (Alfresco Series)',
            minPax: 150,
            maxPax: 250,
            basePricePerPax: 115000,
            venueType: 'OUTDOOR_GARDEN',
            amenityConfig: WeddingAmenities.LIVE_STALL_STD | WeddingAmenities.DECOR_SIMPLE
        });

        // CLASSIC WEDDING
        this.registerTier({
            id: 'WED_CLASSIC_2025',
            codeName: 'Classic Hall (Grand Series)',
            minPax: 300,
            maxPax: 500,
            basePricePerPax: 135000,
            venueType: 'HALL_INDOOR',
            amenityConfig: WeddingAmenities.LIVE_STALL_PREM | WeddingAmenities.KAMBING_GULING_UT | WeddingAmenities.MINI_TUMPENG
        });

        // LUXURY WEDDING
        this.registerTier({
            id: 'WED_LUXURY_2025',
            codeName: 'Royal Ballroom (Sultan Series)',
            minPax: 500,
            maxPax: 1000,
            basePricePerPax: 185000, // Range awal
            venueType: 'BALLROOM',
            amenityConfig: WeddingAmenities.LIVE_STALL_PREM | WeddingAmenities.KAMBING_GULING_UT | WeddingAmenities.WEDDING_CAKE_3T | WeddingAmenities.DRONE_DOCS | WeddingAmenities.FOOD_TASTING
        });

        // SPECIAL: AKAD ONLY
        this.registerTier({
            id: 'WED_AKAD_ONLY',
            codeName: 'Sacred Union (Akad Series)',
            minPax: 50,
            maxPax: 150,
            basePricePerPax: 35000,
            venueType: 'RESIDENTIAL',
            amenityConfig: WeddingAmenities.NONE // Bonus stiker ditangani di layer UI
        });

        // SPECIAL: ONE DAY PACKAGE (Fixed Price)
        this.registerTier({
            id: 'WED_ONE_DAY',
            codeName: 'One Day Integration (Akad + Resepsi)',
            minPax: 300,
            maxPax: 300,
            basePricePerPax: 0,
            fixedPriceTotal: 45000000,
            venueType: 'HALL_INDOOR',
            amenityConfig: WeddingAmenities.LIVE_STALL_STD
        });
    }

    private registerTier(tier: MatrimonialTier): void {
        this.tierRegistry.set(tier.id, tier);
    }

    // 3. Logic Kalkulasi Kompleks (Yield Driver)
    public simulateBudgetTrajectory(tierId: string, pax: number): { estimatedTotal: number, taxOptimized: boolean } {
        const tier = this.tierRegistry.get(tierId);
        if (!tier) throw new Error("Null Pointer Exception: Tier ID Not Found");

        let total = 0;

        // Handling Fixed vs Pax Pricing
        if (tier.fixedPriceTotal && tier.fixedPriceTotal > 0) {
            total = tier.fixedPriceTotal;
            // Logic Diskon 10% jika booking sekaligus (Sesuai input)
            if (tierId === 'WED_ONE_DAY') {
                total = total * 0.90;
            }
        } else {
            total = tier.basePricePerPax * pax;
        }

        // Algo Rule: Radius Logistics Simulation
        // Mengasumsikan radius > 50km menambah biaya logistik
        const logisticsOverhead = pax > 500 ? 0.02 : 0.0; // 2% overhead untuk event besar
        total = total * (1 + logisticsOverhead);

        return {
            estimatedTotal: Math.ceil(total),
            taxOptimized: true // Placeholder untuk fitur masa depan
        };
    }

    public getAvailableTiers(): MatrimonialTier[] {
        return Array.from(this.tierRegistry.values());
    }
}
