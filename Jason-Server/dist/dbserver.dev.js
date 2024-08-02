"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var app = express();

var cors = require('cors');

var bodyParser = require('body-parser');

var PORT = 5006;
app.use(cors());
app.use(bodyParser.json());
var tasks = [{
  id: 1,
  task: 'Sample Task 1',
  taskDate: '2024-01-01',
  taskPriority: 'High',
  userId: '1'
}, {
  id: 2,
  task: 'Sample Task 2',
  taskDate: '2024-01-02',
  taskPriority: 'Medium',
  userId: '1'
}]; // Fetch tasks

app.get('/tasks', function (req, res) {
  var userId = req.query.userId;
  var userTasks = tasks.filter(function (task) {
    return task.userId === userId;
  });
  res.json({
    tasks: userTasks
  });
}); // Add task

app.post('/add-task', function (req, res) {
  var _req$body = req.body,
      userId = _req$body.userId,
      task = _req$body.task,
      taskDate = _req$body.taskDate,
      taskPriority = _req$body.taskPriority;
  var newTask = {
    id: tasks.length + 1,
    userId: userId,
    task: task,
    taskDate: taskDate,
    taskPriority: taskPriority
  };
  tasks.push(newTask);
  res.json({
    message: 'Task added successfully'
  });
}); // Edit task

app.put('/edit-task/:id', function (req, res) {
  var id = req.params.id;
  var _req$body2 = req.body,
      task = _req$body2.task,
      taskDate = _req$body2.taskDate,
      taskPriority = _req$body2.taskPriority;
  var taskIndex = tasks.findIndex(function (t) {
    return t.id === parseInt(id);
  });

  if (taskIndex !== -1) {
    tasks[taskIndex] = _objectSpread({}, tasks[taskIndex], {
      task: task,
      taskDate: taskDate,
      taskPriority: taskPriority
    });
    res.json({
      message: 'Task updated successfully'
    });
  } else {
    res.status(404).json({
      message: 'Task not found'
    });
  }
}); // Delete task

app["delete"]('/delete-task/:id', function (req, res) {
  var id = req.params.id;
  tasks = tasks.filter(function (task) {
    return task.id !== parseInt(id);
  });
  res.json({
    message: 'Task deleted successfully'
  });
});
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});
app.get('/add-task', function _callee(req, res) {
  var userId, query, _tasks;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.query.userId;
          query = req.query.query || '';
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(Task.find({
            userId: userId,
            task: {
              $regex: query,
              $options: 'i'
            } // This regex filters tasks based on the query (case-insensitive)

          }));

        case 5:
          _tasks = _context.sent;
          res.json(_tasks);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          res.status(500).send(_context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
});