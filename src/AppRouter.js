import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token); // Return true if token exists, otherwise false
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally show a loader while checking authentication status
  }

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} /> */}
        {/* <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
