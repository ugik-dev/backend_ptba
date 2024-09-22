import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { JwtPayload } from '../types/jwtPayload';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';
interface JwtPayload {
    id: string;
    role_id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.params['jwt_role_id'] = decoded.role_id;
        req.params['jwt_user_id'] = decoded.id;
        next();
    });

};
