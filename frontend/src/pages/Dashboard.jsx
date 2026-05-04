import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const statusColor = { TODO: 'bg-yellow-500', IN_PROGRESS: 'bg-blue-500', DONE: 'bg-green-500' };
const priorityColor = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-red-400' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/tasks/dashboard').then(r => setStats(r.data)); }, []);

  if (!stats) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Total Tasks', value: stats.totalTasks, color: 'bg-gray-800' },
            { label: 'My Tasks', value: stats.myTasks, color: 'bg-indigo-900/50' },
            { label: 'Overdue', value: stats.overdue, color: 'bg-red-900/50' },
            { label: 'Todo', value: stats.todo, color: 'bg-yellow-900/50' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-900/50' },
            { label: 'Done', value: stats.done, color: 'bg-green-900/50' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border border-gray-700 rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-gray-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {stats.recentTasks.map(task => (
            <div key={task.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{task.project?.name} {task.assignedTo && `• ${task.assignedTo.name}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${priorityColor[task.priority]}`}>{task.priority}</span>
                <span className={`${statusColor[task.status]} text-white text-xs px-2 py-0.5 rounded-full`}>{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
