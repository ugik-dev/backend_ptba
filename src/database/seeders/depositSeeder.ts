import { poolPromise } from '../../config/db';
import bcrypt from 'bcryptjs';
// export default async function seedUsers() {
export default async function seedDeposit() {
    const pool = await poolPromise;

    const getRandomDateInMonth = (year: number, month: number): string => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0); // Hari terakhir di bulan itu
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString(); // Mengembalikan format ISO
    };

    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomAmount = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Hapus semua data di tabel deposits
    await pool.request().query(`DELETE FROM deposits WHERE 1=1`);

    const insertQueries = [];
    const startYear = 2022;
    const startMonth = 0; // Januari
    const endDate = new Date(); // Tanggal saat ini
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth(); // Bulan saat ini (0 = Januari, 11 = Desember)

    // Looping untuk setiap bulan dari tahun 2022 sampai bulan saat ini
    for (let year = startYear; year <= endYear; year++) {
        const lastMonth = year === endYear ? endMonth : 11; // Sampai bulan terakhir tahun berjalan
        for (let month = startMonth; month <= lastMonth; month++) {
            // Buat 15 data untuk setiap bulan
            for (let i = 0; i < 15; i++) {
                const createdAt = getRandomDateInMonth(year, month);
                const user_id = getRandomInt(1, 5);
                const ref_sub_tax_id = getRandomInt(1, 29);
                const region_id = getRandomInt(1, 7);
                const amount = getRandomAmount(250000, 1200000);
                const alocation_percentage = getRandomInt(1, 10);
                const alocation_amount = Math.floor((alocation_percentage / 100) * amount);

                // Menyimpan query ke array untuk dimasukkan dalam satu batch
                insertQueries.push(
                    pool.request()
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
                        `)
                );
            }
        }
    }
    await Promise.all(insertQueries);

    console.log('Deposit seeded');
};

// seedUsers().catch(err => {
//     console.error('Error seeding users:', err);
// });
