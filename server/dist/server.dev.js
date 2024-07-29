"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();

var cors = require('cors');

var app = express();
var port = 5005; // Change this to a different port if needed
// Middleware

app.use(bodyParser.json());
app.use(cors()); // Create and initialize SQLite database

var db = new sqlite3.Database(':memory:');
db.serialize(function () {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)');
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, task TEXT, FOREIGN KEY(user_id) REFERENCES users(id))');
}); // Sign up route

app.post('/signup', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      email = _req$body.email,
      password = _req$body.password;
  var stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
  stmt.run(username, email, password, function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(200).json({
      message: 'User registered successfully'
    });
  });
  stmt.finalize();
}); // Login route

app.post('/login', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (err, row) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (row) {
      res.status(200).json({
        message: 'Login successful',
        userId: row.id
      });
    } else {
      res.status(400).json({
        message: 'Invalid username or password'
      });
    }
  });
}); // Add task route

app.post('/add-task', function (req, res) {
  var _req$body3 = req.body,
      userId = _req$body3.userId,
      task = _req$body3.task;
  var stmt = db.prepare('INSERT INTO tasks (user_id, task) VALUES (?, ?)');
  stmt.run(userId, task, function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(200).json({
      message: 'Task added successfully',
      taskId: this.lastID
    });
  });
  stmt.finalize();
}); // Fetch tasks route

app.get('/tasks', function (req, res) {
  var userId = req.query.userId;
  db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], function (err, rows) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(200).json({
      tasks: rows
    });
  });
}); // Edit task route

app.put('/edit-task/:id', function (req, res) {
  var id = req.params.id;
  var task = req.body.task;
  var stmt = db.prepare('UPDATE tasks SET task = ? WHERE id = ?');
  stmt.run(task, id, function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(200).json({
      message: 'Task updated successfully'
    });
  });
  stmt.finalize();
}); // Delete task route

app["delete"]('/delete-task/:id', function (req, res) {
  var id = req.params.id;
  var stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  });
  stmt.finalize();
}); // Root route to handle GET requests

app.get('/', function (req, res) {
  res.send('Welcome to the ToDo App API');
});
app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});