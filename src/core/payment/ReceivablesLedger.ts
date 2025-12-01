// src/core/payment/ReceivablesLedger.ts
// ENTERPRISE PROTOCOL: Accounts Receivable & Aging Schedule

export interface ReceivableRecord {
    invoiceId: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    agingDays: number;
    status: 'CURRENT' | 'OVERDUE' | 'DEFAULT';
    reminderCount: number;
}

export class ReceivablesLedger {
    private ledger: Map<string, ReceivableRecord>;

    constructor() {
        this.ledger = new Map();
    }

    public registerInvoice(invoiceId: string, total: number, dp: number): void {
        this.ledger.set(invoiceId, {
            invoiceId,
            totalAmount: total,
            paidAmount: dp,
            outstandingAmount: total - dp,
            agingDays: 0,
            status: 'CURRENT',
            reminderCount: 0
        });
    }

    // Logic: Daily Reconciliation Process
    public runDailyAgingProcess(): string[] {
        const actionRequired: string[] = [];

        this.ledger.forEach((record, id) => {
            if (record.outstandingAmount <= 0) return;

            record.agingDays++;

            // Logic: H-3 Automatic Reminder (As requested)
            // Assuming 'dueDate' was calculated externally, we simulate "days remaining"
            // If agingDays crosses a threshold, trigger WA

            if (record.agingDays === 3 && record.reminderCount === 0) {
                actionRequired.push(`TRIGGER_WA_REMINDER:${id}:H-3_PAYMENT`);
                record.reminderCount++;
            }

            // Update Status
            if (record.agingDays > 30) {
                record.status = 'OVERDUE';
            }
        });

        return actionRequired;
    }

    public getOutstandingBalance(): number {
        let total = 0;
        this.ledger.forEach(r => total += r.outstandingAmount);
        return total;
    }
}
