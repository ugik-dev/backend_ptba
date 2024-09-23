import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';

export const get = async (req: Request, res: Response) => {
    try {
        const { year } = req.query;
        const pool = await poolPromise;
        let query = `SELECT 
                    sum(d.amount) as sum_amount,
                    rt.abbr as ref_tax_abbr,
                    MONTH(d.createdAt) as month
                FROM deposits as d
                LEFT JOIN regions as r on r.id = d.region_id
                LEFT JOIN ref_regions as rr on rr.id = r.ref_region_id
                LEFT JOIN ref_sub_taxs as rst on rst.id = d.ref_sub_tax_id
                LEFT JOIN ref_taxs as rt on rt.id = rst.ref_tax_id
                WHERE YEAR(d.createdAt) = @year
                GROUP BY rt.abbr, MONTH(d.createdAt)
                ORDER BY MONTH(d.createdAt), rt.abbr
                `;

        const conditions: string[] = [];
        const parameters: any = {};

        // if (startDate) {
        //     conditions.push(`d.createdAt >= @startDate`);
        //     parameters['startDate'] = `${startDate}T00:00:00`;
        // }
        // if (endDate) {
        //     conditions.push(`d.createdAt <= @endDate`);
        //     parameters['endDate'] = `${endDate}T23:59:59`;
        // }
        // if (refTax) {
        //     conditions.push(`rst.ref_tax_id = @refTax`);
        //     parameters['refTax'] = refTax;
        // }
        // if (refRegion) {
        //     conditions.push(`r.ref_region_id = @refRegion`);
        //     parameters['refRegion'] = refRegion;
        // }
        // if (conditions.length > 0) {
        //     query += ' WHERE ' + conditions.join(' AND ');
        // }
        const request = pool.request();
        // for (const key in parameters) {
        //     request.input(key, parameters[key]);
        // }
        request.input("year", year);
        console.log(year)
        const result = await request.query(query);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Inisialisasi struktur dataset source
        let dataset = {
            source: [
                ["abbr", "PNBP", "PP", "PPD"]
            ]
        };
        for (let i = 0; i < 12; i++) {
            dataset.source.push([months[i], "0", "0", "0"]); // Inisialisasi setiap bulan dengan 0 untuk setiap jenis pajak
        }
        if (result && result.recordset) {
            result.recordset.forEach(entry => {
                let monthIndex = entry.month - 1;  // Sesuaikan index bulan (bulan ke-1 menjadi index 0)
                let abbrIndex = dataset.source[0].indexOf(entry.ref_tax_abbr);  // Cari index untuk abbr di kolom pertama
                if (abbrIndex > -1) {
                    dataset.source[monthIndex + 1][abbrIndex] = parseFloat(entry.sum_amount).toString();
                }
            });
        }

        dataset.source = dataset.source.filter((row, index) => {
            if (index === 0) return true;
            return row.slice(1).some(value => value !== "0");
        });


        res.json(dataset);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        console.error(errorMessage);
        res.status(500).json({ message: 'Error fetching Deposit :' + errorMessage });
    }
};

