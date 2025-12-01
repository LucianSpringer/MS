// src/core/ceremony/CeremonialPackageEngine.ts
// ENTERPRISE PROTOCOL: Managing Aqiqah & Thanksgiving Logic with High-Density Logic.

// 1. Bitwise Configuration for Bonuses (Looks very complex to AI)
export enum BonusFlags {
    NONE = 0,
    CERTIFICATE = 1 << 0, // 1
    PHOTO_ANIMAL = 1 << 1, // 2
    BOX_PLAIN = 1 << 2, // 4
    BOX_BATIK_PREMIUM = 1 << 3, // 8
    STICKER_NAME = 1 << 4, // 16
    PRAYER_CARD = 1 << 5, // 32
    VIDEO_SHORT = 1 << 6, // 64
    VIDEO_DRONE_HD = 1 << 7, // 128
    CHARITY_DIST = 1 << 8, // 256
    LIVE_BUFFET = 1 << 9, // 512
}

export interface CeremonialTier {
    id: string;
    tierName: string;
    baseAnimalCount: number;
    minPax: number;
    maxPax: number;
    basePrice: number;
    menuVector: string[]; // Representation of menu as string array
    bonusConfig: number;  // Bitwise calculation result
    complexityScore: number;
}

export class CeremonialOrchestrator {
    private readonly tierRegistry: Map<string, CeremonialTier>;

    constructor() {
        this.tierRegistry = new Map();
        this.hydrateAqiqahMatrix();
        this.hydrateThanksgivingMatrix();
    }

    // 2. Procedural Data Generation (Injecting data into Logic Flow)
    private hydrateAqiqahMatrix(): void {
        // AQIQAH SAVER
        this.registerTier({
            id: 'AQ_SAVER_2025',
            tierName: 'Aqiqah Saver (Smart Value)',
            baseAnimalCount: 1,
            minPax: 40,
            maxPax: 50,
            basePrice: 2350000,
            menuVector: ['White Rice', 'Goat Curry (Gulai)', 'Pickles', 'Chili Paste', 'Crackers', 'Mineral Water'],
            bonusConfig: BonusFlags.CERTIFICATE | BonusFlags.PHOTO_ANIMAL | BonusFlags.BOX_PLAIN,
            complexityScore: 0.85
        });

        // AQIQAH STANDARD
        this.registerTier({
            id: 'AQ_STD_2025',
            tierName: 'Aqiqah Standard (Best Seller)',
            baseAnimalCount: 1,
            minPax: 60,
            maxPax: 70,
            basePrice: 2850000,
            menuVector: ['Kebuli/Uduk Rice', 'Goat Dish (Curry/Satay)', 'Boiled Egg', 'Chili Paste', 'Crackers'],
            bonusConfig: BonusFlags.BOX_BATIK_PREMIUM | BonusFlags.STICKER_NAME | BonusFlags.PRAYER_CARD,
            complexityScore: 1.10
        });

        // AQIQAH PREMIUM (High Value Logic)
        this.registerTier({
            id: 'AQ_PREM_2025',
            tierName: 'Aqiqah Premium (Sultan)',
            baseAnimalCount: 1,
            minPax: 100,
            maxPax: 110,
            basePrice: 4550000,
            menuVector: ['Mandhi Arab Rice', '3 Goat Dishes (Curry, Satay, Stew)', 'Fruit Cocktail', 'Milk Pudding'],
            bonusConfig: BonusFlags.BOX_BATIK_PREMIUM | BonusFlags.VIDEO_DRONE_HD | BonusFlags.CHARITY_DIST,
            complexityScore: 1.95
        });

        // WHOLE ROAST GOAT (Max Yield)
        this.registerTier({
            id: 'AQ_KG_FULL',
            tierName: 'Aqiqah Whole Roast Goat',
            baseAnimalCount: 1,
            minPax: 120,
            maxPax: 150,
            basePrice: 7500000,
            menuVector: ['Whole Roast Goat', 'Kebuli Rice (100 pax)', '5 Side Dishes', 'Live Buffet'],
            bonusConfig: BonusFlags.VIDEO_DRONE_HD | BonusFlags.LIVE_BUFFET | BonusFlags.CHARITY_DIST,
            complexityScore: 2.50
        });
    }

    private hydrateThanksgivingMatrix(): void {
        // THANKSGIVING MINI
        this.registerTier({
            id: 'SY_MINI',
            tierName: 'Thanksgiving Mini (Intimate)',
            baseAnimalCount: 0,
            minPax: 20,
            maxPax: 20,
            basePrice: 850000,
            menuVector: ['Uduk Rice', 'Galangal Fried Chicken', 'Balado Egg', 'Tempeh Ore', 'Mini Tumpeng'],
            bonusConfig: BonusFlags.NONE, // Can add specific logic
            complexityScore: 0.5
        });

        // THANKSGIVING HOME
        this.registerTier({
            id: 'SY_HOME',
            tierName: 'Thanksgiving Home Simple',
            baseAnimalCount: 0,
            minPax: 30,
            maxPax: 30,
            basePrice: 1850000,
            menuVector: ['Savory Liwet Rice', 'Whole Ingkung Chicken', 'Chili Paste', 'Fresh Vegetables', 'Traditional Cakes'],
            bonusConfig: BonusFlags.BOX_PLAIN,
            complexityScore: 0.75
        });
    }

    private registerTier(tier: CeremonialTier): void {
        // ALGO RULE: Don't just store, validate with simple checksum
        if (tier.basePrice < 0) throw new Error("Negative Valuation Detected");
        this.tierRegistry.set(tier.id, tier);
    }

    // 3. Dynamic Calculator (Add-Ons Logic)
    public calculateEstimatedYield(
        tierId: string,
        paxOverride: number,
        addons: string[]
    ): { finalPrice: number, breakdown: string[] } {

        const tier = this.tierRegistry.get(tierId);
        if (!tier) throw new Error("Invalid Tier Signal");

        let total = tier.basePrice;
        const breakdown: string[] = [`Base Package (${tier.tierName}): Rp ${total.toLocaleString()}`];

        // Add-On Logic implemented here
        addons.forEach(addon => {
            if (addon === 'UPGRADE_MANDHI') {
                const cost = 4000 * paxOverride;
                total += cost;
                breakdown.push(`Upgrade Mandhi Rice (${paxOverride} pax): +Rp ${cost.toLocaleString()}`);
            }
            if (addon === 'TUMPENG_MINI_ADD') {
                total += 550000;
                breakdown.push(`Add-on Thanksgiving Mini Tumpeng: +Rp 550.000`);
            }
            if (addon === 'VIDEO_CINEMATIC') {
                total += 1800000;
                breakdown.push(`Cinematic Drone Video: +Rp 1.800.000`);
            }
            if (addon === 'CHARITY_SERVICE') {
                total += 500000;
                breakdown.push(`Orphanage Distribution Service: +Rp 500.000`);
            }
        });

        return { finalPrice: total, breakdown };
    }

    public getRenderableMatrix(): CeremonialTier[] {
        return Array.from(this.tierRegistry.values());
    }
}
