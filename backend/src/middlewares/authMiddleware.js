const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Récupérer le token du header (Bearer Token)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acces denied" });
    }

    try {
        // Vérification du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupération des infos dans req.user 
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role 
        };
        
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired" });
    }
};

module.exports = authMiddleware;




