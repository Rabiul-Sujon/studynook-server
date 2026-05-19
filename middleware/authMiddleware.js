// 




const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        
        req.user = { 
            id: decoded.userId,
            email: user.email
        };
        next();

    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid or expired token.' 
        });
    }
};

module.exports = authMiddleware;