import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Play, 
  FileText, 
  Video, 
  Music, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit2,
  Clock,
  ChevronLeft,
  Maximize2,
  Timer
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { Content, ContentType } from '../types';
import { CATEGORIES, GRADES, SUBJECTS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Courses = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState<ContentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch('/api/content');
    const data = await res.json();
    setContent(data);
    setIsLoading(false);
  };

  const filteredContent = content.filter(c => {
    const matchesType = filter === 'all' || c.type === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.subject.toLowerCase().includes(search.toLowerCase());
    
    // Student filtering
    if (user?.role === 'student') {
      const matchesGrade = c.grade === user.grade;
      const matchesSubject = user.subjects?.includes(c.subject);
      return matchesType && matchesSearch && matchesGrade && matchesSubject;
    }
    
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'youtube': return <Play size={20} />;
      case 'zoom': return <Video size={20} />;
      case 'form': return <FileText size={20} />;
      case 'pdf': return <FileText size={20} />;
      case 'audio': return <Music size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  if (selectedContent) {
    return <ContentView content={selectedContent} onBack={() => setSelectedContent(null)} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-white/40">Access your lessons, videos, and study materials.</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {['all', 'youtube', 'zoom', 'form', 'pdf', 'audio'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                filter === t ? "bg-white text-indigo-900 shadow-lg" : "text-white/60 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Search for lessons, subjects, or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-white/20 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item, i) => (
            <GlassCard 
              key={item.id} 
              delay={i * 0.05} 
              onClick={() => setSelectedContent(item)}
              className="group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${item.id + 100}/400/225`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {item.subject}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white text-indigo-900 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                    {getTypeIcon(item.type)}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {item.type}
                  </span>
                  <span>{item.grade}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {filteredContent.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={40} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">No content found</h3>
          <p className="text-white/40">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

const ContentView = ({ content, onBack }: { content: Content, onBack: () => void }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [formTimeLeft, setFormTimeLeft] = useState(content.timer ? content.timer * 60 : null);
  const [isFormExpired, setIsFormExpired] = useState(false);

  useEffect(() => {
    if (content.type === 'form' && formTimeLeft !== null && formTimeLeft > 0) {
      const timer = setInterval(() => {
        setFormTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timer);
            setIsFormExpired(true);
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [content.type, formTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderPlayer = () => {
    if (isFormExpired) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/10 rounded-2xl p-8 text-center">
          <Clock size={64} className="text-red-400 mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-red-400 mb-4">Time's Up!</h2>
          <p className="text-white/60 max-w-md">The timer for this Google Form has expired. Your responses have been automatically submitted.</p>
          <button onClick={onBack} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
            Return to Courses
          </button>
        </div>
      );
    }
    switch (content.type) {
      case 'youtube':
        const videoId = content.url.split('v=')[1]?.split('&')[0] || content.url.split('/').pop();
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            className="w-full h-full rounded-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      case 'form':
        return (
          <iframe
            src={content.url}
            className="w-full h-full rounded-2xl bg-white"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        );
      case 'pdf':
        return (
          <embed
            src={content.url}
            type="application/pdf"
            className="w-full h-full rounded-2xl"
          />
        );
      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
            <div className="text-center">
              <div className="w-32 h-32 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Music size={64} className="text-indigo-400" />
              </div>
              <audio controls className="w-80">
                <source src={content.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      case 'zoom':
        return (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
            <div className="text-center max-w-md p-8">
              <div className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Video size={48} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Join Zoom Meeting</h2>
              <p className="text-white/60 mb-8">This meeting is scheduled for your class. Click the button below to join.</p>
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl transition-all"
              >
                Launch Meeting
              </a>
            </div>
          </div>
        );
      default:
        return <div>Unsupported content type</div>;
    }
  };

  return (
    <div className={cn("space-y-6", isFullScreen && "fixed inset-0 z-[100] bg-slate-950 p-4")}>
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span className="font-bold">Back to Courses</span>
        </button>
        <div className="flex gap-2">
          {content.type === 'form' && formTimeLeft !== null && !isFormExpired && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono font-bold">
              <Timer size={18} />
              {formatTime(formTimeLeft)}
            </div>
          )}
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      <div className={cn("w-full aspect-video", isFullScreen && "flex-1 h-full")}>
        <GlassCard className="w-full h-full p-2">
          {renderPlayer()}
        </GlassCard>
      </div>

      {!isFullScreen && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-white/60 flex items-center gap-2">
                  <Clock size={14} />
                  Added on {new Date(content.created_at).toLocaleDateString()}
                </div>
                <div className="px-4 py-2 bg-indigo-500/10 rounded-xl text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <Play size={14} />
                  {content.subject}
                </div>
                <div className="px-4 py-2 bg-purple-500/10 rounded-xl text-xs font-bold text-purple-400 flex items-center gap-2">
                  <Filter size={14} />
                  {content.grade}
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/60 leading-relaxed">
                  This lesson covers the fundamental concepts of {content.subject}. 
                  Please watch the video carefully and take notes. If there are any questions, 
                  you can ask the Ape Guru AI assistant or join the next live Q&A session.
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6">Course Playlist</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/40 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                      {i}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">Related Lesson {i}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">15:20 • Video</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
