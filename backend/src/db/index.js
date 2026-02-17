import mysql from 'mysql2/promise';
import config from '../config/config.js';

const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10,
});

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT NOW() AS now');
        console.log('connexion a la db est Ok avec succes, ', rows[0].now);
    } catch (error) {
        console.error('erreur de connexion a la db: ', error);
        throw error;
    }
}

export { pool, testConnection };
