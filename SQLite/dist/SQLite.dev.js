"use strict";

require('dotenv').config(); // Ensure this line is at the top to load environment variables


var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var sqlite3 = require('sqlite3').verbose();

var jwt = require('jsonwebtoken');

require('dotenv').config();

var app = express();
var port = 6005;
var SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'mp234rt'; // Use env variable or fallback

app.use(bodyParser.json());
app.use(cors());
var db = new sqlite3.Database('./tasks.db');
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)');
  db.run("CREATE TABLE IF NOT EXISTS tasks (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    userId INTEGER,\n    task TEXT,\n    taskDate TEXT,\n    taskPriority TEXT,\n    FOREIGN KEY(userId) REFERENCES users(id)\n  )");
});

function getTasksFromDatabase(userId) {
  return new Promise(function (resolve, reject) {
    var query = 'SELECT * FROM tasks WHERE userId = ?';
    db.all(query, [userId], function (err, rows) {
      if (err) {
        console.error('Database error:', err);
        return reject(err);
      }

      resolve(rows);
    });
  });
}

var authenticateToken = function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, function (err, user) {
    if (err) return res.sendStatus(403); // Forbidden

    req.user = user;
    next();
  });
};

app.get('/tasks', authenticateToken, function _callee(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Fetching tasks for user:', req.user);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(getTasksFromDatabase(req.user.id));

        case 4:
          tasks = _context.sent;
          res.json({
            tasks: tasks
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching tasks:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.get('/search-tasks', authenticateToken, function (req, res) {
  var _req$query = req.query,
      userId = _req$query.userId,
      query = _req$query.query;
  var sqlQuery = "SELECT * FROM tasks WHERE userId = ? AND task LIKE ?";
  db.all(sqlQuery, [userId, "%".concat(query, "%")], function (err, rows) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json({
      tasks: rows
    });
  });
});
app.post('/add-task', authenticateToken, function (req, res) {
  var _req$body = req.body,
      task = _req$body.task,
      taskDate = _req$body.taskDate,
      taskPriority = _req$body.taskPriority;
  var userId = req.user.id;
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
});
app.post('/refresh-token', function (req, res) {
  var refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
    if (err) return res.sendStatus(403);
    var accessToken = generateAccessToken({
      username: user.username
    });
    res.json({
      accessToken: accessToken
    });
  });
});
app.post('/signup', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      email = _req$body2.email,
      password = _req$body2.password;
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
});
app.post('/login', function (req, res) {
  var _req$body3 = req.body,
      username = _req$body3.username,
      password = _req$body3.password;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (err, row) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (row) {
      var user = {
        id: row.id,
        username: row.username
      };
      var token = jwt.sign(user, SECRET_KEY, {
        expiresIn: '1h'
      });
      res.status(200).json({
        token: token
      });
    } else {
      res.status(400).json({
        message: 'Invalid username or password'
      });
    }
  });
});
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});
app.get('/tasks', authenticateToken, function _callee2(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(getTasksFromDatabase(req.user.id));

        case 3:
          tasks = _context2.sent;
          res.json({
            tasks: tasks
          });
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching tasks:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.put('/edit-task/:id', authenticateToken, function (req, res) {
  var taskId = req.params.id;
  var _req$body4 = req.body,
      task = _req$body4.task,
      taskDate = _req$body4.taskDate,
      taskPriority = _req$body4.taskPriority;
  var query = "UPDATE tasks SET task = ?, taskDate = ?, taskPriority = ? WHERE id = ? AND userId = ?";
  db.run(query, [task, taskDate, taskPriority, taskId, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Error updating task'
      });
    }

    res.status(200).json({
      message: 'Task updated successfully'
    });
  });
});
app["delete"]('/delete-task/:id', authenticateToken, function (req, res) {
  var taskId = req.params.id;
  var query = "DELETE FROM tasks WHERE id = ? AND userId = ?";
  db.run(query, [taskId, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Error deleting task'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  });
});
app.get('/', function (req, res) {
  res.send('Welcome to the ToDo App API');
});
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});