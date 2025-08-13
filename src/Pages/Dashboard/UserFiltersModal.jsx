import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Box, Dialog, DialogContent, DialogActions, Typography, CircularProgress, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import { FilterContext } from '../../components/Contexts/FilterContext';

const UserFiltersModal = ({ open, onClose }) => {
  const { goodTags, updateGoodTags, badTags, updateBadTags, tags, updateTags } = useContext(FilterContext);
  const [localGoodTags, setLocalGoodTags] = useState([]);
  const [localBadTags, setLocalBadTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      if (tags.length > 0) {
        setLocalGoodTags([...goodTags]);
        setLocalBadTags([...badTags]);
        setLoading(false);
        console.log('Using cached tags');
        return;
      }

      try {
        const tagsResponse = await api.get('/user/tags');
        if (tagsResponse.status === 200 && tagsResponse.data.tags) {
          const fetchedTags = tagsResponse.data.tags.map((tag) => tag.tag_name);
          updateTags(fetchedTags);
          setLocalGoodTags([...goodTags]);
          setLocalBadTags([...badTags]);
        } else {
          throw new Error('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      setLoading(true);
      fetchTags();
    }
  }, [open, goodTags, badTags, tags, updateTags]);

  const handleTagClick = (tag) => {
    if (localGoodTags.includes(tag)) {
      setLocalGoodTags(localGoodTags.filter((gTag) => gTag !== tag));
    } else if (localBadTags.includes(tag)) {
      setLocalBadTags(localBadTags.filter((bTag) => bTag !== tag));
    } else {
      setLocalGoodTags([...localGoodTags, tag]);
    }
  };

  const handleTagDelete = (tag) => {
    if (localBadTags.includes(tag)) {
      setLocalBadTags(localBadTags.filter((bTag) => bTag !== tag));
    } else {
      setLocalBadTags([...localBadTags, tag]);
      setLocalGoodTags(localGoodTags.filter((gTag) => gTag !== tag));
    }
  };

  const handleSave = () => {
    updateGoodTags(localGoodTags.filter(tag => tag));  // Filter out any falsy values
    updateBadTags(localBadTags.filter(tag => tag));  // Filter out any falsy values
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ style: { padding: 16, position: 'relative' } }}>
      <DialogContent style={{ padding: 16, overflowY: 'auto', maxHeight: '80vh' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Filter Preferences</Typography>
              <Button onClick={onClose} sx={{ minWidth: '40px', minHeight: '40px' }}>
                <CloseIcon />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagClick(tag)}
                  onDelete={() => handleTagDelete(tag)}
                  color={
                    localGoodTags.includes(tag) ? 'success' : localBadTags.includes(tag) ? 'error' : 'default'
                  }
                  deleteIcon={<DeleteIcon />}
                  sx={{ paddingRight: '5px' }}
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button color="secondary" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFiltersModal;