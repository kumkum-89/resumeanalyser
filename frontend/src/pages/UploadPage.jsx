import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader, LoadingState, ErrorBanner, SuccessBanner, Card } from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const ACCEPTED_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE_MB = 10;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { setSelectedResumeId } = useApp();
  const navigate = useNavigate();

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFile = (f) => {
    setError(null);
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const onFileInput = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = await api.uploadResume(file);
      setSelectedResumeId(data.resume.id);
      setSuccess(`"${file.name}" uploaded successfully!`);
      setTimeout(() => navigate('/analysis'), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Upload Resume"
        subtitle="Upload your resume to start AI-powered analysis"
        breadcrumb="Home / Upload Resume"
      />

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Upload Zone */}
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Select Your Resume</h3>

          {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
          {success && <div className="mb-4"><SuccessBanner message={success} /></div>}

          {!file ? (
            <label htmlFor="resume-input">
              <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
              >
                <div className="upload-zone-icon">
                  <Upload size={28} />
                </div>
                <h3>Drop your resume here</h3>
                <p style={{ marginBottom: '1rem' }}>or click to browse files</p>
                <div className="badge badge-purple">PDF, DOC, DOCX · Max 10MB</div>
              </div>
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={onFileInput}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div>
              {/* File Preview */}
              <div className="card" style={{ background: 'var(--bg-input)', marginBottom: '1rem' }}>
                <div className="flex items-center gap-3">
                  <div className="stat-icon purple">
                    <File size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatSize(file.size)} · {file.type.split('/').pop().toUpperCase()}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-icon" onClick={() => setFile(null)}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Uploading...</>
                ) : (
                  <><Upload size={18} /> Analyze Resume</>
                )}
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setFile(null)}
              >
                Choose Different File
              </button>
            </div>
          )}
        </Card>

        {/* Info Panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <h4 style={{ marginBottom: '1rem' }}>What We Analyze</h4>
            {[
              { icon: '🎯', label: 'ATS Compatibility', desc: 'How well your resume passes applicant tracking systems' },
              { icon: '📊', label: 'Section Scores', desc: 'Individual ratings for experience, education, skills & summary' },
              { icon: '🔑', label: 'Keyword Analysis', desc: 'Missing and matched keywords for your target role' },
              { icon: '💡', label: 'Actionable Tips', desc: 'Specific improvements to boost your resume score' }
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3" style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <h4 style={{ marginBottom: '0.75rem' }}>Supported Formats</h4>
            <div className="flex gap-2 flex-wrap">
              {['PDF', 'DOC', 'DOCX'].map(fmt => (
                <div key={fmt} className="badge badge-blue">{fmt}</div>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Maximum file size: 10MB. We recommend PDF format for best results.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
