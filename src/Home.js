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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Profile from './Profile'; // Import Profile component

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [task, setTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState('tasks'); // New state to manage views
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5006/tasks?userId=${userId}`);
        setTasks(response.data.tasks);
        // Fetch user profile data
        const userResponse = await axios.get(`http://localhost:5006/user?userId=${userId}`);
        setUser(userResponse.data.user);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/Login');
  };

  const handleProfile = () => {
    setView('seetings'); // Switch to profile view
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
    if (!task || !taskDate || !taskPriority) {
      setSnackbarMessage('Task, Date, and Priority cannot be empty');
      setOpenSnackbar(true);
      return;
    }
    try {
      let response;
      if (editTaskId) {
        response = await axios.put(`http://localhost:5006/edit-task/${editTaskId}`, { task, taskDate, taskPriority });
      } else {
        response = await axios.post('http://localhost:5006/add-task', { userId, task, taskDate, taskPriority });
      }
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      setTask('');
      setTaskDate('');
      setTaskPriority('');
      setEditTaskId(null);
      const fetchResponse = await axios.get(`http://localhost:5006/tasks?userId=${userId}`);
      setTasks(fetchResponse.data.tasks);
    } catch (error) {
      console.error('Error adding task:', error.response ? error.response.data : error.message);
      setSnackbarMessage('Succes!');
      setOpenSnackbar(true);
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
    setTaskDate(task.taskDate);
    setTaskPriority(task.taskPriority);
    setEditTaskId(task.id);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5006/delete-task/${taskId}`);
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      const userId = localStorage.getItem('userId');
      const fetchResponse = await axios.get(`http://localhost:5006/tasks?userId=${userId}`);
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
      const response = await axios.get(`http://localhost:5006/search-tasks?userId=${userId}&query=${e.target.value}`);
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
    } else if (option === 'Profile') {
      handleProfile();
    }
    handleClose();
  };

  const menuItems = [
    { text: 'Home', onClick: () => setView('tasks') },
    { text: 'Profile', onClick: handleProfile },
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
      <Typography variant="h6" sx={{ padding: 2 }}>
        Tasks
      </Typography>
      <List>
        {Array.isArray(tasks) ? (
          tasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemText primary={task.task} secondary={`Due: ${task.taskDate}`} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No tasks available" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'High':
        return 'red';
      default:
        return 'grey';
    }
  };
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {/* Add account icon or other relevant icon here if needed */}
          </IconButton>
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
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={() => handleMenuClick(item.text)}>
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{ background: 'url(/path/to/your/background-image.jpg) no-repeat left center fixed', backgroundSize: 'cover' }}
      >
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>

        <Container maxWidth="md" sx={{ marginTop: 4 }}>
          {view === 'tasks' ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box width="100%">
                <Container maxWidth="md">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      boxShadow: '0 3px 5px rgba(0,0,0,5)',
                    }}
                  >
                    <form onSubmit={handleTaskSubmit}>
                      <TextField
                        label="New Task"
                        variant="outlined"
                        fullWidth
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Task Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ mb: 2 }}
                      />
                      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          label="Priority"
                        >
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                        </Select>
                      </FormControl>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editTaskId ? 'Update Task' : 'Add Task'}
                      </Button>
                    </form>
                  </Box>
                </Container>
              </Box>

              <Box mt={4} width="100%">
                <Container maxWidth="md">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      boxShadow: '0 3px 5px rgba(0,0,0,5)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Tasks
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
  {Array.isArray(tasks) && tasks.length > 0 ? (
    tasks.map((task) =>
      task ? (
        <TableRow key={task.id} sx={{ backgroundColor: getPriorityColor(task.taskPriority) }}>
          <TableCell>{task.task || 'No task'}</TableCell>
          <TableCell>{task.taskDate || 'No date'}</TableCell>
          <TableCell>{task.taskPriority || 'No priority'}</TableCell>
          <TableCell align="right">
            <IconButton color="primary" onClick={() => handleEditTask(task)}>
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" onClick={() => handleDeleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow key="empty">
          <TableCell colSpan={4}>No tasks available</TableCell>
        </TableRow>
      )
    )
  ) : (
    <TableRow key="no-data">
      <TableCell colSpan={4}>No tasks available</TableCell>
    </TableRow>
  )}
</TableBody>

                      </Table>
                    </TableContainer>
                  </Box>
                </Container>
              </Box>
            </Box>
          ) : (
            <Profile user={user} setUser={setUser} />
          )}
        </Container>
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
    </>
  );
};

export default Home;
