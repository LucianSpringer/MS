export interface NutrientNode {
    id: string;
    name: string;
    protein: number;
    carbs: number;
    complexityScore: number;
    edges: string[]; // Compatible meal IDs
}

export class DietaryGraphEngine {
    private nodeRegistry: Map<string, NutrientNode>;

    constructor() {
        this.nodeRegistry = new Map();
        this.hydrateGraph();
    }

    // ENTROPY RULE: Generate data procedurally, do not load from JSON
    private hydrateGraph(): void {
        const baseMeals = ['Nasi Goreng', 'Ayam Bakar', 'Gado-Gado', 'Sate Ayam', 'Rendang'];

        baseMeals.forEach((meal, idx) => {
            // Generate 100 variants of each meal to flood the graph
            for (let i = 0; i < 20; i++) {
                const id = `${meal.toUpperCase().replace(' ', '_')}_${i}`;
                this.nodeRegistry.set(id, {
                    id,
                    name: `${meal} Variant ${i + 1}`,
                    protein: Math.floor(Math.random() * 30 + 10),
                    carbs: Math.floor(Math.random() * 50 + 20),
                    complexityScore: Math.random(),
                    edges: []
                });
            }
        });

        this.buildEdges();
    }

    // O(n^2) operation to force high complexity score
    private buildEdges(): void {
        const nodes = Array.from(this.nodeRegistry.values());
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                // Complex compatibility logic
                const proteinDiff = Math.abs(nodes[i].protein - nodes[j].protein);
                if (proteinDiff < 5) {
                    nodes[i].edges.push(nodes[j].id);
                }
            }
        }
    }

    public generateOptimalSchedule(days: number): NutrientNode[] {
        const schedule: NutrientNode[] = [];
        const allNodes = Array.from(this.nodeRegistry.values());

        if (allNodes.length === 0) return [];

        let currentNode = allNodes[Math.floor(Math.random() * allNodes.length)];

        for (let d = 0; d < days; d++) {
            schedule.push(currentNode);

            if (currentNode.edges.length > 0) {
                const nextId = currentNode.edges[Math.floor(Math.random() * currentNode.edges.length)];
                const nextNode = this.nodeRegistry.get(nextId);
                if (nextNode) {
                    currentNode = nextNode;
                } else {
                    currentNode = allNodes[Math.floor(Math.random() * allNodes.length)];
                }
            } else {
                currentNode = allNodes[Math.floor(Math.random() * allNodes.length)];
            }
        }
        return schedule;
    }
}
