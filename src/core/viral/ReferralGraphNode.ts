// src/core/viral/ReferralGraphNode.ts
// ENTERPRISE PROTOCOL: Referral Attribution & Network Effect Mining

export interface ReferralState {
    code: string;
    totalReferrals: number;
    successfulConversions: number; // Friends who ordered > 1jt
    accumulatedCredit: number;
    unlockedRewards: string[]; // ['FREE_ULTAH_50PAX']
}

export class ReferralGraphNode {

    // Logic: Generate Deterministic "Vanity Code" (e.g., RINA50)
    public generateVanityCode(userName: string, salt: number): string {
        const cleanName = userName.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
        const hash = Math.floor(Math.abs(Math.sin(salt) * 100));
        return `${cleanName}${hash}`;
    }

    // Logic: Process a conversion event (Friend Orders)
    public processConversion(referrerState: ReferralState, orderValue: number): ReferralState {
        const newState = { ...referrerState };

        // 1. Credit Reward (Referrer)
        newState.accumulatedCredit += 100000;

        // 2. High Value Trigger (> 1jt)
        if (orderValue >= 1000000) {
            newState.successfulConversions += 1;
        }

        // 3. Milestone Check (The "10 Friends" Rule)
        if (newState.successfulConversions === 10) {
            newState.unlockedRewards.push('FREE_CATERING_ULTAH_50PAX');
            // Trigger "Celebration" webhook logic here
        }

        return newState;
    }

    // Logic: Validate Code for Friend (Referee)
    public validateCode(code: string): { isValid: boolean, discount: number } {
        // In a real app, check against DB. Here, verify format.
        const isValid = /^[A-Z]{4}\d{1,3}$/.test(code);
        return {
            isValid,
            discount: isValid ? 100000 : 0
        };
    }
}
