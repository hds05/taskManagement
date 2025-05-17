import { NextResponse } from 'next/server';
import User from '@/models/userModel'; // adjust this to your path
import { connectDB } from '@/dbConfig/dbConfig'; // your DB connection utility

export async function GET() {
    try {
        await connectDB();

        const users = await User.find({}, 'username'); // fetch only username
        return NextResponse.json({ users }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
