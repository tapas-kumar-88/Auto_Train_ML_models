import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { uploadDataset } from '../services/api';

const UploadPage = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError("Please select a valid CSV file");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const data = await uploadDataset(file);
            onUploadSuccess(data);
        } catch (err) {
            setError(err.response?.data?.detail || "Upload failed. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-12 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

                <h2 className="text-3xl font-bold mb-4">Upload Dataset</h2>
                <p className="text-slate-400 mb-12">Select your structured CSV data to begin training</p>

                {!file ? (
                    <label className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-20 flex flex-col items-center gap-6 cursor-pointer group">
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                        <div className="p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="text-primary" size={40} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">Click to browse or drag and drop</p>
                            <p className="text-sm text-slate-500">CSV files only (max 50MB)</p>
                        </div>
                    </label>
                ) : (
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-border w-full max-w-md">
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <FileText className="text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full">
                                <X size={18} />
                            </button>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="btn-primary w-full max-w-md py-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Uploading and Analyzing...
                                </>
                            ) : (
                                "Continue to Selection"
                            )}
                        </button>
                    </div>
                )}

                {error && <p className="mt-6 text-red-500 font-medium">{error}</p>}
            </motion.div>
        </div>
    );
};

export default UploadPage;
