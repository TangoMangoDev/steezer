// src/Pages/Dashboard/UserDetailsModal.jsx
// this is the modal that forces user input. Leave it alone.
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Button, TextField, Container, Box, Dialog, Typography, createTheme, ThemeProvider
} from '@mui/material';
import api from '../../api/axios';

const defaultTheme = createTheme();

const UserDetailsModal = ({ open, onClose }) => {
  const [moonName, setMoonName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [moonNameError, setMoonNameError] = useState('');
  const [isMoonNameValid, setIsMoonNameValid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMoonNameChange = (e) => {
    setMoonName(e.target.value);
    setIsMoonNameValid(false);
    setMoonNameError('');
    e.target.style.borderColor = 'red';
  };

  const handleMoonNameBlur = async (e) => {
    if (moonName.length > 0) {
      setMoonNameError("Checking moon name availability...");
      try {
        const response = await api.post('/user/name', { moon_name: moonName });
        if (response.status === 200) {
          e.target.style.borderColor = "green";
          setMoonNameError("");
          setIsMoonNameValid(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          e.target.style.borderColor = "red";
          setMoonNameError("Moon name is unavailable.");
          setIsMoonNameValid(false);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (isMoonNameValid) {
      try {
        const response = await api.put('/user/name', { moon_name: moonName, first_name: firstName, last_name: lastName });
        if (response.status === 200) {
          const moon = localStorage.getItem('moon');
          const [user_status, user_picture] = moon.split('&');
          const new_user_status = 'user';
          const moonValue = `${new_user_status}&${user_picture}`;
          localStorage.setItem('moon', moonValue);
          onClose();
        }
      } catch (error) {
        console.error('Failed to submit moon name', error);
      }
    } else {
      console.error('Form cannot be submitted yet');
    }
  };

  if (!isMounted) return null;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={open}
        fullScreen
        PaperProps={{
          sx: {
            top: '64px', // Adjust this value to match the height of your navbar
          },
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 500,
            }}
          >
            <Typography component="h1" variant="h5">User Details</Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="moon_name"
                label="Moon Name"
                name="moon_name"
                autoComplete="moon-name"
                inputProps={{ maxLength: 20 }}
                value={moonName}
                onChange={handleMoonNameChange}
                onBlur={handleMoonNameBlur}
                error={Boolean(moonNameError)}
                helperText={moonNameError}
              />
              <TextField
                fullWidth
                id="first_name"
                label="First Name (Optional)"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={Boolean(firstName.length > 20)}
                helperText={firstName.length > 20 ? "First name cannot exceed 20 characters" : ""}
              />
              <TextField
                fullWidth
                id="last_name"
                label="Last Name (Optional)"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={Boolean(lastName.length > 20)}
                helperText={lastName.length > 20 ? "Last name cannot exceed 20 characters" : ""}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                disabled={!isMoonNameValid}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Dialog>
    </ThemeProvider>
  );
};

export default UserDetailsModal;