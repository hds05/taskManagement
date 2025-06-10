import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/taskModel';
import { connectDB } from '@/dbConfig/dbConfig';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;

  try {
    await connectDB();
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await connectDB();
    const body = await request.json();
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await connectDB();
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import Task from '@/models/taskModel';
// import { connectDB } from '@/dbConfig/dbConfig';
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';
// import User from '@/models/userModel';
// const JWT_SECRET = process.env.JWT_SECRET!;

// export async function GET(request: NextRequest, context: any) {
//   const { id } = context.params;

//   try {
//     await connectDB();
//     const task = await Task.findById(id);
//     if (!task) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }
//     return NextResponse.json({ task }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching task:', error);
//     return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
//   }
// }


// export async function PUT(request: NextRequest, context: any) {
//   const { id } = context.params;

//   try {
//     await connectDB();

//     // Get JWT from cookie
//     const cookieStore = cookies();
//     const token = (await cookieStore).get('authToken')?.value;

//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
//     }

//     // Decode token to get userId
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

//     // Fetch user to get username
//     const user = await User.findById(decoded.id).select('username');
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized: Invalid user' }, { status: 401 });
//     }

//     const loggedInUsername = user.username;

//     const task = await Task.findById(id);
//     if (!task) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }

//     const body = await request.json();

//     // Authorization checks
//     if ('status' in body && task.taskfor !== loggedInUsername) {
//       return NextResponse.json({ error: 'Only the assignee can update the status.' }, { status: 403 });
//     }

//     if (
//       ('description' in body || 'priority' in body || 'title' in body || 'dueDate' in body || 'taskfor' in body)
//       && task.assignedBy !== loggedInUsername
//     ) {
//       return NextResponse.json({ error: 'Only the assigner can update task details.' }, { status: 403 });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
//     return NextResponse.json({ task: updatedTask }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating task:', error);
//     return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest, context: any) {
//   const { id } = context.params;

//   try {
//     await connectDB();
//     const deletedTask = await Task.findByIdAndDelete(id);
//     if (!deletedTask) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }
//     return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
//   }
// }
