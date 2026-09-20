import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Storage
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
[DATA_DIR, UPLOADS_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const DB_FILE = path.join(DATA_DIR, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { resumes: [], analyses: [], jobDescriptions: [], history: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Multer config
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── MOCK DATA GENERATORS ─────────────────────────────────────────────────────

function generateAnalysis(resumeName) {
  return {
    overallScore: Math.floor(Math.random() * 30) + 65,
    atsScore: Math.floor(Math.random() * 25) + 70,
    readabilityScore: Math.floor(Math.random() * 20) + 75,
    sections: {
      experience: { score: Math.floor(Math.random() * 20) + 75, feedback: 'Good experience section with quantified achievements.' },
      education: { score: Math.floor(Math.random() * 15) + 80, feedback: 'Education details are well presented.' },
      skills: { score: Math.floor(Math.random() * 25) + 65, feedback: 'Consider adding more technical skills relevant to your target role.' },
      summary: { score: Math.floor(Math.random() * 20) + 70, feedback: 'Professional summary could be more impactful.' }
    },
    keywords: ['Python', 'Machine Learning', 'React', 'Node.js', 'SQL', 'Docker', 'AWS', 'Agile'],
    missingKeywords: ['Kubernetes', 'TypeScript', 'GraphQL', 'CI/CD'],
    suggestions: [
      'Add quantifiable metrics to at least 3 more bullet points',
      'Include a professional summary at the top',
      'Add links to GitHub/portfolio projects',
      'Tailor keywords to target job descriptions',
      'Use action verbs to start each bullet point'
    ],
    strengths: [
      'Clear and structured layout',
      'Good use of action verbs',
      'Relevant work experience',
      'Educational background aligns with career goals'
    ]
  };
}

function generateJobMatch(jobTitle) {
  return {
    matchScore: Math.floor(Math.random() * 35) + 55,
    matchedSkills: ['Python', 'React', 'SQL', 'Agile', 'Git'],
    missingSkills: ['Kubernetes', 'TypeScript', 'GraphQL'],
    experienceMatch: Math.floor(Math.random() * 20) + 75,
    educationMatch: Math.floor(Math.random() * 15) + 80,
    keywordDensity: Math.floor(Math.random() * 20) + 65,
    recommendations: [
      `Tailor your resume specifically for the ${jobTitle} role`,
      'Highlight your most relevant projects prominently',
      'Add missing technical skills to your skills section',
      'Use keywords from the job description naturally throughout'
    ]
  };
}

function generateSkillGap() {
  return {
    currentSkills: [
      { name: 'Python', proficiency: 85, category: 'Programming' },
      { name: 'React', proficiency: 78, category: 'Frontend' },
      { name: 'SQL', proficiency: 72, category: 'Database' },
      { name: 'Git', proficiency: 88, category: 'DevOps' },
      { name: 'Node.js', proficiency: 65, category: 'Backend' }
    ],
    requiredSkills: [
      { name: 'Kubernetes', proficiency: 0, required: 70, category: 'DevOps' },
      { name: 'TypeScript', proficiency: 40, required: 80, category: 'Frontend' },
      { name: 'GraphQL', proficiency: 20, required: 65, category: 'Backend' },
      { name: 'AWS', proficiency: 35, required: 75, category: 'Cloud' },
      { name: 'Docker', proficiency: 55, required: 70, category: 'DevOps' }
    ],
    prioritySkills: ['Kubernetes', 'TypeScript', 'AWS'],
    estimatedLearningTime: '3-6 months'
  };
}

function generateRoadmap() {
  return {
    targetRole: 'Senior Full Stack Engineer',
    timelineMonths: 6,
    milestones: [
      {
        month: 1,
        title: 'Foundation',
        tasks: ['Complete TypeScript fundamentals course', 'Build a TypeScript project', 'Learn Docker basics'],
        status: 'current'
      },
      {
        month: 2,
        title: 'Cloud Skills',
        tasks: ['AWS Cloud Practitioner certification prep', 'Deploy projects to AWS', 'Learn S3, EC2, Lambda'],
        status: 'upcoming'
      },
      {
        month: 3,
        title: 'DevOps Deep Dive',
        tasks: ['Kubernetes fundamentals', 'CI/CD pipelines with GitHub Actions', 'Container orchestration'],
        status: 'upcoming'
      },
      {
        month: 4,
        title: 'API & Architecture',
        tasks: ['GraphQL with Apollo', 'Microservices patterns', 'System design basics'],
        status: 'upcoming'
      },
      {
        month: 5,
        title: 'Portfolio Projects',
        tasks: ['Build 2 full-stack projects using learned skills', 'Open source contributions', 'Technical blog posts'],
        status: 'upcoming'
      },
      {
        month: 6,
        title: 'Job Search',
        tasks: ['Update resume with new skills', 'Apply to 20+ positions', 'Network on LinkedIn', 'Interview preparation'],
        status: 'upcoming'
      }
    ],
    resources: [
      { title: 'TypeScript Handbook', url: '#', type: 'Documentation' },
      { title: 'AWS Free Tier', url: '#', type: 'Platform' },
      { title: 'Kubernetes.io', url: '#', type: 'Documentation' },
      { title: 'The Odin Project', url: '#', type: 'Course' }
    ]
  };
}

function generateInterviewQuestions(role = 'Software Engineer') {
  return {
    role,
    categories: [
      {
        name: 'Technical',
        questions: [
          { q: 'Explain the difference between REST and GraphQL APIs.', difficulty: 'Medium', tip: 'Cover trade-offs: flexibility vs. over-fetching' },
          { q: 'How does the event loop work in JavaScript?', difficulty: 'Medium', tip: 'Mention call stack, task queue, microtask queue' },
          { q: 'What are React hooks and why were they introduced?', difficulty: 'Easy', tip: 'Focus on useState, useEffect, custom hooks' },
          { q: 'Describe your approach to database indexing.', difficulty: 'Hard', tip: 'Cover B-trees, composite indexes, trade-offs' }
        ]
      },
      {
        name: 'Behavioral',
        questions: [
          { q: 'Tell me about a time you had to debug a critical production issue.', difficulty: 'Medium', tip: 'Use STAR method: Situation, Task, Action, Result' },
          { q: 'How do you handle disagreements with teammates?', difficulty: 'Easy', tip: 'Show empathy, data-driven approach' },
          { q: 'Describe your most challenging project and how you overcame obstacles.', difficulty: 'Medium', tip: 'Quantify the impact and your specific contributions' }
        ]
      },
      {
        name: 'System Design',
        questions: [
          { q: `Design a URL shortener like bit.ly.`, difficulty: 'Hard', tip: 'Cover hashing, DB schema, caching, scalability' },
          { q: 'How would you design a notification system?', difficulty: 'Hard', tip: 'Think about push/pull, queues, fan-out strategies' }
        ]
      }
    ]
  };
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Stats (Dashboard)
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json({
    totalResumes: db.resumes.length,
    analysesCompleted: db.analyses.length,
    avgScore: db.analyses.length
      ? Math.round(db.analyses.reduce((s, a) => s + a.analysis.overallScore, 0) / db.analyses.length)
      : 0,
    jobsMatched: db.jobDescriptions.length
  });
});

// Resumes
app.post('/api/resumes/upload', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const db = readDB();
  const resume = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
    path: req.file.path
  };
  db.resumes.push(resume);
  writeDB(db);
  res.json({ success: true, resume });
});

