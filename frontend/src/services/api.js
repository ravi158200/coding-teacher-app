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

export default API;
