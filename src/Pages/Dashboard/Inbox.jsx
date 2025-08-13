import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Tabs, Tab, Dialog, IconButton, Typography, Grid, Chip, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteCard from './NoteCard';
import ViewNote from '../Notes/ViewNote';
import { FilterContext } from '../../components/Contexts/FilterContext';
import { NotesContext } from '../../components/Contexts/NotesContext';
import Friends from './Friends';  // Import the new Friends component

const Inbox = () => {
  const { goodTags, badTags, updateGoodTags, updateBadTags } = useContext(FilterContext);
  const { getDashboardNotes, getAllNotes } = useContext(NotesContext);

  const [tabIndex, setTabIndex] = useState(1); // Set "Mine" as the default tab
  const [dashboardFilteredNotes, setDashboardFilteredNotes] = useState([]);
  const [allFilteredNotes, setAllFilteredNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [pendingDeletion, setPendingDeletion] = useState({});
  const theme = useTheme();
  const colorRef = useRef({});
  const dashboardCallMade = useRef(false);
  const allNotesCallMade = useRef(false);

  useEffect(() => {
    const fetchAndFilterNotes = async () => {
      if (tabIndex === 1 && (dashboardFilteredNotes.length === 0 || !dashboardCallMade.current)) {
        try {
          const notes = await getDashboardNotes();
          setDashboardFilteredNotes(filterNotes(notes));
          dashboardCallMade.current = true;
        } catch (error) {
          console.error('Error notes:', error);
        }
      } else if (tabIndex === 0 && (allFilteredNotes.length === 0 || !allNotesCallMade.current)) {
        try {
          const notes = await getAllNotes();
          setAllFilteredNotes(filterNotes(notes));
          allNotesCallMade.current = true;
        } catch (error) {
          console.error('Error in fetching and filtering notes:', error);
        }
      }
    }
    fetchAndFilterNotes();
  }, [goodTags, badTags, tabIndex, getDashboardNotes, getAllNotes, dashboardFilteredNotes.length, allFilteredNotes.length]);

  const filterNotes = (notes) => {
    if (!notes || !Array.isArray(notes)) return [];
    let filteredNotes = notes;
    if (goodTags.length > 0) {
      filteredNotes = filteredNotes.filter(note => note.note_tags.some(tag => goodTags.includes(tag)));
    }
    if (badTags.length > 0) {
      filteredNotes = filteredNotes.filter(note => !note.note_tags.some(tag => badTags.includes(tag)));
    }
    filteredNotes.forEach(note => {
      if (note.note_tags) {
        note.note_tags.forEach(tag => {
          if (!colorRef.current[tag]) {
            colorRef.current[tag] = getRandomColor();
          }
        });
      }
    });
    return filteredNotes;
  };

  const openViewNoteModal = (note) => {
    setCurrentNote(note);
  };

  const closeNoteModal = () => {
    setCurrentNote(null);
  };

  const getRandomColor = () => {
    const colors = [theme.palette.secondary.main, '#e57373', '#81c784', '#64b5f6', '#ffb74d'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleInboxTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleTagClick = (tag) => {
    if (pendingDeletion[tag]) {
      if (badTags.includes(tag)) {
        updateBadTags(tag);
      } else {
        updateGoodTags(tag);
      }
      setPendingDeletion((prev) => {
        const { [tag]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setPendingDeletion((prev) => ({ ...prev, [tag]: true }));
      setTimeout(() => {
        setPendingDeletion((prev) => {
          const { [tag]: _, ...rest } = prev;
          return rest;
        });
      }, 3000);
    }
  };

  const allTags = [...new Set([...goodTags, ...badTags].filter(tag => tag))]; // Filter out any empty tags

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={handleInboxTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          marginBottom: 1, // Reduce bottom margin
          '& .MuiTab-root': {
            minHeight: '24px', // Reduce tab height
            padding: '4px 8px', // Reduce padding within tab
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#0b6623',
          },
        }}
      >
        <Tab label="All" value={0} />
        <Tab label="Mine" value={1} />
        <Tab label="Friends" value={2} />
      </Tabs>

      <Box display="flex" flexWrap="wrap" justifyContent="flex-start" sx={{ mb: 2 }}>
        {allTags.map((tag, index) => (
          <Chip
            key={index}
            label={pendingDeletion[tag] ? "" : tag}
            onClick={() => handleTagClick(tag)} // Click anywhere to trigger deletion mode
            onDelete={pendingDeletion[tag] ? () => handleTagClick(tag) : undefined}
            color="error"
            deleteIcon={pendingDeletion[tag] ? <DeleteIcon sx={{ transform: 'translateX(-4px)' }} /> : null} // Centered trashcan icon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              backgroundColor: pendingDeletion[tag]
                ? theme.palette.error.light
                : badTags.includes(tag)
                ? theme.palette.error.light
                : theme.palette.success.light,
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '4px 8px',
              margin: '4px',
              '&:hover': {
                backgroundColor: pendingDeletion[tag]
                  ? theme.palette.error.dark
                  : badTags.includes(tag)
                  ? theme.palette.error.dark
                  : theme.palette.success.dark,
              },
            }}
          />
        ))}
      </Box>

      {tabIndex === 2 && <Friends />}  {/* Load Friends component when the Friends tab is selected */}

      {tabIndex === 1 && (
        <Grid container justifyContent="center">
          {dashboardFilteredNotes.length === 0 ? (
            <Typography variant="h6" align="center">Nothing to show</Typography>
          ) : (
            dashboardFilteredNotes.map((note) => (
              <Grid
                item
                xs={12}
                sm={11}
                md={11}
                lg={11}
                xl={10}
                key={note.note_id}
                sx={{ maxWidth: '100%', padding: '0 10px' }}
              >
                <NoteCard
                  key={note.note_id}
                  note={note}
                  onClick={() => openViewNoteModal(note)}
                  colorRef={colorRef}
                  getRandomColor={getRandomColor}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tabIndex === 0 && (
        <Grid container justifyContent="center">
          {allFilteredNotes.length === 0 ? (
            <Typography variant="h6" align="center">Nothing to show</Typography>
          ) : (
            allFilteredNotes.map((note) => (
              <Grid
                item
                xs={12}
                sm={11}
                md={11}
                lg={11}
                xl={10}
                key={note.note_id}
                sx={{ maxWidth: '100%', padding: '0 10px' }}
              >
                <NoteCard
                  key={note.note_id}
                  note={note}
                  onClick={() => openViewNoteModal(note)}
                  colorRef={colorRef}
                  getRandomColor={getRandomColor}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Dialog open={!!currentNote} onClose={closeNoteModal} fullWidth maxWidth="md">
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1301 }}>
          <IconButton onClick={closeNoteModal}>
            <CloseIcon />
          </IconButton>
        </Box>
        {!!currentNote && (
          <ViewNote note={currentNote} onClose={closeNoteModal} edit={true} />
        )}
      </Dialog>
    </Box>
  );
};

export default Inbox;