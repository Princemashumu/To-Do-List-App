import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Menu,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import './App.css';




const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5005/tasks?userId=${userId}`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

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
        response = await axios.put(`http://localhost:5005/edit-task/${editTaskId}`, { task });
      } else {
        response = await axios.post('http://localhost:5005/add-task', { userId, task });
      }
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      setTask('');
      setEditTaskId(null);
      // Fetch tasks again to update the list
      const fetchResponse = await axios.get(`http://localhost:5005/tasks?userId=${userId}`);
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
      const response = await axios.delete(`http://localhost:5005/delete-task/${taskId}`);
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      // Fetch tasks again to update the list
      const userId = localStorage.getItem('userId');
      const fetchResponse = await axios.get(`http://localhost:5005/tasks?userId=${userId}`);
      setTasks(fetchResponse.data.tasks);
    } catch (error) {
      setSnackbarMessage('Error deleting task');
      setOpenSnackbar(true);
      console.error('Error deleting task:', error);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`http://localhost:5005/search-tasks?userId=${userId}&query=${e.target.value}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (option) => {
    if (option === 'Sign Out') {
      handleSignOut();
    }
    handleClose();
  };

  const menuItems = [
    { text: 'Home', onClick: () => navigate('/') },
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
    <>
    <AppBar position="static"sx={{
      backgroundColor:'black', 
      display:'flex',
      justifyContent:'space-between',
      flexGrow:1
      }}>
    <Toolbar>
          <IconButton
            edge="start"
            justifyContent='space-between'
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon  />

          </IconButton>
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ flexGrow: 1 }}
              
            >
            </IconButton>
            <TextField 
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ backgroundColor: 'white', borderRadius: '5px'}}
          />
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuClick('Sign Out')}>Sign Out</MenuItem>
              
              {/* <AccountCircle /> */}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    <Container maxWidth="sm">
      <AppBar position="static">
        
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h3" align="center">
        </Typography>
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
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
          <Box mt={4} width="100%">
            {/* <TextField
              label="Search Tasks"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mb: 2 }}
            /> */}
            <Box
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
    </>
  );
};

export default Home;
