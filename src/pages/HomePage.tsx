// src/pages/HomePage.tsx - Using your LandingPage as HomePage
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', 
      color: 'white', 
      overflowX: 'hidden', 
      margin: 0, 
      padding: 0 
    }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .nav {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 20px 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .sign-in-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .sign-in-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding-top: 80px;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 32px;
          font-weight: 400;
        }

        .cta-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
          }
          .hero-subtitle {
            font-size: 18px;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">🏈</div>
            FantasyEdge
          </div>
          <div className="nav-links">
            <button onClick={handleSignInClick} className="sign-in-btn">Sign In</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">
            Dominate Your Fantasy League with Data-Driven Insights
          </h1>

          <p className="hero-subtitle">
            Get the competitive edge with advanced statistics, AI-powered research, and custom analytics. Perfect for commissioners and serious fantasy football players who want to win.
          </p>

          <button onClick={handleSignInClick} className="cta-primary">
            Start Free Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;