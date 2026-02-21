import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Play, Video, FileText, Music, Link as LinkIcon, Search, Filter, X } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Content, ContentType } from '../types';
import { GRADES, SUBJECTS, CATEGORIES } from '../constants';

export const ContentManagement = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [newContent, setNewContent] = useState({
    type: 'youtube' as ContentType,
    title: '',
    url: '',
    category: CATEGORIES[0],
    grade: GRADES[0],
    subject: SUBJECTS[0],
    timer: 0
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch('/api/content');
    const data = await res.json();
    setContent(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent),
    });
    if (res.ok) {
      setIsAdding(false);
      setNewContent({ type: 'youtube', title: '', url: '', category: CATEGORIES[0], grade: GRADES[0], subject: SUBJECTS[0], timer: 0 });
      fetchContent();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      fetchContent();
    }
  };

  const filteredContent = content.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-white/40">Add and manage videos, forms, PDFs, and other materials.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all"
        >
          <Plus size={20} />
          Add New Content
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Search content by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredContent.map((item, i) => (
          <GlassCard key={item.id} delay={i * 0.02} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                  {item.type === 'youtube' && <Play size={20} />}
                  {item.type === 'zoom' && <Video size={20} />}
                  {item.type === 'form' && <FileText size={20} />}
                  {item.type === 'pdf' && <FileText size={20} />}
                  {item.type === 'audio' && <Music size={20} />}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-xs text-white/40">{item.subject} • {item.grade} • {item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/60">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all text-red-400/60 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <GlassCard className="w-full max-w-2xl p-8 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add New Content</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Content Type</label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as ContentType })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="zoom">Zoom Meeting</option>
                    <option value="form">Google Form</option>
                    <option value="pdf">Google Drive PDF</option>
                    <option value="audio">Google Drive Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                  <select
                    value={newContent.category}
                    onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">URL / Link</label>
                <input
                  type="url"
                  required
                  value={newContent.url}
                  onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Grade</label>
                  <select
                    value={newContent.grade}
                    onChange={(e) => setNewContent({ ...newContent, grade: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
                  <select
                    value={newContent.subject}
                    onChange={(e) => setNewContent({ ...newContent, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {newContent.type === 'form' && (
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Timer (Minutes, 10 - 140)</label>
                  <input
                    type="number"
                    min="10"
                    max="140"
                    value={newContent.timer}
                    onChange={(e) => setNewContent({ ...newContent, timer: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

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
                  Add Content
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
