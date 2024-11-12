// setup axios interceptor

import axios from 'axios';
import { ACCESS_TOKEN } from './constants';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // Corrected template string syntax
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors like token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if the error response status indicates an authentication issue
        if (error.response && error.response.status === 401) {
            // Optionally, you could remove the token here and redirect the user
            localStorage.removeItem(ACCESS_TOKEN);
            
            // Redirect to the login page (if you're using react-router-dom's useNavigate)
            const navigate = useNavigate();
            navigate('/login');  // Make sure this logic is applied inside a component

            // Alternatively, display an alert or handle the error as needed
            alert("Your session has expired. Please log in again.");
        }
        
        return Promise.reject(error);
    }
);

export default api;
