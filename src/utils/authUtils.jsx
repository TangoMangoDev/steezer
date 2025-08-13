// src/utils/authUtils.jsx
import api from '../api/axios';

var config = {
  mode: "cors",
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
  credentials: 'same-origin',
   };

export const getMoonInfo = () => {
  const moon = localStorage.getItem('moon');
  if (moon) {
    const [user_status, user_picture] = moon.split('&');
    return { user_status, user_picture };
  }
  return null;
};



export const Logout = async () => {
  try {
    const response = await api.post('/auth/logout', {}, config);
      console.log('Logging out:', response.status);
      localStorage.removeItem('moon');
      window.location.href = '/signin';
  } catch {
    console.log('Error with logout');
    localStorage.removeItem('moon');
    window.location.href = '/signin';
  }
};