import express from 'express';

import { register, login, logout, getMe } from'../controllers/authController.js';
import {registerLimiter, loginLimiter} from '../middleware/rateLimiter.js'
import auth from '../middleware/auth.js'
const router = express.Router();
router.post('/register', registerLimiter,  register);
router.post('/login', loginLimiter,login);
router.post('/logout', logout);
router.get('/me', auth, getMe);

export default router;  