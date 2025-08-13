import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NoteCard from './NoteCard';
import { NotesContext } from '../../components/Contexts/NotesContext';

const Feed = () => {
  const theme = useTheme();
  const { getFeedNotes } = useContext(NotesContext);
  const [notes, setNotes] = useState([]);
  const colorRef = React.useRef({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getFeedNotes();
        setNotes(notes);
      } catch (error) {
        console.error('Error in fetching feed notes:', error);
      }
    };
    fetchNotes();
  }, [getFeedNotes]);

  const getRandomColor = () => {
    const colors = [theme.palette.secondary.main, '#e57373', '#81c784', '#64b5f6', '#ffb74d'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      {notes.length === 0 ? (
        <Typography variant="h6" align="center">Nothing to show</Typography>
      ) : (
        <Grid container justifyContent="center">
          {notes.map((note) => (
            <Grid item xs={12} sm={11} md={11} lg={11} xl={10} key={note.note_id} sx={{ maxWidth: '100%', padding: '0 10px' }}>
              <NoteCard
                note={note}
                colorRef={colorRef}
                getRandomColor={getRandomColor}
                onClick={() => {}} // Ensuring NoteTag clicks do nothing in Feed
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Feed;