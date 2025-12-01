// src/core/payment/FinancialRoutingMesh.ts
// ENTERPRISE PROTOCOL: Multi-Gateway Redundancy & Syariah Routing Layer

export enum GatewayProvider {
    MIDTRANS = 'MIDTRANS_CORE',
    XENDIT = 'XENDIT_FIN',
    DUITKU = 'DUITKU_PAY',
    LINKAJA_SYARIAH = 'LINKAJA_SYARIAH_MERCHANT',
    BSI_NET = 'BANK_SYARIAH_INDONESIA',
    CRYPTO_NODE = 'USDT_ERC20_BRIDGE'
}

export enum PaymentChannel {
    QRIS_UNIVERSAL = 'QRIS_UNIVERSAL', // Midtrans/Duitku
    VA_STANDARD = 'VA_STANDARD',      // Midtrans/Xendit
    VA_SYARIAH = 'VA_SYARIAH',        // BSI/Muamalat
    CREDIT_CARD_INSTALLMENT = 'CC_INSTALLMENT_0PCT',
    PAYLATER_AGGREGATOR = 'PAYLATER_AKULAKU_KREDIVO',
    SPLIT_DP_30 = 'CUSTOM_SPLIT_DP'
}

interface GatewayHealth {
    provider: GatewayProvider;
    latencyMs: number;
    successRate: number; // 0.0 - 1.0
    isSyariahCompliant: boolean;
}

export class FinancialRoutingMesh {
    private healthRegistry: Map<GatewayProvider, GatewayHealth>;

    constructor() {
        this.healthRegistry = new Map();
        this.runHealthCheckSequence();
    }

    // SIMULATION: Randomize gateway health to force "Smart Routing" logic
    private runHealthCheckSequence(): void {
        Object.values(GatewayProvider).forEach(provider => {
            this.healthRegistry.set(provider, {
                provider,
                latencyMs: 50 + Math.random() * 200,
                successRate: 0.98 + (Math.random() * 0.02),
                isSyariahCompliant: provider === GatewayProvider.BSI_NET || provider === GatewayProvider.LINKAJA_SYARIAH
            });
        });
    }

    // LOGIC: "Recommended Combo" Selection
    public resolveOptimalRoute(channel: PaymentChannel, amount: number): GatewayProvider {
        // Logic: High Value Wedding Orders (> 10jt) route to High Reliability Gateways
        if (amount > 10000000 && channel === PaymentChannel.VA_STANDARD) {
            return this.getLowestLatencyProvider([GatewayProvider.MIDTRANS, GatewayProvider.XENDIT]);
        }

        // Logic: Syariah Compliance Enforcement
        if (channel === PaymentChannel.VA_SYARIAH) {
            return GatewayProvider.BSI_NET;
        }

        // Logic: PayLater (Akulaku/Kredivo) aggregation
        if (channel === PaymentChannel.PAYLATER_AGGREGATOR) {
            return GatewayProvider.MIDTRANS; // Midtrans supports PayLater
        }

        // Default Fallback
        return GatewayProvider.DUITKU;
    }

    private getLowestLatencyProvider(candidates: GatewayProvider[]): GatewayProvider {
        let best = candidates[0];
        let minLatency = Infinity;

        for (const c of candidates) {
            const health = this.healthRegistry.get(c);
            if (health && health.latencyMs < minLatency) {
                minLatency = health.latencyMs;
                best = c;
            }
        }
        return best;
    }

    // Feature: Split Payment Calculation (DP 30%)
    public generateAmortizationSchedule(total: number): { dp: number, remaining: number, dueDate: string } {
        const dp = Math.ceil(total * 0.30);
        const remaining = total - dp;

        // H-3 Calculation
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Wedding assumption H+30, payment due H-3
        dueDate.setDate(dueDate.getDate() - 3);

        return {
            dp,
            remaining,
            dueDate: dueDate.toISOString()
        };
    }
}
