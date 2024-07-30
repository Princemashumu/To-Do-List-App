const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5006; // Change this to a different port if needed

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create and initialize SQLite database
const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)');
  // db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, task TEXT, FOREIGN KEY(user_id) REFERENCES users(id))');
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    task TEXT,
    taskDate TEXT,
    taskPriority TEXT
  )`);
});
module.exports = db;

// Sign up route
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

// Login route
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

// // Add task route
// app.post('/add-task', (req, res) => {
//   const { userId, task } = req.body;
//   const stmt = db.prepare('INSERT INTO tasks (user_id, task) VALUES (?, ?)');
//   stmt.run(userId, task, function (err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json({ message: 'Task added successfully', taskId: this.lastID });
//   });
//   stmt.finalize();
// });

// // Fetch tasks route
// app.get('/tasks', (req, res) => {
//   const { userId } = req.query;
//   db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json({ tasks: rows });
//   });
// });

// // Edit task route
// app.put('/edit-task/:id', (req, res) => {
//   const { id } = req.params;
//   const { task } = req.body;
//   const stmt = db.prepare('UPDATE tasks SET task = ? WHERE id = ?');
//   stmt.run(task, id, function (err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json({ message: 'Task updated successfully' });
//   });
//   stmt.finalize();
// });

// // Delete task route
// app.delete('/delete-task/:id', (req, res) => {
//   const { id } = req.params;
//   const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
//   stmt.run(id, function (err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json({ message: 'Task deleted successfully' });
//   });
//   stmt.finalize();
// });

// // Root route to handle GET requests
// app.get('/', (req, res) => {
//   res.send('Welcome to the ToDo App API');
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


// Add a new task
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

// Get tasks
app.get('/tasks', (req, res) => {
  const userId = req.query.userId;
  const query = `SELECT * FROM tasks WHERE userId = ?`;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    res.status(200).json({ tasks: rows });
  });
});

// Edit task
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

// Delete task
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
