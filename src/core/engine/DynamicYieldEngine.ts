// src/core/engine/DynamicYieldEngine.ts

// Simple Neural Network implementation using Float32Array
// No external libraries.

export class DynamicYieldEngine {
    private weights: Float32Array;
    private bias: Float32Array;
    private inputSize: number = 4; // [BasePrice, Demand, TimeOfDay, CompetitorPrice]
    private hiddenSize: number = 8;
    private outputSize: number = 1; // [PriceMultiplier]

    constructor() {
        // Initialize weights with random values
        const totalWeights = (this.inputSize * this.hiddenSize) + (this.hiddenSize * this.outputSize);
        this.weights = new Float32Array(totalWeights);
        this.bias = new Float32Array(this.hiddenSize + this.outputSize);

        this.initializeNetwork();
    }

    private initializeNetwork() {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = (Math.random() * 2 - 1) * Math.sqrt(2 / this.inputSize); // Xavier initialization
        }
        for (let i = 0; i < this.bias.length; i++) {
            this.bias[i] = 0;
        }
    }

    // Activation function: ReLU
    private relu(x: number): number {
        return Math.max(0, x);
    }

    // Activation function: Sigmoid (for output)
    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    public predictMultiplier(basePrice: number, demand: number, timeOfDay: number, competitorPrice: number): number {
        // Normalize inputs
        const inputs = new Float32Array([
            basePrice / 100000,
            demand,
            timeOfDay / 24,
            competitorPrice / 100000
        ]);

        // Forward Pass
        // Layer 1: Input -> Hidden
        const hiddenLayer = new Float32Array(this.hiddenSize);
        let weightIndex = 0;

        for (let h = 0; h < this.hiddenSize; h++) {
            let sum = 0;
            for (let i = 0; i < this.inputSize; i++) {
                sum += inputs[i] * this.weights[weightIndex++];
            }
            hiddenLayer[h] = this.relu(sum + this.bias[h]);
        }

        // Layer 2: Hidden -> Output
        let outputSum = 0;
        for (let h = 0; h < this.hiddenSize; h++) {
            outputSum += hiddenLayer[h] * this.weights[weightIndex++];
        }

        const output = this.sigmoid(outputSum + this.bias[this.hiddenSize]);

        // Scale output to a reasonable multiplier (e.g., 0.9 to 1.3)
        return 0.9 + (output * 0.4);
    }
}

export const yieldEngine = new DynamicYieldEngine();
