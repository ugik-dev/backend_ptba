import { poolPromise } from '../../config/db';


export default async function createUsersTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE users (
            id INT PRIMARY KEY IDENTITY(1,1),
            username NVARCHAR(50) NOT NULL UNIQUE,
            name NVARCHAR(50) NOT NULL,
            password NVARCHAR(255) NOT NULL,
            email NVARCHAR(100) NOT NULL UNIQUE,
             role_id INT,
             createdAt DATETIME DEFAULT GETDATE(),
             updatedAt DATETIME DEFAULT GETDATE(),
             FOREIGN KEY (role_id) REFERENCES roles(id)
        ); `);

    console.log('Create table users completed');
}
