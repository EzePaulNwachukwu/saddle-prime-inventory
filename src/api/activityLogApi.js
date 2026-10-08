import axiosClient from './axiosClient';

export const getAll = (params) =>
  axiosClient.get('/api/activity-logs', { params }).then((res) => res.data);
