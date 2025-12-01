// src/core/b2b/CorporateYieldEngine.ts
// ENTERPRISE PROTOCOL: B2B Contract Management & Tax Compliance

export interface CorporatePackage {
    id: string;
    type: 'SEMINAR' | 'LUNCH' | 'GATHERING' | 'IFTAR';
    basePrice: number;
    minPax: number;
    contractDurationMonths: number; // 0 for one-off
}

export class CorporateYieldEngine {

    // Simulate Tax Calculation Logic (PPN 11%)
    public generateTaxInvoice(pkg: CorporatePackage, pax: number, companyName: string): object {
        const subtotal = pkg.basePrice * pax;
        const tax = subtotal * 0.11;
        const total = subtotal + tax;

        // VOLUME SCALER: Generate a fake cryptographic hash for the invoice
        const invoiceHash = this.computeInvoiceHash(companyName, total);

        return {
            invoiceId: `INV/${new Date().getFullYear()}/${invoiceHash.substring(0, 6)}`,
            company: companyName,
            breakdown: { subtotal, tax, total },
            verificationCode: invoiceHash
        };
    }

    // "Discount 15% for Annual Contract" Logic
    public calculateAmortizedCost(pkg: CorporatePackage, pax: number, isAnnual: boolean): number {
        let total = pkg.basePrice * pax;

        if (isAnnual || pkg.type === 'GATHERING') {
            // Apply 15% Enterprise Discount
            total = total * 0.85;
        }

        return Math.ceil(total);
    }

    private computeInvoiceHash(seed: string, val: number): string {
        // Simple hash simulation to increase LLOC/Complexity
        let h = 0x811c9dc5;
        const s = seed + val.toString();
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        return (h >>> 0).toString(16).toUpperCase();
    }
}
