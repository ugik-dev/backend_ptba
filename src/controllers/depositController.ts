import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';

export const get = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, refTax, refRegion } = req.query;

        const pool = await poolPromise;
        let query = `SELECT 
                d.*,
                r.name region_name,
                r.ref_region_id,
                rr.name ref_region_name,
                rst.name ref_sub_tax_name,
                rst.ref_tax_id,
                rt.abbr ref_tax_abbr
                FROM deposits as d

                LEFT JOIN regions as r on r.id = d.region_id
                LEFT JOIN ref_regions as rr on rr.id = r.ref_region_id
          
                LEFT JOIN ref_sub_taxs as rst on rst.id = d.ref_sub_tax_id
                LEFT JOIN ref_taxs as rt on rt.id = rst.ref_tax_id
          
                `
        const conditions: string[] = [];
        const parameters: any = {};

        if (startDate) {
            conditions.push(`d.createdAt >= @startDate`);
            parameters['startDate'] = `${startDate}T00:00:00`;
        }
        if (endDate) {
            conditions.push(`d.createdAt <= @endDate`);
            parameters['endDate'] = `${endDate}T23:59:59`;
        }
        if (refTax) {
            conditions.push(`rst.ref_tax_id = @refTax`);
            parameters['refTax'] = refTax;
        }
        if (refRegion) {
            conditions.push(`r.ref_region_id = @refRegion`);
            parameters['refRegion'] = refRegion;
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        const request = pool.request();
        for (const key in parameters) {
            request.input(key, parameters[key]);
        }
        const result = await request.query(query);

        res.json(result.recordset);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        console.error(errorMessage);
        res.status(500).json({ message: 'Error fetching Deposit :' + errorMessage });
    }
};
export const validateCreate = [
    body('amount').notEmpty().withMessage('Amount is required'),
    body('alocation_percentage').notEmpty().withMessage('Amount is required').isNumeric().withMessage("Persentase is numeric"),
    body('ref_sub_tax_id').notEmpty().withMessage('Sub Jenis Pajak is required'),
    body('region_id').notEmpty().withMessage('Wilayah Pajak is required'),
];

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const { ref_sub_tax_id, region_id, alocation_percentage } = req.body;
    let { amount } = req.body;
    const userId = req.params['jwt_user_id'];
    try {
        const pool = await poolPromise;
        // const userId = 1;
        amount = amount.replace(/[^0-9]/g, '');
        const alocation_amount = (alocation_percentage / 100) * amount;
        await pool.request()
            .input('ref_sub_tax_id', ref_sub_tax_id)
            .input('region_id', region_id)
            .input('amount', amount)
            .input('alocation_percentage', alocation_percentage)
            .input('alocation_amount', alocation_amount)
            .input('user_id', userId)
            .query(`
                INSERT INTO deposits (ref_sub_tax_id, region_id, amount,alocation_percentage, alocation_amount, user_id)
                VALUES (@ref_sub_tax_id, @region_id, @amount, @alocation_percentage, @alocation_amount,@user_id)
            `);
        res.status(201).json({ message: 'Deposit created successfully' });
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
    const { ref_sub_tax_id, region_id, alocation_percentage } = req.body;
    const userId = req.params['jwt_user_id'];
    let { amount } = req.body;
    try {

        // if (parent_id === '' || parent_id === '0' || parent_id === 0) {
        //     parent_id = null;
        // }
        amount = amount.replace(/[^0-9]/g, '');
        const alocation_amount = (alocation_percentage / 100) * amount;
        const query = `
            UPDATE deposits 
            SET 
                ref_sub_tax_id = @ref_sub_tax_id,
                region_id = @region_id, 
                amount = @amount, 
                alocation_percentage = @alocation_percentage, 
                alocation_amount = @alocation_amount, 
                user_id = @user_id
            WHERE id = @id
        `;
        const pool = await poolPromise;
        const request = pool.request()
            .input('ref_sub_tax_id', ref_sub_tax_id)
            .input('region_id', region_id)
            .input('amount', amount)
            .input('alocation_percentage', alocation_percentage)
            .input('alocation_amount', alocation_amount)
            .input('user_id', userId)
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
            .query('DELETE FROM deposits WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Ref Region' });
    }
};
