import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('userId');
      console.log('Fetching user details for userId:', userId);
      try {
        const response = await axios.get(`http://localhost:5000/users?userId=${userId}`);
        console.log('Fetched user data:', response.data.user);
        const userData = response.data.users;
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.post('http://localhost:5000/updated-users', {
        userId, // Ensure this is sent if required by your backend
        username,
        email,
        password
      });
      console.log('Updated user data:', response.data.user);
      setUser(response.data.user);
      setSnackbarMessage('Profile updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setSnackbarMessage('Error updating profile');
      setOpenSnackbar(true);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('http://localhost:5000/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
      } catch (error) {
        console.error('Error uploading file:', error.response?.data || error.message);
        setSnackbarMessage('Error uploading file');
        setOpenSnackbar(true);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box mt={4} display="flex" flexDirection="column" alignItems="center">
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-picture-upload"
          type="file"
          onChange={handleFileChange}
        />
        <Box mt={2} width="100%" maxWidth="600px">
          <form onSubmit={handleUpdateProfile}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Profile
            </Button>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
