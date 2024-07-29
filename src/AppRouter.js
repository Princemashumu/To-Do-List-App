// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Switch ,Link} from 'react-router-dom';
// import LandingPage from './LandingPage';
// import Login from './Login';
// import Signup from './Signup';
// // import Home from './Home';
// import { AppBar, Toolbar, Button, Typography } from '@mui/material';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import SignUp from './Signup';
import Home from './Home.js';
import PrivateRoute from './PrivateRoute';


const AppRouter = () => {

      return (
        <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;