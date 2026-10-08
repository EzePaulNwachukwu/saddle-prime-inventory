import { createContext, useState } from 'react';
import * as authApi from '../api/authApi';

export const AuthContext = createContext(null);

const readStoredUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persist = (data) => {
    const { token: newToken, ...userData } = data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    persist(data);
    return data;
  };

  const register = async (username, password, role) => {
    return authApi.register(username, password, role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
