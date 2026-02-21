import axios from 'axios';

// Create a central instance so you don't repeat the Render URL
const API = axios.create({
  baseURL: 'https://docubridge-app.onrender.com/api',
});

// This "Interceptor" grabs the token from localStorage and 
// attaches it to every request automatically.
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;