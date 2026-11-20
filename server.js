// Zero-dependency server: Node >= 22.5 (node:sqlite). Run: node server.js
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { networkInterfaces } from 'node:os';
import { LESSONS } from './public/lessons.js';

const PORT = Number(process.env.PORT || 3000);
const PIN = process.env.TEACHER_PIN || '1234';
const PUBLIC = join(import.meta.dirname, 'public');
const db = new DatabaseSync(process.env.DB_PATH || join(import.meta.dirname, 'data.db'));

db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, grade INTEGER NOT NULL, name TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE, name TEXT NOT NULL, pos INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL, correct INTEGER NOT NULL, total INTEGER NOT NULL, score REAL NOT NULL, seconds INTEGER NOT NULL,
  stars INTEGER NOT NULL, answers TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`);

if (!db.prepare('SELECT 1 FROM classes LIMIT 1').get()) {
  const sample = {
    '3A1': ['Nguyễn Minh Anh', 'Trần Gia Bảo', 'Lê Ngọc Châu', 'Phạm Đức Duy', 'Hoàng Thu Hà', 'Vũ Quốc Khánh'],
    '3A2': ['Đỗ Bảo Ngọc', 'Bùi Tuấn Kiệt', 'Đặng Khánh Linh', 'Ngô Hải Nam'],
  };
  for (const [name, students] of Object.entries(sample)) {
    const { lastInsertRowid } = db.prepare('INSERT INTO classes (grade, name) VALUES (3, ?)').run(name);
    students.forEach((s, i) => db.prepare('INSERT INTO students (class_id, name, pos) VALUES (?, ?, ?)').run(lastInsertRowid, s, i));
  }
  db.prepare("INSERT INTO settings VALUES ('teacher_name', 'Cô Nguyễn Thị Lan')").run();
}

const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
const setting = (k) => db.prepare('SELECT value FROM settings WHERE key = ?').get(k)?.value ?? '';

// Best attempt per (student, lesson): highest score, then fastest.
const BEST = `SELECT * FROM (SELECT a.*, ROW_NUMBER() OVER (PARTITION BY student_id, lesson_id ORDER BY score DESC, seconds ASC) rn FROM attempts a) WHERE rn = 1`;

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const need = (cond, msg) => { if (!cond) throw new HttpError(400, msg); };
const int = (v) => (Number.isInteger(Number(v)) && v !== '' && v != null ? Number(v) : NaN);

const routes = {
  'GET /api/classes': (q) => db.prepare('SELECT id, grade, name FROM classes WHERE (? IS NULL OR grade = ?) ORDER BY grade, name').all(q.grade ?? null, q.grade ?? null),
  'GET /api/students': (q) => db.prepare('SELECT id, name, pos FROM students WHERE class_id = ? ORDER BY pos').all(int(q.class_id)),
  'GET /api/settings': () => ({ teacher_name: setting('teacher_name') }),
  'GET /api/progress': (q) => db.prepare(`SELECT lesson_id, stars, score, seconds FROM (${BEST}) WHERE student_id = ?`).all(int(q.student_id)),

  'POST /api/attempts': (_, b) => {
    const lesson = lessonById[b.lesson_id];
    need(lesson, 'lesson_id không hợp lệ');
    need(db.prepare('SELECT 1 FROM students WHERE id = ?').get(int(b.student_id)), 'student_id không hợp lệ');
    const answers = b.answers;
    need(Array.isArray(answers) && answers.length === lesson.challenges.length && answers.every((x) => typeof x === 'boolean'), 'answers không hợp lệ');
    const seconds = int(b.seconds);
    need(seconds >= 0 && seconds < 86400, 'seconds không hợp lệ');
    // Score is derived server-side from the answers so the client cannot post an arbitrary score.
    const correct = answers.filter(Boolean).length, total = answers.length;
    const score = Math.round((correct / total) * 100) / 10;
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;
    db.prepare('INSERT INTO attempts (student_id, lesson_id, correct, total, score, seconds, stars, answers) VALUES (?,?,?,?,?,?,?,?)')
      .run(int(b.student_id), lesson.id, correct, total, score, seconds, stars, JSON.stringify(answers));
    return { correct, total, score, stars, date: new Date().toLocaleDateString('vi-VN') };
  },

  // Rank by sum of best scores across lessons, then by total time.
  'GET /api/leaderboard': (q) => db.prepare(`
    SELECT s.id, s.name, c.name AS class_name, ROUND(SUM(b.score), 1) AS points, SUM(b.seconds) AS seconds, SUM(b.stars) AS stars
    FROM (${BEST}) b JOIN students s ON s.id = b.student_id JOIN classes c ON c.id = s.class_id
    WHERE (? IS NULL OR c.id = ?) AND (? IS NULL OR c.grade = ?)
    GROUP BY s.id ORDER BY points DESC, seconds ASC LIMIT 20`)
    .all(q.class_id ?? null, q.class_id ?? null, q.grade ?? null, q.grade ?? null),

  'POST /api/admin/login': () => ({ ok: true }),
  'POST /api/admin/settings': (_, b) => {
    need(typeof b.teacher_name === 'string' && b.teacher_name.trim(), 'Thiếu tên giáo viên');
    db.prepare("INSERT OR REPLACE INTO settings VALUES ('teacher_name', ?)").run(b.teacher_name.trim().slice(0, 80));
    return { ok: true };
  },
  'POST /api/admin/classes': (_, b) => {
    const grade = int(b.grade), name = String(b.name ?? '').trim();
    need(grade >= 1 && grade <= 5, 'Khối phải từ 1 đến 5');
    need(name && name.length <= 20, 'Tên lớp không hợp lệ');
    need(!db.prepare('SELECT 1 FROM classes WHERE name = ?').get(name), 'Lớp đã tồn tại');
    return { id: Number(db.prepare('INSERT INTO classes (grade, name) VALUES (?, ?)').run(grade, name).lastInsertRowid) };
  },
  'POST /api/admin/classes/delete': (_, b) => (db.prepare('DELETE FROM classes WHERE id = ?').run(int(b.id)), { ok: true }),

  // Keeps existing students (and their results) whose names are still in the list; removes the rest.
  'POST /api/admin/students': (_, b) => {
    const classId = int(b.class_id);
    need(db.prepare('SELECT 1 FROM classes WHERE id = ?').get(classId), 'Lớp không tồn tại');
    need(Array.isArray(b.names) && b.names.length <= 100, 'Danh sách không hợp lệ');
    const names = [...new Set(b.names.map((n) => String(n).trim().slice(0, 60)).filter(Boolean))];
    const existing = new Map(db.prepare('SELECT id, name FROM students WHERE class_id = ?').all(classId).map((s) => [s.name, s.id]));
    db.exec('BEGIN');
    try {
      for (const [name, id] of existing) if (!names.includes(name)) db.prepare('DELETE FROM students WHERE id = ?').run(id);
      names.forEach((name, pos) => existing.has(name)
        ? db.prepare('UPDATE students SET pos = ? WHERE id = ?').run(pos, existing.get(name))
        : db.prepare('INSERT INTO students (class_id, name, pos) VALUES (?, ?, ?)').run(classId, name, pos));
      db.exec('COMMIT');
    } catch (e) { db.exec('ROLLBACK'); throw e; }
    return { count: names.length };
  },

  'GET /api/admin/dashboard': (q) => {
    const classId = int(q.class_id);
    const students = db.prepare('SELECT id, name FROM students WHERE class_id = ? ORDER BY pos').all(classId);
    const best = db.prepare(`SELECT b.student_id, b.lesson_id, b.correct, b.total, b.score, b.seconds, b.stars FROM (${BEST}) b JOIN students s ON s.id = b.student_id WHERE s.class_id = ?`).all(classId);
    // Per-question correct rate over every attempt in this class.
    const rates = {};
    for (const a of db.prepare('SELECT a.lesson_id, a.answers FROM attempts a JOIN students s ON s.id = a.student_id WHERE s.class_id = ?').all(classId)) {
      const r = (rates[a.lesson_id] ??= lessonById[a.lesson_id].challenges.map(() => ({ right: 0, n: 0 })));
      JSON.parse(a.answers).forEach((ok, i) => { r[i].n++; if (ok) r[i].right++; });
    }
    return { students, best, rates };
  },
};

const csvCell = (v) => `"${String(v).replaceAll('"', '""')}"`;
const fmtTime = (s) => `${Math.floor(s / 60)} phút ${s % 60} giây`;

