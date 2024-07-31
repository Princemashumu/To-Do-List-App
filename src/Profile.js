import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Avatar, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5006/update-profile', {
        name,
        email,
        password,
        profilePicture
      });
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
        const response = await axios.post('http://localhost:5006/upload-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
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
          alt={name}
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
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
