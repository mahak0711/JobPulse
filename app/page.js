'use client';

import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './components/AuthButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const {data:session}=useSession();
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] p-8 sm:p-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="Next.js Logo" width={100} height={24} className="dark:invert" />
          <span className="text-xl font-semibold">JobPulse</span>
        </div>
      
    <AuthButton/>
        
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center sm:items-start gap-8">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to <span className="text-blue-600">JobPulse</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl text-center sm:text-left">
          Track your job applications, stay organized, and gain insights with visual job search analytics. 
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
         {session &&( <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-700"
          >
            View Dashboard
          </Link>)}
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            GitHub Repo
          </a>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} JobPulse 
      </footer>
    </div>
  );
}
