import { Request, Response } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import { body, validationResult } from 'express-validator';
interface Permission {
    show: 'Y' | 'N';
    can_create: 'Y' | 'N';
    can_update: 'Y' | 'N';
    can_delete: 'Y' | 'N';
}

interface Permissions {
    [key: number]: Permission; // Key is the permission ID
}


export const getRoles = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT r.* FROM roles as r');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};
export const getRolePermission = async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('role_id', roleId)
            .query(`SELECT  r.*, p.name, p.id as permission_p_id FROM permission as p 
            LEFT JOIN role_permission as r 
            on r.permission_id = p.id and r.role_id = @role_id`);
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};
export const validateCreate = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Rolename must be a string'),
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
];

export const createRole = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({ message: errorArray[0].msg });
    }
    // const { title, name } = req.body; // role_id default 2
    const { title, name, permissions }: { title: string; name: string; permissions: Permissions } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('title', title)
            .input('name', name)
            .query(`
                INSERT INTO roles (name, title)
                VALUES (@name, @title);
                 SELECT SCOPE_IDENTITY() AS id;
            `);
        const insertedId = result.recordset[0].id; // Dapatkan ID yang baru saja dimasukkan

        for (const [permissionId, permissionData] of Object.entries(permissions)) {
            if (permissionId != 'null' && permissionData && typeof permissionData === 'object') {
                const {
                    show = 'N',
                    can_create = 'N',
                    can_update = 'N',
                    can_delete = 'N'
                } = permissionData;
                console.log('created', permissionId)
                // Gunakan nilai default
                await pool.request()
                    .input('roleId', insertedId)
                    .input('permissionId', permissionId)
                    .input('show', show || 'N') // Default ke 'N' jika tidak ada
                    .input('create', can_create || 'N')
                    .input('update', can_update || 'N')
                    .input('delete', can_delete || 'N')
                    .query(`
                            MERGE INTO role_permission AS target
                            USING (SELECT @roleId AS roleId, @permissionId AS permissionId) AS source
                            ON target.role_id = source.roleId AND target.permission_id = source.permissionId
                            WHEN MATCHED THEN
                                UPDATE SET show = @show, can_create = @create, can_update = @update, can_delete = @delete
                            WHEN NOT MATCHED THEN
                                INSERT (role_id, permission_id, show, can_create, can_update, can_delete)
                                VALUES (@roleId, @permissionId, @show, @create, @update, @delete);
                        `);
            }
        }
        res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating role' });
    }
};
export const validateUpdate = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Rolename must be a string'),
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
];

export const updateRole = async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);
    const { title, name, permissions }: { title: string; name: string; permissions: Permissions } = req.body;
    // const { title, name, permissions } = req.body;
    try {
        const query = `
            UPDATE roles 
            SET title = @title, name = @name 
            WHERE id = @id
        `;
        const pool = await poolPromise;
        const request = pool.request()
            .input('title', title)
            .input('name', name)
            .input('id', roleId)

        await request.query(query);


        await pool.request()
            .input('roleId', roleId)
            .query('DELETE FROM role_permission WHERE role_id = @roleId');

        for (const [permissionId, permissionData] of Object.entries(permissions)) {
            if (permissionId != 'null' && permissionData && typeof permissionData === 'object') {
                const {
                    show = 'N',
                    can_create = 'N',
                    can_update = 'N',
                    can_delete = 'N'
                } = permissionData;
                console.log('created', permissionId)
                // Gunakan nilai default
                await pool.request()
                    .input('roleId', roleId)
                    .input('permissionId', permissionId)
                    .input('show', show || 'N') // Default ke 'N' jika tidak ada
                    .input('create', can_create || 'N')
                    .input('update', can_update || 'N')
                    .input('delete', can_delete || 'N')
                    .query(`
                        MERGE INTO role_permission AS target
                        USING (SELECT @roleId AS roleId, @permissionId AS permissionId) AS source
                        ON target.role_id = source.roleId AND target.permission_id = source.permissionId
                        WHEN MATCHED THEN
                            UPDATE SET show = @show, can_create = @create, can_update = @update, can_delete = @delete
                        WHEN NOT MATCHED THEN
                            INSERT (role_id, permission_id, show, can_create, can_update, can_delete)
                            VALUES (@roleId, @permissionId, @show, @create, @update, @delete);
                    `);
            }
        }
        return res.status(200).json({ message: 'Role updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating role' });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', roleId)
            .query('DELETE FROM roles WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.sendStatus(404).json({ message: 'Error deleting role' });
        }
        res.sendStatus(204);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';

        res.status(500).json({ message: 'Error deleting role :' + errorMessage });
    }
};
