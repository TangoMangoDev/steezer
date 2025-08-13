import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import {
  Typography,
  CardContent,
  Button,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const EditNote = ({ noteId, onClose }) => {
  const [note, setNote] = useState(null);
  const [editData, setEditData] = useState({ note_tags: [] });
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const theme = useTheme();
  const topBoxRef = useRef(null);
  const contentRef = useRef(null);
  const [boxShadow, setBoxShadow] = useState('none');

  useEffect(() => {
    const fetchNoteAndTags = async () => {
      try {
        const [noteResponse, tagsResponse] = await Promise.all([
          api.put('/user/notes', { note_id: noteId }, {
            headers: { 'Content-Type': 'application/json' },
          }),
          api.get('/api/user/tags')
        ]);

        if (noteResponse.status === 200 && noteResponse.data) {
          setNote(noteResponse.data.notes);
          setEditData({ ...noteResponse.data.notes, note_tags: noteResponse.data.notes.note_tags || [] });
        } else {
          throw new Error('Failed to fetch note');
        }

        if (tagsResponse.status === 200 && tagsResponse.data) {
          setAllTags(tagsResponse.data.tags.map(tag => tag.tag_name));
        } else {
          throw new Error('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error fetching note or tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndTags();
  }, [noteId]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && contentRef.current.scrollTop > 0) {
        setBoxShadow('0 3px 5px rgba(0, 0, 0, 0.2)');
      } else {
        setBoxShadow('none');
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleTagClick = (tag) => {
    setChanged(true);
    setEditData((prevData) => {
      const updatedTags = prevData.note_tags.includes(tag)
        ? prevData.note_tags.filter((t) => t !== tag)
        : [...prevData.note_tags, tag];
      return { ...prevData, note_tags: updatedTags };
    });
  };

  const handleInputChange = (e) => {
    setChanged(true);
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const { note_txt, note_tags, note_from } = editData;
      const response = await api.post('/user/notes', {
        note_id: noteId,
        note_txt,
        note_tags,
        note_from
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        onClose();
        window.location.reload();
      } else {
        throw new Error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const updatedStatus = note.note_status === 'active' ? 'draft' : 'active';
      const response = await api.post('/user/notes', {
        note_id: noteId,
        note_status: updatedStatus,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 && note) {
        setNote((prevNote) => ({ ...prevNote, note_status: updatedStatus }));
      } else {
        throw new Error('Failed to update note status');
      }
    } catch (error) {
      console.error('Error updating note status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.post('/user/notes', {
        note_id: noteId,
        note_status: 'DELETE',
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        onClose();
        window.location.reload();
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const renderTagButton = (tag, isNoteTag) => (
    <Button
      key={tag}
      variant="contained"
      onClick={() => handleTagClick(tag)}
      style={{
        color: '#fff',
        backgroundColor: isNoteTag ? theme.palette.secondary.main : 'grey',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        padding: '2px 4px', // Smaller button size
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {tag}
    </Button>
  );

  const confirmSave = () => {
    setConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationOpen(false);
  };

  const saveChanges = () => {
    closeConfirmation();
    handleSave();
  };

  const confirmDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };

  const deleteNote = () => {
    closeDeleteConfirmation();
    handleDelete();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <Box position="relative" sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Box
          ref={topBoxRef}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            padding: '10px 16px',
            width: '100%',
            boxShadow: boxShadow,
            transition: 'box-shadow 0.3s ease-in-out',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: '10px' }}>
              Current Status:
            </Typography>
            <Button
              onClick={handleStatusToggle}
              variant="contained"
              sx={{
                backgroundColor: note.note_status === 'active' ? '#d4edda' : '#f8d7da',
                color: note.note_status === 'active' ? '#155724' : '#721c24',
              }}
            >
              {note.note_status === 'active' ? 'Public' : 'Private'}
            </Button>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box ref={contentRef} sx={{ flex: 1, padding: '16px', marginTop: 0, width: '100%', overflowY: 'auto' }}>
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              color="text.secondary"
              style={{ marginBottom: '16px' }}
            >
              {note.note_from ? `${note.note_from} says:` : 'Anonymous says:'}
            </Typography>
            <TextField
              name="note_txt"
              value={editData.note_txt}
              onChange={handleInputChange}
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '20px' }}
              disabled={note.admin_note}
              InputProps={{
                style: {
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'lightgrey',
                  border: 'none',
                  color: theme.palette.mode === 'dark' ? 'white' : 'black',
                },
              }}
              sx={{
                borderRadius: theme.shape.borderRadius,
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
            />
            <TextField
              name="note_from"
              value={editData.note_from}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '20px' }}
              InputProps={{
                style: {
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'lightgrey',
                  border: 'none',
                  color: theme.palette.mode === 'dark' ? 'white' : 'black',
                },
              }}
              sx={{
                borderRadius: theme.shape.borderRadius,
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
            />
            {!note.admin_note && (
              <>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                  {(editData.note_tags || []).map((tag) => renderTagButton(tag, true))}
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                  {allTags.filter((tag) => !editData.note_tags.includes(tag)).map((tag) => renderTagButton(tag, false))}
                </Box>
              </>
            )}
          </CardContent>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              paddingTop: 0,
            }}
          >
            {!note.admin_note && (
              <Button
                onClick={confirmDelete}
                variant="contained"
                style={{ backgroundColor: '#ff6666' }}
              >
                Delete
              </Button>
            )}
            <Box sx={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <Button onClick={onClose} color="primary" variant="contained">
                Cancel
              </Button>
              {(!note.admin_note && changed) && (
                <Button onClick={confirmSave} color="primary" variant="contained" disabled={!changed}>
                  Save
                </Button>
              )}
            </Box>
          </CardContent>
        </Box>
      </Box>

      {/* Confirmation Dialog for Save */}
      <Dialog open={confirmationOpen} onClose={closeConfirmation}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save the changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={saveChanges} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteNote} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditNote;