// src/utils/authUtils.jsx
import api from '../api/axios';

var config = {
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
   };

export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const [user_status, user_picture] = user.split('&');
    return { user_status, user_picture };
  }
  return null;
};



export const Logout = async () => {
  try {
    const response = await api.post('/auth/logout', {}, config);
      console.log('Logging out:', response.status);
      localStorage.removeItem('user');
      window.location.href = '/signin';
  } catch {
    console.log('Error with logout');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  }
};