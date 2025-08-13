import api from '../api/axios';
import axios from 'axios';

// Function to handle the Google One Tap sign-in response
const onOneTapSignedIn = async (response, setIsSignedIn, setUserInfo) => {
  const authToken = response.credential;

  const postOptions = {
    mode: "cors",
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': "application/json"
    },
    withCredentials: true,
  };

  try {
    const apiResponse = await axios.post('https://api.mangodeploy.com/api/auth/google', postOptions);
    const userData = apiResponse.data;

    const moonValue = `${userData.user_status}&${userData.user_picture}`;
    localStorage.setItem('moon', moonValue);
    setUserInfo({ user_status: userData.user_status, user_picture: userData.user_picture });
    setIsSignedIn(true);
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Error during Google One Tap sign-in:', error);
  }
};

// Function to initialize Google Sign-In
const initializeGSI = (setIsSignedIn, setUserInfo) => {
  google.accounts.id.initialize({
    client_id: '420228495268-ccml8gtao69sphl9lrratq81ngudjimm.apps.googleusercontent.com',
    scopes: 'profile email',
    auto_select: false,
    cancel_on_tap_outside: false,
    callback: (response) => onOneTapSignedIn(response, setIsSignedIn, setUserInfo),

  });

  google.accounts.id.prompt((notification) => {
    console.log(notification.getNotDisplayedReason() || notification.getSkippedReason() || notification.getDismissedReason());
  });
};



export { 
  initializeGSI, 
  onOneTapSignedIn 
};