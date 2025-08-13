import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Button, CssBaseline, TextField, Container, Box, Typography, Grid, Alert, createTheme, ThemeProvider
} from '@mui/material';
import { SignUp } from '../utils/authUtils';

const defaultTheme = createTheme();

const SignUpForm = ({ data, setData, onSubmit }) => {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');

  const isButtonDisabled = Boolean(emailError) || Boolean(passwordError) || Boolean(ageError);

  useEffect(() => {
    setEmailError(
      data.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
        ? 'Invalid email address'
        : ''
    );
  }, [data.email]);

  useEffect(() => {
    setPasswordError(
      data.password && (data.password.length < 10 || data.password.length > 25)
        ? 'Password must be between 10 and 25 characters'
        : ''
    );
  }, [data.password]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      if (name === 'birthDay' || name === 'birthMonth') {
        if (value.length <= 2) {
          setData({ ...data, [name]: value });
        }
        if (value.length === 2) {
          const form = e.target.form;
          const index = Array.prototype.indexOf.call(form, e.target);
          form.elements[index + 1].focus();
        }
      } else if (name === 'birthYear') {
        if (value.length <= 4) {
          setData({ ...data, [name]: value });
        }
      }
    }
  };

  useEffect(() => {
    const { birthDay, birthMonth, birthYear } = data;
    if (birthDay && birthMonth && birthYear) {
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAgeError(age < 13 ? 'You must be at least 13 years old to sign up.' : '');
    }
  }, [data.birthDay, data.birthMonth, data.birthYear]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/mlt_logo.png" alt="Logo" style={{ maxWidth: '600px', width: '60%' }} />
        <Typography component="h1" variant="h5">Sign up</Typography>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                error={Boolean(emailError)}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                error={Boolean(passwordError)}
                helperText={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  name="birthDay"
                  label="Day (DD)"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
                  value={data.birthDay}
                  onChange={handleDateChange}
                  error={Boolean(ageError)}
                />
                <TextField
                  required
                  name="birthMonth"
                  label="Month (MM)"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 12 } }}
                  value={data.birthMonth}
                  onChange={handleDateChange}
                  error={Boolean(ageError)}
                />
                <TextField
                  required
                  name="birthYear"
                  label="Year (YYYY)"
                  type="number"
                  InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                  value={data.birthYear}
                  onChange={handleDateChange}
                  error={Boolean(ageError)}
                />
              </Box>
              {ageError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {ageError}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isButtonDisabled}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const SinglePageSignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', birthDay: '', birthMonth: '', birthYear: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, birthDay, birthMonth, birthYear } = formData;
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      console.error('You must be at least 13 years old to sign up.');
      return;
    }

    const userData = {
      email,
      password,
      user_age: age,
    };

    const signUpSuccessful = await SignUp(userData);
    if (signUpSuccessful) {
      window.location.href = '/signin';
    } else {
      console.error('Sign up failed');
      // Optionally, show a more specific error message to the user
    }
  };

  return (
    <div className="form-container">
      <SignUpForm
        data={formData}
        setData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default function Signup() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SinglePageSignUpForm />
    </ThemeProvider>
  );
}