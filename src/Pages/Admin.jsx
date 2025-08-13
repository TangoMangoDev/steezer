import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { getMoonInfo, Logout } from '../utils/authUtils';
import GetDataGrid from '../utils/GetDataGrid';
import useIsMobile from '../utils/useIsMobile';
import EditNote from '../Pages/Notes/EditNote';
import { Tabs, Tab, Box, Button, Snackbar, Alert } from '@mui/material';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import TagIcon from '@mui/icons-material/Tag';
import PeopleIcon from '@mui/icons-material/People';

export default function Admin() {
  const [value, setValue] = useState(0);
  const isMobile = useIsMobile();
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    const moon = getMoonInfo();
    if (moon !== null) {
      const { user_status } = moon;
        if (user_status !== 'admin') {
          Logout();
      }}
  }, []);

  const handleEditNote = (noteId) => {
    setCurrentNoteId(noteId);
  };

  const closeEditNoteModal = () => {
    setCurrentNoteId(null);
  };

  const handleReset = async () => {
    try {
      const response = await api.delete('/admin/reset', {
        data: { reset: true },
      });

      if (response.status === 200) {
        setNotification({ open: true, message: 'Reset successful!', severity: 'success' });
      } else {
        setNotification({ open: true, message: 'Reset failed!', severity: 'error' });
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      setNotification({ open: true, message: 'An error occurred!', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Button onClick={handleReset} variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
        Reset Data
      </Button>

      <Tabs
        value={value}
        onChange={handleChange}
        variant={isMobile ? "fullWidth" : "standard"}
        aria-label="icon tabs example"
      >
        <Tab icon={<StickyNote2Icon />} label="Notes" />
        <Tab icon={<TagIcon />} label="Tags" />
        <Tab icon={<PeopleIcon />} label="Users" />
        <Tab icon={<PeopleIcon />} label="Friends" />
        <Tab icon={<PeopleIcon />} label="Requests" />
      </Tabs>
      <Box mt={3} px={2} style={{ width: '100%', height: 'calc(100vh - 48px)' }}>
        {value === 0 && <GetDataGrid endpoint="/admin/notes" dataKey="notes" editNote={handleEditNote} />}
        {value === 1 && <GetDataGrid endpoint="/admin/tags" dataKey="tags" />}
        {value === 2 && <GetDataGrid endpoint="/admin/users" dataKey="users" />}
        {value === 3 && <GetDataGrid endpoint="/admin/friends" dataKey="friends" />}
        {value === 4 && <GetDataGrid endpoint="/admin/requests" dataKey="requests" />}
      </Box>

      {currentNoteId && (
        <EditNote
          noteId={currentNoteId}
          onClose={closeEditNoteModal}
        />
      )}

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}