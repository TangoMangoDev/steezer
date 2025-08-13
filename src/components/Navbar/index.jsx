import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidenav from './Sidenav';
import { initializeGSI } from '../../utils/googleOneTap';
import { getMoonInfo, Logout } from '../../utils/authUtils';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ user_picture: AccountCircle, user_status: 'guest' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const signout = () => {
    Logout();
  };

  // Effect to handle initial load
  useEffect(() => {
    const checkAndLogin = async () => {
      const moon = await getMoonInfo();
      if (moon !== null) {
        const { user_status, user_picture } = moon;
        if (user_picture === 'default'){
          setUserInfo({ user_status, user_picture: AccountCircle });
        } else {
          setUserInfo({ user_status, user_picture });
        }
        setIsSignedIn(true);
      } else {
        // Initialize Google One Tap sign-in
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://accounts.google.com/gsi/client');
        scriptElement.onload = () => initializeGSI(setIsSignedIn, setUserInfo);
        document.body.appendChild(scriptElement);
      }
    };
    checkAndLogin();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={handleDrawerToggle}
            >
              <img src="/mlt_logo.png" alt="logo" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
            </IconButton>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              {isSignedIn && userInfo ? (
                <>
                  {userInfo.user_picture && (
                    userInfo.user_status === 'admin' ? (
                      <Link to="/admin">
                        <Avatar src={userInfo.user_picture} />
                      </Link>
                    ) : (
                      <Link to="/dashboard">
                        <Avatar src={userInfo.user_picture} />
                      </Link>
                    )
                  )}
                </>
              ) : (
                <Button color="inherit">
                  <Avatar />
                </Button>
              )}
            </div>
            <Sidenav
              isSignedIn={isSignedIn}
              userStatus={userInfo.user_status}
              signout={signout}
              drawerOpen={drawerOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          </Toolbar>
        </AppBar>

      </Box>
    </>
  );
}