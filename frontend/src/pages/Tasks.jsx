import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const statusColors = { TODO: 'bg-yellow-500', IN_PROGRESS: 'bg-blue-500', DONE: 'bg-green-500' };
const priorityColors = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-red-400' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: '', projectId: '' });
  const [projects, setProjects] = useState([]);

  const fetchTasks = () => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.projectId) params.set('projectId', filter.projectId);
    api.get(`/tasks?${params.toString()}`).then(r => setTasks(r.data));
  };

  useEffect(() => { api.get('/projects').then(r => setProjects(r.data)); }, []);
  useEffect(() => { fetchTasks(); }, [filter]);

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">All Tasks</h1>
        <div className="flex gap-4 mb-6">
          <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none">
            <option value="">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <select value={filter.projectId} onChange={e => setFilter({...filter, projectId: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none">
            <option value="">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {tasks.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE';
            return (
              <div key={task.id} className={`bg-gray-900 border ${isOverdue ? 'border-red-700' : 'border-gray-700'} rounded-xl p-4 flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{task.title}</p>
                    {isOverdue && <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full">OVERDUE</span>}
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {task.project?.name}
                    {task.assignedTo && ` • ${task.assignedTo.name}`}
                    {task.dueDate && ` • Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span>
                  <span className={`${statusColors[task.status]} text-white text-xs px-2 py-0.5 rounded-full`}>{task.status.replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
        </div>
      </div>
    </div>
  );
}
