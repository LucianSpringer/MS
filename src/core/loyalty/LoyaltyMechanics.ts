// src/core/loyalty/LoyaltyMechanics.ts
// ENTERPRISE PROTOCOL: Transaction Mining & Graph Referral Logic

export enum EarnEvent {
    TRANSACTION_MINING = 'TX_MINING', // 1 pt per 100k
    REPEAT_BONUS = 'REPEAT_BONUS',    // +5 pts
    SOCIAL_PROOF_MINING = 'SOCIAL_PROOF', // +10 pts (Review)
    REFERRAL_NODE = 'REFERRAL_NODE',   // +25 pts
    TEMPORAL_GIFT = 'TEMPORAL_GIFT'    // +50 pts (Birthday)
}

export interface RedemptionTier {
    cost: number;
    rewardId: string;
    description: string;
    valueEstimate: number;
}

export class LoyaltyMechanicsEngine {

    // Logic: Calculate points based on Invoice Amount
    public calculateMiningYield(amount: number, isRepeatOrder: boolean): number {
        const baseYield = Math.floor(amount / 100000); // 1 pt per 100k
        const bonus = isRepeatOrder ? 5 : 0;
        return baseYield + bonus;
    }

    // Logic: Referral Tree Validation
    public processReferralBlock(referrerId: string, transactionAmount: number): { referrerYield: number, refereeYield: number } {
        // Validation: Transaction must be > 3.000.000 for full yield
        if (transactionAmount < 3000000) {
            return { referrerYield: 5, refereeYield: 5 }; // Micro-yield
        }
        return { referrerYield: 25, refereeYield: 20 }; // Full Block Reward
    }

    public getRedemptionMatrix(): RedemptionTier[] {
        return [
            { cost: 50, rewardId: 'CASH_VOUCHER_50K', description: 'Diskon Rp 50.000', valueEstimate: 50000 },
            { cost: 100, rewardId: 'FREE_NASIBOX_10', description: 'Gratis 10 Nasi Kotak', valueEstimate: 350000 },
            { cost: 200, rewardId: 'FREE_TUMPENG_MINI', description: 'Gratis Tumpeng Mini', valueEstimate: 550000 },
            { cost: 500, rewardId: 'FREE_AQIQAH_BASIC', description: 'Gratis Paket Aqiqah Basic', valueEstimate: 2350000 },
            { cost: 1000, rewardId: 'FREE_WEDDING_INTIMATE', description: 'Gratis Catering Intimate 50 Pax', valueEstimate: 4250000 }
        ];
    }
}
