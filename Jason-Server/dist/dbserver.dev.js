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