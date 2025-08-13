import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const FriendCard = ({ type, data, onClick, onLettersClick, disabledLetters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCardClick = (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
      return; // Prevent card click event when button is clicked
    }
    if (type === 'friend') {
      onClick(data);
    }
  };

  const handleChatClick = () => {
    if (type === 'friend') {
      onClick(data);
    }
  };

  const handleLettersClick = () => {
    onLettersClick(data.friend_id);
  };

  if (type === 'request') {
    return (
      <Card
        sx={{
          marginBottom: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Typography variant="h6">{`Friend request from: ${data.requestor}`}</Typography>
        </CardContent>
      </Card>
    );
  } else if (type === 'pending') {
    return (
      <Card
        sx={{
          marginBottom: 2,
          cursor: 'default',  // Change cursor to default to indicate it's not clickable
        }}
      >
        <CardContent>
          <Typography variant="body2" color="textSecondary">{`${data.requestee}: Pending...`}</Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card
        sx={{
          marginBottom: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9} sm={7}>
              <Grid container alignItems="center">
                <Grid item>
                  <Avatar src={data.user_picture || ''} alt={data.moon_name || 'default'} sx={{ marginRight: 2 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{`${data.moon_name}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} sm={5} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
              <Grid container spacing={1} sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleChatClick}>
                    Chat
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ ml: 1 }}
                    onClick={handleLettersClick}
                    disabled={disabledLetters}
                  >
                    {data.new_notes ? 'New Letters' : (disabledLetters ? 'No Letters' : 'Letters')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
};

export default FriendCard;