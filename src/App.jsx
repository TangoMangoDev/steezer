import { Route, Routes } from 'react-router-dom';
import SignIn from '../src/Pages/SignIn';
import SignOut from '../src/Pages/SignOut';

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
            <Route path="/" element={<Layout />}>
              <Route index element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/logout" element={<SignOut />} />
              <Route path="/signout" element={<SignOut />} />
              <Route path="*" element={<SignIn />} />
            </Route>
          </Routes>
  );
};

export default App;