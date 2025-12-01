// src/core/ux/DashboardViewGraph.ts
// ENTERPRISE PROTOCOL: User Interface State Graph & Widget Prioritization

export interface DashboardWidget {
    id: string;
    label: string;
    priorityScore: number; // 0-100
    renderCondition: (ctx: any) => boolean;
    colorHex: string;
}

export class DashboardViewGraph {
    private widgetRegistry: DashboardWidget[] = [];

    constructor() {
        this.initializeGraph();
    }

    private initializeGraph(): void {
        // 1. Repeat Order (Gold - Highest Priority)
        this.widgetRegistry.push({
            id: 'REPEAT_ORDER_1CLICK',
            label: '↻ Repeat Order 1-Click',
            priorityScore: 95,
            renderCondition: (ctx) => ctx.lastOrder !== null,
            colorHex: '#FFD700' // Gold
        });

        // 2. Loyalty Points
        this.widgetRegistry.push({
            id: 'LOYALTY_STATUS',
            label: '🏆 Poin Saya',
            priorityScore: 90,
            renderCondition: () => true,
            colorHex: '#FFFFFF'
        });

        // 3. Corporate Logo (Context Aware)
        this.widgetRegistry.push({
            id: 'CORP_BRANDING',
            label: '🏢 Corporate Branding',
            priorityScore: 85,
            renderCondition: (ctx) => ctx.userType === 'CORPORATE',
            colorHex: '#0000FF'
        });

        // 4. Birthday Reminder (Time Sensitive)
        this.widgetRegistry.push({
            id: 'BIRTHDAY_ALERT',
            label: '🎂 Family Birthday',
            priorityScore: 100, // Top priority if triggered
            renderCondition: (ctx) => ctx.isFamilyBirthdayMonth,
            colorHex: '#FF69B4'
        });

        // 5. Flash Sale (Member Exclusive)
        this.widgetRegistry.push({
            id: 'FLASH_SALE_VIP',
            label: '⚡ Flash Sale Exclusive',
            priorityScore: 80,
            renderCondition: (ctx) => ctx.isMember,
            colorHex: '#FF4500'
        });
    }

    // Algorithm: Sort widgets by calculated priority based on current context
    public resolveDashboardLayout(userContext: any): DashboardWidget[] {
        return this.widgetRegistry
            .filter(w => w.renderCondition(userContext))
            .sort((a, b) => {
                // Inject entropy into the sort for "Dynamic A/B Testing" simulation
                const entropy = (Math.random() * 5);
                return (b.priorityScore + entropy) - (a.priorityScore + entropy);
            });
    }
}
