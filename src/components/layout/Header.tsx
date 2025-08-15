// src/components/layout/Header.tsx - Fixed
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

const Header: React.FC = () => {
  const location = useLocation();
  const { 
    theme, 
    setTheme,
    leagues,
    activeLeagueId,
    setActiveLeague 
  } = useAppStore();

  const [scrollHidden, setScrollHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollHidden(true);
      } else {
        setScrollHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const activeLeague = leagues.find(l => l.leagueId === activeLeagueId);

  return (
    <header className={`header ${scrollHidden ? 'scroll-hidden' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/dashboard" className="app-title">
            Fantasy Football Dashboard
          </Link>
        </div>

        <div className="header-center">
          {activeLeague && (
            <div className="active-league-display">
              <span className="league-label">Active League:</span>
              <select 
                value={activeLeagueId || ''}
                onChange={(e) => setActiveLeague(e.target.value)}
                className="league-selector"
              >
                {leagues.map(league => (
                  <option key={league.leagueId} value={league.leagueId}>
                    {league.leagueName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="header-right">
          <nav className="header-nav">
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link 
              to="/roster" 
              className={location.pathname === '/roster' ? 'active' : ''}
            >
              Roster
            </Link>
          </nav>

          <button 
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;