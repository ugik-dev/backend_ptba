import { poolPromise } from '../../config/db';
import bcrypt from 'bcryptjs';
// export default async function seedUsers() {
export default async function seedDeposit() {
    const pool = await poolPromise;

    const getRandomDate = (start: Date, end: Date): string => {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString(); // Mengembalikan dalam format ISO
    };

    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomAmount = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    await pool.request()
        .query(`delete from deposits where 1=1`);


    for (let i = 1; i <= 100; i++) {
        const createdAt = getRandomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date());
        const user_id = getRandomInt(1, 5);
        const ref_sub_tax_id = getRandomInt(1, 29);
        const region_id = getRandomInt(1, 7);
        const amount = getRandomAmount(250000, 1200000);
        const alocation_percentage = getRandomInt(1, 10);
        const alocation_amount = Math.floor((alocation_percentage / 100) * amount);

        await pool.request()
            .input('createdAt', createdAt)
            .input('user_id', user_id)
            .input('ref_sub_tax_id', ref_sub_tax_id)
            .input('region_id', region_id)
            .input('amount', amount)
            .input('alocation_percentage', alocation_percentage)
            .input('alocation_amount', alocation_amount)
            .query(`
            INSERT INTO deposits (user_id, ref_sub_tax_id, region_id, amount, alocation_percentage, alocation_amount, createdAt)
            VALUES (@user_id, @ref_sub_tax_id, @region_id, @amount, @alocation_percentage, @alocation_amount, @createdAt);
        `);
    }

    console.log('Deposit seeded');
};

// seedUsers().catch(err => {
//     console.error('Error seeding users:', err);
// });
