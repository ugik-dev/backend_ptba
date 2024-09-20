import { poolPromise } from '../../config/db';
import bcrypt from 'bcryptjs';
// export default async function seedUsers() {
export default async function seedUsers() {
    const pool = await poolPromise;

    const hashedPassword = await bcrypt.hash('secret', 10);

    const users = [
        { username: 'admin', name: 'Asep Maryana', password: hashedPassword, email: 'admin@example.com', role_id: 1 },
        { username: 'user1', name: 'Sugi Pramana', password: hashedPassword, email: 'user1@example.com', role_id: 2 },
        { username: 'user2', name: 'Other Person', password: hashedPassword, email: 'user2@example.com', role_id: 2 },
    ];
    await pool.request()
        .query(`delete from users where 1=1`);

    for (const user of users) {
        await pool.request()
            .input('username', user.username)
            .input('password', user.password) // Pastikan untuk hash password di aplikasi sebenarnya
            .input('email', user.email)
            .input('name', user.name)
            .input('role_id', user.role_id)
            .query(`
                INSERT INTO users (username, name, password, email, role_id)
                VALUES (@username, @name, @password, @email, @role_id);
            `);
    }

    console.log('Users seeded');
};

// seedUsers().catch(err => {
//     console.error('Error seeding users:', err);
// });
