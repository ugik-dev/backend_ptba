import { poolPromise } from '../../config/db';
export default async function seedRoles() {
    const pool = await poolPromise;
    const users = [
        { name: 'admin', title: "AM PPN" },
        { name: 'spc-keu', title: "Spesilis Keuangan" },
        { name: 'empty-permission', title: "Empty Permission" },
    ];

    await pool.request()
        .query(`delete from roles where 1=1`);

    for (const user of users) {
        await pool.request()
            .input('name', user.name)
            .input('title', user.title) // Pastikan untuk hash password di aplikasi sebenarnya
            .query(`
                INSERT INTO roles (name, title)
                VALUES (@name, @title);
            `);
    }

    const permissions = [
        { slug: 'manage-user', name: "Kelolah User" },
        { slug: 'manage-role', name: "Kelolah Role" },
        { slug: 'manage-tax', name: "Kelolah Jenis Pajak" },
        { slug: 'manage-sub-tax', name: "Kelolah Jenis Sub Pajak" },
        { slug: 'deposit', name: "Deposit" },
    ];

    for (const permission of permissions) {
        let result = await pool.request()
            .input('name', permission.name)
            .input('slug', permission.slug)
            .query(`
                INSERT INTO permission (name, slug)
                VALUES (@name , @slug);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        let permissionId = result.recordset[0].id; // Dapatkan ID yang baru saja dimasukkan
        await pool.request()
            .input('permission_id', permissionId)
            .input('role_id', 1)
            .query(`
            INSERT INTO role_permission 
            (permission_id, role_id, show, can_create, can_update, can_delete)
            VALUES (@permission_id , @role_id, 'Y','Y','Y','Y' );
        `);
        if (permission.slug == "deposit") {
            await pool.request()
                .input('permission_id', permissionId)
                .input('role_id', 2)
                .query(`
                INSERT INTO role_permission 
                (permission_id, role_id, show, can_create, can_update, can_delete)
                VALUES (@permission_id , @role_id, 'Y','Y','Y','Y' );
                `);
        }
    }

    console.log('Roles seeded');
};