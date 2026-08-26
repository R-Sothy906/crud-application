# 📝 Task Management CRUD Application

A modern full-stack **Task Management Application** built with the **MERN Stack**.

The application provides secure user authentication, user-specific task management, and a RESTful API. Each authenticated user can create, view, update, and delete their own tasks.

---

## 🚀 Tech Stack

### Backend

- **Node.js** — JavaScript runtime
- **Express.js v5** — RESTful API framework
- **MongoDB** — NoSQL database
- **Mongoose v9** — MongoDB ODM
- **JWT (JSON Web Token)** — Authentication
- **bcryptjs** — Password hashing
- **Cookie Parser** — HTTP cookie handling
- **CORS** — Cross-Origin Resource Sharing
- **Helmet** — HTTP security headers
- **Morgan** — HTTP request logging
- **express-rate-limit** — API rate limiting
- **express-async-handler** — Async error handling
- **Nodemon** — Development auto-restart

### Frontend

- **React 19** — UI library
- **Vite** — Frontend build tool
- **Tailwind CSS v4** — Utility-first CSS framework
- **Zustand** — Global state management
- **Axios** — HTTP client
- **React Router DOM v7** — Client-side routing
- **Lucide React** — Icon library

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- User logout
- JWT-based authentication
- JWT stored in an **HTTP-only cookie**
- Protected task routes
- Password hashing with bcrypt
- Login rate limiting
- Registration rate limiting

### 👤 User Management

- Each user has their own account
- Tasks are linked to the authenticated user
- Users can only access their own tasks
- User ID is extracted from the JWT
- Frontend does **not** need to send `userId`
- Task ownership is handled securely by the backend

### 📝 Task Management

- Create tasks
- Get all user's tasks
- Get a task by ID
- Update tasks
- Delete tasks
- Task status management
- Task due dates
- Task ownership
- Prevent duplicate task titles for the same user
- Filter tasks by status
- Sort tasks by different fields

### 🛡️ Security

- HTTP-only authentication cookies
- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Authentication middleware
- Rate limiting
- Protected task routes
- Users cannot manually change task ownership

---

# 📁 Project Structure

