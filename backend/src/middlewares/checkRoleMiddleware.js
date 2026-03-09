// allowedRoleIds : tableau d'IDs numériques  1=Admin  2=Selector  3=Super_admin
const checkRole = (allowedRoleIds) => {
    return (req, res, next) => {

        const userRole = req.user?.role;
        console.log("Rôle de l'utilisateur connecté:", userRole);
        console.log("Rôles autorisés pour cette route:", allowedRoles);
      

        if (!req.user || !allowedRoleIds.includes(req.user.role_id)) {

            return res.status(403).json({
                status: 'error',
                message: 'Access denied : you do not have the required permissions'
            });
        }
        next();
    };
};

export default checkRole;
