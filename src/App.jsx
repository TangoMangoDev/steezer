
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import LandingPage from './Pages/LandingPage';
import SignIn from './Pages/SignIn';
import SignOut from './Pages/SignOut';
import { StatsPage } from './components/StatsPage';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: white;
`;

const MainContent = styled.main`
  padding-top: 80px; /* Account for fixed navbar */
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signout" element={<SignOut />} />
          <Route 
            path="/app/*" 
            element={
              <>
                <Navbar />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<StatsPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                  </Routes>
                </MainContent>
              </>
            } 
          />
          <Route 
            path="/stats" 
            element={
              <>
                <Navbar />
                <MainContent>
                  <StatsPage />
                </MainContent>
              </>
            } 
          />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
