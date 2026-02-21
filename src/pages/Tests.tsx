import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Timer, 
  Award,
  BarChart3,
  ChevronLeft,
  X,
  Image as ImageIcon,
  Music,
  Send
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { OnlineTest, Question, TestResult } from '../types';
import { GRADES, SUBJECTS, CATEGORIES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Tests = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState<OnlineTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<OnlineTest | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetchTests();
    if (user) fetchResults();
  }, [user]);

  const fetchTests = async () => {
    const res = await fetch('/api/tests');
    const data = await res.json();
    setTests(data.map((t: any) => ({ ...t, questions: JSON.parse(t.questions) })));
  };

  const fetchResults = async () => {
    // In a real app, we'd have an endpoint for this
    // For now, we'll just fetch all and filter client-side or assume an endpoint exists
  };

  if (isCreating && user?.role === 'admin') {
    return <TestAdmin onBack={() => { setIsCreating(false); fetchTests(); }} />;
  }

  if (selectedTest) {
    return <TestTaking test={selectedTest} onBack={() => setSelectedTest(null)} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Online Tests</h1>
          <p className="text-white/40">Assess your knowledge and track your ranking.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all"
          >
            <Plus size={20} />
            Create New Test
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, i) => (
          <GlassCard key={test.id} delay={i * 0.05} onClick={() => setSelectedTest(test)} className="p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText size={24} />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {test.subject}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{test.title}</h3>
            <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
              <span className="flex items-center gap-1"><Clock size={14} /> {test.duration} mins</span>
              <span className="flex items-center gap-1"><Award size={14} /> {test.questions.length} Questions</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{test.grade}</span>
              <button className="text-sm font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Start Test <ChevronRight size={16} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const TestTaking = ({ test, onBack }: { test: OnlineTest, onBack: () => void }) => {
  const { user } = useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    let score = 0;
    test.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const res = await fetch('/api/test-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: user?.id,
        test_id: test.id,
        score,
        answers
      }),
    });
    const data = await res.json();
    setResult({ score, rank: data.rank });
  };

  if (isSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <GlassCard className="p-12 text-center">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Award size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-4xl font-bold mb-2">Test Completed!</h2>
          <p className="text-white/40 mb-12">Great job! Here are your results.</p>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Your Score</p>
              <p className="text-4xl font-bold text-indigo-400">{result.score}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Your Rank</p>
              <p className="text-4xl font-bold text-amber-400">#{result.rank}</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-xl transition-all"
          >
            Back to Tests
          </button>
        </GlassCard>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronLeft size={20} /></button>
          <div>
            <h2 className="font-bold">{test.title}</h2>
            <p className="text-xs text-white/40">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-2xl border font-mono font-bold text-xl",
          timeLeft < 60 ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-white/5 border-white/10 text-white"
        )}>
          <Timer size={24} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <GlassCard className="p-10">
        <div className="space-y-8">
          {currentQuestion.image && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white/5">
              <img src={currentQuestion.image} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          {currentQuestion.audio && (
            <div className="p-6 bg-white/5 rounded-2xl flex items-center gap-4">
              <Music size={24} className="text-indigo-400" />
              <audio controls className="flex-1">
                <source src={currentQuestion.audio} type="audio/mpeg" />
              </audio>
            </div>
          )}
          
          <h3 className="text-2xl font-bold leading-relaxed">{currentQuestion.text}</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [currentQuestion.id]: i })}
                className={cn(
                  "flex items-center justify-between p-6 rounded-2xl border transition-all text-left group",
                  answers[currentQuestion.id] === i 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" 
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <span className="text-lg font-medium">{option}</span>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  answers[currentQuestion.id] === i ? "border-white bg-white" : "border-white/20"
                )}>
                  {answers[currentQuestion.id] === i && <CheckCircle size={14} className="text-indigo-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold disabled:opacity-20 transition-all hover:bg-white/10"
        >
          Previous
        </button>
        {currentQuestionIndex === test.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-12 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-xl transition-all"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="px-12 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-xl transition-all"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

const TestAdmin = ({ onBack }: { onBack: () => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [grade, setGrade] = useState(GRADES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    };
    setQuestions([...questions, newQ]);
  };

  const handleSave = async () => {
    const res = await fetch('/api/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, category, grade, subject, duration, questions,
        schedule: new Date().toISOString()
      }),
    });
    if (res.ok) onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span className="font-bold">Back to Tests</span>
        </button>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all"
        >
          Save Test
        </button>
      </div>

      <GlassCard className="p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Test Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/60 mb-2">Test Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Mid-term Mathematics Exam"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Duration (Minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Questions ({questions.length})</h2>
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold transition-all"
          >
            <Plus size={20} />
            Add Question
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <GlassCard key={q.id} className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-indigo-400">Question {qIndex + 1}</h3>
              <button 
                onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                className="text-red-400/60 hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Question Text</label>
              <textarea
                value={q.text}
                onChange={(e) => {
                  const newQs = [...questions];
                  newQs[qIndex].text = e.target.value;
                  setQuestions(newQs);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctAnswer === oIndex}
                    onChange={() => {
                      const newQs = [...questions];
                      newQs[qIndex].correctAnswer = oIndex;
                      setQuestions(newQs);
                    }}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newQs = [...questions];
                      newQs[qIndex].options[oIndex] = e.target.value;
                      setQuestions(newQs);
                    }}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/60 mb-2">Image URL (Optional)</label>
                <input
                  type="text"
                  value={q.image || ''}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIndex].image = e.target.value;
                    setQuestions(newQs);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-white/60 mb-2">Marks</label>
                <input
                  type="number"
                  value={q.marks}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIndex].marks = parseInt(e.target.value);
                    setQuestions(newQs);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

import { Trash2 } from 'lucide-react';
