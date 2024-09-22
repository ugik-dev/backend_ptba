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
        { name: 'PPh 4(2) (Pot Put)', tax_id: 1 },
        { name: 'PPh 15 (Pot Put)', tax_id: 1 },
        { name: 'PPh 25 Kredit Pajak', tax_id: 1 },
        { name: 'PPh 29 SPT Badan KB', tax_id: 1 },
        { name: 'PPh 22 Ekspor', tax_id: 1 },
        { name: 'PPN MASA KB', tax_id: 1 },
        { name: 'Pajak Bumi dan Bangunan', tax_id: 2 },
        { name: 'Pajak Penggunaan Hutan (IPPKH)', tax_id: 2 },
        { name: 'Pajak Alat Berat / Kendaraan Bermotor', tax_id: 2 },
        { name: 'Pajak Penerangan Jalan', tax_id: 2 },
        { name: 'Pajak Daerah Jasa Boga', tax_id: 2 },
        { name: 'Pajak Galian C', tax_id: 2 },
        { name: 'Pajak Penggunaan Hutan', tax_id: 2 },
        { name: 'Pajak Reklame', tax_id: 2 },
        { name: 'Dividen', tax_id: 3 },
        { name: 'SP3D (Sumbangan Pihak ke-3)', tax_id: 3 },
        { name: 'BPHTB', tax_id: 3 },
        { name: 'Iuran Produksi Batubara (ROYALTI)', tax_id: 3 },
        { name: 'Retribusi Kebersihan', tax_id: 3 },
        { name: 'Retribusi IMB', tax_id: 3 },
        { name: 'Sewa Perairan', tax_id: 3 },
        { name: 'Retribusi Pemeriksaan Alat Pemadam Kebakaran', tax_id: 3 },
        { name: 'PNBP Pendaftaran, Pelayanan dan Pengukuran Aset', tax_id: 3 },
        { name: 'PNBP Biaya Hak Penggunaan (BHP)', tax_id: 3 },
        { name: 'PNBP Peralihan Aset', tax_id: 3 },
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
