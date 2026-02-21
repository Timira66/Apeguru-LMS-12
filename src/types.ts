export type UserRole = 'admin' | 'student';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  grade?: string;
  subjects?: string[];
  status: 'active' | 'blocked';
  profile_photo?: string;
  details?: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    age?: string;
    dob?: string;
    school?: string;
  };
}

export type ContentType = 'youtube' | 'zoom' | 'form' | 'pdf' | 'audio';

export interface Content {
  id: number;
  type: ContentType;
  title: string;
  url: string;
  category: string;
  grade: string;
  subject: string;
  timer?: number; // in minutes
  created_at: string;
}

export interface OnlineTest {
  id: number;
  title: string;
  category: string;
  grade: string;
  subject: string;
  duration: number; // in minutes
  schedule: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  audio?: string;
  options: string[];
  correctAnswer: number;
  timer?: number; // per question timer
  marks: number;
}

export interface TestResult {
  id: number;
  student_id: number;
  test_id: number;
  score: number;
  rank: number;
  answers: any;
  submitted_at: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  date: string;
  grade: string;
  subject: string;
  type: 'online' | 'physical' | 'both';
  status: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read: number;
  created_at: string;
}
