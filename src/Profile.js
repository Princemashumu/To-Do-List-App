import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, TextField, Button, Avatar, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('userId');
      console.log('Fetching user details for userId:', userId); // Debugging log
      try {
        const response = await axios.get(`http://localhost:5000/users?userId=${userId}`);
        console.log('Fetched user data:', response.data.user); // Debugging log
        const userData = response.data.user;
        setUsername(userData.username);
        setEmail(userData.email);
        setProfilePicture(userData.profilePicture);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put('http://localhost:5000/update-profile', {
        userId,
        username,
        email,
        password,
        profilePicture
      });
      console.log('Updated user data:', response.data.user); // Debugging log
      setUser(response.data.user);
      setSnackbarMessage('Profile updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating profile:', error);
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
        const response = await axios.post('http://localhost:5000/update-profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Uploaded profile picture URL:', response.data.profilePictureUrl); // Debugging log
        setProfilePicture(response.data.profilePictureUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
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
        <Typography variant="h4">My Profile</Typography>
        <Avatar
          alt={username}
          src={profilePicture || '/default-profile.png'} // Default image if none uploaded
          sx={{ width: 100, height: 100, my: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-picture-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-picture-upload">
          <Button variant="contained" component="span">
            Upload Profile Picture
          </Button>
        </label>
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
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
