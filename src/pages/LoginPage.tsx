
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../api/axios';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Check if this is a callback from OAuth providers
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    // const state = params.get("state");
    
    if (code) {
      // Clean up the URL by removing OAuth parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Determine which provider based on the referrer or state parameter
      // For simplicity, we'll check if it's a Google callback by looking for specific Google parameters
      if (params.get("scope") && params.get("scope")!.includes("openid")) {
        completeGoogleAuth(code);
      } else {
        completeYahooAuth(code);
      }
    }
  }, []);

  const startYahooLogin = (): void => {
    const clientId = "dj0yJmk9bDZRbmtGU2lkVVVFJmQ9WVdrOVRFSndWalp5VGtJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWI1";
    const redirectUri = window.location.origin + "/signin";

    const url = new URL("https://api.login.yahoo.com/oauth2/request_auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("language", "en-us");

    window.location.href = url.toString();
  };

  const startGoogleLogin = (): void => {
    const clientId = "420228495268-ccml8gtao69sphl9lrratq81ngudjimm.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/signin";

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "profile email openid");
    url.searchParams.set("access_type", "offline");

    window.location.href = url.toString();
  };

  const completeYahooAuth = async (code: string): Promise<void> => {
    setStatus("Signing you in with Yahoo…");
    
    try {
      const response = await auth.get(`/yahoo/callback?code=${encodeURIComponent(code)}`);
      
      if (response.status === 200 && response.data) {
        // Store user data in localStorage like your other auth flow
        const steezer = `${response.data.user_status}&${response.data.user_picture}`;
        localStorage.setItem('moon', steezer);
        
        setStatus("You're signed in. Redirecting…");
        setTimeout(() => {
          navigate('/stats');
        }, 1500);
      } else {
        throw new Error(`Callback failed (${response.status})`);
      }
    } catch (err: any) {
      setStatus("Authentication failed. " + err.message);
    }
  };

  const completeGoogleAuth = async (code: string): Promise<void> => {
    setStatus("Signing you in with Google…");
    
    try {
      const response = await auth.get(`/google/callback?code=${encodeURIComponent(code)}`);
      
      if (response.status === 200 && response.data) {
        // Store user data in localStorage like your other auth flow
        const steezer = `${response.data.user_status}&${response.data.user_picture}`;
        localStorage.setItem('moon', steezer);
        
        setStatus("You're signed in. Redirecting…");
        setTimeout(() => {
          navigate('/stats');
        }, 1500);
      } else {
        throw new Error(`Callback failed (${response.status})`);
      }
    } catch (err: any) {
      setStatus("Authentication failed. " + err.message);
    }
  };

  const handlePreventDefault = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
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

        .google-btn {
          background: white;
          border-color: #dadce0;
          color: #3c4043;
        }

        .google-btn:hover {
          background: #f8f9fa;
          border-color: #dadce0;
        }

        .google-btn:active {
          background: #f1f3f4;
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
            <h1 className="auth-title">Let's Gooo!</h1>
            <p className="auth-subtitle">Access the Teezer Report</p>
          </div>

          {status ? (
            <div className="status">{status}</div>
          ) : (
            <>
              <div className="auth-methods">
                <button onClick={startGoogleLogin} className="auth-btn google-btn">
                  <div className="btn-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  Continue with Google
                </button>

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
                <p>By continuing, you agree to our <a href="#" onClick={handlePreventDefault}>Terms of Service</a> and <a href="#" onClick={handlePreventDefault}>Privacy Policy</a></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
