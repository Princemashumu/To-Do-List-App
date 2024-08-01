
import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import loadingIcon from './img3.png'; 

const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    width="100vw"
    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
  >
    <img src={loadingIcon} alt="Loading..." style={{ width: 50, height: 50 }} />
    <CircularProgress sx={{ ml: 2 }} />
  </Box>
);

export default Loader;
