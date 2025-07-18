'use client';
import { useEffect, useState } from 'react';

export default function ClientDashboard({ session }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('dateApplied');
  const [order, setOrder] = useState('desc');

useEffect(() => {
  async function fetchApplications() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('company', search); // ✅ updated line
      if (status) params.append('status', status);
      params.append('sortBy', sortBy);
      params.append('order', order);

      const res = await fetch(`/api/applications?${params.toString()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.error("Unexpected response:", data);
        setApplications([]);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  fetchApplications();
}, [search, status, sortBy, order]);

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p>Welcome, {session.user?.name}!</p>
      </div>

      <div className="p-6 sm:p-12">
        <h1 className="text-2xl font-bold mb-6">Job Applications</h1>

        {/* 🔍 Filters & Controls */}
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

        {loading ? (
          <p>Loading...</p>
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
