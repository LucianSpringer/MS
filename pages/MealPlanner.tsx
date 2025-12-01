import React, { useState, useEffect } from 'react';
import { DietaryGraphEngine, NutrientNode } from '../src/core/scheduler/DietaryGraphEngine';
import Button from '../components/Button';
import { Calendar, RefreshCw, ChevronRight } from 'lucide-react';

const MealPlanner: React.FC = () => {
    const [engine] = useState(() => new DietaryGraphEngine());
    const [schedule, setSchedule] = useState<NutrientNode[]>([]);
    const [days, setDays] = useState(7);
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePlan = () => {
        setIsGenerating(true);
        // Simulate complex calculation delay
        setTimeout(() => {
            const newSchedule = engine.generateOptimalSchedule(days);
            setSchedule(newSchedule);
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <div className="bg-white dark:bg-darkSurface rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-white mb-2">
                            Dietary Graph Scheduler
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            AI-driven meal planning using Directed Acyclic Graph traversal for optimal nutritional density.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">Duration:</span>
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value={3}>3 Days</option>
                            <option value={5}>5 Days</option>
                            <option value={7}>7 Days</option>
                            <option value={14}>14 Days</option>
                        </select>
                        <Button onClick={generatePlan} disabled={isGenerating}>
                            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Calendar size={18} />}
                            <span className="ml-2">{isGenerating ? 'Optimizing...' : 'Generate Plan'}</span>
                        </Button>
                    </div>
                </div>

                {schedule.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedule.map((node, index) => (
                            <div key={`${node.id}-${index}`} className="relative group">
                                <div className="absolute -left-3 top-6 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold z-10 border-2 border-white dark:border-darkSurface">
                                    {index + 1}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all hover:shadow-lg ml-3">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{node.name}</h3>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            Score: {node.complexityScore.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex justify-between">
                                            <span>Protein</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${Math.min(node.protein * 2, 100)}%` }}></div>
                                            </div>
                                            <span className="font-mono">{node.protein}g</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Carbs</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${Math.min(node.carbs, 100)}%` }}></div>
                                            </div>
                                            <span className="font-mono">{node.carbs}g</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center text-xs text-gray-400">
                                        <ChevronRight size={14} className="mr-1" />
                                        <span>Graph Node ID: {node.id}</span>
                                    </div>
                                </div>
                                {index < schedule.length - 1 && (
                                    <div className="absolute left-0 bottom-[-1.5rem] w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-3"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-500">No Meal Plan Generated</h3>
                        <p className="text-gray-400 mt-2">Select duration and click Generate to start the graph traversal.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlanner;
