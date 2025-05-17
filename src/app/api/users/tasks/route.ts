import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/taskModel';
import { connectDB } from '@/dbConfig/dbConfig';
import jwt from 'jsonwebtoken'; // Assuming you use JWT
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;


export async function GET() {
    try {
        await connectDB();
        const tasks = await Task.find().sort({ createdAt: -1 });
        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Step 1: Get cookies (no await needed)
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Step 2: Verify JWT
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Step 3: Create task
        const body = await req.json();
        const task = await Task.create({ ...body, createdBy: decoded.id });

        return NextResponse.json({ task }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating task:', error);

        if ((error as Error).name === 'JsonWebTokenError' || (error as Error).name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

