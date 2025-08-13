import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Container,
  Box,
  Dialog,
  Typography,
  createTheme,
  ThemeProvider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/axios';

const defaultTheme = createTheme();

const UserNamesModal = ({ open, onClose }) => {
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
    setIsMoonNameValid(false); // Reset validity check
    setMoonNameError(''); // Reset error message
    e.target.style.borderColor = 'red'; // Initially set to red until validated
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
          onClose(); // Close the modal after successful submission
        }
      } catch (error) {
        console.error('Failed to submit moon name', error);
        onClose();
      }
    } else {
      console.error('Form cannot be submitted yet');
    }
  };

  const handleClose = () => {
    onClose();
  }

  if (!isMounted) return null;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            padding: '30px',
            borderRadius: '15px',
            backgroundColor: '#e0f7fa',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: 'none',
            overflow: 'visible', 
          }
        }}
      >
        <Container component="main" maxWidth="sm">
          <Box 
            sx={{ 
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              padding: 2,
              paddingBottom: 4, // Ensure enough padding at the bottom
              bgcolor: 'white', // Add a background color to improve contrast
              borderRadius: 2, 
              boxSizing: 'border-box',
              overflow: 'auto' // Enable vertical scrolling if content exceeds height
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography component="h1" variant="h5">Update Your Details</Typography>
            <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
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
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
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
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isMoonNameValid}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Dialog>
    </ThemeProvider>
  );
};

export default UserNamesModal;