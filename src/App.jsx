// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import SignIn from './Pages/SignIn';
import SignOut from './Pages/SignOut';
import LandingPage from './Pages/LandingPage';
import Navbar from './components/Navbar';
import FantasyStatsPage from './components/FantasyStatsPage';
import FantasyRosterApp from './components/FantasyRosterApp';
import { Outlet } from 'react-router';

const Layout = () => (
  <div style={{ paddingTop: '64px' }}>
    <Navbar />
    <div style={{ marginTop: '64px' }}>
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/stats" element={<Layout />}>
        <Route index element={<FantasyStatsPage />} />
        <Route path="roster" element={<FantasyRosterApp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="logout" element={<SignOut />} />
        <Route path="signout" element={<SignOut />} />
      </Route>

      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;