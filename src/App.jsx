import { Route, Routes } from 'react-router-dom';
import SignIn from '../src/Pages/SignIn';
import SignOut from '../src/Pages/SignOut';
import LandingPage from '../src/Pages/LandingPage';
import Navbar from '../src/components/Navbar';
import { StatsPage } from './components/StatsPage.jsx';
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
            <Route path="/" element={<Layout />} />
            <Route path="/stats" element={<StatsPage />}>
              <Route index element={<SignIn />} />
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