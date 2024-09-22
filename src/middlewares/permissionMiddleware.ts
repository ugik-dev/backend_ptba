import { Request, Response, NextFunction } from 'express';
import { poolPromise } from '../config/db'; // Pastikan ini sesuai dengan file konfigurasi DB Anda
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export const permissionMiddleware = (action: string, permissionType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pool = await poolPromise;
            // const userId = req.user?.id;
            const roleId = req.params['jwt_role_id'];
            console.log("rolenya", roleId)
            // if (!userId) {
            //     return res.status(401).json({ message: 'Unauthorized' });
            // }
            let typeAction;
            switch (permissionType) {
                case 'create':
                    typeAction = 'can_create';
                    break;
                case 'update':
                    typeAction = 'can_update';
                    break;
                case 'delete':
                    typeAction = 'can_delete';
                    break;
                case 'show':
                    typeAction = 'show';
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid permission type' });
            }

            const query = `
                SELECT *
                FROM role_permission rp
                INNER JOIN permission ur ON ur.id = rp.permission_id
                WHERE ur.slug = @action
                AND rp.role_id = @role_id
                 AND rp.${typeAction} = 'Y'
            `;

            const result = await pool.request()
                .input('role_id', roleId)
                .input('action', action)
                .query(query);

            const hasPermission = result.recordset[0];
            console.log(hasPermission)
            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden: You don\'t have permission' });
            }

            next();
        } catch (error) {
            console.error('Error checking permissions:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

