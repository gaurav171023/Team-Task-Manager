import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const statusColors = { TODO: 'bg-yellow-500', IN_PROGRESS: 'bg-blue-500', DONE: 'bg-green-500' };
const priorityColors = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-red-400' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const fetchProject = () => api.get(`/projects/${id}`).then(r => setProject(r.data));
  useEffect(() => { fetchProject(); api.get('/users').then(r => setUsers(r.data)); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    try { await api.post('/tasks', { ...taskForm, projectId: id }); setShowTaskForm(false); setTaskForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedToId: '' }); fetchProject(); }
    catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  const updateTaskStatus = async (taskId, status) => {
    try { await api.put(`/tasks/${taskId}`, { status }); fetchProject(); }
    catch {}
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${taskId}`); fetchProject(); } catch {}
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return alert('Select a user');
    try { 
      await api.post(`/projects/${id}/members`, { userId: parseInt(selectedMemberId) }); 
      setSelectedMemberId(''); 
      fetchProject(); 
    } catch (err) { alert(err.response?.data?.error || 'Error adding member'); }
  };

  const removeMember = async (memberId) => {
    if (!confirm('Remove this member?')) return;
    try { 
      await api.delete(`/projects/${id}/members/${memberId}`); 
      fetchProject(); 
    } catch (err) { alert(err.response?.data?.error || 'Error removing member'); }
  };

  if (!project) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {isAdmin && <button onClick={() => setShowTaskForm(!showTaskForm)} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition">+ Add Task</button>}
        </div>
        {project.description && <p className="text-gray-400 mb-6">{project.description}</p>}

        {showTaskForm && (
          <form onSubmit={createTask} className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
            <h2 className="text-lg font-semibold col-span-2">New Task</h2>
            <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required placeholder="Task title" className="col-span-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
            <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} placeholder="Description" className="col-span-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" rows={2} />
            <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
            <select value={taskForm.assignedToId} onChange={e => setTaskForm({...taskForm, assignedToId: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
              <option value="">Unassigned</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition">Create Task</button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-white text-sm transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
            <div key={status} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${statusColors[status]}`}></span>
                <span className="font-semibold text-sm">{status.replace('_', ' ')}</span>
                <span className="text-gray-500 text-xs ml-auto">{project.tasks.filter(t => t.status === status).length}</span>
              </div>
              <div className="space-y-3">
                {project.tasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-gray-800 rounded-lg p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      {isAdmin && <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>}
                    </div>
                    {task.assignedTo && <p className="text-gray-500 text-xs mt-1">👤 {task.assignedTo.name}</p>}
                    {task.dueDate && <p className={`text-xs mt-1 ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-400' : 'text-gray-500'}`}>📅 {new Date(task.dueDate).toLocaleDateString()}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span>
                      {status !== 'DONE' && isAdmin && (
                        <button onClick={() => updateTaskStatus(task.id, status === 'TODO' ? 'IN_PROGRESS' : 'DONE')} className="text-xs text-indigo-400 hover:text-indigo-300 ml-auto transition">
                          {status === 'TODO' ? '→ Start' : '→ Done'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Team Members ({project.members.length})</h2>
          
          {isAdmin && (
            <form onSubmit={addMember} className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 flex gap-3">
              <select 
                value={selectedMemberId} 
                onChange={e => setSelectedMemberId(e.target.value)} 
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a user to add...</option>
                {users.filter(u => !project.members.some(m => m.userId === u.id)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition">Add Member</button>
            </form>
          )}

          <div className="flex flex-wrap gap-3">
            {project.members.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm flex items-center gap-3">
                <div>
                  <span className="font-medium">{m.user.name}</span>
                  <span className="text-gray-500 ml-2">{m.user.email}</span>
                  <span className="bg-indigo-900 text-indigo-300 text-xs px-2 py-0.5 rounded-full ml-2">{m.role}</span>
                </div>
                {isAdmin && m.userId !== user?.id && (
                  <button 
                    onClick={() => removeMember(m.id)} 
                    className="text-gray-500 hover:text-red-400 text-sm transition ml-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
