'use client';

import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import toast, { Toaster } from 'react-hot-toast';

const fetcher = url => fetch(url).then(res => res.json());

export default function ClientDashboard({ session }) {
  const { mutate } = useSWRConfig();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('dateApplied');
  const [order, setOrder] = useState('desc');

  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    position: '',
    company: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
  });

  // Construct query string
  const queryParams = new URLSearchParams({
    ...(search && { company: search }),
    ...(status && { status }),
    sortBy,
    order,
  }).toString();

  const {
    data: applications = [],
    error,
    isLoading,
  } = useSWR(`/api/applications?${queryParams}`, fetcher);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Failed to add job');
      }

      toast.success('Job added!');
      setNewJob({
        position: '',
        company: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);

      mutate(`/api/applications?${queryParams}`); // 🔁 Re-fetch data
    } catch (error) {
      toast.error('Error adding job');
      console.error('Error adding job:', error.message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p>Welcome, {session?.user?.name || 'Guest'}!</p>
      </div>

      <div className="p-6 sm:p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? 'Cancel' : '➕ Add Job'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddJob} className="grid gap-4 mb-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <input
              type="text"
              placeholder="Job Position"
              value={newJob.position}
              onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              value={newJob.status}
              onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="date"
              value={newJob.dateApplied}
              onChange={(e) => setNewJob({ ...newJob, dateApplied: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit Job
            </button>
          </form>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border border-gray-300 text-white bg-gray-600 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 text-white bg-gray-600 rounded-md"
          >
            <option value="dateApplied">Date Applied</option>
            <option value="company">Company</option>
            <option value="position">Position</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="p-2 border border-gray-300 text-white bg-gray-600 rounded-md"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load applications.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">{app.company}</td>
                    <td className="px-4 py-2">{app.position}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded-full ${
                          app.status === 'Interview'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'Applied'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Offer'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
