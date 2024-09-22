import { poolPromise } from '../../config/db';
export default async function seedRoles() {
    const pool = await poolPromise;
    const users = [
        { name: 'Pusat' },
        { name: 'Provinsi' },
        { name: 'Kabupaten / Kota' },
    ];

    await pool.request()
        .query(`delete from ref_regions where 1=1`);

    for (const user of users) {
        await pool.request()
            .input('name', user.name)
            .query(`
                INSERT INTO ref_regions (name)
                VALUES (@name);
            `);
    }
    const provinces = [
        { name: "Pusat", ref: 1 },
        { name: "Sumatera Selatan", ref: 2 },
        { name: "Lampung", ref: 2 },
        { name: "Palembang", ref: 3 },
        { name: "Muara Enim", ref: 3 },
        { name: "Sekayu", ref: 3 },
        { name: "Pringsewu", ref: 3 },
    ];

    for (const permission of provinces) {
        await pool.request()
            .input('name', permission.name)
            .input('ref_region_id', permission.ref)
            .query(`
                INSERT INTO regions (name, ref_region_id)
                VALUES (@name , @ref_region_id);
            `);
    }

    console.log('Regions seeded');
};