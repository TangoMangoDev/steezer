import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
//import MenuIcon from '@mui/icons-material/Menu';
//import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { grey } from '@mui/material/colors';
import NewNoteForm from '../../Pages/Notes/NewNoteForm';

const Sidenav = ({ isSignedIn, userStatus, signout, drawerOpen, handleDrawerToggle }) => {
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const theme = useTheme();

  const handleNewNoteOpen = () => {
    setNewNoteOpen(true);
    handleDrawerToggle();
  };

  const handleNewNoteClose = () => {
    setNewNoteOpen(false);
  };

  // Define styles for dark mode
  const textColor = theme.palette.mode === 'dark' ? 'black' : 'inherit';
  const iconColor = theme.palette.mode === 'dark' ? 'black' : 'inherit';

  return (
    <>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 250, bgcolor: grey[100] }
        }}
      >
        <List>
          {isSignedIn ? (
            <>
              <ListItem component={Link} to="/dashboard" onClick={handleDrawerToggle}>
                <ListItemIcon sx={{ color: iconColor }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: textColor }} />
              </ListItem>
              <ListItem component={Link} to="/settings" onClick={handleDrawerToggle}>
                <ListItemIcon sx={{ color: iconColor }}><SettingsIcon /></ListItemIcon>
                <ListItemText primary="User Settings" sx={{ color: textColor }} />
              </ListItem>
              <ListItem component="div" button onClick={handleNewNoteOpen}>
                <ListItemIcon sx={{ color: iconColor }}><AddIcon /></ListItemIcon>
                <ListItemText primary="Send A Letter" sx={{ color: textColor }} />
              </ListItem>
              <ListItem component={Link} to="/contact" onClick={handleDrawerToggle}>
                <ListItemIcon sx={{ color: iconColor }}><MessageIcon /></ListItemIcon>
                <ListItemText primary="Contact Us" sx={{ color: textColor }} />
              </ListItem>

              {userStatus === 'admin' && (
                <ListItem component={Link} to="/admin" onClick={handleDrawerToggle}>
                  <ListItemIcon sx={{ color: iconColor }}><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Admin Dash" sx={{ color: textColor }} />
                </ListItem>
              )}
              <ListItem button onClick={() => { signout(); handleDrawerToggle(); }}>
                <ListItemIcon sx={{ color: iconColor }}><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" sx={{ color: textColor }} />
              </ListItem>
            </>
          ) : (
            <ListItem component={Link} to="/signin" onClick={handleDrawerToggle}>
              <ListItemIcon sx={{ color: iconColor }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Sign In" sx={{ color: textColor }} />
            </ListItem>
          )}
        </List>
      </Drawer>
      <NewNoteForm open={newNoteOpen} onClose={handleNewNoteClose} />
    </>
  );
};

export default Sidenav;