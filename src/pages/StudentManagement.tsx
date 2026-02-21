import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Search, Shield, ShieldOff, Edit, Trash2, Check, X } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { User } from '../types';
import { GRADES, SUBJECTS } from '../constants';

export const StudentManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    grade: GRADES[0],
    subjects: [] as string[],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.filter((u: User) => u.role === 'student'));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser, role: 'student' }),
    });
    if (res.ok) {
      setIsAdding(false);
      setNewUser({ username: '', password: '', grade: GRADES[0], subjects: [] });
      fetchUsers();
    } else {
      alert('Error adding user');
    }
  };

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Student Management</h1>
          <p className="text-white/40">Manage student accounts, grades, and access permissions.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all"
        >
          <UserPlus size={20} />
          Add New Student
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Search students by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user, i) => (
          <GlassCard key={user.id} delay={i * 0.05} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold">{user.username[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user.username}</h3>
                  <p className="text-sm text-white/40">{user.grade} • {user.status}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toggleStatus(user)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    user.status === 'active' ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  )}
                >
                  {user.status === 'active' ? <ShieldOff size={14} /> : <Shield size={14} />}
                  {user.status === 'active' ? 'Block Student' : 'Unblock Student'}
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/60">
                  <Edit size={16} />
                </button>
                <button className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all text-red-400/60 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Student Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          />
          <GlassCard className="w-full max-w-2xl p-8 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add New Student</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Grade</label>
                <select
                  value={newUser.grade}
                  onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Subjects</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUBJECTS.map(s => (
                    <label key={s} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                      <input
                        type="checkbox"
                        checked={newUser.subjects.includes(s)}
                        onChange={(e) => {
                          const subjects = e.target.checked 
                            ? [...newUser.subjects, s]
                            : newUser.subjects.filter(sub => sub !== s);
                          setNewUser({ ...newUser, subjects });
                        }}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-xl transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
