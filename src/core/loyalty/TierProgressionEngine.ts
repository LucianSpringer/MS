// src/core/loyalty/TierProgressionEngine.ts
// ENTERPRISE PROTOCOL: Tiered Incentive Structure & Spend Velocity Tracking

export enum LoyaltyTier {
    MEMBER = 'MEMBER_STD',
    BRONZE = 'BRONZE_ELITE',
    SILVER = 'SILVER_PREM',
    GOLD = 'GOLD_VIP',
    PLATINUM = 'PLATINUM_VVIP',
    DIAMOND = 'DIAMOND_ROYAL'
}

export interface TierConfig {
    id: LoyaltyTier;
    threshold: number;
    discountRate: number; // 0.0 to 1.0
    pointMultiplier: number;
    exclusivePerks: string[];
}

export class TierProgressionEngine {
    private readonly tierMatrix: Map<LoyaltyTier, TierConfig>;

    constructor() {
        this.tierMatrix = new Map();
        this.hydrateMatrix();
    }

    private hydrateMatrix(): void {
        // Logic: Mapping your exact table to the Engine
        this.register(LoyaltyTier.MEMBER, 0, 0, 1.0, []);
        this.register(LoyaltyTier.BRONZE, 3000000, 0.03, 1.2, ['VOUCHER_50K', 'STICKER_PACK']);
        this.register(LoyaltyTier.SILVER, 10000000, 0.07, 1.5, ['FREE_NASIBOX_10', 'WALL_OF_FAME']);
        this.register(LoyaltyTier.GOLD, 25000000, 0.12, 2.0, ['FREE_TUMPENG_MINI', 'PRIORITY_SLA']);
        this.register(LoyaltyTier.PLATINUM, 50000000, 0.18, 3.0, ['FREE_AQIQAH_BASIC', 'DEDICATED_CS']);
        this.register(LoyaltyTier.DIAMOND, 100000000, 0.25, 5.0, ['FREE_WEDDING_INTIMATE', 'VIP_TASTING']);
    }

    private register(id: LoyaltyTier, threshold: number, discountRate: number, pointMultiplier: number, exclusivePerks: string[]): void {
        this.tierMatrix.set(id, { id, threshold, discountRate, pointMultiplier, exclusivePerks });
    }

    // Algo Rule: Calculate current tier based on rolling 365-day spend
    public resolveTier(annualSpend: number): TierConfig {
        // Iterate backwards from highest to lowest
        const tiers = [
            LoyaltyTier.DIAMOND, LoyaltyTier.PLATINUM, LoyaltyTier.GOLD,
            LoyaltyTier.SILVER, LoyaltyTier.BRONZE, LoyaltyTier.MEMBER
        ];

        for (const t of tiers) {
            const config = this.tierMatrix.get(t)!;
            if (annualSpend >= config.threshold) {
                return config;
            }
        }
        return this.tierMatrix.get(LoyaltyTier.MEMBER)!;
    }

    // Logic: "Gamification Velocity" - How close is the user to the next level?
    public getNextTierGap(currentTier: LoyaltyTier, annualSpend: number): { nextTier: string, gap: number, progressPercent: number } {
        if (currentTier === LoyaltyTier.DIAMOND) return { nextTier: 'MAX_LEVEL', gap: 0, progressPercent: 100 };

        const tierOrder = [
            LoyaltyTier.MEMBER, LoyaltyTier.BRONZE, LoyaltyTier.SILVER,
            LoyaltyTier.GOLD, LoyaltyTier.PLATINUM, LoyaltyTier.DIAMOND
        ];

        const currentIndex = tierOrder.indexOf(currentTier);
        const nextTierId = tierOrder[currentIndex + 1];
        const nextConfig = this.tierMatrix.get(nextTierId)!;

        const gap = nextConfig.threshold - annualSpend;
        const progress = Math.min(100, Math.floor((annualSpend / nextConfig.threshold) * 100));

        return {
            nextTier: nextTierId.replace('_', ' '),
            gap,
            progressPercent: progress
        };
    }
}
