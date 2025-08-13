import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import api from '../../api/axios';
import FriendCard from './FriendCard';
import ChatModal from './ChatModal';
import AddFriendModal from './AddFriendModal';
import NoteCard from './NoteCard';
import { FriendsContext } from '../../components/Contexts/FriendsContext';
import { NotesContext } from '../../components/Contexts/NotesContext';

const Friends = () => {
  const { fetchFriends, fetchRequests, friends, requests, pending } = useContext(FriendsContext);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendPicture, setFriendPicture] = useState(null);
  const [currentNotes, setCurrentNotes] = useState({});
  const [disabledLetters, setDisabledLetters] = useState({});

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      if (friends.length === 0) {
        await fetchFriends();
      }
      if (requests.length === 0) {
        await fetchRequests();
      }
    };
    fetchFriendsAndRequests();
  }, [friends, requests, fetchFriends, fetchRequests]);

  const openChatModal = (friend) => {
    setSelectedFriend(friend);
    setFriendPicture(friend.user_picture || '');
    setChatModalOpen(true);
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
    setSelectedFriend(null);
    setFriendPicture(null);
  };

  const openAddFriendModalWithRequest = (request) => {
    setSelectedRequest(request);
    setAddFriendModalOpen(true);
  };

  const closeAddFriendModal = () => {
    setAddFriendModalOpen(false);
    setSelectedRequest(null);
  };

  const handleLettersClick = async (friend_id) => {
    try {
      const response = await api.post('/user/friends/notes', { friend: friend_id });
      if (response.status === 200) {
        const notesData = response.data.notes;
        if (Array.isArray(notesData)) {
          setCurrentNotes((prevNotes) => ({
            ...prevNotes,
            [friend_id]: notesData.map(note => ({
              note_id: note.note_id || '',
              note_txt: note.note_content || '',
              created_at: note.created_at || new Date(),
              updated_at: note.updated_at || new Date()
            }))
          }));
        }
      } else {
        console.error('Failed to fetch friend notes:', response);
      }
    } catch (error) {
      console.error('Error fetching friend notes:', error);
    }
  };

  // Sort friends by new_notes and keep entries with it at the top
  const sortedFriends = [...friends].sort((a, b) => b.new_notes - a.new_notes);

  return (
    <Box>
      <Button>Friend List</Button>
      <Grid container spacing={2}>
        {sortedFriends.map((friend) => (
          <Grid item key={friend.friend_id} xs={12} sm={6} md={4} lg={3}>
            <FriendCard
              type="friend"
              data={friend}
              onClick={openChatModal}
              onLettersClick={handleLettersClick}
              disabledLetters={disabledLetters[friend.friend_id]}
            />
            {currentNotes[friend.friend_id] && currentNotes[friend.friend_id].map((note) => (
              <NoteCard key={note.note_id} note={note} onClick={() => {}} colorRef={React.useRef({})} getRandomColor={() => '#ddd'} />
            ))}
          </Grid>
        ))}
      </Grid>
      <AddFriendModal open={addFriendModalOpen} onClose={closeAddFriendModal} request={selectedRequest} />
      <ChatModal open={chatModalOpen} onClose={closeChatModal} friend={selectedFriend} picture={friendPicture} />
    </Box>
  );
};

export default Friends;