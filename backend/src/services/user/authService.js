import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {createUserModel, getUserByEmailModel, getUserByIdModel, updateUserModel, deleteUserModel}  from '../../models/user/userModel.js';
import { createInvitationModel, getInvitationByJtiModel, markInvitationAsUsedModel } from '../../models/admin/invitationModel.js';

const JWT_SECRET = process.env.JWT_SECRET;


//  Génère un token d'invitation 
export async function createInvitationToken({ email, role }) {
    const jti = uuidv4(); // identifiant unique qui sera inclu dans le token
    // création de l'invitation dans la db 
    await createInvitationModel( {jti, email, role})
    return jwt.sign(
        { email, role,jti, purpose: 'invitation' },
        process.env.JWT_SECRET,
        { expiresIn: '48h' }
    );
}


//  Décode le token pour le Frontend (Affichage email/rôle)

export async function decodeInvitationToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.purpose !== 'invitation') {
            throw new Error('Invalid token ');
        }
        // verification d l'usge unique de l'invitation 
        const invitation = await getInvitationByJtiModel(decoded.jti);

        if(!invitation) {
            throw new Error('Invitation not found');

        } 
        if ( invitation.status !=='pending') {
            throw new Error('Invitation already used')
        }

        return {
            email: decoded.email,
            role: decoded.role,
            jti : decoded.jti,
            token:token
        };
    } catch (err) {
        const error = new Error(err.message ||'Invalid or expired token');
        error.status = 401;
        throw error;
    }
}


// Inscription en base de données
export async function register({ token, firstname, lastname, password }) {

    //Vérification du token d'invitation
    const decoded = await decodeInvitationToken(token);
    console.log("Contenu du token aprés decode :", decoded);

     // Vérification de l'existence de l'utilisateur
    const existing = await getUserByEmailModel(decoded.email);

    if (existing) {
        const error = new Error('Email already exists');
        error.status = 409;
        throw error;
    }
 

    // Mapping du rôle (Texte -> ID numérique pour la BDD)
    const roleMapping = {
        'Admin': 1,
        'Selector': 2,
        'Super-admin': 3
    };
    const roleId = roleMapping[decoded.role] || 2; // Par défaut selector
  

    // Hachage du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Insertion dans la db
   const userId = await createUserModel(
    {
        email: decoded.email,
        firstname,
        lastname,
        password_hash: hash,
        role_id: roleId
    }) ;
    
    const marked = await markInvitationAsUsedModel(decoded.jti);
    console.log("Mraquage de l'invitation", marked);
    
    return {
        id: userId,
        email : decoded.email,
        message : `User n° ${userId} created with success `
    };


}

// Connexion réservée aux membres de l'équipe
export async function login({ email, password }) {

    const user = await getUserByEmailModel(email);
    console.log("Objet user récupéré :", user);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }
   const idDuRole = user.role_id || user.ROLE_ID || user.roleId;
    const roleNames = {
        1: 'Admin',
        2: 'Selector',
        3: 'Super-admin'
    };

    // On récupère le nom du rôle via l'ID
   const roleLabel = roleNames[idDuRole];

   console.log(`VERIFICATION FINALE : ID trouvé = ${idDuRole} -> Nom = ${roleLabel}`);

    // Génération du token de session 
    const token =  jwt.sign(
        { sub: user.id, email: user.email, role: roleLabel },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
    return {
        token,
        user: {
            id : user.id,
            email : user.email,
            firstname : user.firstname,
            lastname : user.lastname,
            role:roleLabel
        }
    }
}

// Modification du user
export async function updateUser(userId, userData) {
    const { firstname, lastname, password} = userData
    const dataToUpdate = { firstname, lastname, password };

    // Si l'utilisateur change son mot de passe, on le hache avant de l'envoyer en db
    if (dataToUpdate.password) {
        dataToUpdate.password_hash = await bcrypt.hash(dataToUpdate.password, 10);
        delete dataToUpdate.password; 
    }

    const success = await updateUserModel(userId, userData);
    
    if (!success) {
        const error = new Error('User not found or no changes made');
        error.status = 404;
        throw error;
    }

    return { 
        status: "success",
        message: `Profile ${userId} updated successfully`};
}

// Suprresion du user
export async function deleteUser(id) {
    const result = await deleteUserModel(id);
    if (!result) {
        const error = new Error('User not found or impossible deletion');
        error.status = 404;
        throw error;
    }
    return {
        status : "success",
        message: `Profile ${id} deleted successfully`
    }
}
// Espace user 
export async function profileUser (id) {
    const user = await getUserByIdModel(id);
    if(!user) {
        const error = new Error(`User n° ${id} don't exist !`);
        error.status = 404;
        throw error;
    }
      const roleNames = {
        1: 'Admin',
        2: 'Selector',
        3: 'Super-admin'
    };
return {
    id : user.id,
    firstname : user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: roleNames[user.role_id],
    message : `User n° ${id} connected`,
    status : "success"
}

}
