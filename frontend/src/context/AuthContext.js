import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('taskmanager_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      } catch {
        localStorage.removeItem('taskmanager_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('taskmanager_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskmanager_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
