import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5003/api'
});

// Add a request interceptor to include the token in every request if it exists
API.interceptors.request.use((req) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
});

export const ASSET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5003/api').replace('/api', '') + '/uploads/';

export const formatAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) {
        // Handle Google Drive links
        if (url.includes('drive.google.com')) {
            const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
            if (id) return `https://lh3.googleusercontent.com/d/${id}`;
        }
        return url;
    }
    // Remove leading slash and 'uploads/' if present (since ASSET_URL already includes it)
    const cleanPath = url.replace(/^\/?(uploads\/?)?/, '');
    return `${ASSET_URL}${cleanPath}`;
};

export default API;
