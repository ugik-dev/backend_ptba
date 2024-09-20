import { poolPromise } from '../../config/db';
export default async function seedRoles() {
    const pool = await poolPromise;
    const users = [
        { name: 'admin', title: "AM PPN" },
        { name: 'spc-keu', title: "Spesilis Keuangan" },
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

    console.log('Roles seeded');
};