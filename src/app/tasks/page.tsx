'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';

export default function TasksPage() {
    const router = useRouter();

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
        status: 'Pending',
    });

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/users/tasks');
            setTasks(res.data.tasks);
        } catch (err) {
            toast.error('Failed to fetch tasks');
        }
    };

    const createTask = async () => {
        try {
            const res = await axios.post('/api/users/tasks', newTask);
            toast.success('Task created!');
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Low',
                status: 'Pending',
            });
            fetchTasks();
        } catch (err) {
            toast.error('Task creation failed');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center bg-amber-400">
            <div className='w-full flex justify-between bg-amber-100 p-3 text-center'>
                <div>
                    <img src="https://cdn-icons-png.flaticon.com/512/15369/15369359.png" width={50} alt="" />
                </div>
                <div>
                    <h1 className="text-2xl text-gray-700 font-bold mb-4 font-sans">Task Manager</h1>
                </div>
                <div>
                    
                </div>
            </div>

            <div className="bg-white w-[400px] mt-10 p-4 shadow rounded mb-6 text-center">
                <h2 className="font-semibold mb-2 text-gray-700">Create New Task</h2>
                <input
                    className="border p-2 w-full mb-2 text-gray-600"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                    className="border p-2 w-full mb-2 text-gray-600"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <input
                    className="border p-2 w-full mb-2 text-gray-600"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <select
                    className="border p-2 w-full mb-2 text-gray-600"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <select
                    className="border p-2 w-full mb-4 text-gray-600"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-xl hover:shadow-2xl transition-all duration-150 active:translate-y-1 active:shadow-inner"
                    style={{ boxShadow: ' 9px 5px 4px rgba(0,0,0, 0.4)' }}
                    onClick={createTask}>
                    Create Task
                </button>
            </div>

            <div className="space-y-4 mb-2">
                {tasks.map((task: any) => (
                    <div key={task._id} className="bg-gray-100 p-4 w-max-200px text-gray-600 rounded shadow">
                        <h3 className="text-xl font-semibold">{task.title}</h3>
                        <p>{task.description}</p>
                        <p className="text-sm text-gray-600">
                            Due: {task.dueDate?.substring(0, 10)} | Priority: {task.priority} | Status: {task.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
