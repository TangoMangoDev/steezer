import React, { useEffect, useState } from 'react';
import { Link as NavLink, useNavigate } from "react-router-dom";
import { getMoonInfo, Login } from '../utils/authUtils';
import { auth } from '../api/axios';

function Copyright(props) {
  return (
    <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#666' }}>
      {'Copyright © Stateezer @ '}
      <a href="https://stateezer.com/" style={{ color: 'inherit' }}>
        Mindfirm
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </div>
  );
}

const SignIn = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Check if this is a Yahoo callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    
    if (code) {
      completeYahooAuth(code);
    }
  }, []);

  const startYahooLogin = () => {
    const clientId = "dj0yJmk9bDZRbmtGU2lkVVVFJmQ9WVdrOVRFSndWalp5VGtJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWI1";
    const redirectUri = window.location.origin + "/signin";

    const url = new URL("https://api.login.yahoo.com/oauth2/request_auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("language", "en-us");

    window.location.href = url.toString();
  };

  const completeYahooAuth = async (code) => {
    setStatus("Signing you in with Yahoo…");
    
    try {
      const response = await auth.get(`/yahoo/callback?code=${encodeURIComponent(code)}`);
      
      if (response.status === 200) {
        setStatus("You're signed in. Redirecting…");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error(`Callback failed (${response.status})`);
      }
    } catch (err) {
      setStatus("Authentication failed. " + err.message);
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative',
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .auth-card {
          background: white;
          border-radius: 20px;
          padding: 48px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 10;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .auth-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .auth-subtitle {
          font-size: 16px;
          color: #718096;
          line-height: 1.5;
        }

        .auth-methods {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 20px;
          border: 2px solid transparent;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          width: 100%;
        }

        .auth-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .auth-btn:active {
          background-color: #f8f9fa;
        }

        .yahoo-btn {
          background: #720e9e;
          border-color: #720e9e;
          color: white;
        }

        .yahoo-btn:hover {
          background: #5c0b7f;
          border-color: #5c0b7f;
        }

        .yahoo-btn:active {
          background: #4a0866;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
          color: #999;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e5e5;
        }

        .divider span {
          padding: 0 16px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 32px;
          font-size: 14px;
          color: #666;
        }

        .auth-footer a {
          color: #720e9e;
          text-decoration: none;
        }

        .status {
          margin-top: 1rem;
          font-size: 1.1rem;
          text-align: center;
          color: #720e9e;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your fantasy sports dashboard</p>
          </div>

          {status ? (
            <div className="status">{status}</div>
          ) : (
            <>
              <div className="auth-methods">
                <button onClick={startYahooLogin} className="auth-btn yahoo-btn">
                  <div className="btn-icon">
                    <svg viewBox="0 0 50 50" width="20" height="20">
                      <circle cx="25" cy="25" r="25" fill="white"/>
                      <path fill="#720e9e" d="M25 5c11.05 0 20 8.95 20 20s-8.95 20-20 20S5 36.05 5 25 13.95 5 25 5z"/>
                      <path fill="white" d="M15.5 15h3.2l4.3 8.5L27.3 15h3.2l-6.8 12.2V35h-2.4V27.2L15.5 15z"/>
                      <circle cx="32" cy="32" r="2.5" fill="#FF0000"/>
                    </svg>
                  </div>
                  Continue with Yahoo
                </button>
              </div>

              <div className="divider">
                <span>Secure Authentication</span>
              </div>

              <div className="auth-footer">
                <p>By continuing, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></p>
              </div>
            </>
          )}

          <Copyright />
        </div>
      </div>
    </div>
  );
};

export default SignIn;