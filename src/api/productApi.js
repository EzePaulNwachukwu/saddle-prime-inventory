import axiosClient from './axiosClient';

export const getAll = (params) =>
  axiosClient.get('/api/products', { params }).then((res) => res.data);

export const getLowStock = () =>
  axiosClient.get('/api/products/reports/low-stock').then((res) => res.data);

export const getInventoryValue = () =>
  axiosClient.get('/api/products/reports/inventory-value').then((res) => res.data);

export const getOne = (id) => axiosClient.get(`/api/products/${id}`).then((res) => res.data);

export const create = (product) =>
  axiosClient.post('/api/products', product).then((res) => res.data);

export const update = (id, product) =>
  axiosClient.put(`/api/products/${id}`, product).then((res) => res.data);

export const remove = (id) =>
  axiosClient.delete(`/api/products/${id}`).then((res) => res.data);
