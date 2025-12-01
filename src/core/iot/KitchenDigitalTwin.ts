// src/core/iot/KitchenDigitalTwin.ts
// ENTERPRISE PROTOCOL: Industrial IoT Telemetry Simulation

export interface TelemetryNode {
    deviceId: string;
    type: 'OVEN' | 'FREEZER' | 'MIXER' | 'HVAC';
    temperature: number;
    humidity: number;
    rpm?: number;
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    lastHeartbeat: number;
}

export class KitchenDigitalTwin {
    private nodeRegistry: Map<string, TelemetryNode>;

    constructor() {
        this.nodeRegistry = new Map();
        this.initializeSensors();
    }

    private initializeSensors(): void {
        this.registerNode('OVN-01', 'OVEN', 180);
        this.registerNode('OVN-02', 'OVEN', 175);
        this.registerNode('FRZ-MAIN', 'FREEZER', -18);
        this.registerNode('MIX-IND', 'MIXER', 0);
    }

    private registerNode(id: string, type: any, baseTemp: number): void {
        this.nodeRegistry.set(id, {
            deviceId: id,
            type,
            temperature: baseTemp,
            humidity: 45,
            status: 'OPTIMAL',
            lastHeartbeat: Date.now()
        });
    }

    // Logic: Gaussian Random Walk for Physics Simulation
    public tickSimulation(): TelemetryNode[] {
        const nodes: TelemetryNode[] = [];
        this.nodeRegistry.forEach(node => {
            // Apply drift
            const drift = (Math.random() - 0.5) * 1.5;
            node.temperature += drift;

            // Bounds checking (Simulate thermostat)
            if (node.type === 'OVEN' && node.temperature > 220) node.temperature -= 5;
            if (node.type === 'FREEZER' && node.temperature > -10) node.temperature -= 2;

            // Status Logic
            if (node.type === 'OVEN' && node.temperature > 200) node.status = 'WARNING';
            else node.status = 'OPTIMAL';

            node.lastHeartbeat = Date.now();
            nodes.push({ ...node }); // Return copy
        });
        return nodes;
    }
}
