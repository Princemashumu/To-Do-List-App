import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Button, Container, Typography, Box, Snackbar, Alert} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      setSnackbarMessage('Enter Username');
      setOpenSnackbar(true);
      return;
    }else if(!password)
    {
      setSnackbarMessage('Enter Password');
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/users', {
        params: { username, password },
      });
      const user = response.data.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        setSnackbarMessage('Login successful');
        localStorage.setItem('authToken', 'your-auth-token');
        localStorage.setItem('userId', user.id);
        navigate('/home'); // Redirect to home page
      } else {
        setSnackbarMessage('Invalid username or password');
      }
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error logging in');
      setOpenSnackbar(true);
      console.error('Error logging in:', error);
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
          
          <Link to ="/Signup">
          <Button
            color="inherit"
            sx={{
              borderRadius: '20px',
              margin: '0 5px',
              border: '2px solid #fff',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#333',
                borderColor: '#fff'
              }
            }}
          >
            Signup
          </Button>
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
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
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

export default Login;
