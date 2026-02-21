import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Camera, Save, Phone, MessageCircle, MapPin, Calendar, GraduationCap, Hash } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AuthContext } from '../App';
import { GRADES } from '../constants';

export const Profile = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.details?.name || '',
    phone: user?.details?.phone || '',
    whatsapp: user?.details?.whatsapp || '',
    address: user?.details?.address || '',
    age: user?.details?.age || '',
    dob: user?.details?.dob || '',
    school: user?.details?.school || '',
    grade: user?.grade || GRADES[0],
    profile_photo: user?.profile_photo || ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const res = await fetch(`/api/users/${user?.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade: formData.grade,
        profile_photo: formData.profile_photo,
        details: {
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          address: formData.address,
          age: formData.age,
          dob: formData.dob,
          school: formData.school
        }
      }),
    });
    if (res.ok) {
      setIsEditing(false);
      refreshUser();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all"
        >
          {isEditing ? <Save size={20} /> : <Edit size={20} />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="p-8 text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white/10">
              {formData.profile_photo ? (
                <img src={formData.profile_photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-white/20" />
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-indigo-900 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-1">{formData.name || user?.username}</h2>
          <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest">{user?.role}</p>
          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Grade</span>
              <span className="font-bold">{user?.grade}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Status</span>
              <span className="text-emerald-400 font-bold capitalize">{user?.status}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-10">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <UserIcon className="text-indigo-400" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileField label="Full Name" icon={UserIcon} value={formData.name} isEditing={isEditing} onChange={(v) => setFormData({...formData, name: v})} />
            <ProfileField label="Phone Number" icon={Phone} value={formData.phone} isEditing={isEditing} onChange={(v) => setFormData({...formData, phone: v})} />
            <ProfileField label="WhatsApp" icon={MessageCircle} value={formData.whatsapp} isEditing={isEditing} onChange={(v) => setFormData({...formData, whatsapp: v})} />
            <ProfileField label="School" icon={GraduationCap} value={formData.school} isEditing={isEditing} onChange={(v) => setFormData({...formData, school: v})} />
            <ProfileField label="Age" icon={Hash} value={formData.age} isEditing={isEditing} onChange={(v) => setFormData({...formData, age: v})} />
            <ProfileField label="Date of Birth" icon={Calendar} value={formData.dob} isEditing={isEditing} onChange={(v) => setFormData({...formData, dob: v})} />
            <div className="md:col-span-2">
              <ProfileField label="Address" icon={MapPin} value={formData.address} isEditing={isEditing} onChange={(v) => setFormData({...formData, address: v})} />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const ProfileField = ({ label, icon: Icon, value, isEditing, onChange }: { label: string, icon: any, value: string, isEditing: boolean, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
      <Icon size={14} />
      {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    ) : (
      <p className="text-lg font-medium text-white/90">{value || 'Not provided'}</p>
    )}
  </div>
);

import { Edit } from 'lucide-react';
