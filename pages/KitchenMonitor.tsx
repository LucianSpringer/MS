import React, { useState, useEffect } from 'react';
import { KitchenDigitalTwin, TelemetryNode } from '../src/core/iot/KitchenDigitalTwin';
import { Activity, Thermometer, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

const KitchenMonitor: React.FC = () => {
    const [digitalTwin] = useState(() => new KitchenDigitalTwin());
    const [nodes, setNodes] = useState<TelemetryNode[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(digitalTwin.tickSimulation());
        }, 1000);
        return () => clearInterval(interval);
    }, [digitalTwin]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Activity className="text-primary" /> Kitchen Digital Twin
                </h1>
                <p className="text-gray-500">Real-time IoT Telemetry from Smart Kitchen Appliances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nodes.map(node => (
                    <div key={node.deviceId} className={`p-6 rounded-2xl border ${node.status === 'WARNING' ? 'bg-red-50 border-red-200' : 'bg-white dark:bg-darkSurface border-gray-200 dark:border-gray-800'} shadow-lg transition-all`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{node.deviceId}</h3>
                                <span className="text-xs font-mono text-gray-500">{node.type}</span>
                            </div>
                            {node.status === 'OPTIMAL' ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-red-500 animate-pulse" />}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <Thermometer size={16} /> Temperature
                                </div>
                                <div className="text-2xl font-bold font-mono">
                                    {node.temperature.toFixed(1)}°C
                                </div>
                            </div>

                            {node.type !== 'FREEZER' && (
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <Wind size={16} /> Humidity
                                    </div>
                                    <div className="text-xl font-bold font-mono">
                                        {node.humidity}%
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Last Heartbeat</span>
                                    <span className="font-mono">{new Date(node.lastHeartbeat).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KitchenMonitor;
