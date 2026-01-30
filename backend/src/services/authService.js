import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';
import config from '../config/config.js';
const JWT_SECRET = process.env.JWT_SECRET;

// Super-admin envoie au user par mail un lien avec token provisoire vers le formulaire d'inscription ( email et role préremplis)
export async function createInvitationToken({ email, role }) {
    return jwt.sign(
        { email, role: role, purpose: 'invitation' },
        JWT_SECRET,
        { expiresIn: '48h' }
    );
}

// user soumet le formulaire aprés l'avoir complété ( nom, prénom, mot de passe). Verfication du token
export async function register({ token, firstname, lastname, password }) {
    //  Vérification et décodage du token d'invitation
    let decoded;
    try {
        decoded = jwt.verify(token, config.jwtsecret);
        if (decoded.type !== 'invitation') throw new Error();
    } catch (err) {
        const error = new Error('Invalid or expired invitation link');
        error.status = 401;
        throw error;
    }

    const { email, role } = decoded;

    // Vérification que l'email n'a pas déjà été créé
    const [existing] = await pool.execute('SELECT id FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
        const error = new Error('An account is already associated with this email address');
        error.status = 409;
        throw error;
    }

    // Hsschage du mot de passe
    const hash = await bcrypt.hash(password, 10);

    //Insertion dans la db
    const query = `
        INSERT INTO user (email, firstname, lastname, password_hash, role) 
        VALUES (?, ?, ?, ?, ?, 1)
    `;
    const [result] = await pool.execute(query, [
        email,
        firstname,
        lastname,
        hash,
        role
    ]);

    return { id: result.insertId, email, message: "Profile successfully created" };
}
// Login par le lien dissimulé dans le site
export async function login({ email, password }) {
    const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        const error = new Error('Identifiants incorrects');
        error.status = 401;
        throw error;
    }

    return jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '12h' }
    );
}