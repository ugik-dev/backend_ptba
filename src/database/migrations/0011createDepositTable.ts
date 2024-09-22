import { poolPromise } from '../../config/db';

export default async function createDepositTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE deposits (
            id INT PRIMARY KEY IDENTITY(1,1),
            user_id INT NOT NULL,
            ref_sub_tax_id INT NOT NULL,
            region_id INT NOT NULL,
            amount BIGINT,
            alocation_percentage INT,
            alocation_amount BIGINT,
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (region_id) REFERENCES regions(id),
            FOREIGN KEY (ref_sub_tax_id) REFERENCES ref_sub_taxs(id)
        ); `);
    console.log('Create table deposits completed');
}
