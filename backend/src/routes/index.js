import express from 'express';
import taskRoute from './taskRoute.js'
import authRoute from './authRoutes.js'
const route = express.Router();

route.use('/api', authRoute)
route.use('/api', taskRoute);

export default route;