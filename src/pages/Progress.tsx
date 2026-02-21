import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Award, Clock, Brain, Sparkles, ChevronRight, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { TestResult, Attendance } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

export const Progress = () => {
  const { user } = useContext(AuthContext);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // In a real app, these would be filtered by user.id on the server
    const [resTests, resAttendance] = await Promise.all([
      fetch('/api/tests'), // This would actually be test-results
      fetch('/api/attendance')
    ]);
    // Mocking data for now as we don't have a full test-results endpoint yet
    setTestResults([]); 
    setAttendance([]);
  };

  const analyzeProgress = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my progress. I am in ${user?.grade}. I have completed several tests and attended most classes. Give me a detailed educational progress report daily, weekly, monthly, quarterly and annually.`,
          history: []
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = [
    { name: 'Jan', score: 65 },
    { name: 'Feb', score: 78 },
    { name: 'Mar', score: 82 },
    { name: 'Apr', score: 75 },
    { name: 'May', score: 90 },
    { name: 'Jun', score: 88 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Progress</h1>
          <p className="text-white/40">AI-powered analysis of your academic performance.</p>
        </div>
        <button
          onClick={analyzeProgress}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <Sparkles className="animate-spin" size={20} /> : <Brain size={20} />}
          {isAnalyzing ? 'Analyzing...' : 'Generate AI Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <h3 className="text-xl font-bold mb-8">Performance Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold mb-6">Achievements</h3>
            <div className="space-y-4">
              {[
                { title: 'Top Performer', desc: 'Ranked #1 in Math Quiz', icon: Award, color: 'amber' },
                { title: 'Perfect Attendance', desc: '100% attendance in Feb', icon: CheckCircle, color: 'emerald' },
                { title: 'Fast Learner', desc: 'Completed 5 lessons today', icon: TrendingUp, color: 'indigo' },
              ].map((ach, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className={`w-12 h-12 rounded-xl bg-${ach.color}-500/20 flex items-center justify-center text-${ach.color}-400`}>
                    <ach.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{ach.title}</h4>
                    <p className="text-[10px] text-white/40">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-xl font-bold mb-6">Subject Mastery</h3>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', progress: 85 },
                { subject: 'Science', progress: 72 },
                { subject: 'History', progress: 94 },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>{s.subject}</span>
                    <span className="text-white/40">{s.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {aiAnalysis && (
        <GlassCard className="p-10 border-indigo-500/30 bg-indigo-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ape Guru AI Analysis</h2>
              <p className="text-white/40 text-sm">Personalized insights based on your recent activity.</p>
            </div>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {aiAnalysis}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
