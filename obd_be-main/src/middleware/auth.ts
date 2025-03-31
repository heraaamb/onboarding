import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Temporary development token (replace with actual JWT for testing)
const TEMP_DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiTmljayBGdXJ5Iiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzQyNzQ2NjU1LCJleHAiOjE3NDMzNTE0NTV9.rsLi8R2oeX4EsWdp2h3Nm0WvwrztEtmLvC2Yo2GkYiQ";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header or query param
    const tokenFromHeader = req.headers.authorization?.split(' ')[1];
    const tokenFromQuery = req.query.token as string;

    // Use hardcoded token in development if none provided
    const isDev = process.env.NODE_ENV !== 'production';
    const authToken = tokenFromHeader || tokenFromQuery || (isDev ? TEMP_DEV_TOKEN : null);

    // // Debugging
    console.log('Auth Token:', authToken);

    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export default auth;
