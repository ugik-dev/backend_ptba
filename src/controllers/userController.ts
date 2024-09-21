import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
export const getUsers = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT u.*, r.title as role_title FROM users as u join roles as r on r.id = u.role_id');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};
export const validateCreateUser = [
    body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
];



export const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    const { username, name, password, email, role_id = 2 } = req.body; // role_id default 2
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const pool = await poolPromise;
        await pool.request()
            .input('username', username)
            .input('name', name)
            .input('password', hashedPassword)
            .input('email', email)
            .input('role_id', role_id)
            .query(`
                INSERT INTO users (username, name, password, email, role_id)
                VALUES (@username, @name, @password, @email, @role_id)
            `);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
export const validateUpdateUser = [
    body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
];

export const updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { username, name, email, role_id } = req.body;
    let { password } = req.body; // Password bisa kosong

    try {
        if (password) {
            password = await bcrypt.hash(password, 10); // Hash password
        }

        const query = `
            UPDATE users 
            SET username = @username, name = @name, email = @email, role_id = @role_id
            ${password ? ', password = @password' : ''}
            WHERE id = @id
        `;

        const pool = await poolPromise;
        const request = pool.request()
            .input('username', username)
            .input('name', name)
            .input('email', email)
            .input('role_id', role_id)
            .input('id', userId);

        // Jika password ada, tambahkan input password ke query
        if (password) {
            request.input('password', password);
        }

        await request.query(query);

        // Hanya satu panggilan untuk mengirim respons
        return res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', userId)
            .query('DELETE FROM users WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404); // User not found
        }

        res.sendStatus(204); // No Content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
