import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance with a relative API base path for production deployment.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
export const api = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedTokens = localStorage.getItem('authTokens');
      if (storedTokens) {
        setTokens(JSON.parse(storedTokens));
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
        } catch (error) {
          console.error("Auth load failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, tokens } = res.data.data;
    setUser(user);
    setTokens(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    return user;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { user, tokens } = res.data.data;
    setUser(user);
    setTokens(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    return user;
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('authTokens');
  };

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
