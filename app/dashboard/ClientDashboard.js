'use client';
import { useEffect, useState } from 'react';

export default function ClientDashboard({ session }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  async function fetchApplications() {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.error("Unexpected response:", data);
        setApplications([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]); // fallback on fetch error
    } finally {
      setLoading(false);
    }
  }

  fetchApplications();
}, []);


  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p>Welcome, {session.user?.name}!</p>
      </div>

      <div className="p-6 sm:p-12">
        <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
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
