import { poolPromise } from '../../config/db';


export default async function createRefRegionTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE ref_regions (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(50) NOT NULL
        ); `);
    console.log('Create table ref_regions completed');
}
