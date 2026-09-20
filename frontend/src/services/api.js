const API_BASE = 'https://resumex-backend-klgv.onrender.com/api';

async function request(method, path, body, isFormData = false) {
  const opts = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
  };
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Health
  health: () => request('GET', '/health'),

  // Stats
  stats: () => request('GET', '/stats'),

  // Resumes
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('resume', file);
    return request('POST', '/resumes/upload', fd, true);
  },
  getResumes: () => request('GET', '/resumes'),
  getResume: (id) => request('GET', `/resumes/${id}`),
  deleteResume: (id) => request('DELETE', `/resumes/${id}`),

  // Analysis
  analyzeResume: (resumeId) => request('POST', `/analysis/${resumeId}`),
  getAnalysis: (resumeId) => request('GET', `/analysis/${resumeId}`),

  // Jobs
  createJob: (data) => request('POST', '/jobs', data),
  getJobs: () => request('GET', '/jobs'),
  getJob: (id) => request('GET', `/jobs/${id}`),

  // Match
  matchResume: (resumeId, jobId) => request('POST', '/match', { resumeId, jobId }),

  // Skill Gap
  getSkillGap: (resumeId) => request('GET', `/skillgap/${resumeId}`),

  // Roadmap
  getRoadmap: (resumeId) => request('GET', `/roadmap/${resumeId}`),

  // Interview
  getInterviewQuestions: (role) => request('GET', `/interview${role ? `?role=${encodeURIComponent(role)}` : ''}`),

  // History
  getHistory: () => request('GET', '/history'),
  deleteHistory: (id) => request('DELETE', `/history/${id}`)
};
