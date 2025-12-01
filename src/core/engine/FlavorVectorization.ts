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
}
