import { poolPromise } from '../../config/db';

export default async function createRolesTable() {
    const pool = await poolPromise;

    await pool.request().query(`
     CREATE TABLE roles (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(50) NOT NULL UNIQUE,
            title NVARCHAR(255) NOT NULL,
        ); 
         `);

    console.log('Create table roles completed');
}