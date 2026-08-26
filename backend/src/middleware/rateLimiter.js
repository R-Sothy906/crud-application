import rateLimit from 'express-rate-limit';

// global route ratelimite
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per 15 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true, 
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Login Rate Limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // 5 login attempts per 15 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipFailedRequests: false,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later. Please wait 15 minutes.'
    },
    // កំណត់ key ដោយ IP address
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    }
});

//Register Rate Limiter
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3, // 3 registrations per hour
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later.'
    }
});