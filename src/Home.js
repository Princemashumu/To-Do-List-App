import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { Container, Typography, Box, Button, Menu, MenuItem, Drawer, List, ListItem, ListItemText, IconButton, TextField, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5001/tasks?userId=${userId}`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      let response;
      if (editTaskId) {
        response = await axios.put(`http://localhost:5001/edit-task/${editTaskId}`, { task });
      } else {
        response = await axios.post('http://localhost:5001/add-task', { userId, task });
      }
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      setTask('');
      setEditTaskId(null);
      // Fetch tasks again to update the list
      const fetchResponse = await axios.get(`http://localhost:5001/tasks?userId=${userId}`);
      setTasks(fetchResponse.data.tasks);
    } catch (error) {
      setSnackbarMessage('Error adding task');
      setOpenSnackbar(true);
      console.error('Error adding task:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleEditTask = (task) => {
    setTask(task.task);
    setEditTaskId(task.id);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/delete-task/${taskId}`);
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      // Fetch tasks again to update the list
      const userId = localStorage.getItem('userId');
      const fetchResponse = await axios.get(`http://localhost:5001/tasks?userId=${userId}`);
      setTasks(fetchResponse.data.tasks);
    } catch (error) {
      setSnackbarMessage('Error deleting task');
      setOpenSnackbar(true);
      console.error('Error deleting task:', error);
    }
  };

  const menuItems = [
    { text: 'Home', onClick: () => navigate('/') },
    { text: 'Settings', onClick: handleMenuClick },
    { text: 'Sign Out', onClick: handleSignOut }
  ];

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} onClick={item.onClick}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    
    <div className="Container">
      <div classname="Sidebar">
      <div className="Main1">

      <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems=" flex-start"
        justifyContent=" flex-start"
        minHeight="100vh"
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
     
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Box>
    </Container>
      </div>
      <div className="Main2"></div>
      <div classname="Main3"></div>
      </div>
      
      <div className='MainBar'>
      <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Box mt={4} width="100%">
          <form onSubmit={handleTaskSubmit}>
            <TextField
              label="New Task"
              variant="outlined"
              fullWidth
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {editTaskId ? 'Update Task' : 'Add Task'}
            </Button>
          </form>
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditTask(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>

      </div>
    </div>

  );
};

export default Home;
