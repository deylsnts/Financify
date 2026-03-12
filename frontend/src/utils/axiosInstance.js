import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
});

// Request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Check if the error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried

            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    localStorage.setItem('access', response.data.access);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    
                    // Retry the original request with the new token
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token is invalid, logging out.", refreshError);
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/'; // Redirect to login
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
