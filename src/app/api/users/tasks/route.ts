import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/taskModel';
import { connectDB } from '@/dbConfig/dbConfig';


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
        const body = await req.json();
        const task = await Task.create(body);
        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}
