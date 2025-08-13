import axios from 'axios';

const api = axios.create({
  baseURL: 'stateezer.com/data',
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
});

const auth = axios.create({
  baseURL: 'stateezer.com/auth',
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
});

// Named + default export
export { auth };
export default api;