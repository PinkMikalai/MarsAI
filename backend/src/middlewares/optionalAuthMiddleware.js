const jwt = require('jsonwebtoken');
// Ajouter un export nommé pour l'auth optionnelle
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // Pas de token ? Continuer sans bloquer
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
        // Token invalide ? Continuer quand même
        req.user = null;
        next();
    }
};

module.exports = optionalAuthMiddleware;