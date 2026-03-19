import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Zap, Shield, ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center text-center pt-12 md:pt-24 space-y-12 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 max-w-4xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    AI-Powered Machine Learning
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    Automate Your <br />
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">ML Workflow</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Upload your dataset and let our engine handle preprocessing, EDA, model training, and hyperparameter tuning automatically. Get production-ready models in minutes.
                </p>

                <div className="pt-8 space-y-4 flex justify-center">
                    <button
                        onClick={onStart}
                        className="btn-primary py-4 px-10 text-lg group"
                    >
                        Start Your First Training
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
            >
                <FeatureCard
                    icon={<Zap className="text-amber-400" />}
                    title="Fast Processing"
                    desc="Optimized C++ backends for XGBoost and LightGBM handle millions of rows efficiently."
                />
                <FeatureCard
                    icon={<BarChart3 className="text-emerald-400" />}
                    title="Auto EDA"
                    desc="Comprehensive visualizations and statistical analysis generated instantly for your data."
                />
                <FeatureCard
                    icon={<Shield className="text-blue-400" />}
                    title="Best Model Selection"
                    desc="Automatic hyperparameter tuning using Optuna to ensure maximum accuracy."
                />
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass p-8 rounded-2xl flex flex-col items-center text-center card-hover">
        <div className="p-4 bg-white/5 rounded-2xl mb-6">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
