# ✅ **To Do List App**

### A simple and efficient **To-Do** application built with **React**, **SQLite**, **JSON Server**, and **Express.js**, allowing users to manage their tasks effectively. 🚀

---

## **🌟 Features**

- 🔒 **User Authentication**: Sign up and login functionality with **JWT authentication**.
- 📝 **Task Management**: Add, edit, delete, and search tasks effortlessly.
- 🚦 **Task Prioritization**: Set priority levels for tasks (**High**, **Medium**, **Low**).
- 🔍 **Task Filtering**: Search tasks by keywords.
- 👤 **User Profile**: View and edit your profile seamlessly.

---

## **⚙️ Installation**

### **Prerequisites**
Make sure you have the following installed:

1. 📦 **Node.js** (v12 or higher)  
2. 🛠️ **npm** (comes with Node.js)  
3. 🗄️ **SQLite3**

---

### **Backend Setup**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/princemashumu/todo-app.git
   cd todo-app
# Navigate to the backend directory and install the dependencies:

bash
```
cd backend
npm install
```
# Create an SQLite database and tables:

```
node setupDatabase.js
```
# Start the backend server:

```
npm start
```
The backend server should now be running on: http://localhost:5006.

# Frontend Setup
## Navigate to the frontend directory and install the dependencies:

```
cd ../frontend
npm install
```
## Start the frontend development server:

```
npm start
```
The frontend should now be running on: http://localhost:3000.

# 📡 API Endpoints
User Authentication
Sign Up:
```
POST /signup
```
Request Body:

```
{ "username": "string", "email": "string", "password": "string" }
```
 ## Login:
```
POST /login
```
Request Body:

```
{ "username": "string", "password": "string" }
```
## Task Management
Get Tasks:
```
GET /tasks
```
## Headers:

{ "Authorization": "Bearer <token>" }
## Add Task:
```
POST /add-task
```
## Headers:

{ "Authorization": "Bearer <token>" }
Request Body:

{ "task": "string", "taskDate": "string", "taskPriority": "string" }
Edit Task:
```
PUT /edit-task/:id
```
## Headers:

{ "Authorization": "Bearer <token>" }
Request Body:


{ "task": "string", "taskDate": "string", "taskPriority": "string" }
## Delete Task:
```
DELETE /delete-task/:id
```
## Headers:


{ "Authorization": "Bearer <token>" }
## Search Tasks:
```
GET /search-tasks
```
## Headers:

`
{ "Authorization": "Bearer <token>" }
## Query Params:
```
?query=<search-term>
```
# 🤝 Contributing
## Fork the repository.
Create your feature branch:
```
git checkout -b feature/AmazingFeature
```
## Commit your changes:
```
git commit -m 'Add some AmazingFeature'
```
## Push to the branch:
```
git push origin feature/AmazingFeature
```
## Open a Pull Request.
# 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

# 💡 Acknowledgements
🖥️ React
🌐 Express.js
🎨 Material-UI
🗄️ SQLite
📋 JSON Server
🎨 Project UI (User Interface)
