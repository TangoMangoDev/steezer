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

//PASSWORD LOGIN: This calls the login route and should use the response to set a local storage item as shown. 
export const Login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password }, config);
    if (response.data) {
      const userData = response.data;
      const moonValue = `${userData.user_status}&${userData.user_picture}`;
      const user_theme = userData.user_theme;
      localStorage.setItem('theme', user_theme);
      localStorage.setItem('moon', moonValue);
      window.location.href = '/dashboard';
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

//PASSWORD SIGNUP
export const SignUp = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData, config);
    if (response.data) {
      const moonValue = `${response.data.user_status}&${response.data.user_picture}`;
      localStorage.setItem('moon', moonValue);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};