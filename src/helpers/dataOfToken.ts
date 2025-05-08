import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenData {
    userId: string;
    email: string;
    exp: number;
    [key: string]: any; // Add additional fields as needed
}

export const extractDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decodedToken.id;
    } catch (error: any) {
        throw new Error('Invalid token: ' + error.message);
        console.error('Invalid token:', error);
        return null;
    }
};