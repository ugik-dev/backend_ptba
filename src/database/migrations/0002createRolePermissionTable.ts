import { poolPromise } from '../../config/db';


export default async function createRolePermissionTable() {
    const pool = await poolPromise;
    await pool.request().query(`
        CREATE TABLE role_permission (
            id INT PRIMARY KEY IDENTITY(1,1),
            role_id INT,
            permission_id INT,
            show CHAR(1) DEFAULT 'N' CHECK (show IN ('Y', 'N')),
            can_create CHAR(1) DEFAULT 'N' CHECK (can_create IN ('Y', 'N')),
            can_update CHAR(1) DEFAULT 'N' CHECK (can_update IN ('Y', 'N')),
            can_delete CHAR(1) DEFAULT 'N' CHECK (can_delete IN ('Y', 'N')),         
            FOREIGN KEY (role_id) REFERENCES roles(id),
            FOREIGN KEY (permission_id) REFERENCES permission(id)
        ) `);

    console.log('Create table prole ermission completed');
}
