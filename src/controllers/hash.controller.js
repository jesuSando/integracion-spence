import dotenv from 'dotenv';
dotenv.config();

import db from '../config/conexion.js';

export const getHashDB = async () => {
    const user = process.env.HASH_USER;
    const pass = process.env.HASH_PASS;

    const [rows] = await db.execute(
        'SELECT hash FROM hash WHERE user = ? AND pasw = ?', 
        [user, pass]
    );
    return rows[0]?.hash; 
};


//solo hash
export const getHash = async (req, res) => {
    try {
        const hash = await getHashDB();
        if (hash) {
            res.json({ hash });
        } else {
            res.status(404).json({ message: 'Hash no encontrado' });
        }
    } catch (error) {
        console.error('Error en getHash:', error.message); 
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message
        });
    }
};
