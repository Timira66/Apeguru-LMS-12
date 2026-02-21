import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("lms.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    grade TEXT,
    subjects TEXT,
    status TEXT DEFAULT 'active',
    profile_photo TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    title TEXT,
    url TEXT,
    category TEXT,
    grade TEXT,
    subject TEXT,
    timer INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS online_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    grade TEXT,
    subject TEXT,
    duration INTEGER,
    schedule DATETIME,
    questions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    test_id INTEGER,
    score INTEGER,
    rank INTEGER,
    answers TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES users(id),
    FOREIGN KEY(test_id) REFERENCES online_tests(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    grade TEXT,
    subject TEXT,
    type TEXT,
    status INTEGER,
    FOREIGN KEY(student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    type TEXT,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    content_ids TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("shenaltimira6@gamail.com", "Shenal2008@", "admin");
} else {
  // Update existing admin if needed
  db.prepare("UPDATE users SET username = ?, password = ? WHERE role = 'admin'").run("shenaltimira6@gamail.com", "Shenal2008@");
}

// Seed Settings
const seedSetting = (key: string, value: string) => {
  const exists = db.prepare("SELECT * FROM settings WHERE key = ?").get(key);
  if (!exists) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(key, value);
  }
};
seedSetting("ai_enabled", "true");
seedSetting("email_notifications", "true");

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      if (user.status === 'blocked') {
        return res.status(403).json({ error: "Your account is blocked." });
      }
      user.subjects = JSON.parse(user.subjects || '[]');
      user.details = JSON.parse(user.details || '{}');
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all() as any[];
    users.forEach(u => {
      u.subjects = JSON.parse(u.subjects || '[]');
      u.details = JSON.parse(u.details || '{}');
    });
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const { username, password, role, grade, subjects, details } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (username, password, role, grade, subjects, details) VALUES (?, ?, ?, ?, ?, ?)").run(username, password, role, grade, JSON.stringify(subjects), JSON.stringify(details));
      res.json({ id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Username already exists" });
    }
  });

  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id) as any;
    if (user) {
      user.subjects = JSON.parse(user.subjects || '[]');
      user.details = JSON.parse(user.details || '{}');
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.patch("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { status, grade, subjects, details, profile_photo } = req.body;
    const fields = [];
    const values = [];
    if (status) { fields.push("status = ?"); values.push(status); }
    if (grade) { fields.push("grade = ?"); values.push(grade); }
    if (subjects) { fields.push("subjects = ?"); values.push(JSON.stringify(subjects)); }
    if (details) { fields.push("details = ?"); values.push(JSON.stringify(details)); }
    if (profile_photo) { fields.push("profile_photo = ?"); values.push(profile_photo); }
    
    if (fields.length > 0) {
      values.push(id);
      db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    }
    res.json({ success: true });
  });

  app.get("/api/content", (req, res) => {
    const content = db.prepare("SELECT * FROM content").all();
    res.json(content);
  });

  app.post("/api/content", (req, res) => {
    const { type, title, url, category, grade, subject, timer } = req.body;
    const info = db.prepare("INSERT INTO content (type, title, url, category, grade, subject, timer) VALUES (?, ?, ?, ?, ?, ?, ?)").run(type, title, url, category, grade, subject, timer);
    io.emit("content_update");
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/content/:id", (req, res) => {
    db.prepare("DELETE FROM content WHERE id = ?").run(req.params.id);
    io.emit("content_update");
    res.json({ success: true });
  });

  app.get("/api/tests", (req, res) => {
    const tests = db.prepare("SELECT * FROM online_tests").all();
    res.json(tests);
  });

  app.post("/api/tests", (req, res) => {
    const { title, category, grade, subject, duration, schedule, questions } = req.body;
    const info = db.prepare("INSERT INTO online_tests (title, category, grade, subject, duration, schedule, questions) VALUES (?, ?, ?, ?, ?, ?, ?)").run(title, category, grade, subject, duration, schedule, JSON.stringify(questions));
    io.emit("test_update");
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/test-results", (req, res) => {
    const { student_id, test_id, score, answers } = req.body;
    // Calculate rank (simplified: rank based on score in this test)
    const existingResults = db.prepare("SELECT score FROM test_results WHERE test_id = ? ORDER BY score DESC").all(test_id) as any[];
    const rank = existingResults.filter(r => r.score > score).length + 1;
    
    const info = db.prepare("INSERT INTO test_results (student_id, test_id, score, rank, answers) VALUES (?, ?, ?, ?, ?)").run(student_id, test_id, score, rank, JSON.stringify(answers));
    
    // Add notification for admin
    db.prepare("INSERT INTO notifications (user_id, title, message, type) SELECT id, ?, ?, 'test_submission' FROM users WHERE role = 'admin'").run("New Test Submission", `Student ID ${student_id} submitted test ${test_id}`);
    
    io.emit("test_submission", { student_id, test_id });
    res.json({ id: info.lastInsertRowid, rank });
  });

  app.get("/api/attendance", (req, res) => {
    const attendance = db.prepare("SELECT * FROM attendance").all();
    res.json(attendance);
  });

  app.post("/api/attendance", (req, res) => {
    const { student_id, date, grade, subject, type, status } = req.body;
    db.prepare("INSERT OR REPLACE INTO attendance (student_id, date, grade, subject, type, status) VALUES (?, ?, ?, ?, ?, ?)").run(student_id, date, grade, subject, type, status);
    
    // Add notification for student
    db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'attendance')").run(
      student_id, 
      "Attendance Marked", 
      `Your attendance for ${subject} on ${date} has been marked as ${status ? 'Present' : 'Absent'}.`
    );
    
    io.emit("attendance_update", { student_id });
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  app.get("/api/notifications/:userId", (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(notifications);
  });

  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;
    try {
      const { chatWithGemini } = await import("./src/services/geminiService.ts");
      const text = await chatWithGemini(message, history);
      res.json({ text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "AI failed" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Socket.io
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
