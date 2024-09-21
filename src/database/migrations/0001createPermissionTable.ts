import { poolPromise } from '../../config/db';


export default async function createPermissionTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE permission (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(50) NOT NULL UNIQUE,
            slug NVARCHAR(50) NOT NULL UNIQUE 
        ) `);

    console.log('Create table permission completed');
}
