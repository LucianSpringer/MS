// src/core/compliance/LiturgicalValidator.ts
// Mengubah "Tips" menjadi "Validation Rules"

export interface LiturgicalRule {
    ruleId: string;
    severity: 'MANDATORY' | 'RECOMMENDED';
    validationLogic: (ctx: any) => boolean;
    description: string;
}

export class LiturgicalComplianceEngine {
    private rules: LiturgicalRule[] = [];

    constructor() {
        this.initializeCanon();
    }

    private initializeCanon(): void {
        // Tip 1: H-14 Rule
        this.rules.push({
            ruleId: 'TEMPORAL_CONSTRAINT_14D',
            severity: 'MANDATORY',
            validationLogic: (ctx) => ctx.daysUntilEvent >= 14,
            description: 'Supply chain latency requirement for livestock health verification.'
        });

        // Tip 3: Syar'i Packaging (Batik/Kaligrafi)
        this.rules.push({
            ruleId: 'VISUAL_MODESTY_PROTOCOL',
            severity: 'RECOMMENDED',
            validationLogic: (ctx) => ctx.packagingType === 'BATIK' || ctx.packagingType === 'CALLIGRAPHY',
            description: 'Visual compliance with local modest culture standards.'
        });

        // Tip 6: Social Redistribution (Panti Asuhan)
        this.rules.push({
            ruleId: 'SOCIAL_DIVIDEND_ALLOCATION',
            severity: 'RECOMMENDED',
            validationLogic: (ctx) => ctx.charityAllocation >= 10, // Min 10 porsi
            description: 'Automatic routing of excess inventory to orphanage nodes.'
        });
    }

    public validateEventManifest(context: any): string[] {
        const violations: string[] = [];
        for (const rule of this.rules) {
            if (!rule.validationLogic(context)) {
                violations.push(`[${rule.severity}] ${rule.description}`);
            }
        }
        return violations;
    }

    public getRules(): LiturgicalRule[] {
        return this.rules;
    }
}
