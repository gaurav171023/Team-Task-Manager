import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const fetchProjects = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/projects', form); setShowForm(false); setForm({ name: '', description: '' }); fetchProjects(); }
    catch (err) { alert(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition">+ New Project</button>
        </div>
        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8 space-y-4">
            <h2 className="text-lg font-semibold">Create Project</h2>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Project name" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description (optional)" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" rows={3} />
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm transition">Cancel</button>
            </div>
          </form>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} onClick={() => nav(`/projects/${project.id}`)} className="bg-gray-900 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-indigo-500 transition group">
              <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition">{project.name}</h3>
              {project.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>👥 {project.members?.length || 0} members</span>
                <span>✅ {project._count?.tasks || 0} tasks</span>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-gray-500 col-span-3">No projects yet. Create one!</p>}
        </div>
      </div>
    </div>
  );
}
