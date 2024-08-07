## **To Do List App**


### A simple and efficient ToDo application built with React, SQLite, Json Server and Express.js, allowing users to manage their tasks effectively.

**Features**

- User Authentication: Sign up and login functionality with JWT authentication.
- Task Management: Add, edit, delete, and search tasks.
- Task Prioritization: Set priority levels for tasks (High, Medium, Low).
- Task Filtering: Search tasks by keywords.
- User Profile: View and edit user profile.
- Installation
- Prerequisites
  ### Make sure you have the following installed:
1. Node.js (v12 or higher)
2. npm (comes with Node.js)
3. SQLite3
4. Backend Setup
5. Clone the repository:

> - [ ] sh
> - [ ] Copy code
> - [ ] git clone https://github.com/princemashumu/todo-app.git
> - [ ] cd todo-app
> - [ ] Navigate to the backend directory and install the dependencies:
> - [ ] 
> - [ ] sh
> - [ ] Copy code
> - [ ] cd backend
> - [ ] npm install
> - [ ] Create an SQLite database and tables:
> - [ ] 
> - [ ] sh
> - [ ] Copy code
> - [ ] node setupDatabase.js
> - [ ] Start the backend server:
> - [ ] 
> - [ ] sh
> - [ ] Copy code
> - [ ] npm start
> - [ ] The backend server should be running on http://localhost:5006.
> - [ ] 
> - [ ] Frontend Setup
> - [ ] Navigate to the frontend directory and install the dependencies:
> - [ ] 
> - [ ] sh
> - [ ] Copy code
> - [ ] cd ../frontend
> - [ ] npm install
> - [ ] Start the frontend development server:
> - [ ] 
> - [ ] sh
> - [ ] Copy code
> - [ ] npm start
> - [ ] The frontend should be running on http://localhost:3000.
> - [ ] 
>


## API Endpoints
**User Authentication**

> Sign Up: POST /signup
> 
> Request Body: { "username": "string", "email": "string", "password": "string" }
> Login: POST /login
> 
> Request Body: { "username": "string", "password": "string" }
> Task Management
> Get Tasks: GET /tasks
> 
> Headers: { "Authorization": "Bearer <token>" }
> Add Task: POST /add-task
> 
> Headers: { "Authorization": "Bearer <token>" }
> Request Body: { "task": "string", "taskDate": "string", "taskPriority": "string" }
> Edit Task: PUT /edit-task/:id
> 
> Headers: { "Authorization": "Bearer <token>" }
> Request Body: { "task": "string", "taskDate": "string", "taskPriority": "string" }
> Delete Task: DELETE /delete-task/:id
> 
> Headers: { "Authorization": "Bearer <token>" }
> Search Tasks: GET /search-tasks
> 
> Headers: { "Authorization": "Bearer <token>" }
> Query Params: ?query=<search-term>

## Contributing
**Fork the repository.**

- Create your feature branch (git checkout -b feature/AmazingFeature).
- Commit your changes (git commit -m 'Add some AmazingFeature').
- Push to the branch (git push origin feature/AmazingFeature).
- Open a Pull Request.
## License
**This project is licensed under the MIT License - see the LICENSE file for details.**

## Acknowledgements

- React
- Express.js
- Material-UI
- SQLite
- Json Server

## Project UI(User Interface)
### Home Page
![image](https://github.com/user-attachments/assets/f21f6a7c-2e3c-4660-9aec-a8eb10e7a563)
### Login Page
![image](https://github.com/user-attachments/assets/6d2e510d-5bbc-4406-9e3e-257864302f6c)
### Signup Page
![image](https://github.com/user-attachments/assets/1936bd94-ac82-4321-8aab-0053c4945190)

