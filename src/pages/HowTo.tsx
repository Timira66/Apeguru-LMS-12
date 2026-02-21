import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle, Smartphone, Laptop, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const HowTo = () => {
  const steps = [
    { title: 'Login to your account', desc: 'Use your provided username and password to access the dashboard.', icon: ShieldCheck },
    { title: 'Select your grade', desc: 'Ensure your grade is correctly set to see relevant courses.', icon: CheckCircle },
    { title: 'Start learning', desc: 'Browse through videos, PDFs, and join live Zoom meetings.', icon: Play },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">How to use LMS</h1>
        <p className="text-xl text-white/60">Follow these simple steps to get started with your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-10 text-center relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-xl">
              {i + 1}
            </div>
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-400">
              <step.icon size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-white/40 leading-relaxed">{step.desc}</p>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Video Tutorials</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="aspect-video relative group cursor-pointer">
              <img src={`https://picsum.photos/seed/how${i}/600/400`} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white text-indigo-900 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="font-bold text-lg">Tutorial #{i}: Platform Basics</h4>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard className="p-12 bg-indigo-600/10 border-indigo-500/30">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Available on all devices</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Our LMS is fully responsive and optimized for both mobile and desktop. 
              Access your lessons anytime, anywhere.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                <Smartphone size={20} className="text-indigo-400" />
                <span className="font-bold">Mobile</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                <Laptop size={20} className="text-indigo-400" />
                <span className="font-bold">Desktop</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[48px] border border-white/10 flex items-center justify-center">
            <Smartphone size={120} className="text-indigo-400/40" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
