const express = require('express'); //dependancies
const bodyParser = require('body-parser'); //dependancies
const cors = require('cors'); //dependancies
const sqlite3 = require('sqlite3').verbose(); //dependancies
const jwt = require('jsonwebtoken'); //dependancies

const app = express(); //dependancies
const port = 5006; // I am using this port
const SECRET_KEY = 'priNC23E'; //Using this key for a token i used

app.use(bodyParser.json()); //dependancies
app.use(cors()); //dependancies

const db = new sqlite3.Database('./tasks.db'); //Linking my Database to Javascript

//Creating tables
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



function getTasksFromDatabase(userId) {               //function to get All the tasks from the database using SQL 
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

//Data manipulation funtion to Retrieve All tasks from the database using SQL
app.get('/search-tasks', (req, res) => {
  const { userId, query } = req.query;
  const sqlQuery = `SELECT * FROM tasks WHERE userId = ? AND task LIKE ?`;
  db.all(sqlQuery, [userId, `%${query}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ tasks: rows });
  });
});

//creating a token for each who successfully logins, I used this token to give a userID
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
//function to INSERT tasks into the database using SQL
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


//I had to find a way to refresh the token so that it does not expire and the tasks do not Vanish on the browser
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});


//function to CREATE a new user to the database using SQL
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


//Function to retrieve user credintials from the database and then log the user in
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

app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await getTasksFromDatabase(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//A function to UPDATE the tasks of each user in the database
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
