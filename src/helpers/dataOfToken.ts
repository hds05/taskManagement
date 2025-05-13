import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenData {
    userId: string;
    email: string;
    username: string;
    exp: number;
    [key: string]: any; // Add additional fields as needed
}

export const extractDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('authToken')?.value || '';
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decodedToken.id;
    } catch (error: any) {
        console.error('Invalid token:', error);
        throw new Error('Invalid token: ' + error.message);
    }
};