import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';
export const get = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            `SELECT u.* FROM ref_taxs as u`
        );
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Ref Tax' });
    }
};
export const validateCreate = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Abbr must be a string'),
    body('abbr').notEmpty().withMessage('Abbr is required').isString().withMessage('Abbr must be a string'),
];

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const { abbr, name } = req.body; // role_id default 2
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('abbr', abbr)
            .input('name', name)
            .query(`
                INSERT INTO ref_taxs (abbr, name)
                VALUES (@abbr, @name)
            `);
        res.status(201).json({ message: 'Ref Tax created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating ref tax' });
    }
};

export const update = async (req: Request, res: Response) => {
    const dataId = parseInt(req.params.id);
    const { abbr, name } = req.body;

    try {
        const query = `
            UPDATE ref_taxs 
            SET abbr = @abbr, name = @name
            WHERE id = @id
        `;
        const pool = await poolPromise;
        const request = pool.request()
            .input('abbr', abbr)
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
            .query('DELETE FROM ref_taxs WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Ref Tax' });
    }
};
