import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda

export const refRoles = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM roles');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

export const refPermission = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM permission');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};

export const refTax = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ref_taxs');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

export const refSubTax = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const parent = parseInt(req.params.parent);
        const result = await pool.request()
            .input("parent", parent)
            .query('SELECT * FROM ref_sub_taxs where ref_tax_id = @parent');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

export const refRegion = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ref_regions');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching regions' });
    }
};

export const refSubRegion = async (req: Request, res: Response) => {
    const parent = parseInt(req.params.parent);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("parent", parent)
            .query('SELECT * FROM regions where ref_region_id = @parent');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching regions' });
    }
};

export const refProvince = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM regions where ref_region_id = 2');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching province' });
    }
};