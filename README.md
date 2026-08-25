# 📝 Task Management CRUD Application

A modern full-stack Task Management web application built with the **MERN** stack (MongoDB, Express 5, React 19, Node.js). It uses **Vite** for fast client-side tooling, **Tailwind CSS v4** for styling, **Zustand** for global state management, and **Axios** for API requests.

---

## 📁 Project Structure

```text
crud_application/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   └── routes/
│   │       ├── index.js
│   │       └── taskRoute.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
🛠️ Tech Stack & Key LibrariesBackend:Node.js & Express.js (v5) — Server framework & RESTful API architectureMongoDB & Mongoose (v9) — Database storage & object data modelingCors & Helmet — API security & cross-origin resource sharingMorgan — HTTP request logger middlewareNodemon — Development live-reload engineFrontend:React (v19) — User Interface libraryVite — High-performance frontend build toolTailwind CSS (v4) & Lucide React — Utility-first styling & UI iconsZustand — Lightweight state managementAxios — Promise-based HTTP clientReact Router DOM (v7) — Client-side routing✨ Key FeaturesTask Creation: Add new tasks with title, description, status, and due date.Task Reading: Fetch and display active tasks smoothly with Zustand state logic.Task Updating: Modify existing task details seamlessly with backend validation.Task Deletion: Safe removal of task records from MongoDB.Security & Logs: Protected API headers using Helmet, request logging via Morgan, and custom error handling.⚡ Getting Started1. PrerequisitesMake sure you have the following installed on your machine:Node.js (v18+ recommended)MongoDB connection string (Local or MongoDB Atlas)2. Backend SetupNavigate to the backend directory:Bashcd backend
Install backend dependencies:Bashnpm install
Create a .env file in the backend/ root directory:កំណាត់កូដPORT=3000
MONGOOSE_URI=mongodb://localhost:27017/your_database_name
Start the backend server (using Nodemon for dev):Bashnpm run dev
3. Frontend SetupOpen a new terminal tab and navigate to the frontend directory:Bashcd frontend
Install frontend dependencies:Bashnpm install
Create a .env file in the frontend/ root directory:កំណាត់កូដVITE_CONNECT=http://localhost:3000
Start the Vite frontend dev server:Bashnpm run dev
🔌 API EndpointsMethodEndpointDescriptionPayload BodyGET/api/tasksGet all tasksNoneGET/api/tasks/:idGet single task by IDNonePOST/api/tasksCreate a new task{ title, description, status, dueDate }PUT/api/tasks/:idUpdate an existing task{ title, description, status, dueDate }DELETE/api/tasks/:idDelete a taskNone📄 LicenseThis project is open-source and available under the MIT License.