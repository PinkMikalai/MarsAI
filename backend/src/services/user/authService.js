import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createUserModel, getUserByEmailModel, getUserByIdModel, updateUserModel, updateUserBySuperAdminModel, deleteUserModel, getRoleByIdModel, getRoleByNameModel } from '../../models/user/userModel.js';
import { createInvitationModel, getInvitationByJtiModel, markInvitationAsUsedModel } from '../../models/admin/invitationModel.js';
import { welcomeEmail, passwordResetEmail } from '../admin/mailService.js';

const JWT_SECRET = process.env.JWT_SECRET;
// création du token d'invitation (à usage unique) à créer un compte user
export async function createInvitationToken({ email, role }) {
    const jti = uuidv4();
    await createInvitationModel({ jti, email, role })
    return jwt.sign(
        { email, role, jti, purpose: 'invitation' },
        process.env.JWT_SECRET,
        { expiresIn: '48h' }
    );
}
// vérification du token
export async function decodeInvitationToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.purpose !== 'invitation') {
            throw new Error('Invalid token ');
        }
        const invitation = await getInvitationByJtiModel(decoded.jti);
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new Error('Invitation already used')
        }
        return {
            email: decoded.email,
            role: decoded.role,
            jti: decoded.jti,
            token: token
        };
    } catch (err) {
        const error = new Error(err.message || 'Invalid or expired token');
        error.status = 401;
        throw error;
    }
}

// Reception et traitement du formuliare de création du compte user
export async function register({ token, firstname, lastname, password }) {
    const decoded = await decodeInvitationToken(token);
    // console.log("Contenu du token aprés decode :", decoded);

    const existing = await getUserByEmailModel(decoded.email);
    if (existing) {
        const error = new Error('Email already exists');
        error.status = 409;
        throw error;
    }
    const roleData = await getRoleByNameModel(decoded.role);
    if(!roleData) {`Role ${decoded.role} not found in db`}

    const roleId = roleData.id || 2

    const hash = await bcrypt.hash(password, 10);

    const userId = await createUserModel({
        email: decoded.email,
        firstname,
        lastname,
        password_hash: hash,
        role_id: roleId
    });

    const marked = await markInvitationAsUsedModel(decoded.jti);
    // console.log("Marquage de l'invitation", marked);

    try {
        await welcomeEmail(decoded.email, firstname);
    } catch (emailError) {
        console.error("Failed to send welcome email", emailError)
    }

    return {
        id: userId,
        email: decoded.email,
        message: `User n° ${userId} created with success `
    };
}
// login
export async function login({ email, password }) {
    const user = await getUserByEmailModel(email);
    console.log("Objet user récupéré :", user);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const role = await getRoleByIdModel(user.role_id);
    const roleLabel = role ? role.name : 'Unknown';

    const token = jwt.sign(
        { sub: user.id, email: user.email, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role_id: user.role_id,
            role: roleLabel
        }
    }
}
// modification du profil par le user
export async function updateUser(userId, userData) {
    const { firstname, lastname, password } = userData;
    const dataToUpdate = {};
    if (firstname) dataToUpdate.firstname = firstname;
    if (lastname) dataToUpdate.lastname = lastname;
    if (password && password.trim() !== "") {
        dataToUpdate.password_hash = await bcrypt.hash(password, 10);
    }
    const success = await updateUserModel(userId, dataToUpdate);

    if (!success) {
        const error = new Error('User not found or no changes made');
        error.status = 404;
        throw error;
    }

    return {
        status: "success",
        message: `Profile ${userId} updated successfully`
    };
}
// update du user par le super_admin
export async function updateUserBySuperAdmin(userId, userData) {
    const { firstname, lastname, password, email, role_id } = userData;
    const dataToUpdate = {};
    if (firstname) dataToUpdate.firstname = firstname;
    if (lastname) dataToUpdate.lastname = lastname;
    if (email) dataToUpdate.email = email;
    if (role_id) dataToUpdate.role_id = role_id;
    if (password && password.trim() !== "") {
        dataToUpdate.password_hash = await bcrypt.hash(password, 10);
    }
    const success = await updateUserBySuperAdminModel(userId, dataToUpdate);

    if (!success) {
        const error = new Error('User not found or no changes made');
        error.status = 404;
        throw error;
    }

    return {
        status: "success",
        message: `Profile ${userId} updated successfully`
    };
}
// suppression du user par le super-admin
export async function deleteUser(id) {
    const result = await deleteUserModel(id);
    if (!result) {
        const error = new Error('User not found or impossible deletion');
        error.status = 404;
        throw error;
    }
    return {
        status: "success",
        message: `Profile ${id} deleted successfully`
    }
}

// profil des user
export async function profileUser(id) {
    const user = await getUserByIdModel(id);
    if (!user) {
        const error = new Error(`User n° ${id} don't exist !`);
        error.status = 404;
        throw error;
    }
    
    const role = await getRoleByIdModel(user.role_id);

   console.log("User Role", role);

    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role_id: user.role_id,
        role: role ? role.name : "Unknown",
        message: `User n° ${id} connected`,
        status: "success"
    }
}
// gestion du password oublié
export async function passwordReset(email) {
    const user = await getUserByEmailModel(email);
    if (!user) {
        return { message: `A reset link has been sent the email address provided ` };
    }
    const jti = uuidv4();
    await createInvitationModel({
        jti,
        email: user.email,
        type: 'password_reset',
        user_id: user.id
    })
    const token = jwt.sign(
        { jti, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
    try {
        await passwordResetEmail(user.email, token, user.firstname);
    } catch (emailError) {
        console.error("Reset password email error", emailError)
    }
    return {
        status: 'success',
        message: `A reset link has been sent the email address provided `,
        
    }
}
// confirmation de la modification du password oublié
export async function confirmPasswordReset(token, newPassword) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password_reset') {
            throw new Error('Invalid token prupose')
        }
        const invitationData = await getInvitationByJtiModel(decoded.jti);
        if (!invitationData || invitationData.status !== 'pending') {
            throw new Error('jti invalid or already used');
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await updateUserModel(invitationData.user_id, { password_hash: hash });
        await markInvitationAsUsedModel(decoded.jti);

        return {
            success: true,
            message: "Password updated sucessfully"
        };
    } catch (err) {
        const error = new Error(err.message || 'Reset failed');
        error.status = 401;
        throw error;
    }
}
// modification du password par user connecté
export async function updatePassword(userId, oldPassword, newPassword) {
    const user = await getUserByIdModel(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // console.log("user récupéré :", { id: user.id, pshash: !!user.password_hash });

    const checkPasswords = await bcrypt.compare(oldPassword, user.password_hash);
    if (!checkPasswords) {
        const error = new Error('CurrEnt password incorrect');
        error.status = 401;
        throw error;
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await updateUserModel(userId, { password_hash: hash });
    return {
        success: true,
        message: "Password updated sucessfully"
    };
}
