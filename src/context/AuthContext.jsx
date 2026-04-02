import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (name, password) => {
    const response = await api.post('/login', { name, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updatePassword = async (newPassword) => {
    const response = await api.post('/change-password', { newPassword });
    // Keep user logged in, just update firstLogin flag
    const updatedUser = { ...user, firstLogin: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
