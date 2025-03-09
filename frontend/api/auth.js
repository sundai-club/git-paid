import axios from 'axios';

// Axios instance to communicate with backend API
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE
});

// Attach JWT token to all requests if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get current user profile
export async function getCurrentUser() {
  try {
    // Note: Route should be '/auth/user-profile' not '/api/auth/user-profile'
    // because auth routes are mounted under '/auth' in the backend
    const res = await API.get('/auth/user-profile');
    return res.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    return null;
  }
}
