import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  CircularProgress,
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/axios';
import moment from 'moment';
import EditNote from './EditNote';

const ViewNote = ({ note, onClose, edit }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [msgFromVisible, setMsgFromVisible] = useState(false);
  const [msgFrom, setMsgFrom] = useState('');
  const [msgTxt, setMsgTxt] = useState('');
  const [editNoteOpen, setEditNoteOpen] = useState(false);
  const [seeMoreNoteTxt, setSeeMoreNoteTxt] = useState(false);
  const [seeMoreMsgTxt, setSeeMoreMsgTxt] = useState({});
  const inputRef = useRef(null);
  const topBoxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const topBox = topBoxRef.current;
      if (topBox) {
        if (window.scrollY > topBox.offsetTop) {
          topBox.style.position = 'fixed';
          topBox.style.top = '0';
          topBox.style.width = `calc(100% - ${topBox.offsetLeft}px)`;
          topBox.style.zIndex = 1302;
          topBox.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)';
        } else {
          topBox.style.position = 'relative';
          topBox.style.width = '100%';
          topBox.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.put('/user/notes', { note_id: note.note_id });
        let { msgs } = response.data;
        msgs = msgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setMsgs(msgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [note.note_id]);

  const handleSendMessage = async () => {
    const confirmSend = window.confirm('Are you sure you want to send this message?');
    const sender = msgFrom.trim() === '' ? 'Anonymous' : msgFrom;

    if (confirmSend) {
      try {
        const response = await api.post('/user/reply', {
          msg: {
            msg_txt: msgTxt,
            msg_from: sender,
            note_id: note.note_id,
          }
        });

        if (response.status === 200) {
          const newMsg = {
            msg_from: sender,
            msg_txt: msgTxt,
            msg_id: Date.now(),
            created_at: new Date(),
          };
          setMsgs((prevMsgs) => [newMsg, ...prevMsgs]);
          setMsgFrom('');
          setMsgTxt('');
          setMsgFromVisible(false);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleMsgTxtChange = (e) => {
    const value = e.target.value;
    setMsgTxt(value);
    if (value.trim() !== '') {
      setMsgFromVisible(true);
    } else {
      setMsgFromVisible(false);
    }
  };

  const handleEditNote = () => {
    setEditNoteOpen(true);
  };

  const renderMsg = (msg) => (
    <Box key={msg.msg_id} sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
        {msg.msg_from}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {moment(msg.created_at).format('MMM D h:mm A')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {msg.msg_txt.length > 250 && !seeMoreMsgTxt[msg.msg_id]
          ? (
            <>
              {`${msg.msg_txt.substring(0, 250)}... `}
              <Typography
                variant="body2"
                color="primary"
                component="span"
                onClick={() => setSeeMoreMsgTxt((prev) => ({ ...prev, [msg.msg_id]: true }))}
                sx={{ cursor: 'pointer' }}
              >
                read more
              </Typography>
            </>
          ) : msg.msg_txt}
      </Typography>
    </Box>
  );

  return (
    <>
      <Dialog open={!!note && !editNoteOpen} onClose={onClose} fullWidth maxWidth="md">
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
              boxShadow: window.scrollY > 0 ? '0 3px 5px rgba(0, 0, 0, 0.2)' : 'none',
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 1, boxShadow: 'none' }}>
              {edit && (
                <Button onClick={handleEditNote}>
                  Edit
                </Button>
              )}
              <Button variant="contained" color="secondary" onClick={() => inputRef.current.focus()}>
                Reply
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, padding: '16px', marginTop: 0, width: '100%', overflowY: 'auto' }}>
            <Typography
              variant="h6"
              component="div"
              color="text.secondary"
              style={{ padding: '10px 16px' }}
            >
              {note.note_from ? `${note.note_from} says:` : 'Anonymous says:'}
            </Typography>
          <TextField
   name="note_txt"
   value={note.note_txt}
   multiline
   rows={10}
   fullWidth
   variant="outlined"
   InputProps={{
     readOnly: true,
     style: {
       borderRadius: theme.shape.borderRadius,
       border: 'none',
     },
   }}
   sx={{
     borderRadius: theme.shape.borderRadius,
     '& .MuiOutlinedInput-root': {
       borderRadius: theme.shape.borderRadius,
     },
   }}
 />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', padding: '10px' }}>
              {note.note_tags.map((tag, index) => (
                <Button
                  key={index}
                  variant="contained"
                  style={{
                    color: '#fff',
                    backgroundColor: theme.palette.secondary.main,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    padding: '2px 4px',
                    pointerEvents: 'none',
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Box>
<TextField
   fullWidth
   multiline
   rows={2}
   value={msgTxt}
   onChange={handleMsgTxtChange}
   inputRef={inputRef}
   variant="outlined"
   placeholder="Reply..."
   InputProps={{
     style: {
       borderRadius: theme.shape.borderRadius,
       border: 'none',
     },
   }}
   sx={{
     marginBottom: '20px',
     '& .MuiOutlinedInput-root': {
       borderRadius: theme.shape.borderRadius,
     },
   }}
 />
            {msgFromVisible && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TextField
   fullWidth
   value={msgFrom}
   onChange={(e) => setMsgFrom(e.target.value)}
   placeholder="Anonymous"
   variant="outlined"
   InputProps={{
     style: {
       borderRadius: theme.shape.borderRadius,
       border: 'none',
     },
   }}
   sx={{
     '& .MuiOutlinedInput-root': {
       borderRadius: theme.shape.borderRadius,
     },
   }}
 />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendMessage}
                  sx={{ height: '56px' }}
                >
                  Send
                </Button>
              </Box>
            )}
            <Typography variant="h6" gutterBottom sx={{ padding: '10px 16px' }}>
              Responses:
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ padding: '0 16px' }}>
                {msgs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No responses yet.
                  </Typography>
                ) : (
                  msgs.map(renderMsg)
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>

      {editNoteOpen && (
        <EditNote
          noteId={note.note_id}
          onClose={() => setEditNoteOpen(false)}
        />
      )}
    </>
  );
};

export default ViewNote;