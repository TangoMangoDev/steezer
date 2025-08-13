import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import { FilterProvider } from './components/Contexts/FilterContext';
import { FriendsProvider } from './components/Contexts/FriendsContext';
import { NotesProvider } from './components/Contexts/NotesContext';


import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../src/components/Navbar';
import SignIn from '../src/Pages/SignIn';
import SignOut from '../src/Pages/SignOut';
import Signup from '../src/Pages/SignUp';
import UserSettings from '../src/components/Settings/UserSettings';
import Dashboard from './Pages/Dashboard/Dashboard';
import Admin from '../src/Pages/Admin';
import { Box } from '@mui/material';
import { Outlet } from 'react-router';

let lightTheme = createTheme({
  typography: {
    fontFamily: 'Marcellus, serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#659EC7',
    },
    secondary: {
      main: '#6f5785',
    },
  },
});
lightTheme = responsiveFontSizes(lightTheme);

let darkTheme = createTheme({
  typography: {
    fontFamily: 'Marcellus, serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#659EC7',
    },
    secondary: {
      main: '#6f5785',
    },
  },
});
darkTheme = responsiveFontSizes(darkTheme);

const Layout = () => (
  <Box sx={{ pt: '64px' }}>
    <Navbar />
    <Box sx={{ marginTop: '64px' }}>
      <Outlet />
    </Box>
  </Box>
);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Read user theme preference from local storage on initial load
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'Dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);


  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <FilterProvider>
        <NotesProvider>
          <FriendsProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/logout" element={<SignOut />} />
              <Route path="/signout" element={<SignOut />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<UserSettings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<SignIn />} />
            </Route>
          </Routes>
          </FriendsProvider>
        </NotesProvider>
      </FilterProvider>
    </ThemeProvider>
  );
};

export default App;