const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 5006;

app.use(cors());
app.use(bodyParser.json());

let tasks = [
  { id: 1, task: 'Sample Task 1', taskDate: '2024-01-01', taskPriority: 'High', userId: '1' },
  { id: 2, task: 'Sample Task 2', taskDate: '2024-01-02', taskPriority: 'Medium', userId: '1' },
];

// Fetch tasks
app.get('/tasks', (req, res) => {
  const userId = req.query.userId;
  const userTasks = tasks.filter(task => task.userId === userId);
  res.json({ tasks: userTasks });
});

// Add task
app.post('/add-task', (req, res) => {
  const { userId, task, taskDate, taskPriority } = req.body;
  const newTask = { id: tasks.length + 1, userId, task, taskDate, taskPriority };
  tasks.push(newTask);
  res.json({ message: 'Task added successfully' });
});

// Edit task
app.put('/edit-task/:id', (req, res) => {
  const { id } = req.params;
  const { task, taskDate, taskPriority } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], task, taskDate, taskPriority };
    res.json({ message: 'Task updated successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete task
app.delete('/delete-task/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id));
  res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/add-task', async (req, res) => {
  const userId = req.query.userId;
  const query = req.query.query || '';

  try {
    const tasks = await Task.find({
      userId: userId,
      task: { $regex: query, $options: 'i' } // This regex filters tasks based on the query (case-insensitive)
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});