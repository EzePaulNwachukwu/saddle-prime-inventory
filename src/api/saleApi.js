import axiosClient from './axiosClient';

export const record = (productId, quantitySold) =>
  axiosClient.post('/api/sales', { productId, quantitySold }).then((res) => res.data);

export const getAll = (params) =>
  axiosClient.get('/api/sales', { params }).then((res) => res.data);

export const getToday = () =>
  axiosClient.get('/api/sales/reports/today').then((res) => res.data);

export const getSummary = (params) =>
  axiosClient.get('/api/sales/reports/summary', { params }).then((res) => res.data);

export const getOne = (id) => axiosClient.get(`/api/sales/${id}`).then((res) => res.data);
