'use client';

import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './components/AuthButton';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // ✅ Correct for App Router

export default function Home() {
  const { data: session } = useSession();
const router = useRouter();

  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [newJob, setNewJob] = useState({
    position: '',
    company: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    notes: '',
    salary: '',
    location: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search for:', search);
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || 'Failed to add job');
      }

      toast.success('Job added successfully!');
    router.push('/dashboard'); 

      setNewJob({
        position: '',
        company: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        notes: '',
        salary: '',
        location: '',
      });
    } catch (error) {
      console.error('Error adding job:', error.message);
      toast.error('Failed to add job');
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] p-4 sm:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="Next.js Logo" width={100} height={24} className="dark:invert" />
          <span className="text-xl font-semibold">JobPulse</span>
        </div>
        <AuthButton />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center sm:items-start gap-10 w-full">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to <span className="text-blue-600">JobPulse</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl text-center sm:text-left">
          Track your job applications, stay organized, and gain insights with visual job search analytics.
        </p>

        {session && (
          <div className="w-full max-w-2xl grid gap-8">
            {/* 🔍 SEARCH */}
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">🔍 Search Your Jobs</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search job titles or companies..."
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Search
                </button>
              </form>
            </div>

            {/* ➕ ADD JOB */}
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">➕ Add New Job</h2>
              <form onSubmit={handleAddJob} className="grid gap-4">
                <input
                  type="text"
                  placeholder="Job Position"
                  value={newJob.position}
                  onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <select
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <input
                  type="date"
                  value={newJob.dateApplied}
                  onChange={(e) => setNewJob({ ...newJob, dateApplied: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />

                {/* Expandable Section */}
                {showMore && (
                  <>
                    <textarea
                      placeholder="Notes"
                      value={newJob.notes}
                      onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Salary (optional)"
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className="text-sm text-blue-600 hover:underline self-start"
                >
                  {showMore ? 'Hide optional fields' : 'Add more details'}
                </button>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add Job
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LINKS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {session && (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          )}
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
