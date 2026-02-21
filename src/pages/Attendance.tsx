import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Calendar, Clock, Filter, BarChart3 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { Attendance } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export const AttendancePage = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    const res = await fetch('/api/attendance');
    const data = await res.json();
    setAttendance(data.filter((a: Attendance) => a.student_id === user?.id));
    setIsLoading(false);
  };

  const stats = [
    { label: 'Total Classes', value: attendance.length, color: 'indigo' },
    { label: 'Present', value: attendance.filter(a => a.status === 1).length, color: 'emerald' },
    { label: 'Absent', value: attendance.filter(a => a.status === 0).length, color: 'red' },
    { label: 'Percentage', value: attendance.length ? `${Math.round((attendance.filter(a => a.status === 1).length / attendance.length) * 100)}%` : '0%', color: 'amber' },
  ];

  const chartData = [
    { name: 'Present', value: attendance.filter(a => a.status === 1).length },
    { name: 'Absent', value: attendance.filter(a => a.status === 0).length },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Attendance</h1>
          <p className="text-white/40">Track your class participation and consistency.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} delay={i * 0.05} className="p-6">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <h3 className="text-xl font-bold mb-8">Attendance History</h3>
          <div className="space-y-4">
            {attendance.length === 0 && !isLoading && (
              <div className="text-center py-12 text-white/20">
                <Calendar size={48} className="mx-auto mb-4" />
                <p>No attendance records found yet.</p>
              </div>
            )}
            {attendance.map((record, i) => (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                    record.status === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {record.status === 1 ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{record.subject}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{record.date} • {record.type}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  record.status === 1 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                )}>
                  {record.status === 1 ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-xl font-bold mb-8">Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
