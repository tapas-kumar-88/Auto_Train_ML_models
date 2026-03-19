import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Table as TableIcon, Target, BrainCircuit } from 'lucide-react';

const SelectionPage = ({ dataset, onStartTraining, onBack }) => {
    const [selectedCol, setSelectedCol] = useState('');

    const handleStart = () => {
        if (selectedCol) {
            onStartTraining(selectedCol);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pt-8 space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} /> Back to Upload
                </button>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-xs font-bold uppercase">
                    Dataset Analysis Ready
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-3xl overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <TableIcon className="text-secondary" />
                            <h2 className="text-2xl font-bold">Data Preview</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b border-border bg-white/5">
                                    <tr>
                                        {dataset.columns.map(col => (
                                            <th key={col} className="px-4 py-3 font-semibold text-slate-300">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {dataset.preview.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            {dataset.columns.map(col => (
                                                <td key={col} className="px-4 py-3 text-slate-400">{row[col]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-8 rounded-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="text-primary" />
                            <h2 className="text-2xl font-bold">Configure Task</h2>
                        </div>

                        <p className="text-slate-400 text-sm mb-6">
                            Select the target column you want to predict. Our engine will automatically detect if this is a Classification or Regression problem.
                        </p>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-300">Target Variable</label>
                            <select
                                value={selectedCol}
                                onChange={(e) => setSelectedCol(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select a column...</option>
                                {dataset.columns.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-12 space-y-4">
                            <button
                                onClick={handleStart}
                                disabled={!selectedCol}
                                className={`btn-primary w-full py-4 ${!selectedCol ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <BrainCircuit size={20} />
                                Start Auto-Pipeline
                            </button>
                            <p className="text-center text-xs text-slate-500">
                                This will run EDA, Preprocessing, and Train 10+ Models.
                            </p>
                        </div>
                    </motion.div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <h4 className="font-bold mb-2">Did you know?</h4>
                        <p className="text-sm text-slate-400">
                            Categorical targets will trigger a Classification pipeline, while continuous values will trigger Regression.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
