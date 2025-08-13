import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Container, Box, Typography, TextField, Button, Alert, useTheme, ThemeProvider } from '@mui/material';
import api from '../../api/axios';

const handleSubmit = async (formData, onClose, setErrorMessage, setModalError) => {
  try {
    const submitData = { ...formData, noteTags: formData.page2Field.join(', ') };
    delete submitData.page2Field;
    console.log('Sending New Note:', submitData);
    const response = await api.post('/user/notes/write', submitData);

    if (response.status === 200) {
      setTimeout(() => {
        window.location.href = `/dashboard`;
      }, 500);
    } else {
      setErrorMessage(response.data);
      setModalError(true);
    }
  } catch (error) {
    setErrorMessage(error.response?.data || 'An error occurred while saving the note');
    setModalError(true);
  }
};

const Page1 = ({ data, setData, onNext, error, setError }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateNoteText = () => {
    if (data.noteText.length > 3000) {
      setError('Note text must be under 3000 characters');
      return false;
    }
    if (/[^a-zA-Z0-9\s.,?!]/.test(data.noteText)) {
      setError('Note text contains invalid characters');
      return false;
    }
    return true;
  };

  const validateNoteFrom = () => {
    if (data.noteFrom && data.noteFrom.length > 20) {
      setError('From field must be under 20 characters');
      return false;
    }
    if (data.noteFrom && /[^a-zA-Z0-9\s.,?!]/.test(data.noteFrom)) {
      setError('From field contains invalid characters');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (validateNoteText() && validateNoteFrom()) {
      onNext();
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h6" sx={{ width: '100%' }}>
          Write a new letter for a select few to read and respond to:
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            placeholder="You can vent all your worries in an anonymous letter"
            multiline
            rows={4} // Set initial rows to 4
            fullWidth
            variant="outlined"
            name="noteText"
            value={data.noteText}
            onChange={handleInputChange}
            inputProps={{ style:{resize:"vertical",overflow: "hidden"}}}
            sx={{
              mt: 1,
              backgroundColor: 'lightgrey',
              color: 'black',
              borderRadius: 2,
              '& .MuiInputBase-root': { height: 'auto', borderRadius: 2 },
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(0, 0, 0, 0.5)' },
            }}
            required
          />
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              From:
            </Typography>
            <TextField
              fullWidth
              placeholder="Anonymous"
              name="noteFrom"
              value={data.noteFrom || ''}
              onChange={handleInputChange}
              sx={{
                backgroundColor: 'lightgrey',
                color: 'black',
                borderRadius: 2,
                '& .MuiInputBase-root': { height: 'auto', borderRadius: 2 },
                '& .MuiInputBase-input': { color: 'black' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(0, 0, 0, 0.5)' },
              }}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#007bff',
              height: 48,
              '&:hover': {
                backgroundColor: '#0056b3'
              },
              mt: 2
            }}
            disabled={data.noteText.trim().length < 10}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const Page2 = ({ data, setData, onPrevious, error, setError, onClose, setErrorMessage, setModalError }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState(new Set(data.page2Field || []));

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/user/tags');
        if (response.status === 200) {
          setTags(response.data.tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) => {
      const newTags = new Set(prevTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const handleNext = () => {
    if (selectedTags.size > 0) {
      setError('');
      const updatedData = { ...data, page2Field: Array.from(selectedTags) };
      setData(updatedData);
      handleSubmit(updatedData, onClose, setErrorMessage, setModalError);
    } else {
      setError('At least one tag must be selected');
    }
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h6">Help us find the best matches:</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTags.has(tag.tag_name) ? 'contained' : 'outlined'}
              onClick={() => handleTagChange(tag.tag_name)}
              sx={{ margin: 1 }}
            >
              {tag.tag_name}
            </Button>
          ))}
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Button onClick={onPrevious} variant="contained" color="primary" sx={{ m: 1 }}>
        Previous
      </Button>
      <Button onClick={handleNext} variant="contained" color="primary" sx={{ m: 1 }}>
        Submit
      </Button>
    </Box>
  );
};

const MultiPageForm = ({ onClose }) => {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({ noteText: '', noteFrom: '', anonymous: true });
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalError, setModalError] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    if (modalError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [modalError]);

  const handleNext = () => {
    setPage(1);
  };

  const handlePrevious = () => {
    setPage(0);
  };

  const pages = [
    <Page1 data={formData} setData={setFormData} onNext={handleNext} error={error} setError={setError} />,
    <Page2
      data={formData}
      setData={setFormData}
      onPrevious={handlePrevious}
      error={error}
      setError={setError}
      onClose={onClose}
      setErrorMessage={setErrorMessage}
      setModalError={setModalError}
    />,
  ];

  return (
    <Box sx={{ padding: '16px', height: '100%' }}>
      {modalError && (
        <Alert severity="error" ref={errorRef} tabIndex="-1">
          {errorMessage}
        </Alert>
      )}
      {pages[page]}
    </Box>
  );
};

const NewNoteForm = ({ open, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ backgroundColor: theme.palette.background.default, padding: 0 }}>
        <ThemeProvider theme={theme}>
          <MultiPageForm onClose={onClose} />
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteForm;