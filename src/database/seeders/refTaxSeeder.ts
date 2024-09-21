import { poolPromise } from '../../config/db';
import bcrypt from 'bcryptjs';
// export default async function seedUsers() {
export default async function seedRefTax() {
    const pool = await poolPromise;

    const taxs = [
        { name: 'Penerimaan Pajak', abbr: "PP" },
        { name: 'Penerimaan Pajak Daerah', abbr: "PPD" },
        { name: 'Penerimaan Bukan Pajak', abbr: "PNBP" },
    ];
    await pool.request()
        .query(`delete from ref_taxs where 1=1`);

    for (const tax of taxs) {
        await pool.request()
            .input('name', tax.name)
            .input('abbr', tax.abbr)
            .query(`
                INSERT INTO ref_taxs (name, abbr)
                VALUES (@name, @abbr);
            `);
    }
    const sub_taxs = [
        { name: 'PPh 21 Pegawai', tax_id: 1 },
        { name: 'PPh 22 (Pot Put)', tax_id: 1 },
        { name: 'PPh 23 (Pot Put)', tax_id: 1 },
        { name: 'PPh 26 (Pot Put)', tax_id: 1 },
        { name: 'Pajak Bumi dan Bangunan', tax_id: 2 },
        { name: 'Pajak Penggunaan Hutan (IPPKH)', tax_id: 2 },
        { name: 'Pajak Alat Berat / Kendaraan Bermotor', tax_id: 2 },
    ];
    await pool.request()
        .query(`delete from ref_sub_taxs where 1=1`);

    for (const sub_tax of sub_taxs) {
        await pool.request()
            .input('name', sub_tax.name)
            .input('ref_tax_id', sub_tax.tax_id)
            .query(`
                INSERT INTO ref_sub_taxs (name, ref_tax_id)
                VALUES (@name, @ref_tax_id);
            `);
    }
    console.log('Ref Tax seeded');
};

// seedUsers().catch(err => {
//     console.error('Error seeding users:', err);
// });
