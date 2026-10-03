import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);
          localStorage.setItem('dos_user', JSON.stringify(res.user));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      } else {
        setUser(null);
        localStorage.removeItem('dos_user');
      }
      setLoading(false);
    };

    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('auth_logout', handleLogoutEvent);
    verifyUser();

    return () => {
      window.removeEventListener('auth_logout', handleLogoutEvent);
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('dos_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('dos_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('dos_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
