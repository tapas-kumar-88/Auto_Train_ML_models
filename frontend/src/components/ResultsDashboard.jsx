import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Download,
    BarChart3,
    LayoutDashboard,
    Repeat,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

const ResultsDashboard = ({ results, onReset }) => {
    const [activeTab, setActiveTab] = useState('leaderboard'); // leaderboard, visualizations

    const API_BASE = 'http://localhost:8000';

    const bestModel = results?.leaderboard?.find(m => m.model_name === results?.best_model);

    return (
        <div className="max-w-7xl mx-auto pt-8 pb-20 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">Training Complete</h1>
                    <p className="text-slate-400">Task for target: <span className="text-primary font-bold">{results.target}</span> ({results.problem_type})</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border hover:bg-white/5 transition-colors"
                    >
                        <Repeat size={18} /> New Dataset
                    </button>
                    <a
                        href={`${API_BASE}/download-model`}
                        className="btn-primary group"
                    >
                        <Download size={18} /> Download Best Model
                    </a>
                </div>
            </div>

            {/* Best Model Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
            >
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"></div>
                <div className="relative flex flex-col md:flex-row gap-12 items-center">
                    <div className="p-10 bg-primary/20 rounded-full border border-primary/30 relative">
                        <Trophy className="text-primary" size={60} />
                        <div className="absolute -bottom-2 -right-2 bg-accent p-2 rounded-full border-4 border-background">
                            <CheckCircle2 className="text-white" size={20} />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Best Performance</h2>
                        <h3 className="text-5xl font-black">{results.best_model}</h3>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                            {bestModel?.metrics && Object.entries(bestModel.metrics).map(([key, value]) => (
                                typeof value === 'number' && (
                                    <div key={key} className="px-5 py-3 bg-white/5 rounded-2xl border border-border/50">
                                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">{key.replace('_', ' ')}</p>
                                        <p className="text-2xl font-black text-emerald-400">{value.toFixed(4)}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <LayoutDashboard size={18} /> Leaderboard
                </button>
                <button
                    onClick={() => setActiveTab('visualizations')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'visualizations' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <BarChart3 size={18} /> EDA & Metrics
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'leaderboard' ? (
                    <motion.div
                        key="lb"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass rounded-3xl overflow-hidden"
                    >
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-border">
                                <tr>
                                    <th className="px-8 py-4 font-bold">Model Name</th>
                                    <th className="px-8 py-4 font-bold">Primary Metric</th>
                                    <th className="px-8 py-4 font-bold text-center">Status</th>
                                    <th className="px-8 py-4 font-bold text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {results?.leaderboard?.map((model, i) => (
                                    <tr key={i} className={`hover:bg-white/5 transition-colors ${model.model_name === results.best_model ? 'bg-primary/5' : ''}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                                                <span className="font-bold">{model.model_name}</span>
                                                {model.tuned && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full uppercase font-bold">Tuned</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-mono text-emerald-400">
                                            {results.problem_type === 'classification' ?
                                                `Acc: ${(model.metrics.accuracy * 100).toFixed(2)}%` :
                                                `R2: ${model.metrics.r2_score.toFixed(4)}`}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold">Passed</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-slate-500 hover:text-primary"><ExternalLink size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div
                        key="vis"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {Object.entries(results?.eda_plots || {}).map(([key, path]) => (
                            <div key={key} className="glass rounded-3xl p-6 space-y-4">
                                <h4 className="text-lg font-bold capitalize">{key.replace('_', ' ')}</h4>
                                <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center border border-border/50">
                                    <img
                                        src={`${API_BASE}/reports/${path.split(/[\\/]/).pop()}`}
                                        alt={key}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Chart+Preview'; }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Feature Importance of Best Model */}
                        {bestModel.importance_plot && (
                            <div className="glass rounded-3xl p-6 md:col-span-2 space-y-4">
                                <h4 className="text-lg font-bold">Feature Importance ({results.best_model})</h4>
                                <div className="aspect-[21/9] bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center border border-border/50">
                                    <img
                                        src={`${API_BASE}/reports/${bestModel.importance_plot.split(/[\\/]/).pop()}`}
                                        alt="Importance"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResultsDashboard;
