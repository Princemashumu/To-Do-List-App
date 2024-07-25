import React from 'react';
import './Wrapper.css';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import  customIcon from './img3.png';
// import customImg from './backgroundimg2.jpg';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';



function LandingPage() {
  
  return (
    <div className="Wrapper">
     <div className="Container">
      <div className="Header">
      <AppBar position="static"  sx={{ backgroundColor: '#333' }}>
      <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu">
          <img src={customIcon}
           alt="custom icon"
           href="/Home"
            style={{ width: 30, height: 30 }} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <strong>T</strong>oDo
        </Typography>
        {/* <Button 
        color="inherit"
        component={Link}
        to="/Home"
        sx={{ 
          borderRadius: '20px', 
          margin: '0 5px',
          border: '2px solid #fff' 
        }}>
          Home
        </Button> */}

       
        <Button 
        color="inherit"
        component={Link} to="/Login"
        sx={{ 
          borderRadius: '20px', 
            margin: '0 5px',
            border: '2px solid #fff',
            '&:hover': {
              backgroundColor: '#fff',
              color: '#333',
              borderColor: '#fff'}}}>
          Login
        </Button>
        <Button 
        color="inherit"
        component={Link} 
        to="/Signup"
        sx={{ 
          borderRadius: '20px', 
          margin: '0 5px',
          border: '2px solid #fff',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#333',
            borderColor: '#fff'}
        }}>
          Signup
        </Button>
      </Toolbar>
    </AppBar>
      </div>
      <div className="Main1">
      <Container maxWidth="sm"
      sx={{ alignContent:'center'}}>
        
        <h2>A simple way To Do List.</h2>
        
        </Container>
      </div>
      <div className="Main2">
      <Container maxWidth="sm">
      <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your journey to create and manage tasks starts here 
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/Signup" 
          sx={{ borderRadius: '20px', padding: '10px 20px' }}
        >
          Let's Get Started
        </Button>
      </Box>
    </Container>
        </Container>
      </div>
      {/* <div className="Main3">
      <Container maxWidth="sm">
        
        
        
        </Container>
      </div> */}
      {/* <div className="Footer">
      <Container maxWidth="sm">
      <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}> 
   
        </Container>
        </Container>
      </div> */}
      </div>

    </div>
  )
}

export default LandingPage;