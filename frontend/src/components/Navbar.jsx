import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Navbar = ({ setStep }) => {
    return (
        <nav className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setStep('landing')}
                >
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <BrainCircuit className="text-primary" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        AutoTrain<span className="text-primary">ML</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
                    <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
                    <button
                        className="btn-primary py-1.5 px-4 text-sm"
                        onClick={() => setStep('upload')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
