import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Star, Heart, Cloud, Sun, Moon, Check, X, RefreshCcw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
];

const ANIMALS = [
  { name: 'Cat', icon: '🐱' },
  { name: 'Dog', icon: '🐶' },
  { name: 'Rabbit', icon: '🐰' },
  { name: 'Lion', icon: '🦁' },
  { name: 'Panda', icon: '🐼' },
  { name: 'Monkey', icon: '🐵' },
];

export const Preschool = () => {
  const [game, setGame] = useState<'colors' | 'animals' | 'math' | null>(null);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startColors = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const options = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!options.find(o => o.name === target.name)) options[0] = target;
    setCurrentChallenge({ target, options: options.sort(() => Math.random() - 0.5) });
    setGame('colors');
    setFeedback(null);
  };

  const startAnimals = () => {
    const target = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const options = [...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!options.find(o => o.name === target.name)) options[0] = target;
    setCurrentChallenge({ target, options: options.sort(() => Math.random() - 0.5) });
    setGame('animals');
    setFeedback(null);
  };

  const handleChoice = (choice: any) => {
    if (choice.name === currentChallenge.target.name) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      setTimeout(() => {
        if (game === 'colors') startColors();
        else if (game === 'animals') startAnimals();
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Preschool Fun</h1>
          <p className="text-white/40">Learn and play with fun mini-games!</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <Star className="text-amber-400 fill-amber-400" size={24} />
          <span className="text-2xl font-bold">{score} Points</span>
        </div>
      </div>

      {!game ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="p-10 text-center group" onClick={startColors}>
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
              <div className="w-12 h-12 rounded-full bg-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Color Match</h3>
            <p className="text-white/40 mb-8">Can you find the right color?</p>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">Play Now</button>
          </GlassCard>

          <GlassCard className="p-10 text-center group" onClick={startAnimals}>
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
              <span className="text-5xl">🦁</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Animal Friends</h3>
            <p className="text-white/40 mb-8">Match the animal names!</p>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">Play Now</button>
          </GlassCard>

          <GlassCard className="p-10 text-center group" onClick={() => {}}>
            <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
              <span className="text-5xl font-bold text-indigo-400">1+2</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Simple Math</h3>
            <p className="text-white/40 mb-8">Fun with numbers and counting!</p>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">Coming Soon</button>
          </GlassCard>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-12 text-center relative overflow-hidden">
            <button 
              onClick={() => setGame(null)}
              className="absolute top-6 left-6 p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <RefreshCcw size={20} />
            </button>

            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
                >
                  {feedback === 'correct' ? (
                    <div className="text-emerald-400 text-center">
                      <Check size={120} className="mx-auto mb-4" />
                      <h2 className="text-4xl font-bold">Great Job!</h2>
                    </div>
                  ) : (
                    <div className="text-red-400 text-center">
                      <X size={120} className="mx-auto mb-4" />
                      <h2 className="text-4xl font-bold">Try Again!</h2>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Find the {currentChallenge.target.name}!</h2>
              <div className="w-48 h-48 bg-white/5 rounded-[48px] flex items-center justify-center mx-auto border-4 border-white/10 shadow-2xl">
                {game === 'colors' ? (
                  <div className="w-24 h-24 rounded-full shadow-lg" style={{ backgroundColor: currentChallenge.target.hex }} />
                ) : (
                  <span className="text-8xl">{currentChallenge.target.icon}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {currentChallenge.options.map((opt: any, i: number) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice(opt)}
                  className="py-8 rounded-3xl bg-white/5 border-2 border-white/10 text-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all shadow-xl"
                >
                  {opt.name}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
