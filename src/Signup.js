import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Button, Container, Typography, Box, Snackbar, Alert, Link} from '@mui/material';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email,setEmail]= useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmPassword] =useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !Confirmpassword) {
      setSnackbarMessage('Please enter Credintials');
      setOpenSnackbar(true);
      return;
    }
    else if(password !== Confirmpassword )
    {
      setSnackbarMessage('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/users', { username, email, password,Confirmpassword });
      setSnackbarMessage('Signup successful');
      setOpenSnackbar(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setSnackbarMessage('Error signing up');
      setOpenSnackbar(true);
      console.error('Error signing up:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={customIcon} alt="custom icon" style={{ width: 30, height: 30 }} />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <strong>T</strong>oDo
          </Typography>
          <Link to ="/Login">
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          marginTop='5em'
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 3px 5px rgba(0,0,0,5)'
          }}
        >
        <Typography variant="h6" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
           <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
           <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={Confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Signup
          </Button>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </>
  );
};

export default Signup;
