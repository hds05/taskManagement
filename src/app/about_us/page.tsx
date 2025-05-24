'use client';

import React from 'react';

export default function AboutPage() {
    return (
        <main className="px-6 py-12 text-gray-800 bg-cover bg-repeat" style={{ backgroundImage: "url('https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg')" }}>
            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-md max-w-3xl mx-auto'>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8 text-center text-black">
                    About Us
                </h1>


                <section className="space-y-8">
                    <p className="text-sm sm:text-lg leading-relaxed">
                        Welcome to <span className="font-semibold text-black">TaskFlow</span> —
                        a powerful yet simple task assigning platform designed to make teamwork
                        smooth, transparent, and efficient. Whether you’re managing a small team
                        or coordinating across departments, our platform helps you assign, track,
                        and manage tasks effortlessly.
                    </p>

                    <div>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-black">
                            Why We Built This
                        </h2>
                        <p className="text-sm sm:text-lg leading-relaxed">
                            We noticed that many teams struggle with miscommunication, missed
                            deadlines, and unclear responsibilities. Traditional tools like
                            spreadsheets and email threads are inefficient. That’s why we built
                            TaskFlow — to provide a centralized, easy-to-use task management solution.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-black">
                            Who It's For
                        </h2>
                        <p className="text-sm sm:text-lg leading-relaxed">
                            TaskFlow is perfect for project managers, HR departments, team leads,
                            startups, and anyone who needs a structured way to assign and track tasks
                            in real time.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-black">
                            Key Features
                        </h2>
                        <ul className="text-xs sm:text-lg list-disc list-inside space-y-2">
                            <li>Quick and easy task creation and assignment</li>
                            <li>Real-time updates and progress tracking</li>
                            <li>Team overview dashboard</li>
                            <li>Clean, mobile-friendly UI</li>
                            <li>Reminders and deadline notifications</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-black">
                            Our Vision
                        </h2>
                        <p className="text-sm sm:text-lg leading-relaxed">
                            We believe effective collaboration starts with clear communication and
                            organization. Our mission is to empower teams with tools that keep
                            everyone aligned, accountable, and productive — no matter where they work
                            from.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}


