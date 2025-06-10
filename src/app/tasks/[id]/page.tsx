'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


export default function EditTaskPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = searchParams.get('user'); // 👈 This gets the user from ?user=...
    const taskBy = searchParams.get('taskBy'); // 👈 This gets the user from ?user=...
    // You can now use `user` anywhere in this component
    console.log('User passed in URL:', user);
    console.log('Task assigned by:', taskBy);

    const [task, setTask] = useState({
        taskfor: '',
        assignedBy: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
        status: 'Pending',
    });

    const [loading, setLoading] = useState(true);

    // Fetch task data by ID
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`/api/users/tasks/${id}`);
                if (!res.ok) throw new Error('Task not found');
                const data = await res.json();
                setTask(data.task);
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert('Failed to load task');
                router.push('/');
            }
        };

        fetchTask();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleOnClose = () => {
        router.push('/'); // Go back to task list
    }

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/users/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (res.ok) {
                alert('Task updated successfully');
                router.push('/'); // Go back to task list
            } else {
                const error = await res.json();
                alert(error.message || 'Failed to update task');
            }
        } catch (err) {
            console.error(err);
            alert('Error while updating task');
        }
    };

    if (loading) return <div className="p-4 text-gray-600">Loading task...</div>;
    
    const istaskFor = user === task.taskfor;
    const istaskby = user === task.assignedBy;

    return (
        <div className='bg-cover p-3 text-center flex items-center justify-center min-h-screen' style={{ backgroundImage: "url('https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg')" }}>
            <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Task</h2>
                    <button
                        onClick={handleOnClose}
                        className="bg-red-600 text-sm text-white px-2 py-1 rounded hover:bg-red-700 transition mb-4"
                    >
                        Close
                    </button>
                </div>
                <input
                    name="assignedBy"
                    placeholder="Assigned By"
                    value={task.assignedBy}
                    readOnly
                    // onChange={handleChange}
                    className="border p-2 w-full mb-2 text-gray-600"
                />
                <input
                    name="taskfor"
                    placeholder="Task For"
                    value={task.taskfor}
                    readOnly
                    // onChange={handleChange}
                    className="border p-2 w-full mb-2 text-gray-600"
                />
                <input
                    name="title"
                    placeholder="Title"
                    value={task.title}
                    readOnly={!istaskby}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2 text-gray-600"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={task.description}
                    readOnly={!istaskby}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2 text-gray-600"
                />
                <input
                    type="date"
                    name="dueDate"
                    // value={task.dueDate?.substring(0, 10)}
                    value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    readOnly={!istaskby}
                    className="border p-2 w-full mb-2 text-gray-600"
                />
                <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    disabled={!istaskby}
                    className="border p-2 w-full mb-2 text-gray-600"
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    disabled={!istaskFor}
                    className="border p-2 w-full mb-4 text-gray-600"
                >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Task
                </button>
            </div>
        </div>
    );
}
