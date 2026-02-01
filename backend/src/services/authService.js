import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET;


//  Génère un token d'invitation 
export async function createInvitationToken({ email, role }) {
    return jwt.sign(
        { email, role, purpose: 'invitation' },
        JWT_SECRET,
        { expiresIn: '48h' }
    );
}


//  Décode le token pour le Frontend (Affichage email/rôle)

export async function decodeInvitationToken(token) {
    try {
        console.log("Clé utilisée pour décoder :", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.purpose !== 'invitation') {
            throw new Error('Invalid token purpose');
        }

        return {
            email: decoded.email,
            role: decoded.role,
            token:token
        };
    } catch (err) {
        const error = new Error('Lien invalide ou expiré');
        error.status = 401;
        throw error;
    }
}


// Inscription en base de données
export async function register({ token, firstname, lastname, password }) {
    //Vérification du token d'invitation
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.purpose !== 'invitation') throw new Error();
    } catch (err) {
        const error = new Error('Invalid or expired invitation link');
        error.status = 401;
        throw error;
    }

    const { email, role } = decoded;

    // Mapping du rôle (Texte -> ID numérique pour la BDD)
    const roleMapping = {
        'Admin': 1,
        'Selector': 2,
        'Super-admin': 3
    };
    const roleId = roleMapping[role] || 3; // Par défaut organisateur

    // Vérification de l'existence de l'utilisateur
    const [existing] = await pool.execute('SELECT id FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
        const error = new Error('An account is already associated with this email address');
        error.status = 409;
        throw error;
    }

    // Hachage du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Insertion dans la table 'user'
    const query = `
        INSERT INTO user (email, firstname, lastname, password_hash, role_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
        const [result] = await pool.execute(query, [
            email,
            firstname,
            lastname,
            hash,
            roleId
        ]);

        return { 
            id: result.insertId, 
            email, 
            message: "Profile successfully created" 
        };
    } catch (dbError) {
        console.error("Database Error:", dbError.message);
        throw dbError;
    }
}


// Connexion réservée aux membres de l'équipe
export async function login({ email, password }) {
    const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);

    const user = rows[0];

    console.log("user trouvé :", user ? "OUI" : "NON");
    

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        const error = new Error('Identifiants incorrects');
        error.status = 401;
        throw error;
    }

    // Génération du token de session 
    return jwt.sign(
        { sub: user.id, email: user.email, role: user.role_id },
        JWT_SECRET,
        { expiresIn: '12h' }
    );
}