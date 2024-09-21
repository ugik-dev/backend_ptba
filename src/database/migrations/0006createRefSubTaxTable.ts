import { poolPromise } from '../../config/db';


export default async function createRefSubTaxTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE ref_sub_taxs (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(50) NOT NULL,
            ref_tax_id INT,
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (ref_tax_id) REFERENCES ref_taxs(id)
        ); `);
    console.log('Create table ref_sub_taxs completed');
}
