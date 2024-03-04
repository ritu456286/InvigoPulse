import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const DashboardHeading = () => {
  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        
        color: 'black',
        padding: '10px',
      }}
    >
      <Typography variant="h3">DASHBOARD</Typography>
    </Box>
  );
};

export default DashboardHeading;
