import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenData {
  userId: string;
  email: string;
  username: string;
  exp: number;
  id: string; 
  [key: string]: unknown; 
}

export const extractDataFromToken = (request: NextRequest): string => {
  const token = request.cookies.get('authToken')?.value;
  if (!token) {
    throw new Error('Token not found in cookies');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as TokenData;
    if (!decodedToken.id) {
      throw new Error('Token does not contain a user ID');
    }
    return decodedToken.id;
  } catch (error: unknown) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid token: ' + (error as Error).message);
  }
};
