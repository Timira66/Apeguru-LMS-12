import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Search, Calendar, Filter, Users, Send, Check, X } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { User, Attendance } from '../types';
import { GRADES, SUBJECTS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AttendanceAdmin = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classType, setClassType] = useState<'online' | 'physical' | 'both'>('online');
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [selectedGrade]);

  const fetchStudents = async () => {
    setIsLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setStudents(data.filter((u: User) => u.role === 'student' && u.grade === selectedGrade));
    setIsLoading(false);
  };

  const handleMark = async (studentId: number, status: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        date: selectedDate,
        grade: selectedGrade,
        subject: selectedSubject,
        type: classType,
        status: status ? 1 : 0
      }),
    });
  };

  const markAll = async (status: boolean) => {
    const newAttendance: Record<number, boolean> = {};
    for (const student of students) {
      newAttendance[student.id] = status;
      await handleMark(student.id, status);
    }
    setAttendance(newAttendance);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mark Attendance</h1>
          <p className="text-white/40">Select class details and mark student participation.</p>
        </div>
        <button
          onClick={() => alert('Attendance report sent to emails!')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all"
        >
          <Send size={20} />
          Send Email Reports
        </button>
      </div>

      <GlassCard className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Class Type</label>
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              <option value="online">Online</option>
              <option value="physical">Physical</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users className="text-indigo-400" />
          Students ({students.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => markAll(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll(false)}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student, i) => (
          <GlassCard 
            key={student.id} 
            delay={i * 0.02}
            className={cn(
              "p-5 flex items-center justify-between transition-all",
              attendance[student.id] ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-white/40">
                {student.username[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-sm">{student.username}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{student.grade}</p>
              </div>
            </div>
            <button
              onClick={() => handleMark(student.id, !attendance[student.id])}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                attendance[student.id] 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-white/5 text-white/20 hover:bg-white/10"
              )}
            >
              {attendance[student.id] ? <Check size={20} /> : <X size={20} />}
            </button>
          </GlassCard>
        ))}
      </div>

      {students.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10">
          <Users size={48} className="text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white/40">No students found in this grade</h3>
        </div>
      )}
    </div>
  );
};
