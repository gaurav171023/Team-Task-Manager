import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-white font-bold text-xl tracking-tight">⚡ TaskFlow</Link>
        <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition">Dashboard</Link>
        <Link to="/projects" className="text-gray-400 hover:text-white text-sm transition">Projects</Link>
        <Link to="/tasks" className="text-gray-400 hover:text-white text-sm transition">Tasks</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">{user?.name} <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{user?.role}</span></span>
        <button onClick={() => { logout(); nav('/login'); }} className="text-gray-400 hover:text-red-400 text-sm transition">Logout</button>
      </div>
    </nav>
  );
}
