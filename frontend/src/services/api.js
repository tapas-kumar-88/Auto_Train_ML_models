import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
});

export const uploadDataset = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const startTraining = async (datasetId, path, targetColumn) => {
    const formData = new FormData();
    formData.append('dataset_id', datasetId);
    formData.append('path', path);
    formData.append('target_column', targetColumn);
    const response = await api.post('/train', formData);
    return response.data;
};

export const getJobStatus = async (datasetId) => {
    const response = await api.get(`/status/${datasetId}`);
    return response.data;
};

export const getResults = async (datasetId) => {
    const response = await api.get(`/results/${datasetId}`);
    return response.data;
};

export default api;
