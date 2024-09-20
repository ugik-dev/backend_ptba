import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME!,
    options: {
        encrypt: true, // Untuk Azure
        port: 1433,
        trustServerCertificate: true // Untuk local dev
    }
};

const requiredEnvVariables = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
requiredEnvVariables.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

export const poolPromise = new ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });
