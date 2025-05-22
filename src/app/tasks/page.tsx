'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

interface User {
    _id: string;
    username: string;
}

interface Task {
    _id: string;
    taskfor: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Completed';
    assignedBy: string;
}

export default function TasksPage() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        taskfor: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
        status: 'Pending',
        assignedBy: '',
    });



    const checkLoginStatus = async () => {
        try {
            const res = await axios.get('/api/users/login');
            if (res.data?.user) {
                setIsLoggedIn(true);
                setNewTask((prev) => ({ ...prev, assignedBy: res.data.user.username })); // 👈 set username
            }
            // setIsLoggedIn(!!res.data?.user);
            console.log('Login status:', res.data);
            console.log('Login status1:', res.data.user.username);

        } catch {
            setIsLoggedIn(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users/allusers'); // you need to create this API
            setUsers(res.data.users);
        } catch {
            toast.error('Failed to fetch users');
        }
    };


    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/users/tasks');
            setTasks(res.data.tasks);
            setAllTasks(res.data.tasks);
        } catch {
            toast.error('Failed to fetch tasks');
        }
    };

    const createTask = async () => {
        if (!newTask.taskfor || !newTask.title || !newTask.description || !newTask.dueDate) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (newTask.dueDate < new Date().toISOString().split('T')[0]) {
            toast.error("Due date cannot be in the past.");
            return;
        }

        try {
            const res = await axios.get('/api/users/login');
            const currentUsername = res.data?.user?.username;
            if (!currentUsername) {
                toast.error("Login expired. Please log in again.");
                return;
            }

            const taskToCreate = { ...newTask, assignedBy: currentUsername };

            const taskRes = await axios.post('/api/users/tasks', taskToCreate);
            // const res = await axios.post('/api/users/tasks', newTask);
            toast.success('Task created!');
            setNewTask({
                taskfor: '',
                title: '',
                description: '',
                dueDate: '',
                priority: 'Low',
                status: 'Pending',
                assignedBy: '',
            });
            // console.log('Task created:', res.data.task);
              console.log('Task created:', taskRes.data.task);
            fetchTasks();
        } catch {
            toast.error('Task creation failed');
        }
    };

    const handleDelete = async (taskId: string) => {
        const confirm = window.confirm('Are you sure you want to delete this task?');
        if (!confirm) return;

        try {
            const res = await fetch(`/api/users/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Optional: refresh tasks or remove from state
                alert('Task deleted successfully');
                // You may want to reload the page or update your local state
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete task');
            }
        } catch (error: unknown) {
            console.error('Error deleting task:', error);
            alert('Something went wrong');
        }
    };


    const logout = async () => {
        try {
            const res = await axios.get('/api/users/logout');
            console.log('Logout response:', res.data);
            setIsLoggedIn(false);
            toast.success('Logout successful!');
            router.push('/tasks'); // Redirect to tasks page

        } catch (error: unknown) {
            console.error('Logout failed:', error);
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error instanceof Error) {
                toast.error(`Logout failed: ${error.message}`);
            } else {
                toast.error('Logout failed due to an unknown error');
            }
        }

    }

    useEffect(() => {
        fetchTasks();
        fetchUsers();
        checkLoginStatus();
    }, []);

    return (
        <div className="w-full flex flex-col items-center  bg-amber-200 h-full min-h-screen bg-cover" style={{ backgroundImage: "url('https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg')" }}>
            {/* header */}
            <div className='sticky top-0 z-50 w-screen'>
                <div className='relative w-full flex justify-between items-center bg-amber-100 py-3 px-5 text-center'>
                    <div>
                        {/* <img src="" width={50} alt="" /> */}
                        <Image src={'https://cdn-icons-png.flaticon.com/512/11725/11725603.png'} alt={''} width={50} height={50} />
                    </div>
                    <div>
                        <h1 className="text-2xl text-gray-700 font-bold font-sans">TaskFlow</h1>
                    </div>
                    <div className='right-0 top-0 '>
                        <div>
                            < MenuIcon id="menu-button" onClick={() => setMenuOpen(!menuOpen)} className='text-gray-700 cursor-pointer' fontSize='large' />
                        </div>

                        {/* Side Menu */}
                        {menuOpen && (
                            <div id="menu-dropdown" className='absolute right-0  w-[250px] bg-white shadow-lg rounded z-50'>
                                <div className='flex justify-between items-center p-4 border-b'>
                                    <h1 className='text-gray-700 font-semibold'>Menu</h1>
                                    <div>
                                        <Image src={'https://cdn-icons-png.flaticon.com/512/8157/8157896.png'} alt={''} width={30} height={30} />
                                    </div>
                                    {/* About */}

                                </div>
                                {isLoggedIn ?
                                    (<div className='text-gray-700 flex flex-col gap-2 p-4'>
                                        <Link href={'/about_us'} className='hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400'>About</Link>
                                        <Link href={'/profile/user'} className='hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400'>Profile</Link>
                                        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400" onClick={logout}>Logout</div>
                                    </div>
                                    ) :
                                    (<div className='text-gray-700 flex flex-col gap-2 p-4'>
                                        <Link href={'/about_us'} className='hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400'>About</Link>
                                        <Link href={'/login'} className="hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400">
                                            Login
                                        </Link>
                                        <Link href={'/signup'} className="hover:bg-gray-100 p-2 rounded cursor-pointer border border-gray-400">
                                            Signup
                                        </Link>
                                    </div>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* filters */}
            <div className='flex flex-wrap gap-2 items-center justify-center mt-4'>
                {/* By search of title and discription */}
                <div className='flex flex-wrap gap-2 items-center'>
                    <h1 className='text-black font-semibold'>Search:</h1>
                    <input
                        type="text"
                        placeholder="Search by title or description"
                        className='border lg:w-2xl sm:w-1md p-2 rounded text-gray-600 bg-amber-50'
                        onChange={(e) => {
                            const searchValue = e.target.value.toLowerCase();
                            setTasks(
                                allTasks.filter((task: Task) =>
                                    task.title.toLowerCase().includes(searchValue) ||
                                    task.description.toLowerCase().includes(searchValue)
                                )
                            );
                        }}
                    />
                </div>

                {/* By status */}
                <div className='flex gap-2 items-center'>
                    <h1 className='text-black font-semibold'>Filter by:</h1>
                    <select className='border p-2 rounded text-gray-600 bg-amber-50' onChange={(e) => {
                        const filterValue = e.target.value;
                        if (filterValue === 'all') {
                            setTasks(allTasks); // reset to full list
                            // fetchTasks();
                        } else {
                            setTasks(
                                allTasks.filter((task: Task) =>
                                    task.status.toLowerCase() === filterValue.toLowerCase()
                                )
                            );
                        }
                    }}>
                        <option value="all">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

            </div>

            {/* content to show on basis of login */}
            {isLoggedIn ? (
                <div className="bg-white max-w-[500px] mt-10 p-4 shadow rounded-3xl mx-1.5 mb-6 text-center">
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
                        value={newTask.taskfor}
                        onChange={(e) => setNewTask({ ...newTask, taskfor: e.target.value })}
                    >
                        <option value="" disabled >Select Task For</option>
                        {users.map((user: User) => (
                            <option key={user._id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>

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

                    <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-xl hover:shadow-[1px_7px_4px_rgba(0,0,0,0.2)] transition-all  duration-150 active:translate-y-1 active:shadow-inner"
                        // style={{ boxShadow: ' 9px 5px 4px rgba(0,0,0, 0.4)' }}
                        onClick={createTask}>
                        Create Task
                    </button>
                </div>) : (
                <div className="mt-10 ">
                </div>
            )}

            {/* tasks */}
            <h1 className="text-gray-500 font-semibold text-2xl mb-4">Tasks</h1>
            {tasks.length > 0 ? (
                <div className="mb-4 flex flex-wrap justify-center gap-4">
                    {tasks.map((task: Task) => (
                        <div
                            key={task._id}
                            className="w-[300px] h-[300px] flex flex-col justify-between p-4 rounded-3xl shadow bg-amber-50 border border-gray-300"
                            // style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fh260/background/20221226/pngtree-korean-japanese-style-small-fresh-and-pure-wedding-wedding-engagement-invitation-image_1495144.jpg)' }}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    {/* <div className='flex justify-between'> */}
                                        <h2 className='text-sm font-extralight text-gray-600 '>
                                            Assigned by: {task.assignedBy || 'Nobody'}
                                        </h2>
                                        <h2 className="text-sm font-extralight text-gray-600 ">
                                            Assigned to: {task.taskfor || 'Nobody'}
                                        </h2>
                                    {/* </div> */}
                                    <h3 className="text-md font-extralight text-black max-h-10 overflow-auto">
                                        Task: {task.title}
                                    </h3>
                                </div>
                                {isLoggedIn && (
                                    <div className="flex gap-2 bg-amber-100 p-1 rounded-2xl border border-gray-200">
                                        <Link
                                            href={`/tasks/${task._id}`}
                                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                                        >
                                            <EditIcon style={{ color: 'gray' }} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                                        >
                                            <DeleteIcon style={{ color: 'salmon' }} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="overflow-auto bg-white text-gray-800 text-sm h-40 border border-gray-500 mt-1.5 p-1.5 rounded-2xl">
                                {task.description}
                            </p>

                            <p className="text-sm text-gray-900 mt-2 flex gap-2 flex-wrap">
                                <span className="bg-gray-300 p-1 rounded-lg">
                                    Due: {task.dueDate?.substring(0, 10)}
                                </span>{' '}
                                |{' '}
                                <span className="bg-gray-300 p-1 rounded-lg">
                                    Priority: {task.priority}
                                </span>{' '}
                                |{' '}
                                <span className="bg-gray-300 p-1 rounded-lg">
                                    Status:{' '}
                                    <span
                                        className={`${task.status === 'Pending'
                                            ? 'text-red-600'
                                            : task.status === 'In Progress'
                                                ? 'text-blue-600'
                                                : task.status === 'Completed'
                                                    ? 'text-green-600'
                                                    : 'text-gray-900'
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-4">No tasks assigned.</p>
            )}

        </div>
    );
}
