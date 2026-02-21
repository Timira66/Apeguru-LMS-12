import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageCircle, Globe, Youtube, Facebook, Instagram, Twitter } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { APP_NAME, DEVELOPER, CREATOR } from '../constants';

const TEACHERS = [
  { name: 'Dr. Kamal Perera', subject: 'Mathematics', bio: 'Expert in advanced calculus and algebra with 15 years of experience.', image: 'https://picsum.photos/seed/t1/200/200' },
  { name: 'Mrs. Nilanthi Silva', subject: 'Science', bio: 'Passionate about biology and environmental science.', image: 'https://picsum.photos/seed/t2/200/200' },
  { name: 'Mr. Sunil Gamage', subject: 'History', bio: 'Specializes in ancient civilizations and modern history.', image: 'https://picsum.photos/seed/t3/200/200' },
  // ... more teachers can be added by admin
];

export const AboutUs = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
          About {APP_NAME}
        </h1>
        <p className="text-xl text-white/60 leading-relaxed">
          We are dedicated to providing the best learning experience for students in Sri Lanka. 
          Our platform combines modern technology with expert teaching to help you achieve your academic goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEACHERS.map((teacher, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-8 text-center group">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white/10 group-hover:border-indigo-500/50 transition-all">
              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-1">{teacher.name}</h3>
            <p className="text-indigo-400 text-sm font-bold mb-4">{teacher.subject}</p>
            <p className="text-white/40 text-sm leading-relaxed">{teacher.bio}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <GlassCard className="p-10">
          <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold">Phone</p>
                <p className="font-bold">+94 11 234 5678</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold">WhatsApp</p>
                <p className="font-bold">+94 77 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold">Email</p>
                <p className="font-bold">support@apeguru.lk</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-10">
          <h2 className="text-2xl font-bold mb-8">Follow Us</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <Youtube className="text-red-500" />
              <span className="font-bold">YouTube</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <Facebook className="text-blue-500" />
              <span className="font-bold">Facebook</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <Instagram className="text-pink-500" />
              <span className="font-bold">Instagram</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <Globe className="text-cyan-500" />
              <span className="font-bold">Website</span>
            </a>
          </div>
        </GlassCard>
      </div>

      <div className="text-center pt-12 border-t border-white/10">
        <p className="text-white/20 text-sm">
          Developed by <span className="text-white/40 font-bold">{DEVELOPER}</span> • 
          Created by <span className="text-white/40 font-bold">{CREATOR}</span>
        </p>
      </div>
    </div>
  );
};
