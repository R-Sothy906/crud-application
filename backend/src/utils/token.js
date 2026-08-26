import jwt from 'jsonwebtoken';

export const sendTokenCookie = (user, statusCode, res) => {

  // Create JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // Convert cookie expiration to milliseconds
  const cookieDays = parseInt(
    process.env.JWT_COOKIE_EXPIRES_IN
  ); 

  const cookieOptions = {
    expires: new Date(
      Date.now() + cookieDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  return res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message: 'Authentication successful',
      data: {
        name: user.name,
        email: user.email
      }
    });
};