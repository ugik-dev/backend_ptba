import { poolPromise } from '../../config/db';


export default async function createRegionsTable() {
    const pool = await poolPromise;
    await pool.request().query(`
      CREATE TABLE regions (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(50) NOT NULL,
            ref_region_id INT NOT NULL,
            parent_id INT,
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (ref_region_id) REFERENCES ref_regions(id),
            FOREIGN KEY (parent_id) REFERENCES regions(id)
        ); `);
    console.log('Create table regions completed');
}
