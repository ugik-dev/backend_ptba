import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';

export const get = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            `SELECT 
                u.*,
                up.name as province_name,
                r.name as ref_region_name
                FROM regions as u
                 JOIN ref_regions as r on r.id = u.ref_region_id
                 LEFT JOIN regions as up on up.id = u.parent_id
                `);
        res.json(result.recordset);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        console.error(errorMessage);
        res.status(500).json({ message: 'Error fetching Ref Region :' + errorMessage });
    }
};
export const validateCreate = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Ref_region_id must be a string'),
    body('ref_region_id').notEmpty().withMessage('Kategori is required'),
    body('parent_id')
        .if(body('ref_region_id').equals('3'))  // Hanya memvalidasi jika ref_region_id = 3
        .notEmpty().withMessage('Province is required when Kategori is Kabupaten/Kota')
        .isNumeric().withMessage('Select Province!'),
];

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const { ref_region_id, name, parent_id } = req.body; // role_id default 2
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ref_region_id', ref_region_id)
            .input('name', name)
            .input('parent_id', parent_id)
            .query(`
                INSERT INTO regions (ref_region_id, name, parent_id)
                VALUES (@ref_region_id, @name, @parent_id)
            `);
        res.status(201).json({ message: 'Region created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating region' });
    }
};

export const update = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const dataId = parseInt(req.params.id);
    const { ref_region_id, name } = req.body;
    let { parent_id } = req.body;

    try {

        // if (parent_id === '' || parent_id === '0' || parent_id === 0) {
        //     parent_id = null;
        // }
        const query = `
            UPDATE regions 
            SET ref_region_id = @ref_region_id, name = @name, parent_id = @parent_id
            WHERE id = @id
        `;
        const pool = await poolPromise;
        const request = pool.request()
            .input('ref_region_id', ref_region_id)
            .input('name', name)
            .input('parent_id', parent_id)
            .input('id', dataId);

        await request.query(query);
        return res.status(200).json({ message: 'Ref Region updated successfully' });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        console.error(error);
        return res.status(500).json({ message: 'Error updating Region :' + errorMessage });
    }
};

export const deleteData = async (req: Request, res: Response) => {
    const dataId = parseInt(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', dataId)
            .query('DELETE FROM regions WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Ref Region' });
    }
};
