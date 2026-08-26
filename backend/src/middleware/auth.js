import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no session token'
    });
  }
  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token'
    });

  }

});

export default auth;