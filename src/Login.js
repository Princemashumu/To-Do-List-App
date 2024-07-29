import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/login', {
        username,
        password
      });
      // Save authentication state (e.g., token) if needed
      localStorage.setItem('authToken', response.data.token);
      setOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1000); // Redirect after 1 second
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
          {/* <Link to ="/Login"> */}
          {/* <Button
            color="inherit"
            component={Link} 
            to="/Login"
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
            Login
          </Button> */}
          {/* </Link> */}
          <Link to ="/Signup">
          <Button
            color="inherit"
            // component={Link to} 
            // to="/Signup"
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
          minHeight="100vh"
        >
          <Typography variant="h4">Login</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
          <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Login successful! Redirecting to home...
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
};

export default Login;