app.get('/api/resumes', (req, res) => {
  const db = readDB();
  res.json(db.resumes);
});

app.get('/api/resumes/:id', (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.id);
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json(resume);
});

app.delete('/api/resumes/:id', (req, res) => {
  const db = readDB();
  db.resumes = db.resumes.filter(r => r.id !== req.params.id);
  db.analyses = db.analyses.filter(a => a.resumeId !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Analysis
app.post('/api/analysis/:resumeId', (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.resumeId);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });

  const existing = db.analyses.find(a => a.resumeId === req.params.resumeId);
  if (existing) return res.json(existing);

  const analysisDoc = {
    id: uuidv4(),
    resumeId: req.params.resumeId,
    resumeName: resume.originalName,
    createdAt: new Date().toISOString(),
    analysis: generateAnalysis(resume.originalName)
  };
  db.analyses.push(analysisDoc);
  db.history.push({ id: uuidv4(), type: 'analysis', label: `Analyzed ${resume.originalName}`, timestamp: new Date().toISOString(), ref: analysisDoc.id });
  writeDB(db);
  res.json(analysisDoc);
});

app.get('/api/analysis/:resumeId', (req, res) => {
  const db = readDB();
  const analysis = db.analyses.find(a => a.resumeId === req.params.resumeId);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  res.json(analysis);
});

// Job Descriptions
app.post('/api/jobs', (req, res) => {
  const { title, company, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description required' });
  const db = readDB();
  const job = { id: uuidv4(), title, company: company || 'Unknown', description, createdAt: new Date().toISOString() };
  db.jobDescriptions.push(job);
  writeDB(db);
  res.json({ success: true, job });
});

app.get('/api/jobs', (req, res) => {
  const db = readDB();
  res.json(db.jobDescriptions);
});

app.get('/api/jobs/:id', (req, res) => {
  const db = readDB();
  const job = db.jobDescriptions.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

// Job Match
app.post('/api/match', (req, res) => {
  const { resumeId, jobId } = req.body;
  const db = readDB();
  const resume = db.resumes.find(r => r.id === resumeId);
  const job = db.jobDescriptions.find(j => j.id === jobId);
  if (!resume || !job) return res.status(404).json({ error: 'Resume or job not found' });
  const matchData = { id: uuidv4(), resumeId, jobId, resumeName: resume.originalName, jobTitle: job.title, createdAt: new Date().toISOString(), match: generateJobMatch(job.title) };
  db.history.push({ id: uuidv4(), type: 'match', label: `Matched ${resume.originalName} to ${job.title}`, timestamp: new Date().toISOString(), ref: matchData.id });
  writeDB(db);
  res.json(matchData);
});

// Skill Gap
app.get('/api/skillgap/:resumeId', (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.resumeId);
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json({ resumeId: req.params.resumeId, ...generateSkillGap() });
});

// Roadmap
app.get('/api/roadmap/:resumeId', (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.resumeId);
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json({ resumeId: req.params.resumeId, ...generateRoadmap() });
});

// Interview
app.get('/api/interview', (req, res) => {
  const role = req.query.role || 'Software Engineer';
  res.json(generateInterviewQuestions(role));
});

// History
app.get('/api/history', (req, res) => {
  const db = readDB();
  res.json(db.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

app.delete('/api/history/:id', (req, res) => {
  const db = readDB();
  db.history = db.history.filter(h => h.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`ResumeX API running on http://localhost:${PORT}`));
