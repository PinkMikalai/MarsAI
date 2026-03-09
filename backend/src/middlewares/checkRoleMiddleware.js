// allowedRoleIds : tableau d'IDs numériques  1=Admin  2=Selector  3=Super_admin
const checkRole = (allowedRoleIds) => {
    return (req, res, next) => {

        console.log("Rôle de l'utilisateur connecté:", req.user?.role_id);
        console.log("Rôles autorisés pour cette route:", allowedRoleIds);
      

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
