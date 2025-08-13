
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleAnchorClick = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add scroll effect to navigation
    const handleScroll = () => {
      const nav = document.querySelector('.nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
          nav.style.background = 'rgba(15, 23, 42, 0.8)';
        }
      }
    };

    // Animate stats on scroll
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('scroll', handleScroll);

    // Add animation to elements
    document.querySelectorAll('.stat, .stat-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', color: 'white', overflowX: 'hidden', margin: 0, padding: 0 }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: white;
          overflow-x: hidden;
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

        .nav-link {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #ffffff;
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .hero-content {
          z-index: 10;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          color: #3b82f6;
          margin-bottom: 24px;
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

        .hero-cta {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 48px;
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

        .cta-secondary {
          color: #cbd5e1;
          padding: 16px 32px;
          border: 1px solid #475569;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          background: transparent;
        }

        .cta-secondary:hover {
          border-color: #cbd5e1;
          color: white;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
        }

        .stat {
          text-align: left;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dashboard-preview {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dashboard-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
        }

        .dashboard-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .stat-card-title {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-card-value {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .stat-card-change {
          font-size: 12px;
          color: #10b981;
          font-weight: 500;
        }

        .chart-placeholder {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          height: 80px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .floating-icon {
          position: absolute;
          color: rgba(59, 130, 246, 0.3);
          font-size: 24px;
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .floating-icon:nth-child(2) { top: 20%; right: 15%; animation-delay: 2s; }
        .floating-icon:nth-child(3) { top: 70%; left: 5%; animation-delay: 4s; }
        .floating-icon:nth-child(4) { bottom: 20%; right: 10%; animation-delay: 1s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 16px;
          }

          .nav-link {
            display: none;
          }

          .hero-container {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-stats {
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 16px;
          }

          .hero-container {
            padding: 0 16px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .logo {
            font-size: 20px;
          }

          .logo-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">🏈</div>
            FantasyEdge
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#about" className="nav-link">About</a>
            <button onClick={handleSignInClick} className="sign-in-btn">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* Floating Icons */}
        <div className="floating-icon">📊</div>
        <div className="floating-icon">📈</div>
        <div className="floating-icon">🎯</div>
        <div className="floating-icon">🏆</div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              ⚡ AI-Powered Analytics
            </div>

            <h1 className="hero-title">
              Dominate Your Fantasy League with Data-Driven Insights
            </h1>

            <p className="hero-subtitle">
              Get the competitive edge with advanced statistics, AI-powered research, and custom analytics. Perfect for commissioners and serious fantasy football players who want to win.
            </p>

            <div className="hero-cta">
              <button onClick={handleSignInClick} className="cta-primary">Start Free Today</button>
              <a href="#features" className="cta-secondary">See Features</a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Win Rate Improvement</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Live Data Updates</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="dashboard-title">Player Analytics</div>
                <div className="dashboard-badge">LIVE</div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-title">Projected Points</div>
                  <div className="stat-card-value">24.7</div>
                  <div className="stat-card-change">+15% vs avg</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Matchup Rating</div>
                  <div className="stat-card-value">A+</div>
                  <div className="stat-card-change">Elite matchup</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Target Share</div>
                  <div className="stat-card-value">28%</div>
                  <div className="stat-card-change">+5% trend</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">AI Confidence</div>
                  <div className="stat-card-value">92%</div>
                  <div className="stat-card-change">High confidence</div>
                </div>
              </div>

              <div className="chart-placeholder">
                📈 Performance Trend Chart
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
