// src/components/Navbar.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
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
        navigate('/stats');
      }
    } catch (error) {
      console.error('Google One Tap authentication failed:', error);
    }
  };

  const handleSignOut = () => {
    navigate('/signout');
  };

  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '1rem 2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏈</span>
          <h1 style={{ 
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0
          }}>
            FantasyEdge
          </h1>
        </div>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={() => navigate('/stats')}
            sx={{
              color: 'white',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/stats/roster')}
            sx={{
              color: 'white',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Rosters
          </Button>
          <Button 
            onClick={handleSignOut}
            sx={{
              color: 'white',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      </div>
    </nav>
  );
};

export default Navbar;