import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, Play, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 3 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 2.5 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-white/40">Here's what's happening with your learning today.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <GlassCard className="px-6 py-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Study Time</p>
              <p className="text-xl font-bold">12.5 hrs</p>
            </div>
          </GlassCard>
          <GlassCard className="px-6 py-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Completed</p>
              <p className="text-xl font-bold">85%</p>
            </div>
          </GlassCard>
          <GlassCard className="px-6 py-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Rank</p>
              <p className="text-xl font-bold">#12</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Learning Activity</h3>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-xl font-bold mb-8">Upcoming Events</h3>
          <div className="space-y-6">
            {[
              { title: 'Physics Q&A', time: '10:30 AM', date: '22', month: 'FEB', color: 'indigo' },
              { title: 'Math Quiz', time: '02:00 PM', date: '24', month: 'FEB', color: 'emerald' },
              { title: 'History Lecture', time: '09:00 AM', date: '25', month: 'FEB', color: 'amber' },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-white/30 transition-all`}>
                  <span className={`text-[10px] font-bold text-${event.color}-400`}>{event.month}</span>
                  <span className="text-lg font-bold leading-none">{event.date}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                  <p className="text-xs text-white/40 mt-1">{event.time}</p>
                  <button className="mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300">Join Now</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
            View Calendar
          </button>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Continue Learning</h3>
            <button className="text-indigo-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                <div className="w-32 h-20 rounded-xl bg-white/10 overflow-hidden relative">
                  <img src={`https://picsum.photos/seed/${i + 10}/300/200`} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">Advanced Mathematics - Calculus Part {i}</h4>
                  <p className="text-xs text-white/40 mb-3">Grade 11 • Mathematics</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${40 + i * 15}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white/60">{40 + i * 15}%</span>
                  </div>
                </div>
                <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
          <div className="flex-1 space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-indigo-300">Course Progress</span>
                <span className="text-2xl font-bold">78%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-indigo-500" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-purple-300">Test Average</span>
                <span className="text-2xl font-bold">92%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-purple-500" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-emerald-300">Attendance</span>
                <span className="text-2xl font-bold">98%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
