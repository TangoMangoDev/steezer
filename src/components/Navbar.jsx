
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { auth } from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google One Tap on landing page
    if (window.location.pathname === '/') {
      loadGoogleOneTap();
    }
  }, []);

  const loadGoogleOneTap = () => {
    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    } else {
      initializeGoogleOneTap();
    }
  };

  const initializeGoogleOneTap = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "420228495268-ccml8gtao69sphl9lrratq81ngudjimm.apps.googleusercontent.com",
        callback: handleGoogleOneTapResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap not displayed:', notification.getNotDisplayedReason() || notification.getSkippedReason());
        }
      });
    }
  };

  const handleGoogleOneTapResponse = async (response) => {
    if (!response.credential) return;

    try {
      const authResponse = await auth.post('/google/onetap', {
        credential: response.credential
      });

      if (authResponse.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google One Tap authentication failed:', error);
    }
  };

  const handleSignOut = () => {
    navigate('/signout');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1e293b' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FantasyEdge
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/app')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
