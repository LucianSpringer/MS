// src/core/analytics/SentimentTensorEngine.ts
// ENTERPRISE PROTOCOL: Natural Language Vectorization & Sentiment Scoring

export interface SentimentVector {
    magnitude: number; // 0 to 1
    polarity: number;  // -1 (Negative) to 1 (Positive)
    entropy: number;   // Confusion metric
}

export class SentimentTensorEngine {
    private vocabulary: Map<string, number>;
    private stopWords: Set<string>;

    constructor() {
        this.vocabulary = new Map();
        this.stopWords = new Set(['yang', 'di', 'ke', 'dari', 'ini', 'itu', 'dan', 'atau']);
        this.seedVocabulary();
    }

    private seedVocabulary(): void {
        // Manual Sentiment Weighting
        this.vocabulary.set('enak', 0.8);
        this.vocabulary.set('lezat', 0.9);
        this.vocabulary.set('mantap', 0.7);
        this.vocabulary.set('puas', 0.8);
        this.vocabulary.set('kurang', -0.4);
        this.vocabulary.set('asin', -0.3);
        this.vocabulary.set('telat', -0.8);
        this.vocabulary.set('dingin', -0.5);
        this.vocabulary.set('mahal', -0.2);
        this.vocabulary.set('rekomendasi', 0.9);
    }

    public analyzeTextBatch(reviews: string[]): SentimentVector {
        let totalMagnitude = 0;
        let totalPolarity = 0;

        for (const review of reviews) {
            const vector = this.vectorize(review);
            totalMagnitude += vector.magnitude;
            totalPolarity += vector.polarity;
        }

        const count = reviews.length || 1;
        return {
            magnitude: totalMagnitude / count,
            polarity: totalPolarity / count,
            entropy: Math.abs(totalPolarity - totalMagnitude) // Simulated entropy
        };
    }

    private vectorize(text: string): SentimentVector {
        const tokens = this.tokenize(text);
        let score = 0;
        let matches = 0;

        tokens.forEach(token => {
            if (this.vocabulary.has(token)) {
                score += this.vocabulary.get(token)!;
                matches++;
            }
        });

        // TF-IDF Simulation (Term Frequency only here)
        const magnitude = matches / (tokens.length || 1);

        // Normalize polarity -1 to 1
        const polarity = Math.max(-1, Math.min(1, score));

        return {
            magnitude,
            polarity,
            entropy: 0 // Calculated at batch level
        };
    }

    private tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(w => !this.stopWords.has(w) && w.length > 2);
    }
}
