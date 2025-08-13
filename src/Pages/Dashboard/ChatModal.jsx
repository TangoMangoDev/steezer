import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Avatar, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/axios';
import { format, isToday } from 'date-fns';

const ChatModal = ({ open, handleClose, friend_id, friend_name, friend_picture }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMessages = async () => {
      if (friend_id && open) {
        try {
          const response = await api.post('/user/texts', { friend: friend_id });
          if (response.status === 200) {
            setMessages(response.data.texts);
            scrollToBottom();
          } else {
            console.error('Failed to fetch messages:', response);
          }
        } catch (error) {
          console.error(`Error fetching texts:`, error);
        }
      }
    };

    if (open) {
      fetchMessages();
    }
  }, [friend_id, open]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await api.put('/user/texts', { friend: friend_id, text: newMessage });
        if (response.status === 200) {
          // Append the new message to the list and clear the input field
          setMessages([...messages, { content: newMessage, sender_id: null, created_at: new Date().toISOString() }]);
          setNewMessage('');
          scrollToBottom();
        } else {
          console.error('Failed to send message:', response);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format date according to requirements
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Today at ${format(date, 'HH:mm')}`;
    } else {
      return `${format(date, 'MM/dd')} at ${format(date, 'HH:mm')}`;
    }
  };

  // Sort messages by created_at with newest at the bottom
  const sortedMessages = messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        width: isMobile ? 'calc(100% - 20px)' : 800,
        height: 'calc(100vh - 200px)',
        bgcolor: 'background.paper',
        margin: '100px auto',
        padding: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={friend_picture || ''} alt={friend_name || 'default'} sx={{ marginRight: 2 }} />
            <Typography variant="h6">{`Chat with ${friend_name}`}</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {sortedMessages.map((message, index) => (
            <ListItem key={index} sx={{
              justifyContent: message.sender_id === friend_id ? 'flex-start' : 'flex-end',
              textAlign: message.sender_id === friend_id ? 'left' : 'right'
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {formatDate(message.created_at)}
                </Typography>
                <ListItemText primary={message.content} />
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField fullWidth value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message" />
          <Button onClick={handleSendMessage} variant="contained" sx={{ marginLeft: 1 }}>Send</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChatModal;