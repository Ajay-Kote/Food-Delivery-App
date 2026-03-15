import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setAccessToken(parsed.accessToken);
      setAuthToken(parsed.accessToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && accessToken) {
      localStorage.setItem('auth', JSON.stringify({ user, accessToken }));
      setAuthToken(accessToken);
    } else {
      localStorage.removeItem('auth');
      setAuthToken(null);
    }
  }, [user, accessToken]);

  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('auth');
    setAuthToken(null);
  };

  const value = { user, accessToken, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


