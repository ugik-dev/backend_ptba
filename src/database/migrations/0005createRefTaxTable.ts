import { poolPromise } from '../../config/db';


export default async function createRefTaxTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE ref_taxs (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(120) NOT NULL,
            abbr NVARCHAR(50) NOT NULL,
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE(),
        ); `);

    console.log('Create table ref_taxs completed');
}
