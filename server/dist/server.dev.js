"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();

var cors = require('cors');

var app = express();
var port = 5006; // Change this to a different port if needed
// Middleware

app.use(bodyParser.json());
app.use(cors()); // Create and initialize SQLite database

var db = new sqlite3.Database('./tasks.db');
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)'); // db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, task TEXT, FOREIGN KEY(user_id) REFERENCES users(id))');

  db.run("CREATE TABLE IF NOT EXISTS tasks (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    userId TEXT,\n    task TEXT,\n    taskDate TEXT,\n    taskPriority TEXT\n  )");
});
module.exports = db; // Sign up route

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
}); // Add a new task

app.post('/add-task', function (req, res) {
  var _req$body3 = req.body,
      userId = _req$body3.userId,
      task = _req$body3.task,
      taskDate = _req$body3.taskDate,
      taskPriority = _req$body3.taskPriority;
  var query = "INSERT INTO tasks (userId, task, taskDate, taskPriority) VALUES (?, ?, ?, ?)";
  db.run(query, [userId, task, taskDate, taskPriority], function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Error adding task'
      });
    }

    res.status(200).json({
      message: 'Task added successfully',
      taskId: this.lastID
    });
  });
}); // Get tasks

app.get('/tasks', function _callee(req, res) {
  var userId, tasks;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.query.userId;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(db.all('SELECT * FROM tasks WHERE userId = ?', [userId]));

        case 4:
          tasks = _context.sent;
          res.json({
            tasks: tasks
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'Error fetching tasks'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // Edit task

app.put('/edit-task/:id', function (req, res) {
  var taskId = req.params.id;
  var _req$body4 = req.body,
      task = _req$body4.task,
      taskDate = _req$body4.taskDate,
      taskPriority = _req$body4.taskPriority;
  var query = "UPDATE tasks SET task = ?, taskDate = ?, taskPriority = ? WHERE id = ?";
  db.run(query, [task, taskDate, taskPriority, taskId], function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Error updating task'
      });
    }

    res.status(200).json({
      message: 'Task updated successfully'
    });
  });
}); // Delete task

app["delete"]('/delete-task/:id', function (req, res) {
  var taskId = req.params.id;
  var query = "DELETE FROM tasks WHERE id = ?";
  db.run(query, [taskId], function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Error deleting task'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  });
}); // Root route to handle GET requests

app.get('/', function (req, res) {
  res.send('Welcome to the ToDo App API');
});
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});