function exportCsv(q) {
  const cls = db.prepare('SELECT id, grade, name FROM classes WHERE id = ?').get(int(q.class_id));
  if (!cls) throw new HttpError(404, 'Lớp không tồn tại');
  const students = db.prepare('SELECT id, name FROM students WHERE class_id = ? ORDER BY pos').all(cls.id);
  const best = new Map(db.prepare(`SELECT b.* FROM (${BEST}) b JOIN students s ON s.id = b.student_id WHERE s.class_id = ?`).all(cls.id).map((b) => [`${b.student_id}|${b.lesson_id}`, b]));
  const rows = [['STT', 'Họ và tên', 'Lớp', 'Tên bài học', 'Số câu đúng', 'Điểm số', 'Thời gian làm bài', 'Trạng thái hoàn thành']];
  let stt = 0;
  for (const s of students) for (const l of LESSONS.filter((l) => l.grade === cls.grade)) {
    const b = best.get(`${s.id}|${l.id}`);
    rows.push([++stt, s.name, cls.name, l.title, b ? `${b.correct}/${b.total}` : '', b ? b.score : '', b ? fmtTime(b.seconds) : '', b ? 'Hoàn thành' : 'Chưa làm']);
  }
  // BOM so Excel opens UTF-8 Vietnamese correctly.
  return { body: '\uFEFF' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n'), name: `ket-qua-${cls.name}.csv` };
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const q = Object.fromEntries(url.searchParams);
  try {
    if (url.pathname.startsWith('/api/admin') && req.headers['x-pin'] !== PIN && q.pin !== PIN) throw new HttpError(401, 'Sai mã PIN');
    if (url.pathname === '/api/admin/export.csv') {
      const { body, name } = exportCsv(q);
      res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}` });
      return res.end(body);
    }
    const route = routes[`${req.method} ${url.pathname}`];
    if (route) {
      let body = {};
      if (req.method === 'POST') {
        let raw = '';
        for await (const chunk of req) { raw += chunk; if (raw.length > 1e6) throw new HttpError(413, 'Dữ liệu quá lớn'); }
        try { body = raw ? JSON.parse(raw) : {}; } catch { throw new HttpError(400, 'JSON không hợp lệ'); }
      }
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(route(q, body)));
    }
    if (url.pathname.startsWith('/api/')) throw new HttpError(404, 'Không tìm thấy');
    const file = normalize(join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname));
    if (!file.startsWith(PUBLIC)) throw new HttpError(403, 'Forbidden');
    const data = await readFile(file).catch(() => { throw new HttpError(404, 'Không tìm thấy'); });
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    if (!e.status) console.error(e);
    res.writeHead(e.status || 500, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: e.status ? e.message : 'Lỗi máy chủ' }));
  }
}).listen(PORT, () => {
  const ips = Object.values(networkInterfaces()).flat().filter((i) => i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log(`Web học tập đang chạy:\n  Máy này:  http://localhost:${PORT}\n${ips.map((ip) => `  Học sinh: http://${ip}:${PORT}`).join('\n')}\n  Mã PIN giáo viên: ${PIN}`);
});
