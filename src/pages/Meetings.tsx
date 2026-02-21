import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { Video, Calendar, Clock, ExternalLink, Plus, Trash2, Edit2, Users } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { Content } from '../types';
import { GRADES, SUBJECTS } from '../constants';

export const Meetings = () => {
  const { user } = useContext(AuthContext);
  const [meetings, setMeetings] = useState<Content[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    url: '',
    grade: GRADES[0],
    subject: SUBJECTS[0],
    category: 'Meetings'
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const res = await fetch('/api/content');
    const data = await res.json();
    setMeetings(data.filter((c: Content) => c.type === 'zoom'));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newMeeting, type: 'zoom' }),
    });
    if (res.ok) {
      setIsAdding(false);
      setNewMeeting({ title: '', url: '', grade: GRADES[0], subject: SUBJECTS[0], category: 'Meetings' });
      fetchMeetings();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      fetchMeetings();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Live Meetings</h1>
          <p className="text-white/40">Join your live classes and interactive sessions via Zoom.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all"
          >
            <Plus size={20} />
            Schedule Meeting
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meetings.map((meeting, i) => (
          <GlassCard key={meeting.id} delay={i * 0.1} className="p-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-all" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                <Video size={28} />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {meeting.subject}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{meeting.title}</h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Users size={14} />
                <span>{meeting.grade}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar size={14} />
                <span>Scheduled for Today</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={meeting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
              >
                Join Now
                <ExternalLink size={16} />
              </a>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all text-red-400/60 hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[48px] border border-white/10">
          <Video size={64} className="text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white/40">No meetings scheduled</h3>
          <p className="text-white/20 mt-2">Check back later for upcoming live sessions.</p>
        </div>
      )}

      {/* Add Meeting Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <GlassCard className="w-full max-w-lg p-8 relative z-10">
            <h2 className="text-2xl font-bold mb-8">Schedule New Meeting</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Zoom Link</label>
                <input
                  type="url"
                  required
                  value={newMeeting.url}
                  onChange={(e) => setNewMeeting({ ...newMeeting, url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Grade</label>
                  <select
                    value={newMeeting.grade}
                    onChange={(e) => setNewMeeting({ ...newMeeting, grade: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
                  <select
                    value={newMeeting.subject}
                    onChange={(e) => setNewMeeting({ ...newMeeting, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
                  className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-xl transition-all"
                >
                  Schedule
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
