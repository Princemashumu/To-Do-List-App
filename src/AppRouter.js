// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Switch ,Link} from 'react-router-dom';
// import LandingPage from './LandingPage';
// import Login from './Login';
// import Signup from './Signup';
// // import Home from './Home';
// import { AppBar, Toolbar, Button, Typography } from '@mui/material';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './Signup';
import Home from './Home.js';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import  customIcon from './img3.png';
import IconButton from '@mui/material/IconButton';


const PrivateRoute = ({ element: Component }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? <Component /> : <Navigate to="/login" />;
};
const AppRouter = () => {
  // const handleLogin = (username, password) => {
  //   console.log('Logged in with', username, password);
  // };

  // const handleSignUp = (username, email, password) => {
  //   console.log('Signed up with', username, email, password);
  // };
      return (
        <Router>
          <AppBar position="static"sx={{backgroundColor:'black'}}>
          <Toolbar >
      <IconButton edge="start" color="inherit" aria-label="menu">
          <img src={customIcon}
           alt="custom icon"
           href="/Home"
            style={{ width: 30, height: 30 }} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <strong>T</strong>oDo
        </Typography>
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
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<PrivateRoute element={Home} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;