
import express from 'express';
import { 
  createTask, 
  getAllTask, 
  updateTask,
  deleteTask,      
  getTaskById      
} from '../controllers/taskController.js';
import auth from '../middleware/auth.js'
const route = express.Router();

route.use(auth);
route.post('/tasks', createTask);
route.get('/tasks', getAllTask);
route.get('/tasks/:id', getTaskById);  
route.put('/tasks/:id', updateTask);
route.delete('/tasks/:id', deleteTask); 

export default route; 