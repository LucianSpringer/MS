export interface LivestockData {
    id: string;
    breed: string;
    weightKg: number;
    ageMonths: number;
    healthScore: number; // 0.0 - 1.0
    originFarm: string;
    vaccinationStatus: 'Complete' | 'Partial' | 'Pending';
    photoUrl: string;
}

export class LivestockTraceabilityEngine {
    private livestockRegistry: Map<string, LivestockData>;

    constructor() {
        this.livestockRegistry = new Map();
        this.hydrateLivestockData();
    }

    private hydrateLivestockData(): void {
        // Simulate premium livestock data
        const breeds = ['Etawa Cross', 'Boer', 'Garut Premium', 'Merino'];
        const farms = ['Berkah Farm Bogor', 'Mandiri Farm Cianjur', 'Alam Segar Sukabumi'];

        for (let i = 0; i < 20; i++) {
            const id = `LS-${2024000 + i}`;
            const breed = breeds[Math.floor(Math.random() * breeds.length)];
            const weight = 25 + Math.random() * 15; // 25-40kg
            const health = 0.9 + (Math.random() * 0.1); // 0.9 - 1.0 (Premium Quality)

            this.livestockRegistry.set(id, {
                id,
                breed,
                weightKg: parseFloat(weight.toFixed(2)),
                ageMonths: 12 + Math.floor(Math.random() * 12),
                healthScore: parseFloat(health.toFixed(3)),
                originFarm: farms[Math.floor(Math.random() * farms.length)],
                vaccinationStatus: 'Complete',
                photoUrl: `https://source.unsplash.com/random/300x200?goat,sheep&sig=${i}`
            });
        }
    }

    public getAvailableLivestock(): LivestockData[] {
        return Array.from(this.livestockRegistry.values());
    }

    public getLivestockById(id: string): LivestockData | undefined {
        return this.livestockRegistry.get(id);
    }

    public assignLivestockToOrder(orderId: string): LivestockData {
        // In a real system, this would lock the ID. Here we just pick a random one.
        const all = this.getAvailableLivestock();
        return all[Math.floor(Math.random() * all.length)];
    }
}
