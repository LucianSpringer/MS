// src/core/ux/RetentionNeuralNet.ts
// ENTERPRISE PROTOCOL: Heuristic Engine for User Retention & Feature Unlocking

export interface UserState {
    id: string;
    orderCount: number;
    totalSpend: number;
    lastLogin: number;
    tier: 'SILVER' | 'GOLD' | 'PLATINUM';
}

export class RetentionNeuralNet {

    // Defines which features are "Unlocked" based on user state
    public resolveFeatureAccess(user: UserState): string[] {
        const features: string[] = ['DASHBOARD_BASIC'];

        // Logic: "Unlock Gold Features"
        if (user.orderCount > 0 || user.tier !== 'SILVER') {
            features.push('REPEAT_ORDER_ONE_CLICK');
            features.push('LOYALTY_LEDGER');
            features.push('SAVED_MENUS');
        }

        // Logic: "Corporate Dashboard"
        if (user.totalSpend > 5000000) {
            features.push('CORPORATE_DASHBOARD');
            features.push('AUTO_INVOICE_GENERATOR');
        }

        // Logic: "Exclusive Menu"
        if (user.tier === 'GOLD' || user.tier === 'PLATINUM') {
            features.push('EXCLUSIVE_MENU_ACCESS'); // e.g., Kambing Guling Mini
        }

        return features;
    }

    // Logic: "Repeat Order Prediction"
    // Calculates probability that user wants to repeat last order
    public predictReorderProbability(user: UserState): number {
        const daysSinceLastLogin = (Date.now() - user.lastLogin) / (1000 * 60 * 60 * 24);

        // Simple heuristic curve
        if (daysSinceLastLogin > 30) return 0.8; // High probability after 1 month
        if (daysSinceLastLogin > 7) return 0.4;
        return 0.1;
    }
}
