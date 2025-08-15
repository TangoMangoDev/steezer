import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@stores/appStore';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorBoundary from '@components/common/ErrorBoundary';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/HomePage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const DashboardPage = lazy(() => import('@pages/DashboardPage'));
const PlayerDetailPage = lazy(() => import('@pages/PlayerDetailPage'));
const RosterPage = lazy(() => import('@pages/RosterPage'));
const AdminPage = lazy(() => import('@pages/AdminPage'));

function App() {
  const { theme, activeLeagueId } = useAppStore();
  const isAuthenticated = !!localStorage.getItem('userId');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/player/:playerId" 
            element={isAuthenticated ? <PlayerDetailPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/roster" 
            element={
              isAuthenticated && activeLeagueId ? (
                <RosterPage />
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;