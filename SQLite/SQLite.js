const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5006;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)');
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    task TEXT,
    taskDate TEXT,
    taskPriority TEXT
  )`);
});

function getTasksFromDatabase(userId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tasks WHERE userId = ?';
    db.all(query, [userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
  stmt.run(username, email, password, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
  stmt.finalize();
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.status(200).json({ message: 'Login successful', userId: row.id });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  });
});

app.post('/add-task', (req, res) => {
  const { userId, task, taskDate, taskPriority } = req.body;
  const query = `INSERT INTO tasks (userId, task, taskDate, taskPriority) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, task, taskDate, taskPriority], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error adding task' });
    }
    res.status(200).json({ message: 'Task added successfully', taskId: this.lastID });
  });
});

app.get('/tasks', async (req, res) => {
  const { userId } = req.query;
  try {
    const tasks = await getTasksFromDatabase(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/edit-task/:id', (req, res) => {
  const taskId = req.params.id;
  const { task, taskDate, taskPriority } = req.body;
  const query = `UPDATE tasks SET task = ?, taskDate = ?, taskPriority = ? WHERE id = ?`;
  db.run(query, [task, taskDate, taskPriority, taskId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating task' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  });
});

app.delete('/delete-task/:id', (req, res) => {
  const taskId = req.params.id;
  const query = `DELETE FROM tasks WHERE id = ?`;
  db.run(query, [taskId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting task' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the ToDo App API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
