import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function JoinTeam() {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'track'

  // Application form state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    course: '',
    address: '',
    areaOfInterest: 'Robotics',
    whyJoin: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: false, message: '' });

  // Track status state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const [domains, setDomains] = useState([
    'Robotics',
    'IoT & Telemetry',
    'Industrial Automation',
    'Drones & Computer Vision'
  ]);

  useEffect(() => {
    axios.get('/api/settings/domains').then(res => {
      if (res.data?.length > 0) {
        const titles = res.data.map(d => d.title);
        setDomains(titles);
        setForm(prev => ({ ...prev, areaOfInterest: titles[0] }));
      }
    }).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setStatus({ success: false, message: 'Please accept the club commitment terms & conditions.' });
      return;
    }

    setLoading(true);
    setStatus({ success: false, message: '' });

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('profilePhoto', file);

    try {
      await axios.post('/api/applications', fd);

      setStatus({
        success: true,
        message: 'Application successfully submitted! The Admin and Core Team will review your application soon.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setForm({
        fullName: '',
        email: '',
        phone: '',
        gender: 'Male',
        course: '',
        address: '',
        areaOfInterest: domains[0] || 'Robotics',
        whyJoin: ''
      });
      setFile(null);
      setPreview(null);
      setAgree(false);
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.error || 'Failed to submit application. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    setLookupResult(null);
    setLookupError('');

    try {
      const res = await axios.get(`/api/applications/check-status?query=${encodeURIComponent(lookupQuery.trim())}`);
      setLookupResult(res.data);
    } catch (err) {
      setLookupError(err.response?.data?.message || err.response?.data?.error || 'No application found with these details.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-6 py-14'>
      {/* Header */}
      <div className='text-center mb-10'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-tech text-cyan-300 mb-4 shadow-sm'>
          <span className='w-2 h-2 rounded-full bg-cyan-400 animate-ping' />
          <span>Recruitment Cycle Live • Direct Registration</span>
        </div>
        <h1 className='font-display text-4xl sm:text-6xl font-black text-white'>
          Join SMC Club 🦾
        </h1>
        <p className='text-slate-300 text-sm mt-3 max-w-lg mx-auto leading-relaxed'>
          Become a core builder in our robotics ecosystem. Access our hardware lab, build prototypes, and represent our university in national competitions.
        </p>

        {/* Tab switcher */}
        <div className='flex justify-center gap-3 mt-8'>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'apply'
                ? 'btn-primary-gradient shadow-lg scale-105'
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            📝 Membership Application
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'btn-cyan-gradient shadow-lg scale-105'
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            🔍 Track Status
          </button>
        </div>
      </div>

      {activeTab === 'track' ? (
        /* STATUS TRACKER TAB */
        <div className='glass-card p-8 sm:p-10 rounded-3xl space-y-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10'>
          <div className='text-center max-w-md mx-auto'>
            <h2 className='font-display text-2xl font-bold text-white'>Check Your Application Status</h2>
            <p className='text-xs text-slate-400 mt-1.5 font-tech'>
              Enter the email address or phone number you used when applying.
            </p>
          </div>

          <form onSubmit={handleLookup} className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
            <input
              required
              type='text'
              placeholder='Enter email or phone number...'
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              className='flex-1 px-4 py-3.5 rounded-xl glass-input text-xs'
            />
            <button
              type='submit'
              disabled={lookupLoading}
              className='btn-cyan-gradient text-xs px-6 py-3.5 rounded-xl font-bold'
            >
              {lookupLoading ? 'Checking...' : 'Check Status'}
            </button>
          </form>

          {lookupError && (
            <div className='p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center max-w-md mx-auto font-semibold'>
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className='glass p-6 rounded-2xl border border-white/10 max-w-md mx-auto space-y-4 bg-slate-950/90'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-400'>Applicant</span>
                <span className='font-bold text-white text-sm'>{lookupResult.fullName}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-400'>Specialization</span>
                <span className='text-xs font-semibold text-cyan-300 font-tech'>{lookupResult.areaOfInterest}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-400'>Review Status</span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  lookupResult.status === 'Approved' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : lookupResult.status === 'Rejected' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {lookupResult.status}
                </span>
              </div>
              {lookupResult.adminNotes && (
                <div className='pt-3 border-t border-white/10'>
                  <span className='text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-tech'>Admin Feedback</span>
                  <p className='text-xs text-slate-200 italic'>"{lookupResult.adminNotes}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : status.success ? (
        /* SUCCESS VIEW */
        <div className='glass-card p-10 sm:p-14 rounded-3xl border border-emerald-500/40 text-center space-y-5 bg-emerald-950/25 shadow-2xl shadow-emerald-500/10 my-4'>
          <div className='text-6xl'>🎉</div>
          <h2 className='font-display text-3xl sm:text-4xl font-black text-white'>Application Submitted Successfully!</h2>
          <p className='text-slate-200 text-sm sm:text-base max-w-md mx-auto leading-relaxed'>
            {status.message}
          </p>
          <div className='pt-4 flex flex-wrap justify-center gap-3'>
            <button
              onClick={() => setStatus({ success: false, message: '' })}
              className='glass px-6 py-3.5 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors'
            >
              Submit Another Application
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className='btn-primary-gradient px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg'
            >
              Track Application Status →
            </button>
          </div>
        </div>
      ) : (
        /* APPLICATION FORM */
        <form onSubmit={submit} className='glass-card p-8 sm:p-10 rounded-3xl space-y-6 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.15)]'>
          {status.message && !status.success && (
            <div className='p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium'>
              {status.message}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className='space-y-4'>
            <h2 className='font-tech text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/10 pb-2'>
              1. Candidate Credentials & Contact
            </h2>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Full Name *</label>
              <input
                required
                placeholder='Enter your full name'
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs'
              />
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>College / Student Email *</label>
                <input
                  required
                  type='email'
                  placeholder='Enter your college email address'
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>WhatsApp / Mobile *</label>
                <input
                  required
                  type='tel'
                  placeholder='+91 98765 43210'
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900 text-white'
                  style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                >
                  <option style={{ backgroundColor: '#0b1120', color: '#f8fafc' }} className='bg-slate-900 text-slate-100 py-2'>Male</option>
                  <option style={{ backgroundColor: '#0b1120', color: '#f8fafc' }} className='bg-slate-900 text-slate-100 py-2'>Female</option>
                  <option style={{ backgroundColor: '#0b1120', color: '#f8fafc' }} className='bg-slate-900 text-slate-100 py-2'>Other</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>Course & Year *</label>
                <input
                  required
                  placeholder='e.g. B.Tech Robotics 2nd Year'
                  value={form.course}
                  onChange={e => setForm({ ...form, course: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Hostel / City Address</label>
              <input
                placeholder='e.g. Room 204, Tech Hostel B'
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs'
              />
            </div>
          </div>

          {/* Section 2: Technical Interest */}
          <div className='space-y-4 pt-4 border-t border-white/10'>
            <h2 className='font-tech text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-2'>
              2. Technical Specialization & Motivation
            </h2>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Select Focus Domain *</label>
              <select
                value={form.areaOfInterest}
                onChange={e => setForm({ ...form, areaOfInterest: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900 text-white'
                style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
              >
                {domains.map(d => (
                  <option
                    key={d}
                    value={d}
                    style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                    className='bg-slate-900 text-slate-100 py-2'
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Why do you want to join SMC Club? *</label>
              <textarea
                required
                rows={3}
                placeholder='Tell us about your coding/hardware experience, tools you know (ROS2, Arduino, ESP32, Python, KiCAD, 3D printing), and what hardware you hope to build...'
                value={form.whyJoin}
                onChange={e => setForm({ ...form, whyJoin: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs'
              />
            </div>
          </div>

          {/* Section 3: Profile Photo Upload */}
          <div className='space-y-4 pt-4 border-t border-white/10'>
            <h2 className='font-tech text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-2'>
              3. Profile Picture (For Member Badge)
            </h2>

            <div className='flex items-center gap-6'>
              <div className='w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md'>
                {preview ? (
                  <img src={preview} alt='Preview' className='w-full h-full object-cover' />
                ) : (
                  <span className='text-3xl text-slate-600'>📷</span>
                )}
              </div>

              <div className='flex-1'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer'
                />
                <p className='text-[11px] text-slate-400 mt-1 font-tech'>Square JPG or PNG, max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Commitment Checkbox */}
          <div className='pt-2 flex items-start gap-3'>
            <input
              type='checkbox'
              id='agree'
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className='mt-1 rounded accent-cyan-400'
            />
            <label htmlFor='agree' className='text-xs text-slate-300 leading-relaxed cursor-pointer'>
              I confirm that the details provided are accurate and I commit to actively participating in laboratory project sprints, hackathons, and hardware building sessions.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-4 rounded-xl btn-primary-gradient text-sm font-black'
          >
            {loading ? 'Submitting Application...' : 'Submit Application 🚀'}
          </button>
        </form>
      )}
    </div>
  );
}
