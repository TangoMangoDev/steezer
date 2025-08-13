import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { Button, Box, Dialog, DialogContent, DialogActions, Typography, CircularProgress, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FilterContext } from '../../components/Contexts/FilterContext'; // Import FilterContext

const LetterPreferencesModal = ({ open, onClose, FeedPrefs, setFeedPrefs }) => {
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [localFeedPrefs, setLocalFeedPrefs] = useState([]);
  const { tags, updateTags } = useContext(FilterContext); // Destructure tags and updateTags from FilterContext

  useEffect(() => {
    const fetchTags = async () => {
      if (tags.length > 0) {
        setLocalFeedPrefs(FeedPrefs);
        setLoading(false);
        return; // Use existing tags from context
      }

      try {
        const tagsResponse = await api.get('/user/tags');
        if (tagsResponse.status === 200 && tagsResponse.data.tags) {
          const fetchedTags = tagsResponse.data.tags.map(tag => tag.tag_name);
          updateTags(fetchedTags); // Update tags in FilterContext
          setLocalFeedPrefs(FeedPrefs);
        } else {
          throw new Error('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      setLoading(true);
      fetchTags();
    }
  }, [open, tags, FeedPrefs, updateTags]);

  const handleTagClick = (tag) => {
    const updatedLocalFeedPrefs = localFeedPrefs.includes(tag)
      ? localFeedPrefs.filter(gTag => gTag !== tag)
      : [...localFeedPrefs, tag];
    setLocalFeedPrefs(updatedLocalFeedPrefs);
    setChanged(true);
  };

  const handleSave = async () => {
    try {
      await api.post('/user/settings', { user_prefs: localFeedPrefs, bad_tags: [] });
      setChanged(false);
      setFeedPrefs(localFeedPrefs); // Update FeedPrefs state
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ style: { padding: 16, position: 'relative' } }}>
      <DialogContent style={{ padding: 16, overflowY: 'auto', maxHeight: '80vh' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Feed Preferences</Typography>
              <Button onClick={onClose} sx={{ minWidth: '40px', minHeight: '40px' }}>
                <CloseIcon />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  variant={localFeedPrefs.includes(tag) ? 'filled' : 'outlined'}
                  onClick={() => handleTagClick(tag)}
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" disabled={!changed} onClick={handleSave}>
          Save
        </Button>
        <Button color="secondary" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LetterPreferencesModal;