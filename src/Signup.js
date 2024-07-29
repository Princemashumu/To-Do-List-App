import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Button, Container, Typography, Box, Snackbar, Alert, Link,CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5005/signup', {
        username,
        email,
        password
      });
      setOpen(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 1000); // Redirect after 1 second
    } catch (err) {
      setLoading(false);
      setError('Error registering user');
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
          minHeight="100vh"
          sx={{
            backgroundColor: 'beige',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
          }}
        >
          <Typography variant="h4">Signup</Typography>
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
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Signup
            </Button>
          </form>
          <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Signup successful! Redirecting to login...
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

export default Signup;
