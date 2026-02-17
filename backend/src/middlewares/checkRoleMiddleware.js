const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log("Rôle de l'utilisateur connecté:", req.user.role);
        console.log("Rôles autorisés pour cette route:", allowedRoles);
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied : you do not have the required permissions'
            })
        }
        next();
    }
};

export default checkRole;
