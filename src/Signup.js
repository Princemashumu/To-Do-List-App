// src/pages/Signup.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '', // Add state for date of birth
    password: '',
    confirmPassword:' ',
  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form data:', formData);
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
        borderRadius: '8px', // Add border radius
        backgroundColor: '#fff', // Add background color
        width: '100%', // Make the Box take the full width of its container
        maxWidth: '600px', // Set a maximum width for the Box
        backgroundImage:'/backgroundimg1.jpg', // Add background image
        backgroundSize: 'cover', // Ensure the image covers the entire container
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat' // Do not repeat the background image
      }}
      >
        <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
          borderRadius: '8px', // Add border radius
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Add background color with opacity
          width: '100%', // Make the Box take the full width of its container
          maxWidth: '600px' // Set a maximum width for the Box
        }}
      >
        
      </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="Confirmpassword"
              type="password"
              value={formData.Confirmpassword}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: '20px', padding: '10px 20px', width: '100%' }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
