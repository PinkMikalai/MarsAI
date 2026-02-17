import jwt from 'jsonwebtoken';

const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        req.user = null;
        return next();
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

export default optionalAuthMiddleware;
