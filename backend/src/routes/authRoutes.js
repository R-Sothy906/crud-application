import express from 'express';

import { register, login, logout } from'../controllers/authController.js';
import {registerLimiter, loginLimiter} from '../middleware/rateLimiter.js'

const router = express.Router();
router.post('/register', registerLimiter,  register);
router.post('/login', loginLimiter,login);
router.post('/logout', logout);

export default router;  