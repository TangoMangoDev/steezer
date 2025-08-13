import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/axios';
const AddFriendModal = ({ open, handleClose, friend, request_id }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFriendRequest, setIsFriendRequest] = useState(false);

  useEffect(() => {
    if (friend) {
      setUsername(friend);
      setIsFriendRequest(true);
    }
  }, [friend, request_id]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Conditionally set the payload
      const payload = request_id ? { request_id } : { friend: username };
      const response = await api.put('/user/friends', payload);
      if (response.status === 200) {
        alert('The request was sent');
        handleClose();
      }
    } catch (error) {
      console.error('Error saving friend:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} style={{ borderRadius: 8 }}>
      <div style={{ padding: 20, background: '#333', color: '#fff', borderRadius: 8, maxWidth: 400, margin: '0 auto', top: '50%', transform: 'translateY(-50%)', position: 'relative' }}>
        <IconButton
          style={{ position: 'absolute', top: 10, right: 10, color: '#fff' }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <h2>{isFriendRequest ? `Accept friend request from: ${username}` : "Enter your friend's username:"}</h2>
        <TextField
          fullWidth
          value={username}
          onChange={handleInputChange}
          placeholder="Enter username"
          InputProps={{ style: {color: '#fff'}, readOnly: isFriendRequest }}
        />
        <Button
          style={{ marginTop: 20 }}
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={(username.length < 5 && !isFriendRequest) || isSubmitting}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default AddFriendModal;