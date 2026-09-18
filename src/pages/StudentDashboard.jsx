import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Award, BookOpen, Video, Lock, Unlock, MessageCircle, CheckCircle2, PlayCircle, Image as ImageIcon, Eye, Building2, Sparkles, Sigma, Compass, Layers 
} from 'lucide-react';

export default function StudentDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('performance'); // 'performance', 'class-marks', 'media'
  const [perfSubTab, setPerfSubTab] = useState('pure'); // 'pure', 'applied', 'combined'

  // --- TAB 1: PERFORMANCE STATES ---
  const [perfData, setPerfData] = useState(null);
  const [loadingPerf, setLoadingPerf] = useState(true);

  // --- TAB 2: CLASS MARKS STATES ---
  const [batchExams, setBatchExams] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(user.alYear ? String(user.alYear) : '2028');
  const [selectedExamName, setSelectedExamName] = useState('');
  const [examMarksView, setExamMarksView] = useState(null);
  const [loadingMarks, setLoadingMarks] = useState(false);

  // --- TAB 3: MEDIA STATES ---
  const [mediaList, setMediaList] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');

  // -------------------------------------------------------------
  // FETCHERS
  // -------------------------------------------------------------
  const fetchMyPerformance = async () => {
    setLoadingPerf(true);
    try {
      const res = await API.get(`/marks/performance/${user.studentId}`);
      setPerfData(res.data);
    } catch (err) {
      console.error('Error loading student performance:', err);
    } finally {
      setLoadingPerf(false);
    }
  };

  const fetchBatchExams = async () => {
    try {
      const res = await API.get(`/marks/grouped-exams?alYear=${selectedBatch}`);
      setBatchExams(res.data);
      if (res.data.length > 0) {
        setSelectedExamName(res.data[0].examName);
      } else {
        setSelectedExamName('');
        setExamMarksView(null);
      }
    } catch (err) {
      console.error('Error loading batch exams:', err);
    }
  };

  const fetchExamMarksView = async () => {
    if (!selectedExamName) return;
    setLoadingMarks(true);
    try {
      const res = await API.get(`/marks/grouped-view?examName=${encodeURIComponent(selectedExamName)}&alYear=${selectedBatch}`);
      setExamMarksView(res.data);
    } catch (err) {
      console.error('Error loading exam marks view:', err);
    } finally {
      setLoadingMarks(false);
    }
  };

  const fetchMediaLibrary = async () => {
    try {
      const res = await API.get(`/media?playlist=${selectedPlaylist}`);
      setMediaList(res.data.media);
      setPlaylists(res.data.playlists);
    } catch (err) {
      console.error('Error fetching media library:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'performance') fetchMyPerformance();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'class-marks') fetchBatchExams();
  }, [activeTab, selectedBatch]);

  useEffect(() => {
    if (activeTab === 'class-marks' && selectedExamName) fetchExamMarksView();
  }, [selectedExamName]);

  useEffect(() => {
    if (activeTab === 'media') fetchMediaLibrary();
  }, [activeTab, selectedPlaylist]);

  const getCurrentPerfObject = () => {
    if (!perfData) return null;
    if (perfSubTab === 'pure') return perfData.purePerformance;
    if (perfSubTab === 'applied') return perfData.appliedPerformance;
    return perfData.combinedPerformance;
  };

  const currentPerf = getCurrentPerfObject();

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1rem 3rem' }}>
      
      {/* Top Student Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('performance')}
          className="glass-card"
          style={{
            flex: 1,
            padding: '1.25rem',
            border: activeTab === 'performance' ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
            background: activeTab === 'performance' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
            color: activeTab === 'performance' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)' }}>
            <TrendingUp size={24} color="#818cf8" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>My Performance</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Pure, Applied & Average Bar Charts</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('class-marks')}
          className="glass-card"
          style={{
            flex: 1,
            padding: '1.25rem',
            border: activeTab === 'class-marks' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
            background: activeTab === 'class-marks' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
            color: activeTab === 'class-marks' ? '#ffffff' : 'var(--text-muted)',
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
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Class Exam Results</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>View exam marks for any batch</div>
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
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Video & Photo Library</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Playlists & study materials</div>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 3-CATEGORY PERFORMANCE ANALYTICS (CLEAN SINGLE BAR CHART) */}
      {/* ========================================================= */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#a5b4fc' }}>
            <Lock size={18} color="#818cf8" />
            <span><strong>Private Analytics:</strong> Confidential performance report for {user.firstName} {user.lastName} ({user.studentId}).</span>
          </div>

          {/* COLORFUL SUB-TAB NAVIGATION */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '1rem', 
            background: 'rgba(15, 23, 42, 0.7)', 
            padding: '0.5rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-glass)' 
          }}>
            <button
              onClick={() => setPerfSubTab('pure')}
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                border: perfSubTab === 'pure' ? '2px solid #a855f7' : 'none',
                background: perfSubTab === 'pure' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(126, 34, 206, 0.3) 100%)' : 'transparent',
                color: perfSubTab === 'pure' ? '#d8b4fe' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: perfSubTab === 'pure' ? '0 4px 14px rgba(168, 85, 247, 0.35)' : 'none'
              }}
            >
              <Sigma size={20} color="#a855f7" />
              <span>Pure Mathematics</span>
            </button>

            <button
              onClick={() => setPerfSubTab('applied')}
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                border: perfSubTab === 'applied' ? '2px solid #06b6d4' : 'none',
                background: perfSubTab === 'applied' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(2, 132, 199, 0.3) 100%)' : 'transparent',
                color: perfSubTab === 'applied' ? '#67e8f9' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: perfSubTab === 'applied' ? '0 4px 14px rgba(6, 182, 212, 0.35)' : 'none'
              }}
            >
              <Compass size={20} color="#06b6d4" />
              <span>Applied Mathematics</span>
            </button>

            <button
              onClick={() => setPerfSubTab('combined')}
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                border: perfSubTab === 'combined' ? '2px solid #10b981' : 'none',
                background: perfSubTab === 'combined' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)' : 'transparent',
                color: perfSubTab === 'combined' ? '#6ee7b7' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: perfSubTab === 'combined' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
              }}
            >
              <Layers size={20} color="#10b981" />
              <span>Average</span>
            </button>
          </div>

          {loadingPerf ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading performance analytics...
            </div>
          ) : !currentPerf ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No performance records found.
            </div>
          ) : (
            <>
              {/* Stat Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {perfSubTab === 'pure' ? 'Pure Exams Written' : perfSubTab === 'applied' ? 'Applied Exams Written' : 'Average Tests Taken'}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: perfSubTab === 'pure' ? '#a855f7' : perfSubTab === 'applied' ? '#06b6d4' : '#10b981', marginTop: '0.2rem' }}>
                    {currentPerf.stats.examsTaken}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {perfSubTab === 'combined' ? 'Average Score' : 'Overall Average Score'}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6ee7b7', marginTop: '0.2rem' }}>
                    {currentPerf.stats.overallAverage}%
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Highest Score</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                    {currentPerf.stats.highestMark}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>School</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perfData.student.school || user.school || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Interactive Performance Bar Chart (CLEAN SINGLE BAR PER EXAM) */}
              <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                      {perfSubTab === 'pure' ? '🟣 Pure Mathematics Performance Chart' : perfSubTab === 'applied' ? '🔷 Applied Mathematics Performance Chart' : '🟢 Average Performance Chart'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {perfSubTab === 'combined' ? 'Showing single average score bar per exam' : 'Student score per examination'}
                    </p>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                    {perfSubTab === 'combined' ? 'AVERAGE' : `${perfSubTab.toUpperCase()} MATHS`}
                  </span>
                </div>

                {currentPerf.graphTimeline.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-dim)' }}>
                    No {perfSubTab.toUpperCase()} exam marks recorded for your ID yet. Marks will appear here once Admin publishes test scores!
                  </div>
                ) : (
                  <div style={{ width: '100%', height: 380 }}>
                    <ResponsiveContainer>
                      <BarChart data={currentPerf.graphTimeline} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="examName" stroke="var(--text-muted)" fontSize={12} />
                        <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid var(--border-glass)', borderRadius: '10px', color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '15px' }} />
                        <Bar 
                          dataKey="myScore" 
                          name={perfSubTab === 'combined' ? 'Average Score' : 'My Score'} 
                          fill={perfSubTab === 'pure' ? '#a855f7' : perfSubTab === 'applied' ? '#06b6d4' : '#10b981'} 
                          radius={[8, 8, 0, 0]}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLASS EXAM RESULTS */}
      {/* ========================================================= */}
      {activeTab === 'class-marks' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Class Exam Results</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View Pure & Applied examination scores & rankings</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <select className="glass-input" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                <option value="2025">2025 A/L Batch</option>
                <option value="2026">2026 A/L Batch</option>
                <option value="2027">2027 A/L Batch</option>
                <option value="2028">2028 A/L Batch</option>
                <option value="2029">2029 A/L Batch</option>
              </select>

              <select className="glass-input" value={selectedExamName} onChange={(e) => setSelectedExamName(e.target.value)}>
                {batchExams.length === 0 ? (
                  <option value="">No exams found</option>
                ) : (
                  batchExams.map((ex) => (
                    <option key={ex.examName} value={ex.examName}>
                      {ex.examName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {loadingMarks ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading results...</div>
          ) : !examMarksView ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Select an exam to view results.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-success">{examMarksView.alYear} Batch</span>
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#fff',
                  padding: '0.2rem 0.60rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  CLASS RESULTS
                </span>
                <strong style={{ fontSize: '1.1rem' }}>{examMarksView.examName}</strong>
              </div>

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>School</th>
                    <th style={{ color: '#d8b4fe' }}>Pure Marks</th>
                    <th style={{ color: '#67e8f9' }}>Applied Marks</th>
                    <th style={{ color: '#6ee7b7' }}>Full Average Marks</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {examMarksView.marks.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No marks recorded for this exam paper yet.</td></tr>
                  ) : (
                    examMarksView.marks.map((m, idx) => {
                      const isMe = m.studentId === user.studentId;
                      const studentSchool = m.studentObjId?.school || 'N/A';
                      return (
                        <tr key={m.studentId} style={{ background: isMe ? 'rgba(99, 102, 241, 0.12)' : 'transparent' }}>
                          <td style={{ fontWeight: 800 }}>#{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {m.studentId} {isMe && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>YOU</span>}
                          </td>
                          <td style={{ fontWeight: isMe ? 800 : 600, color: '#ffffff' }}>
                            {m.studentObjId ? `${m.studentObjId.firstName} ${m.studentObjId.lastName}` : 'Student'}
                          </td>
                          <td style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem' }}>
                            {studentSchool}
                          </td>
                          <td style={{ fontWeight: 700, color: '#c084fc', fontSize: '0.95rem' }}>{m.pureMark}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>{m.appliedMark}</td>
                          <td style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1.05rem' }}>{m.averageMark}</td>
                          <td><span className="badge badge-primary">{m.grade}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.remarks || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VIDEO & PHOTO LIBRARY */}
      {/* ========================================================= */}
      {activeTab === 'media' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Study Video & Photo Gallery</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Watch class lectures, revision playlists, and photo notes</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="glass-input" value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                <option value="all">All Playlists</option>
                {playlists.map((pl) => <option key={pl} value={pl}>{pl}</option>)}
              </select>
            </div>
          </div>

          {mediaList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No study videos or photo notes published for this playlist.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {mediaList.map((item) => {
                const targetUrl = item.mediaSource === 'file' ? item.fileUrl : item.url;
                const batchText = user.alYear ? `${user.alYear} A/L` : 'N/A';
                const whatsappMsg = `Hi, I am ${user.firstName} (Student ID: ${user.studentId}, Batch: ${batchText}). Requesting access for video "${item.title}" (Amount: Rs. ${item.price}). request the account number to paid`;
                const whatsappLink = `https://wa.me/94713126258?text=${encodeURIComponent(whatsappMsg)}`;

                return (
                  <div key={item._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span className={`badge ${item.type === 'video' ? 'badge-primary' : 'badge-success'}`}>
                          {item.type === 'video' ? 'VIDEO LECTURE' : 'PHOTO NOTE'}
                        </span>

                        {item.isPaid ? (
                          item.hasAccess ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Unlock size={12} /> UNLOCKED
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#f472b6', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Lock size={12} /> PAID (Rs. {item.price})
                            </span>
                          )
                        ) : (
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Unlock size={12} /> FREE
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>{item.playlistName}</div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{item.description || 'Class material.'}</p>
                    </div>

                    {item.hasAccess ? (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ width: '100%', textDecoration: 'none', background: item.type === 'video' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        {item.type === 'video' ? <PlayCircle size={18} /> : <Eye size={18} />}
                        <span>{item.type === 'video' ? 'Watch Lecture' : 'View Photo Note'}</span>
                      </a>
                    ) : (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{
                          width: '100%',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.9rem'
                        }}
                      >
                        <MessageCircle size={18} />
                        <span>PAID (Rs. {item.price}) - Request on WhatsApp</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
