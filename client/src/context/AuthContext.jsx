import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser) {
          setIsAdmin(true);
          setUser(parsedUser);
          setIsMainAdmin(parsedUser.isMainAdmin);
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await loginAdmin({ username, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAdmin(true);
      setUser(userData);
      setIsMainAdmin(userData.isMainAdmin);
      addToast('Login successful!', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid credentials', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAdmin(false);
    setIsMainAdmin(false);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isMainAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
