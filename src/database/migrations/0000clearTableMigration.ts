import { poolPromise } from '../../config/db';

export default async function clearTableMigration() {
    const pool = await poolPromise;

    await pool.request().query(`
        IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
        IF OBJECT_ID('dbo.role_permission', 'U') IS NOT NULL DROP TABLE dbo.role_permission;
        IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;
        IF OBJECT_ID('dbo.permission', 'U') IS NOT NULL DROP TABLE dbo.permission;
    `);

    console.log('Cleared tables migration completed');
}