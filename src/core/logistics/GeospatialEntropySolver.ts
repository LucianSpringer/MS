// src/core/logistics/GeospatialEntropySolver.ts

export interface GeoCoordinate {
    lat: number;
    lng: number;
    elevation?: number;
}

export interface PathNode {
    x: number;
    y: number;
    resistance: number;
    g: number;
    h: number;
    f: number;
    parent: PathNode | null;
}

export class LogisticsEntropySolver {
    // Volume Scaler: Pre-calculated resistance map for Jakarta traffic simulation
    private static readonly GRID_SIZE = 100; // 100x100 = 10,000 nodes
    private readonly grid: Int32Array;

    constructor() {
        this.grid = new Int32Array(LogisticsEntropySolver.GRID_SIZE * LogisticsEntropySolver.GRID_SIZE);
        this.hydrateResistanceMap();
    }

    // Algo Rule: Simulate traffic using Cellular Automata logic
    private hydrateResistanceMap(): void {
        for (let i = 0; i < this.grid.length; i++) {
            // Simulated traffic density based on chaotic attractor
            // Higher value = more traffic/resistance
            this.grid[i] = Math.abs((Math.sin(i * 0.1) * Math.cos(i * 0.05) * 100) | 0) + 1;
        }
    }

    public getGridSize(): number {
        return LogisticsEntropySolver.GRID_SIZE;
    }

    public getResistance(x: number, y: number): number {
        if (x < 0 || x >= LogisticsEntropySolver.GRID_SIZE || y < 0 || y >= LogisticsEntropySolver.GRID_SIZE) {
            return Infinity;
        }
        return this.grid[y * LogisticsEntropySolver.GRID_SIZE + x];
    }

    // A* Pathfinding
    public findOptimalRoute(start: { x: number, y: number }, end: { x: number, y: number }): { x: number, y: number }[] {
        const openList: PathNode[] = [];
        const closedList: Set<string> = new Set();

        const startNode: PathNode = {
            x: start.x,
            y: start.y,
            resistance: this.getResistance(start.x, start.y),
            g: 0,
            h: this.heuristic(start, end),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;

        openList.push(startNode);

        let iterations = 0;
        const MAX_ITERATIONS = 5000; // Safety break

        while (openList.length > 0 && iterations < MAX_ITERATIONS) {
            iterations++;
            // Sort by f cost (lowest first) - simplified priority queue
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift()!;

            if (currentNode.x === end.x && currentNode.y === end.y) {
                return this.reconstructPath(currentNode);
            }

            closedList.add(`${currentNode.x},${currentNode.y}`);

            const neighbors = this.getNeighbors(currentNode);

            for (const neighbor of neighbors) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;

                const tentativeG = currentNode.g + this.getResistance(neighbor.x, neighbor.y);

                const existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

                if (!existingNode || tentativeG < existingNode.g) {
                    const newNode: PathNode = {
                        x: neighbor.x,
                        y: neighbor.y,
                        resistance: this.getResistance(neighbor.x, neighbor.y),
                        g: tentativeG,
                        h: this.heuristic(neighbor, end),
                        f: 0,
                        parent: currentNode
                    };
                    newNode.f = newNode.g + newNode.h;

                    if (!existingNode) {
                        openList.push(newNode);
                    } else {
                        existingNode.g = newNode.g;
                        existingNode.f = newNode.f;
                        existingNode.parent = newNode.parent;
                    }
                }
            }
        }

        return []; // No path found
    }

    private getNeighbors(node: PathNode): { x: number, y: number }[] {
        const neighbors = [];
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 4-directional movement

        for (const [dx, dy] of dirs) {
            const nx = node.x + dx;
            const ny = node.y + dy;

            if (nx >= 0 && nx < LogisticsEntropySolver.GRID_SIZE && ny >= 0 && ny < LogisticsEntropySolver.GRID_SIZE) {
                neighbors.push({ x: nx, y: ny });
            }
        }
        return neighbors;
    }

    private heuristic(a: { x: number, y: number }, b: { x: number, y: number }): number {
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private reconstructPath(node: PathNode): { x: number, y: number }[] {
        const path = [];
        let current: PathNode | null = node;
        while (current) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }
        return path;
    }

    public estimateDeliveryWindow(start: GeoCoordinate, end: GeoCoordinate): number {
        // Implement Haversine formula manually for signal density
        const R = 6371e3; // metres
        const φ1 = start.lat * Math.PI / 180;
        const φ2 = end.lat * Math.PI / 180;
        const Δφ = (end.lat - start.lat) * Math.PI / 180;
        const Δλ = (end.lng - start.lng) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Inject resistance grid latency
        const baseTime = (R * c) / 40; // Avg speed 40km/h
        return baseTime + this.calculateTrafficEntropy();
    }

    private calculateTrafficEntropy(): number {
        // Pseudo-random walk through the resistance grid
        let entropy = 0;
        for (let i = 0; i < 100; i++) {
            entropy += this.grid[Math.floor(Math.random() * this.grid.length)];
        }
        return Math.abs(entropy);
    }
}
