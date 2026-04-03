import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://finance-dashboard-rbac.onrender.com/api',
});

// Add a request interceptor to add the User ID to every request
api.interceptors.request.use(
    (config) => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            config.headers['x-user-id'] = userId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        
        // Log error for debugging
        console.error('[API Error]:', message);
        
        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
            // Redirect to login or clear local storage if needed
            // localStorage.removeItem('userId');
            // window.location.href = '/login';
        }
        
        // Enhance the error object for downstream components
        error.displayMessage = message;
        return Promise.reject(error);
    }
);

export default api;
