import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Users, Award, Video, Plus, Search, Edit3, Trash2, Save, X, Filter, 
  BookOpen, Calendar, Image as ImageIcon, PlayCircle, CheckCircle, RefreshCw, Sparkles, AlertCircle, CheckCircle2, Building2,
  Lock, Unlock, Upload, DollarSign, UserCheck, ShieldAlert, Check, Link as LinkIcon, FileText, Trophy, Crown
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('marks');

  // --- TAB 1: STUDENTS STATES ---
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // --- TAB 2: MARKS STATES ---
  const [marksBatchYear, setMarksBatchYear] = useState('2028');
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [entrySheet, setEntrySheet] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [saveMarksMsg, setSaveMarksMsg] = useState('');
  const [batchToppers, setBatchToppers] = useState({});

  // New Exam Modal
  const [showExamModal, setShowExamModal] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamSubjectType, setNewExamSubjectType] = useState('Pure');
  const [newExamMaxMarks, setNewExamMaxMarks] = useState('100');

  // --- TAB 3: MEDIA STATES ---
  const [mediaItems, setMediaItems] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('');
  const [playlistFilter, setPlaylistFilter] = useState('all');

  // New Media Form
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaType, setMediaType] = useState('video');
  const [mediaSource, setMediaSource] = useState('link'); // 'link' | 'file'
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPlaylist, setMediaPlaylist] = useState('General');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaIsPaid, setMediaIsPaid] = useState(false);
  const [mediaPrice, setMediaPrice] = useState('');

  // Access Modal state & student filters
  const [accessModalMedia, setAccessModalMedia] = useState(null);
  const [grantStudentIdInput, setGrantStudentIdInput] = useState('');
  const [modalBatchFilter, setModalBatchFilter] = useState('all');
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalStudents, setModalStudents] = useState([]);
  const [loadingModalStudents, setLoadingModalStudents] = useState(false);

  // -------------------------------------------------------------
  // FETCHERS
  // -------------------------------------------------------------
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await API.get(`/students?alYear=${selectedBatch}&search=${searchQuery}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchExamsForBatch = async () => {
    try {
      const res = await API.get(`/marks/exams?alYear=${marksBatchYear}`);
      setExams(res.data);
      if (res.data.length > 0) {
        setSelectedExamId(res.data[0]._id);
      } else {
        setSelectedExamId('');
        setEntrySheet([]);
        setCurrentExam(null);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const fetchExamEntrySheet = async () => {
    if (!selectedExamId) {
      setEntrySheet([]);
      setCurrentExam(null);
      return;
    }
    setLoadingMarks(true);
    try {
      const res = await API.get(`/marks/exam/${selectedExamId}/students`);
      setCurrentExam(res.data.exam);
      setEntrySheet(res.data.entrySheet);
    } catch (err) {
      console.error('Error fetching entry sheet:', err);
    } finally {
      setLoadingMarks(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await API.get(`/media?type=${mediaTypeFilter}&playlist=${playlistFilter}`);
      setMediaItems(res.data.media);
      setPlaylists(res.data.playlists);
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const fetchBatchToppers = async () => {
    try {
      const res = await API.get(`/marks/batch-toppers?alYear=${marksBatchYear}`);
      setBatchToppers(res.data);
    } catch (err) {
      console.error('Error fetching batch toppers:', err);
    }
  };

  const fetchModalStudents = async () => {
    if (!accessModalMedia) return;
    setLoadingModalStudents(true);
    try {
      const res = await API.get(`/students?alYear=${modalBatchFilter}&search=${modalSearchQuery}`);
      setModalStudents(res.data);
    } catch (err) {
      console.error('Error fetching modal students:', err);
    } finally {
      setLoadingModalStudents(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
  }, [activeTab, selectedBatch]);

  useEffect(() => {
    if (activeTab === 'marks') {
      fetchExamsForBatch();
      fetchBatchToppers();
    }
  }, [activeTab, marksBatchYear]);

  useEffect(() => {
    if (activeTab === 'marks' && selectedExamId) fetchExamEntrySheet();
  }, [selectedExamId]);

  useEffect(() => {
    if (activeTab === 'media') fetchMedia();
  }, [activeTab, mediaTypeFilter, playlistFilter]);

  useEffect(() => {
    if (accessModalMedia) fetchModalStudents();
  }, [accessModalMedia, modalBatchFilter, modalSearchQuery]);

  // -------------------------------------------------------------
  // HANDLERS: STUDENTS
  // -------------------------------------------------------------
  const handleDeleteStudent = async (id, studentId) => {
    if (!window.confirm(`Are you sure you want to delete student ${studentId}? This will remove all their mark records!`)) return;
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Error deleting student');
    }
  };

  const handleUpdateStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/students/${editingStudent._id}`, editingStudent);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      alert('Error updating student');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: MARKS & EXAMS
  // -------------------------------------------------------------
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    try {
      const res = await API.post('/marks/exams', {
        examName: newExamName,
        subjectType: newExamSubjectType,
        alYear: marksBatchYear,
        maxMarks: newExamMaxMarks
      });
      setShowExamModal(false);
      setNewExamName('');
      await fetchExamsForBatch();
      setSelectedExamId(res.data._id);
    } catch (err) {
      alert('Error creating exam');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Delete this exam and all student marks for it?')) return;
    try {
      await API.delete(`/marks/exams/${examId}`);
      fetchExamsForBatch();
    } catch (err) {
      alert('Error deleting exam');
    }
  };

  const calculateGradeHelper = (score, max = 100) => {
    if (score === '' || score === null || isNaN(score)) return '-';
    const pct = (Number(score) / max) * 100;
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 35) return 'S';
    return 'F';
  };

  const handleMarkChange = (index, field, value) => {
    const updated = [...entrySheet];
    updated[index][field] = value;
    if (field === 'marks') {
      updated[index].grade = calculateGradeHelper(value, currentExam?.maxMarks || 100);
    }
    setEntrySheet(updated);
  };

  const handleSaveMarksBatch = async () => {
    if (!selectedExamId) {
      alert('Please select or create an exam first!');
      return;
    }
    try {
      const res = await API.post('/marks/batch', {
        examId: selectedExamId,
        marksData: entrySheet
      });
      setSaveMarksMsg(`✅ Saved marks for ${res.data.count || entrySheet.length} students!`);
      setTimeout(() => setSaveMarksMsg(''), 4000);
      fetchExamEntrySheet();
      fetchBatchToppers();
    } catch (err) {
      alert('Error saving marks batch');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: MEDIA
  // -------------------------------------------------------------
  const handleAddMedia = async (e) => {
    e.preventDefault();
    try {
      if (mediaSource === 'file' && mediaFile) {
        const formData = new FormData();
        formData.append('title', mediaTitle);
        formData.append('type', mediaType);
        formData.append('mediaSource', 'file');
        formData.append('file', mediaFile);
        formData.append('playlistName', mediaPlaylist);
        formData.append('description', mediaDescription);
        formData.append('isPaid', mediaIsPaid);
        formData.append('price', mediaIsPaid ? mediaPrice : 0);

        await API.post('/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('/media', {
          title: mediaTitle,
          type: mediaType,
          mediaSource: 'link',
          url: mediaUrl,
          playlistName: mediaPlaylist,
          description: mediaDescription,
          isPaid: mediaIsPaid,
          price: mediaIsPaid ? mediaPrice : 0
        });
      }

      setMediaTitle('');
      setMediaUrl('');
      setMediaFile(null);
      setMediaDescription('');
      setMediaIsPaid(false);
      setMediaPrice('');
      fetchMedia();
    } catch (err) {
      alert('Error adding media item');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Delete this media item?')) return;
    try {
      await API.delete(`/media/${id}`);
      fetchMedia();
    } catch (err) {
      alert('Error deleting media item');
    }
  };

  const handleMakeFreeSingle = async (id) => {
    try {
      await API.put(`/media/${id}/make-free`);
      fetchMedia();
      if (accessModalMedia && accessModalMedia._id === id) {
        setAccessModalMedia(prev => prev ? { ...prev, isPaid: false, price: 0 } : null);
      }
    } catch (err) {
      alert('Error making item free');
    }
  };

  const handleMakeAllFree = async () => {
    if (!window.confirm('Are you sure you want to make ALL media items free for every student?')) return;
    try {
      await API.put('/media/make-all-free');
      fetchMedia();
    } catch (err) {
      alert('Error making all media free');
    }
  };

  const handleGrantAccess = async () => {
    if (!grantStudentIdInput.trim() || !accessModalMedia) return;
    try {
      const res = await API.post(`/media/${accessModalMedia._id}/grant-access`, {
        studentId: grantStudentIdInput.trim()
      });
      setAccessModalMedia(res.data.media);
      setGrantStudentIdInput('');
      fetchMedia();
    } catch (err) {
      alert('Error granting student access');
    }
  };

  const handleRevokeAccess = async (studentIdToRevoke) => {
    if (!accessModalMedia) return;
    try {
      const res = await API.post(`/media/${accessModalMedia._id}/revoke-access`, {
        studentId: studentIdToRevoke
      });
      setAccessModalMedia(res.data.media);
      fetchMedia();
    } catch (err) {
      alert('Error revoking student access');
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1rem 3rem' }}>
      
      {/* Top Admin Dashboard Navigation Tabs */}
      <div className="mobile-stack" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('marks')}
          className="glass-card"
          style={{
            flex: 1,
            padding: '1.25rem',
            border: activeTab === 'marks' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
            background: activeTab === 'marks' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
            color: activeTab === 'marks' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)' }}>
            <Award size={24} color="#6ee7b7" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Marks Entry & Exams</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Add Pure / Applied exam scores</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className="glass-card"
          style={{
            flex: 1,
            padding: '1.25rem',
            border: activeTab === 'students' ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
            background: activeTab === 'students' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
            color: activeTab === 'students' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)' }}>
            <Users size={24} color="#818cf8" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Student Directory</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Manage & search student profiles</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className="glass-card"
          style={{
            flex: 1,
            padding: '1.25rem',
            border: activeTab === 'media' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
            background: activeTab === 'media' ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-card)',
            color: activeTab === 'media' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)' }}>
            <Video size={24} color="#67e8f9" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Media & Playlists</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Upload videos, photos & playlists</div>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB: MARKS & EXAMS ENTRY */}
      {/* ========================================================= */}
      {activeTab === 'marks' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
          
          {/* BATCH TOP PERFORMERS (HIGHEST AVERAGE STUDENT CARD) */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)', 
            border: '1px solid rgba(245, 158, 11, 0.35)', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.25)', padding: '0.5rem', borderRadius: '10px' }}>
                  <Trophy size={22} color="#fcd34d" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fef08a' }}>Batch Top Performers (Highest Average)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Highest scoring overall student for {marksBatchYear} A/L Batch</p>
                </div>
              </div>
            </div>

            {(() => {
              let currentBatchToppers = (batchToppers.toppers && String(batchToppers.alYear) === String(marksBatchYear))
                ? batchToppers.toppers
                : (batchToppers.toppersByBatch && batchToppers.toppersByBatch[String(marksBatchYear)])
                || (batchToppers[String(marksBatchYear)])
                || [];

              // Real-time fallback from entry sheet if DB toppers empty
              const validSheetMarks = entrySheet.filter(
                item => item.marks !== '' && item.marks !== null && !isNaN(Number(item.marks))
              );
              if (currentBatchToppers.length === 0 && validSheetMarks.length > 0) {
                const sortedSheet = [...validSheetMarks].sort((a, b) => Number(b.marks) - Number(a.marks));
                const sheetTop = sortedSheet[0];
                currentBatchToppers = [{
                  student: {
                    firstName: sheetTop.name,
                    lastName: '',
                    studentId: sheetTop.studentId,
                    school: sheetTop.school || 'N/A',
                    alYear: marksBatchYear
                  },
                  overallAverage: Number(sheetTop.marks),
                  examsTaken: 1,
                  highestMark: Number(sheetTop.marks)
                }];
              }

              if (currentBatchToppers.length === 0) {
                return (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '10px', textAlign: 'center' }}>
                    No exam scores recorded yet for <strong>{marksBatchYear} A/L Batch</strong> to determine top performer.
                  </div>
                );
              }
              const topOne = currentBatchToppers[0];
              const runnersUp = currentBatchToppers.slice(1, 3);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* #1 TOPPER HIGHLIGHT CARD */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '2px solid #f59e0b',
                    borderRadius: '14px',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#000000',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)'
                      }}>
                        <Crown size={28} color="#000000" />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>#1 HIGHEST AVERAGE SCORE</span>
                          <span style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 800 }}>{topOne.student.alYear} A/L BATCH</span>
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', marginTop: '0.2rem', letterSpacing: '-0.01em' }}>
                          {topOne.student.firstName} {topOne.student.lastName}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.2rem', marginTop: '0.25rem' }}>
                          <span>Student ID: <strong style={{ color: '#818cf8', fontSize: '0.95rem' }}>{topOne.student.studentId}</strong></span>
                          <span>School: <strong style={{ color: '#67e8f9' }}>{topOne.student.school || 'N/A'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', background: 'rgba(16, 185, 129, 0.12)', padding: '0.6rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#6ee7b7', lineHeight: 1.1 }}>
                        {topOne.overallAverage}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.2rem' }}>
                        Highest Paper Average
                      </div>
                    </div>
                  </div>

                  {/* RUNNERS UP (#2 & #3) IF AVAILABLE */}
                  {runnersUp.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.2rem' }}>
                      {runnersUp.map((st, idx) => (
                        <div key={st.student.studentId} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: idx === 0 ? '#cbd5e1' : '#b45309' }}>
                              #{idx + 2} TOPPER
                            </span>
                            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{st.student.firstName} {st.student.lastName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>ID: {st.student.studentId}</div>
                          </div>
                          <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '1.2rem' }}>
                            {st.overallAverage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={22} color="#10b981" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Batch Student Marks Entry</h2>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Create Pure or Applied Maths exams, select batch, and enter student scores.
              </p>
            </div>

            <button 
              onClick={() => setShowExamModal(true)} 
              className="btn-primary" 
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
            >
              <Plus size={18} /> Create New Exam
            </button>
          </div>

          {/* STEP 1 & 2 CONTROL BAR */}
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.75)', 
            border: '1px solid var(--border-glow)', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.5rem' }}>
                <Filter size={15} /> 1. Select A/L Batch Year
              </label>
              <select 
                className="glass-input" 
                style={{ fontWeight: 700, fontSize: '1rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(15, 23, 42, 0.9)' }} 
                value={marksBatchYear} 
                onChange={(e) => setMarksBatchYear(e.target.value)}
              >
                <option value="2025">2025 A/L Batch</option>
                <option value="2026">2026 A/L Batch</option>
                <option value="2027">2027 A/L Batch</option>
                <option value="2028">2028 A/L Batch</option>
                <option value="2029">2029 A/L Batch</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.5rem' }}>
                <BookOpen size={15} /> 2. Select Exam ({marksBatchYear} Batch)
              </label>
              <select 
                className="glass-input" 
                style={{ fontWeight: 700, fontSize: '1rem', borderColor: 'rgba(99, 102, 241, 0.4)', background: 'rgba(15, 23, 42, 0.9)' }} 
                value={selectedExamId} 
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                {exams.length === 0 ? (
                  <option value="">No exams created yet for {marksBatchYear} batch</option>
                ) : (
                  exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      [{ex.subjectType ? ex.subjectType.toUpperCase() : 'PURE'}] {ex.examName} ({new Date(ex.date).toLocaleDateString()}) - Max Score: {ex.maxMarks}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {currentExam && (() => {
            const validSheetMarks = entrySheet.filter(
              item => item.marks !== '' && item.marks !== null && !isNaN(Number(item.marks))
            );
            const sortedSheet = [...validSheetMarks].sort((a, b) => Number(b.marks) - Number(a.marks));
            const topScorer = sortedSheet.length > 0 ? sortedSheet[0] : null;

            return (
              <div style={{ 
                background: currentExam.subjectType === 'Applied' 
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)' 
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(126, 34, 206, 0.15) 100%)', 
                border: currentExam.subjectType === 'Applied' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)', 
                padding: '1.25rem 1.75rem', 
                borderRadius: '16px', 
                marginBottom: '1.8rem', 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-success">{currentExam.alYear} Batch</span>
                    <span style={{ 
                      background: currentExam.subjectType === 'Applied' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'linear-gradient(135deg, #a855f7, #7e22ce)',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}>
                      {currentExam.subjectType === 'Applied' ? '🔷 APPLIED MATHS' : '🟣 PURE MATHS'}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{currentExam.examName}</h3>

                    {topScorer && (
                      <span style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.5)',
                        color: '#fef08a',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                      }}>
                        <Trophy size={14} color="#fcd34d" /> Top Score: {topScorer.name} ({topScorer.marks} / {currentExam.maxMarks} Marks)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>Max Marks: <strong style={{ color: '#ffffff' }}>{currentExam.maxMarks}</strong></span>
                    <span>Registered Students: <strong style={{ color: '#6ee7b7' }}>{entrySheet.length}</strong></span>
                  </div>
                </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {saveMarksMsg && (
                  <span style={{ color: '#6ee7b7', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={18} /> {saveMarksMsg}
                  </span>
                )}
                <button 
                  onClick={handleSaveMarksBatch} 
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 800 }}
                >
                  <Save size={18} /> Save All Student Marks
                </button>
                <button 
                  onClick={() => handleDeleteExam(currentExam._id)} 
                  className="btn-danger" 
                  style={{ padding: '0.8rem 1rem' }}
                  title="Delete Exam"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            );
          })()}

          {loadingMarks ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              ⏳ Loading registered students for {marksBatchYear} batch...
            </div>
          ) : !selectedExamId ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '16px', 
              border: '1px dashed var(--border-glass)',
              color: 'var(--text-muted)' 
            }}>
              <BookOpen size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>No Exam Selected for {marksBatchYear} Batch</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
                Select an existing exam from the dropdown above or click below to create a new exam.
              </p>
              <button onClick={() => setShowExamModal(true)} className="btn-primary">
                <Plus size={18} /> Create Exam for {marksBatchYear} Batch
              </button>
            </div>
          ) : entrySheet.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              ⚠️ No students are currently registered in the <strong>{marksBatchYear} A/L Batch</strong>. Go to Student Directory to register students.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th style={{ width: '130px' }}>Student ID</th>
                    <th>Student Full Name</th>
                    <th>School Name</th>
                    <th>ID Number (NIC)</th>
                    <th style={{ width: '150px' }}>Marks (0 - {currentExam?.maxMarks || 100})</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Grade</th>
                    <th>Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {entrySheet.map((item, idx) => {
                    const gradeVal = item.grade || calculateGradeHelper(item.marks, currentExam?.maxMarks || 100);
                    let badgeClass = 'badge-primary';
                    if (gradeVal === 'A') badgeClass = 'badge-success';
                    else if (gradeVal === 'F') badgeClass = 'btn-danger';
                    else if (gradeVal === 'B' || gradeVal === 'C') badgeClass = 'badge-warning';

                    return (
                      <tr key={item.studentId} style={{ transition: 'background 0.2s ease' }}>
                        <td style={{ fontWeight: 700, color: 'var(--text-dim)' }}>{idx + 1}</td>
                        <td>
                          <span style={{ fontWeight: 800, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                            {item.studentId}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                          {item.name}
                        </td>
                        <td style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.school || 'N/A'}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {item.idNumber}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={currentExam?.maxMarks || 100}
                            placeholder="Enter score"
                            className="glass-input"
                            style={{ 
                              fontWeight: 800, 
                              fontSize: '1.05rem', 
                              padding: '0.5rem 0.8rem', 
                              borderColor: item.marks !== '' ? 'var(--accent-emerald)' : 'var(--border-glass)',
                              background: item.marks !== '' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)'
                            }}
                            value={item.marks}
                            onChange={(e) => handleMarkChange(idx, 'marks', e.target.value)}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                            {gradeVal}
                          </span>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. Top performer / Absence"
                            className="glass-input"
                            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                            value={item.remarks}
                            onChange={(e) => handleMarkChange(idx, 'remarks', e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {currentExam && entrySheet.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleSaveMarksBatch} 
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '0.9rem 2.5rem', fontSize: '1.1rem', fontWeight: 800, boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)' }}
              >
                <Save size={20} /> Save All Student Marks
              </button>
            </div>
          )}

          {showExamModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Create New Exam ({marksBatchYear} Batch)</h3>
                  <button onClick={() => setShowExamModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={22} /></button>
                </div>

                <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Exam Name</label>
                    <input type="text" required placeholder="e.g. Kinematics & Integration Test 01" className="glass-input" value={newExamName} onChange={(e) => setNewExamName(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Subject Category (Pure / Applied)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <button
                        type="button"
                        onClick={() => setNewExamSubjectType('Pure')}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: newExamSubjectType === 'Pure' ? '2px solid #a855f7' : '1px solid var(--border-glass)',
                          background: newExamSubjectType === 'Pure' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                          color: '#ffffff',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        🟣 Pure Maths
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewExamSubjectType('Applied')}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: newExamSubjectType === 'Applied' ? '2px solid #06b6d4' : '1px solid var(--border-glass)',
                          background: newExamSubjectType === 'Applied' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                          color: '#ffffff',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        🔷 Applied Maths
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Target A/L Batch</label>
                    <input type="text" disabled className="glass-input" value={`${marksBatchYear} A/L Batch`} style={{ opacity: 0.7 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Maximum Score (Default: 100)</label>
                    <input type="number" required defaultValue="100" className="glass-input" value={newExamMaxMarks} onChange={(e) => setNewExamMaxMarks(e.target.value)} />
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <Plus size={18} /> Create Exam & Open Entry Sheet
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: STUDENTS DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Registered Students Directory</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View, search, edit or remove student profiles</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="glass-input"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="all">All Batches</option>
                  <option value="2025">2025 A/L</option>
                  <option value="2026">2026 A/L</option>
                  <option value="2027">2027 A/L</option>
                  <option value="2028">2028 A/L</option>
                  <option value="2029">2029 A/L</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Search name, ID, school, NIC..."
                  className="glass-input"
                  style={{ width: '240px', padding: '0.5rem 1rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => { if (e.key === 'Enter') fetchStudents(); }}
                />
                <button onClick={fetchStudents} className="btn-secondary" style={{ padding: '0.55rem' }}>
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>School</th>
                  <th>ID Number (NIC)</th>
                  <th>A/L Batch</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No students found for selected batch.</td></tr>
                ) : (
                  students.map((st) => (
                    <tr key={st._id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{st.studentId}</td>
                      <td style={{ fontWeight: 600 }}>{st.firstName} {st.lastName}</td>
                      <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{st.school || 'N/A'}</td>
                      <td>{st.idNumber}</td>
                      <td><span className="badge badge-primary">{st.alYear} A/L</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(st.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setEditingStudent(st)} className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Edit Student">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDeleteStudent(st._id, st.studentId)} className="btn-danger" style={{ padding: '0.35rem 0.6rem' }} title="Delete Student">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {editingStudent && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Student ({editingStudent.studentId})</h3>
                  <button onClick={() => setEditingStudent(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleUpdateStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First Name</label>
                    <input type="text" className="glass-input" value={editingStudent.firstName} onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last Name</label>
                    <input type="text" className="glass-input" value={editingStudent.lastName} onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>School Name</label>
                    <input type="text" className="glass-input" value={editingStudent.school || ''} onChange={(e) => setEditingStudent({ ...editingStudent, school: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID Number (NIC)</label>
                    <input type="text" className="glass-input" value={editingStudent.idNumber} onChange={(e) => setEditingStudent({ ...editingStudent, idNumber: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}><Save size={16} /> Update Details</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: MEDIA & PLAYLISTS */}
      {/* ========================================================= */}
      {activeTab === 'media' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          
          {/* MEDIA UPLOAD FORM */}
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.3rem' }}>Upload Video / Photo</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add study materials for MathiQ students</p>

            <form onSubmit={handleAddMedia} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Media Title</label>
                <input type="text" required placeholder="e.g. Mechanics Lecture 01" className="glass-input" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Media Category</label>
                <select className="glass-input" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                  <option value="video">🎥 Video (Lecture / Revision)</option>
                  <option value="photo">🖼️ Photo / Note Document</option>
                </select>
              </div>

              {/* Source Switch: Link vs Direct File Upload */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Source Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setMediaSource('link')}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: mediaSource === 'link' ? '2px solid #06b6d4' : '1px solid var(--border-glass)',
                      background: mediaSource === 'link' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <LinkIcon size={16} /> Link / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSource('file')}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: mediaSource === 'file' ? '2px solid #a855f7' : '1px solid var(--border-glass)',
                      background: mediaSource === 'file' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Upload size={16} /> Upload File
                  </button>
                </div>
              </div>

              {mediaSource === 'link' ? (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Video / Image Link (URL)</label>
                  <input type="url" required placeholder="https://www.youtube.com/watch?v=..." className="glass-input" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Select File (Video / Photo)</label>
                  <input type="file" required accept="video/*,image/*,.pdf" className="glass-input" onChange={(e) => setMediaFile(e.target.files[0])} />
                </div>
              )}

              {/* Free vs Paid Option */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem', display: 'block' }}>Access Pricing Option</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setMediaIsPaid(false)}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: !mediaIsPaid ? '2px solid #10b981' : '1px solid var(--border-glass)',
                      background: !mediaIsPaid ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Unlock size={16} color="#6ee7b7" /> FREE Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaIsPaid(true)}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: mediaIsPaid ? '2px solid #ec4899' : '1px solid var(--border-glass)',
                      background: mediaIsPaid ? 'rgba(236, 72, 153, 0.25)' : 'transparent',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Lock size={16} color="#f472b6" /> PAID Access
                  </button>
                </div>

                {mediaIsPaid && (
                  <div style={{ marginTop: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#f472b6', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Set Video Price (LKR / Amount)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1500"
                      className="glass-input"
                      style={{ borderColor: 'rgba(236, 72, 153, 0.4)', background: 'rgba(15, 23, 42, 0.95)', fontWeight: 800 }}
                      value={mediaPrice}
                      onChange={(e) => setMediaPrice(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Playlist Name</label>
                <input type="text" placeholder="e.g. Mechanics 2028 or Revision" className="glass-input" value={mediaPlaylist} onChange={(e) => setMediaPlaylist(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Description (Optional)</label>
                <textarea rows="3" placeholder="Brief notes for students..." className="glass-input" value={mediaDescription} onChange={(e) => setMediaDescription(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#ffffff', fontWeight: 800, padding: '0.85rem' }}>
                <Plus size={18} /> Publish Media
              </button>
            </form>
          </div>

          {/* MEDIA LIBRARY & ACCESS CONTROLS */}
          <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Uploaded Library</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage media access, grant permissions or make free</p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={handleMakeAllFree}
                  className="btn-secondary"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.8rem', fontWeight: 700, padding: '0.4rem 0.8rem' }}
                  title="Make all videos free for all students"
                >
                  <Unlock size={14} /> Make ALL Videos Free
                </button>

                <select className="glass-input" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} value={playlistFilter} onChange={(e) => setPlaylistFilter(e.target.value)}>
                  <option value="all">All Playlists</option>
                  {playlists.map((pl) => <option key={pl} value={pl}>{pl}</option>)}
                </select>
              </div>
            </div>

            {mediaItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No videos or photos published yet.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
                {mediaItems.map((item) => (
                  <div key={item._id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span className={`badge ${item.type === 'video' ? 'badge-primary' : 'badge-success'}`}>
                          {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                        </span>
                        
                        {item.isPaid ? (
                          <span style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#f472b6', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Lock size={12} /> PAID (Rs. {item.price})
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Unlock size={12} /> FREE
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>{item.playlistName}</div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.description || 'No description provided.'}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a 
                          href={item.mediaSource === 'file' ? item.fileUrl : item.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textDecoration: 'none' }}
                        >
                          Open Media &rarr;
                        </a>

                        <button onClick={() => handleDeleteMedia(item._id)} className="btn-danger" style={{ padding: '0.25rem 0.5rem' }} title="Delete Media">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.isPaid ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <button
                            onClick={() => setAccessModalMedia(item)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#a5b4fc' }}
                          >
                            <UserCheck size={13} /> Access ({item.allowedStudentIds ? item.allowedStudentIds.length : 0})
                          </button>
                          <button
                            onClick={() => handleMakeFreeSingle(item._id)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7' }}
                          >
                            <Unlock size={13} /> Make Free
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600, textAlign: 'center', background: 'rgba(16, 185, 129, 0.08)', padding: '0.3rem', borderRadius: '6px' }}>
                          Available to all students
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MANAGE STUDENT ACCESS MODAL */}
          {accessModalMedia && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '650px', padding: '2rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Manage Student Access</h3>
                    <p style={{ fontSize: '0.85rem', color: '#f472b6', fontWeight: 700, marginTop: '0.2rem' }}>
                      Video: {accessModalMedia.title} (Rs. {accessModalMedia.price})
                    </p>
                  </div>
                  <button onClick={() => setAccessModalMedia(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {/* FILTER BAR: BATCH NO & STUDENT ID SEARCH */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.3rem', display: 'block' }}>Filter Batch</label>
                    <select
                      className="glass-input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                      value={modalBatchFilter}
                      onChange={(e) => setModalBatchFilter(e.target.value)}
                    >
                      <option value="all">All Batches</option>
                      <option value="2025">2025 A/L</option>
                      <option value="2026">2026 A/L</option>
                      <option value="2027">2027 A/L</option>
                      <option value="2028">2028 A/L</option>
                      <option value="2029">2029 A/L</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.3rem', display: 'block' }}>Search Student ID / Name</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        placeholder="Search student ID, name..."
                        className="glass-input"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* DIRECTORY LIST OF STUDENTS WITH ACCESS TOGGLE */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.2rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    Select Student to Grant or Revoke Free Access ({modalStudents.length} Students found)
                  </h4>

                  {loadingModalStudents ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading students...</div>
                  ) : modalStudents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                      No students found matching current batch & search filters.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {modalStudents.map((st) => {
                        const isGranted = Array.isArray(accessModalMedia.allowedStudentIds) && accessModalMedia.allowedStudentIds.includes(st.studentId);

                        return (
                          <div
                            key={st._id}
                            style={{
                              display: 'flex',
                              justify: 'space-between',
                              alignItems: 'center',
                              background: isGranted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                              border: isGranted ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-glass)',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{st.studentId}</span>
                                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{st.firstName} {st.lastName}</span>
                                <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{st.alYear} A/L</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                School: <span style={{ color: 'var(--accent-cyan)' }}>{st.school || 'N/A'}</span>
                              </div>
                            </div>

                            <div>
                              {isGranted ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <span style={{ color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <CheckCircle size={14} /> Granted
                                  </span>
                                  <button
                                    onClick={() => handleRevokeAccess(st.studentId)}
                                    className="btn-danger"
                                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                  >
                                    Revoke
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await API.post(`/media/${accessModalMedia._id}/grant-access`, { studentId: st.studentId });
                                      setAccessModalMedia(res.data.media);
                                      fetchMedia();
                                    } catch (err) {
                                      alert('Error granting access');
                                    }
                                  }}
                                  className="btn-primary"
                                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                >
                                  <Plus size={13} /> Grant Free Access
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleMakeFreeSingle(accessModalMedia._id)}
                    className="btn-secondary"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7' }}
                  >
                    <Unlock size={16} /> Make Free for EVERYONE
                  </button>

                  <button onClick={() => setAccessModalMedia(null)} className="btn-secondary">
                    Close Modal
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
