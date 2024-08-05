const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
const port = 5006;
const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)');
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    task TEXT,
    taskDate TEXT,
    taskPriority TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
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
      const user = { id: row.id, username: row.username };
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  });
});

app.post('/add-task', authenticateToken, (req, res) => {
  const { task, taskDate, taskPriority } = req.body;
  const query = `INSERT INTO tasks (userId, task, taskDate, taskPriority) VALUES (?, ?, ?, ?)`;
  db.run(query, [req.user.id, task, taskDate, taskPriority], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error adding task' });
    }
    res.status(200).json({ message: 'Task added successfully', taskId: this.lastID });
  });
});

app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await getTasksFromDatabase(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/edit-task/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const { task, taskDate, taskPriority } = req.body;
  const query = `UPDATE tasks SET task = ?, taskDate = ?, taskPriority = ? WHERE id = ? AND userId = ?`;
  db.run(query, [task, taskDate, taskPriority, taskId, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating task' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  });
});

app.delete('/delete-task/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const query = `DELETE FROM tasks WHERE id = ? AND userId = ?`;
  db.run(query, [taskId, req.user.id], function (err) {
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
