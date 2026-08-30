import asyncHandler from 'express-async-handler';

import User from '../models/User.js';

import { sendTokenCookie } from '../utils/token.js';

// Register
export const register = asyncHandler(async (req, res) => {

          const { name, email, password } = req.body;

          // Check required fields
          if (!name || !email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Please fill in all fields'
            });
          }

          // Check if user already exists
          const userExists = await User.findOne({ email });

          if (userExists) {
            return res.status(400).json({
              success: false,
              message: 'User already exists'
            });
          }

          // Create user
          const user = await User.create({
            name,
            email,
            password
          });

          // Response
          return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
              _id: user._id,
              name: user.name,
              email: user.email
            }
          });
});

export const login = asyncHandler(async (req, res) => {

          const { email, password } = req.body;

          // Check required fields
          if (!email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Please provide email and password'
            });
          }

          // Find user
          const user = await User.findOne({ email }).select('+password');

          // Check user and password
          if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
              success: false,
              message: 'Invalid email or password'
            });
          }

          // Create JWT + Cookie
          return sendTokenCookie(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {

        // Clear token cookie
        res.cookie('token', '', {
          httpOnly: true,
          expires: new Date(0)
        });

        return res.status(200).json({
          success: true,
          message: 'Logged out successfully'
        });
});

export const getMe = asyncHandler(async(req, res)=> {
  const user = await User.findById(req.userId);
  if(!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found!'
    })
  }
  return res.status(201).json({
    success: true,
    data: {
      name: user.name,
      email: user.email
    }
  })
})





