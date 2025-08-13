import axios from 'axios';

const api = axios.create({
  baseURL: 'mangodeploy.com/api',
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
});

export default api;