const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        
        console.log("Rôle de l'utilisateur connecté:", userRole);
        console.log("Rôles autorisés pour cette route:", allowedRoles);

        if (!userRole) {
            return res.status(401).json({ message: "Utilisateur non authentifié ou rôle manquant" });
        }

        const normalize = (str) => str.toLowerCase().replace(/-/g, '_').trim();

        const isAuthorized = allowedRoles.some(role => 
            normalize(role) === normalize(userRole)
        );

        if (!isAuthorized) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied: role '${userRole}' is not authorized`
            });
        }
        next();
    }
};

export default checkRole;
