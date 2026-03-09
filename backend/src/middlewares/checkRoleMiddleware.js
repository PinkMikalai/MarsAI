const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        console.log("Rôle de l'utilisateur connecté:", userRole);
        console.log("Rôles autorisés pour cette route:", allowedRoles);
        if (!req.user || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied : you do not have the required permissions'
            })
        }
        next();
    }
};

export default checkRole;
