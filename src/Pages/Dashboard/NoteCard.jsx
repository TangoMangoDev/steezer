import React, { useContext } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FilterContext } from '../../components/Contexts/FilterContext';

const NoteCard = ({ note, onClick, colorRef, getRandomColor }) => {
  const theme = useTheme();
  const { updateGoodTags } = useContext(FilterContext);

  const handleTagClick = (tag) => {
    updateGoodTags(tag);
  };

  if (!note) {
    return null; // Or handle missing note data accordingly
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '10px',
        cursor: 'pointer',
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up('md')]: {
          maxWidth: 'none',
        },
      }}
    >
      <CardContent sx={{ padding: '10px 16px' }}>
        <Typography variant="h6" component="div" color="text.secondary" sx={{ marginBottom: '10px' }}>
          {note.note_from ? `${note.note_from} says:` : 'Anonymous says:'}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ padding: '10px', borderRadius: '4px', minHeight: '72px' }}>
          {note.note_txt}
        </Typography>
        {note.note_tags && (
          <Box
            component="div"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {note.note_tags.map((tag, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleTagClick(tag)}
                sx={{
                  color: '#fff',
                  backgroundColor: colorRef.current[tag] || getRandomColor(),
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  pointerEvents: 'auto',
                }}
              >
                {tag}
              </Button>
            ))}
          </Box>
        )}
      </CardContent>
      
    </Card>
  );
};

export default NoteCard;