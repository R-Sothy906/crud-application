import express from 'express';
import taskRoute from './taskRoute.js'
const route = express.Router();

route.use('/api', taskRoute);

export default route;