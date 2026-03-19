import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Circle, Settings, BarChart2, Cpu, Zap } from 'lucide-react';
import { getJobStatus, getResults } from '../services/api';

const TrainingDashboard = ({ datasetId, onComplete }) => {
    const [status, setStatus] = useState('processing');
    const [progress, setProgress] = useState(10);
    const [currentTask, setCurrentTask] = useState('Data Validation');

    const tasks = [
        { name: 'Data Validation', step: 10, icon: <CheckCircle2 size={18} /> },
        { name: 'Data Preprocessing', step: 30, icon: <Settings size={18} /> },
        { name: 'EDA Generation', step: 45, icon: <BarChart2 size={18} /> },
        { name: 'Model Training (Ensemble)', step: 70, icon: <Cpu size={18} /> },
        { name: 'Hyperparameter Tuning', step: 90, icon: <Zap size={18} /> },
    ];

    useEffect(() => {
        let interval = setInterval(async () => {
            try {
                const data = await getJobStatus(datasetId);
                if (data.status === 'completed') {
                    // Get final results manually if status is completed
                    const finalResults = await getResults(datasetId);
                    onComplete(finalResults);
                    clearInterval(interval);
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    clearInterval(interval);
                } else {
                    // Fake progress based on time for UI feel, while real training happens
                    setProgress(prev => Math.min(prev + 2, 98));
                    if (progress < 25) setCurrentTask('Data Preprocessing');
                    else if (progress < 50) setCurrentTask('EDA Generation');
                    else if (progress < 80) setCurrentTask('Model Training');
                    else setCurrentTask('Hyperparameter Tuning');
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [datasetId, onComplete, progress]);

    return (
        <div className="max-w-4xl mx-auto pt-12">
            <div className="glass rounded-3xl p-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: `${progress - 100}%` }}
                        className="h-full bg-gradient-to-r from-primary via-secondary to-primary w-full"
                    />
                </div>

                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative p-8 bg-background border border-border rounded-full ring-8 ring-white/5">
                            <Loader2 className="animate-spin text-primary" size={60} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-black">AI is Training...</h2>
                        <p className="text-slate-400 text-lg">Currently performing: <span className="text-primary font-bold">{currentTask}</span></p>
                    </div>

                    <div className="w-full max-w-md space-y-6 pt-8">
                        {tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-4 transition-all duration-500">
                                <div className={`p-2 rounded-lg ${progress >= task.step ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                                    {progress >= task.step ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] border-2 border-current rounded-full" />}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className={`font-semibold ${progress >= task.step ? 'text-white' : 'text-slate-500'}`}>{task.name}</p>
                                </div>
                                {progress >= task.step - 10 && progress < task.step && (
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 text-slate-500 text-sm italic">
                        "We are testing multiple algorithms including XGBoost, SVM, and Random Forest..."
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingDashboard;
