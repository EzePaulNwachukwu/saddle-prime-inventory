import axiosClient from './axiosClient';

export const getAll = (params) =>
  axiosClient.get('/api/users', { params }).then((res) => res.data);

export const getOne = (id) => axiosClient.get(`/api/users/${id}`).then((res) => res.data);

export const update = (id, updates) =>
  axiosClient.put(`/api/users/${id}`, updates).then((res) => res.data);

export const remove = (id) => axiosClient.delete(`/api/users/${id}`).then((res) => res.data);
