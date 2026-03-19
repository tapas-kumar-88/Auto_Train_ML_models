import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Database,
  BarChart3,
  Download,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight
} from 'lucide-react';
import { uploadDataset, startTraining, getJobStatus, getResults } from './services/api';

// Components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import SelectionPage from './components/SelectionPage';
import TrainingDashboard from './components/TrainingDashboard';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [step, setStep] = useState('landing'); // landing, upload, selection, training, results
  const [dataset, setDataset] = useState(null);
  const [target, setTarget] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (data) => {
    setDataset(data);
    setStep('selection');
  };

  const handleStartTraining = async (targetCol) => {
    setTarget(targetCol);
    setStep('training');
    try {
      await startTraining(dataset.dataset_id, dataset.path, targetCol);
    } catch (err) {
      setError("Failed to start training");
    }
  };

  const handleTrainingComplete = (data) => {
    setResults(data);
    setStep('results');
  };

  return (
    <div className="min-h-screen text-text selection:bg-primary/30">
      <Navbar setStep={setStep} />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <LandingPage onStart={() => setStep('upload')} />
          )}

          {step === 'upload' && (
            <UploadPage onUploadSuccess={handleUploadSuccess} />
          )}

          {step === 'selection' && (
            <SelectionPage
              dataset={dataset}
              onStartTraining={handleStartTraining}
              onBack={() => setStep('upload')}
            />
          )}

          {step === 'training' && (
            <TrainingDashboard
              datasetId={dataset?.dataset_id}
              onComplete={handleTrainingComplete}
            />
          )}

          {step === 'results' && (
            <ResultsDashboard
              results={results}
              onReset={() => {
                setStep('landing');
                setDataset(null);
                setResults(null);
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center gap-3 backdrop-blur-md">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-4 hover:text-white">&times;</button>
        </div>
      )}
    </div>
  );
}

export default App;
