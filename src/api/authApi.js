import axiosClient from './axiosClient';

export const login = (username, password) =>
  axiosClient.post('/api/auth/login', { username, password }).then((res) => res.data);

export const register = (username, password, role) =>
  axiosClient.post('/api/auth/register', { username, password, role }).then((res) => res.data);