```text
crud-application/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoute.js
│   │   │
│   │   └── utils/
│   │       └── token.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── frontend/
    │
    ├── src/
    │   ├── api/
    │   │   └── ...
    │   │
    │   ├── assets/
    │   │   └── ...
    │   │
    │   ├── components/
    │   │   └── ...
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── ...
    │   │
    │   ├── store/
    │   │   └── ...
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── .env
    ├── index.html
    ├── vite.config.js
    └── package.json

    🔐 Authentication Flow

The application uses JWT + HTTP-only Cookie authentication.

User
  │
  ▼
POST /api/login
  │
  ▼
Validate email & password
  │
  ▼
Generate JWT
  │
  ▼
Set HTTP-only Cookie
  │
  ▼
Browser stores Cookie
  │
  ▼
Protected Request
  │
  ▼
Auth Middleware
  │
  ▼
Read token from Cookie
  │
  ▼
Verify JWT
  │
  ▼
req.userId
  │
  ▼
Access user's tasks

The frontend does not need to send the user's ID when creating a task.

Example Request
{
  "title": "Learn React",
  "description": "Study React today",
  "status": "pending",
  "dueDate": "2026-09-01"
}

The backend automatically gets the user ID from:

req.userId

Then saves it to the task:

user: req.userId

This prevents users from manually changing the task owner from the frontend.

🛡️ Protected Task Routes

All task routes are protected by the authentication middleware:

route.use(auth);

route.post('/tasks', createTask);

route.get('/tasks', getAllTask);

route.get('/tasks/:id', getTaskById);

route.put('/tasks/:id', updateTask);

route.delete('/tasks/:id', deleteTask);

The backend uses req.userId to make sure users only access their own tasks.

For example:

const filter = {
  user: req.userId
};

const tasks = await Task.find(filter);

For a specific task:

const task = await Task.findOne({
  _id: id,
  user: req.userId
});

This prevents one user from accessing another user's tasks.

🚦 Rate Limiting

The application uses express-rate-limit to help prevent excessive requests and authentication abuse.

Global Rate Limiter
Window: 15 minutes
Limit: 100 requests
Login Rate Limiter
Window: 15 minutes
Limit: 5 attempts
Registration Rate Limiter
Window: 1 hour
Limit: 3 registrations

Example response:

{
  "success": false,
  "message": "Too many login attempts, please try again later. Please wait 15 minutes."
}
⚡ Getting Started
1. Prerequisites

Make sure you have installed:

Node.js 18+
npm
MongoDB
Git

You can use either:

Local MongoDB
MongoDB Atlas
🔧 Backend Setup

Navigate to the backend:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend directory:

PORT=3000

MONGO_URI=mongodb://localhost:27017/task_management

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=30d

JWT_COOKIE_EXPIRES_IN=30

NODE_ENV=development

⚠️ Never commit your .env file to GitHub.

Start the backend in development:

npm run dev

Start the backend in production:

npm start

Backend server:

http://localhost:3000
🎨 Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_URL=http://localhost:3000

Start the frontend:

npm run dev

Frontend normally runs at:

http://localhost:5173
🔌 API Endpoints
🔐 Authentication API
Method	Endpoint	Description	Authentication
POST	/api/register	Register a new user	❌
POST	/api/login	Login user	❌
POST	/api/logout	Logout user	❌
Register
Request
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "111111"
}
Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
Login
Request
POST /api/login
{
  "email": "john@example.com",
  "password": "111111"
}
Response
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

After successful login, the server sends a JWT in an HTTP-only cookie.

The frontend does not need to manually store the JWT.

Logout
Request
POST /api/logout
Response
{
  "success": true,
  "message": "Logged out successfully"
}

The authentication cookie is cleared by the backend.

📝 Task API

All task endpoints require authentication.

Method	Endpoint	Description
GET	/api/tasks	Get current user's tasks
GET	/api/tasks/:id	Get a specific task
POST	/api/tasks	Create a task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task
Create Task
Request
POST /api/tasks
{
  "title": "Learn React",
  "description": "Study React today",
  "status": "pending",
  "dueDate": "2026-09-01"
}

Notice that there is no userId in the request.

The backend automatically assigns:

user: req.userId
Response
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "title": "Learn React",
    "description": "Study React today",
    "status": "pending",
    "dueDate": "2026-09-01",
    "user": "John Doe"
  }
}
Get All Tasks
Request
GET /api/tasks

The backend automatically returns only tasks belonging to the logged-in user.

Filter by Status
GET /api/tasks?status=pending
Sort Tasks
GET /api/tasks?sortBy=createdAt&order=desc
Example Response
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "task_id_1",
      "title": "Learn React",
      "description": "Study React today",
      "status": "pending",
      "user": {
        "_id": "user_id",
        "name": "John Doe"
      }
    }
  ]
}
Get Task By ID
Request
GET /api/tasks/:id

Example:

GET /api/tasks/64f123456789

The backend checks both the task ID and the authenticated user:

const task = await Task.findOne({
  _id: id,
  user: req.userId
});

Therefore, a user cannot access another user's task.

Update Task
Request
PUT /api/tasks/:id
{
  "title": "Learn React Advanced",
  "description": "Study React and Hooks",
  "status": "in-progress",
  "dueDate": "2026-09-05"
}
Response
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "title": "Learn React Advanced",
    "description": "Study React and Hooks",
    "status": "in-progress",
    "dueDate": "2026-09-05",
    "user": "John Doe"
  }
}
Delete Task
Request
DELETE /api/tasks/:id
Response
{
  "success": true,
  "message": "Task deleted successfully"
}
📊 Task Status

Tasks support the following statuses:

pending
in-progress
completed
cancelled

Example:

{
  "title": "Build Portfolio",
  "description": "Create MERN portfolio",
  "status": "in-progress"
}
🔒 Environment Variables
Backend .env
PORT=3000

MONGO_URI=mongodb://localhost:27017/task_management

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=30d

JWT_COOKIE_EXPIRES_IN=30

NODE_ENV=development
Frontend .env
VITE_API_URL=http://localhost:3000

⚠️ Do not upload .env files containing secrets to GitHub.

Add them to .gitignore:

.env
.env.local
node_modules/
dist/
🧪 Testing

You can test the REST API using:

Postman
Insomnia
Browser
Frontend application
Recommended Authentication Testing Flow
1. Register
      ↓
2. Login
      ↓
3. Browser stores HTTP-only Cookie
      ↓
4. Create Task
      ↓
5. Get Tasks
      ↓
6. Update Task
      ↓
7. Delete Task
      ↓
8. Logout

For Axios requests from the frontend, make sure credentials are enabled:

axios.defaults.withCredentials = true;

Or:

axios.get('http://localhost:3000/api/tasks', {
  withCredentials: true
});
🧠 Architecture

The backend follows a simple separation of responsibilities:

Routes
  │
  ▼
Middleware
  │
  ├── Authentication
  └── Rate Limiting
  │
  ▼
Controllers
  │
  ▼
Models
  │
  ▼
MongoDB
Authentication
Login
  ↓
JWT
  ↓
HTTP-only Cookie
  ↓
Auth Middleware
  ↓
req.userId
Task Ownership
Logged-in User
      ↓
JWT
      ↓
req.userId
      ↓
Task.user
      ↓
MongoDB

This architecture ensures that task ownership is controlled by the backend rather than by user input.

📄 License

This project is open-source and available under the MIT License.