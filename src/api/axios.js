import axios from 'axios';

const api = axios.create({
  baseURL: 'stateezer.com/data',
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
});

export default api;