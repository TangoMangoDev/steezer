import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Stack, Link, Box, Switch, FormControlLabel, Typography, Avatar
} from '@mui/material';
import UserNamesModal from './UserNamesModal';
import { Logout } from '../../utils/authUtils';
import LetterPreferencesModal from './LetterPreferencesModal';
import api from '../../api/axios';
import { NotesContext } from '../../components/Contexts/NotesContext'; // Import NotesContext

const UserSettings = ({ isDarkMode, setIsDarkMode }) => {
  const [showUserNamesModal, setShowUserNamesModal] = useState(false);
  const [letterPreferencesOpen, setLetterPreferencesOpen] = useState(false);
  const [user, setUser] = useState({ moon_name: '', user_theme: 'Light' });
  const [FeedPrefs, setFeedPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dashboardNotes, updateDashboardNotes, feedNotes, updateFeedNotes } = useContext(NotesContext); // Use NotesContext

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await api.post('/user/settings', { settings: 'send' });
        const { moon_name, user_theme, user_prefs } = response.data.settings;
        setUser({ moon_name, user_theme });
        setFeedPrefs(user_prefs || []);
        setIsDarkMode(user_theme === 'Dark');
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [setIsDarkMode]);

  const handleThemeChange = async (event) => {
    const newTheme = event.target.checked ? 'Dark' : 'Light';
    setIsDarkMode(event.target.checked);
    setUser(prevUser => ({ ...prevUser, user_theme: newTheme }));

    try {
      await api.post('/user/settings', { user_theme: newTheme });
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const getAvatarUrl = () => {
    const moon = localStorage.getItem('moon');
    if (moon) {
      const avatar = moon.split('&')[1];
      return avatar === 'default' ? '' : avatar;
    }
    return '';
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const avatarUrl = getAvatarUrl();

  return (
    <Box sx={{ p: 2, maxWidth: '800px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 3 }}>
        {avatarUrl ? (
          <Avatar src={avatarUrl} sx={{ width: 56, height: 56 }} />
        ) : (
          <Avatar sx={{ width: 56, height: 56 }} />
        )}
      </Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Settings for: {user.moon_name}
      </Typography>
      <Stack spacing={3} direction="column" sx={{ alignItems: 'center' }}>
        <Button variant="contained" color="secondary" sx={{ width: '200px', justifyContent: 'flex-start', p: 2 }} onClick={() => setShowUserNamesModal(true)}>Change Username</Button>
        <Button variant="contained" color="secondary" sx={{ width: '200px', justifyContent: 'flex-start', p: 2 }} onClick={() => setLetterPreferencesOpen(true)}>Update Preferences</Button>
        <Button variant="contained" color="secondary" sx={{ width: '200px', justifyContent: 'flex-start', p: 2 }}>Pronouns</Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, width: '100%', maxWidth: '450px' }}>
          <Typography variant="body1">DarkTheme:</Typography>
          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={handleThemeChange} name="themeToggle" color="primary" />}
            label=""
          />
        </Box>
        <Link href="#" color="textSecondary" underline="none">Terms of Service</Link>
        <Link href="#" color="textSecondary" underline="none">Privacy Policy</Link>
        <Link href="#" color="textSecondary" underline="none">Rate Us</Link>
        <Link href="#" color="textSecondary" underline="none">Share Feedback</Link>
      </Stack>
      <UserNamesModal open={showUserNamesModal} onClose={() => setShowUserNamesModal(false)} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ width: '200px', mb: 2 }}
          onClick={() => {
            localStorage.removeItem('u_p');
            Logout();
          }}
        >
          Delete Account
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => Logout()}
          sx={{ width: '200px' }}
        >
          Logout
        </Button>
      </Box>
      <LetterPreferencesModal
        open={letterPreferencesOpen}
        onClose={() => setLetterPreferencesOpen(false)}
        FeedPrefs={FeedPrefs}
        setFeedPrefs={setFeedPrefs} // Pass FeedPrefs state and setter
      />
    </Box>
  );
};

export default UserSettings;