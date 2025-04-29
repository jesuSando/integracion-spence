import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Crear un pool de conexiones
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
