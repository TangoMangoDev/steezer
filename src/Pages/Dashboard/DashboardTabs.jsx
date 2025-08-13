import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Tab, Box, Container, Typography, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Inbox from './Inbox';
import Feed from './Feed';

const DashboardTabs = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const savedTabIndex = localStorage.getItem('currentTabIndex');
    if (savedTabIndex !== null) {
      setValue(parseInt(savedTabIndex, 10));
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('currentTabIndex', newValue);
  };

  return (
    <Container>
      <Box sx={{ mt: 1 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Moonlight Talk
        </Typography>
        <Box
          sx={{
            bgcolor: 'lightgrey',
            borderRadius: 2,
            p: 1, // Reduce padding
            mt: 1,
            mx: 'auto',
            maxWidth: '600px',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="Dashboard Tabs"
            sx={{
              mb: 1, // Reduce bottom margin
              '& .MuiTab-root': {
                minHeight: '24px', // Reduce tab height
                padding: '4px 8px', // Reduce padding within tab
                color: '#1a1a1a',
              },
              '& .Mui-selected': {
                color: '#0b6623',
              },
              '& .MuiTab-iconWrapper': {
                color: 'inherit',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0b6623',
              },
            }}
          >
            <Tab icon={<Diversity3Icon />} label="Daily" sx={{ my: 1 }} iconPosition="start" />
            <Tab icon={<PersonIcon />} label="Inbox" sx={{ my: 1 }} iconPosition="start" />
          </Tabs>

          <Box mt={1}>
            {value === 0 && <Feed />}
            {value === 1 && <Inbox />}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardTabs;