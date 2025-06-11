'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Task {
    _id: string;
    taskfor: string;
    assignedBy: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Completed';
}

export default function AssignedTasksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const assignedByUser = searchParams.get('user');

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (taskId: string) => {
        const confirm = window.confirm('Are you sure you want to delete this task?');
        if (!confirm) return;

        try {
            const res = await axios.delete(`/api/users/tasks/${taskId}`);
            if (res.status === 200) {
                setTasks(prev => prev.filter(task => task._id !== taskId));
                alert('Task deleted successfully');
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('An error occurred while deleting the task');
        }
    };


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('/api/users/tasks');
                const allTasks = res.data.tasks || [];

                const filtered = allTasks.filter(
                    (task: Task) => task.assignedBy === assignedByUser
                );

                setTasks(filtered);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (assignedByUser) fetchTasks();
    }, [assignedByUser, router]);

    return (
        <div
            className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-10"
            style={{
                backgroundImage: "url('https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <h1 className="text-2xl sm:text-4xl font-bold text-center text-black mb-8 underline bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
                Tasks, Assigned By You
            </h1>

            {loading ? (
                <p className="text-center text-gray-700 text-lg">Loading tasks...</p>
            ) : tasks.length > 0 ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            className="w-full max-w-xs bg-white bg-opacity-90 shadow-md rounded-2xl p-4 border border-gray-300"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-blue-600">{task.title}</h2>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/tasks/${task._id}?user=${assignedByUser}&taskBy=${task.assignedBy}`}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        <EditIcon style={{ color: 'gray' }} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                         <DeleteIcon style={{ color: 'salmon' }} />
                                    </button>
                                </div>
                            </div>


                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Assigned To:</strong> {task.taskfor}
                            </p>
                            <div className="overflow-auto text-sm bg-white text-gray-800 h-32 border border-gray-400 p-2 rounded-lg mb-2">
                                {task.description}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Due Date:</strong>{' '}
                                {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Priority:</strong> {task.priority}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Status:</strong> {task.status}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-800 text-lg">No tasks assigned by you.</p>
            )}
        </div>
    );
}
