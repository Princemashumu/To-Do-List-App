import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Button, Container, Typography, Box, Snackbar, Alert,CircularProgress  } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill out all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5005/login', { username, password });
      localStorage.setItem('authToken', response.data.token);
      setOpen(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000); // Redirect after 1 second
    } catch (err) {
      setLoading(false);
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
          minHeight="100vh"
          sx={{
            backgroundColor: 'beige',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 3px 5px rgba(0,0,0,5)'
          }}
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
          {loading && (
            <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
              <CircularProgress />
              <img src={customIcon} alt="Loading" style={{ width: 50, height: 50, marginLeft: 10 }} />
              </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Login;
