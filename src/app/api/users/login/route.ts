import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connectDB } from '@/dbConfig/dbConfig';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id).select('_id email username');

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // ✅ Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // ✅ Set token in cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'authToken',
            value: token,
            httpOnly: true,
            path: '/',
            // secure: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
        });

        return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email } }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
