import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';

export const get = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            `SELECT 
                u.*,
                r.name as ref_tax_name,
                r.abbr as ref_tax_abbr
             FROM ref_sub_taxs as u
            JOIN ref_taxs as r on r.id = u.ref_tax_id`);
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Ref Tax' });
    }
};
export const validateCreate = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Ref_tax_id must be a string'),
    body('ref_tax_id').notEmpty().withMessage('Jenis Pajak is required').isString().withMessage('Ref_tax_id must be a string'),
];

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const { ref_tax_id, name } = req.body; // role_id default 2
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ref_tax_id', ref_tax_id)
            .input('name', name)
            .query(`
                INSERT INTO ref_sub_taxs (ref_tax_id, name)
                VALUES (@ref_tax_id, @name)
            `);
        res.status(201).json({ message: 'Ref Tax created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating ref tax' });
    }
};

export const update = async (req: Request, res: Response) => {
    const dataId = parseInt(req.params.id);
    const { ref_tax_id, name } = req.body;

    try {
        const query = `
            UPDATE ref_sub_taxs 
            SET ref_tax_id = @ref_tax_id, name = @name
            WHERE id = @id
        `;
        const pool = await poolPromise;
        const request = pool.request()
            .input('ref_tax_id', ref_tax_id)
            .input('name', name)
            .input('id', dataId);

        await request.query(query);
        return res.status(200).json({ message: 'Ref Tax updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating Ref Tax' });
    }
};

export const deleteData = async (req: Request, res: Response) => {
    const dataId = parseInt(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', dataId)
            .query('DELETE FROM ref_sub_taxs WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Ref Tax' });
    }
};
