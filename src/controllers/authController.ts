import { Request, Response } from 'express';
import { poolPromise } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        console.log(username, password)
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', username)
            .query(`SELECT u.*, r.title FROM users as u
                JOIN roles as r on r.id = u.role_id
                 WHERE username = @username`);

        const user: User = result.recordset[0];
        if (!user) {
            return res.status(401).json({ message: 'Username tidak ditemukan' });
        } else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Password salah!' });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
