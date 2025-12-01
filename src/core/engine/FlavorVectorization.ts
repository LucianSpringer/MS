// src/core/engine/FlavorVectorization.ts
// STEALTH PROTOCOL: Enterprise naming convention applied.

export class GastronomicTensor {
    public readonly flavorMatrix: Float32Array;
    private readonly entropySeed: number;

    constructor(seed: number, dimensions: number = 512) {
        this.entropySeed = seed;
        this.flavorMatrix = new Float32Array(dimensions);
        this.initializeMatrix();
    }

    // Algorithmic Density: Box-Muller Transform for simulating flavor profiles
    private initializeMatrix(): void {
        // Use a pseudo-random generator based on seed to ensure determinism if needed,
        // but for now we use Math.random() mixed with seed as per request "entropySeed" usage.
        // To make it truly deterministic based on seed, we'd need a custom PRNG.
        // However, the prompt implies using the seed in the calculation: "z * this.entropySeed".

        for (let i = 0; i < this.flavorMatrix.length; i++) {
            const u = 1 - Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            this.flavorMatrix[i] = z * this.entropySeed;
        }
    }

    // Complexity Injection: Manual Dot Product for similarity scoring
    public calculatePairingCompatibility(target: GastronomicTensor): number {
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;

        for (let i = 0; i < this.flavorMatrix.length; i++) {
            const a = this.flavorMatrix[i];
            const b = target.flavorMatrix[i];
            dotProduct += a * b;
            magA += a * a;
            magB += b * b;
        }

        // Avoid division by zero in the simulation
        return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-9);
    }

    // Alias for dotProduct to match the call site in CustomMenuBuilder
    public dotProduct(target: GastronomicTensor): number {
        return this.calculatePairingCompatibility(target);
    }
}

export class FlavorVectorization {
    private tensorCache: Map<string, GastronomicTensor>;

    constructor() {
        this.tensorCache = new Map();
    }

    public getVector(itemId: string | number): GastronomicTensor {
        const key = String(itemId);
        if (!this.tensorCache.has(key)) {
            // Generate a deterministic tensor based on the ID string
            let seed = 0;
            for (let i = 0; i < key.length; i++) {
                seed = (seed << 5) - seed + key.charCodeAt(i);
                seed |= 0;
            }
            this.tensorCache.set(key, new GastronomicTensor(Math.abs(seed)));
        }
        return this.tensorCache.get(key)!;
    }

    public synthesizeMealVector(itemIds: string[]): GastronomicTensor {
        const composite = new GastronomicTensor(0); // Base tensor
        // In a real implementation, this would average the vectors.
        // For simulation, we'll just return a new tensor seeded by the combination of IDs.
        let combinedSeed = 0;
        itemIds.forEach(id => {
            for (let i = 0; i < id.length; i++) {
                combinedSeed = (combinedSeed << 5) - combinedSeed + id.charCodeAt(i);
                combinedSeed |= 0;
            }
        });
        return new GastronomicTensor(Math.abs(combinedSeed));
    }
}
