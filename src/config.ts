// If we are in production, use the environment variable. Otherwise, localhost.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";