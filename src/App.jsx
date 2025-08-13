import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import SignIn from '../src/Pages/SignIn';
import SignOut from '../src/Pages/SignOut';
import LandingPage from '../src/Pages/LandingPage';
import Navbar from '../src/components/Navbar';
import { Outlet } from 'react-router';

const Layout = () => (
  <Box sx={{ pt: '64px' }}>
    <Navbar />
    <Box sx={{ marginTop: '64px' }}>
      <Outlet />
    </Box>
  </Box>
);

const App = () => {
  return (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<Layout />}>
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