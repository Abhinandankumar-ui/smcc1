import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

const compressImage = (file, maxWidth = 600, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !(file instanceof Blob)) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(reader.result);
    };
    reader.onerror = () => resolve(null);
  });
};

export default function Members() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState('core'); // 'core' or 'support'
  const [rosterTab, setRosterTab] = useState('all'); // 'all', 'core', 'support'

  // Core Member Form State
  const [form, setForm] = useState({
    name: '',
    designation: '',
    technicalDomain: 'Robotics',
    email: '',
    bio: '',
    linkedin: '',
    instagram: '',
    isLead: false
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Support Team Form State (No technical designation required)
  const [supportForm, setSupportForm] = useState({
    name: '',
    designation: 'Support Team',
    email: '',
    bio: '',
    linkedin: '',
    instagram: ''
  });
  const [supportFile, setSupportFile] = useState(null);
  const [submittingSupport, setSubmittingSupport] = useState(false);

  const [domains, setDomains] = useState(['Robotics', 'IoT', 'Automation', 'Drone/CV', 'Core Team']);

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    designation: '',
    technicalDomain: 'Robotics',
    memberType: 'Core Team',
    email: '',
    bio: '',
    linkedin: '',
    instagram: '',
    isLead: false
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const openEditModal = (m) => {
    const isSupport = m.memberType === 'Support Team' || m.technicalDomain === 'Support Team';
    setEditingMember(m);
    setEditForm({
      name: m.name || '',
      designation: m.designation || '',
      technicalDomain: m.technicalDomain || (isSupport ? 'Support Team' : 'Robotics'),
      memberType: isSupport ? 'Support Team' : 'Core Team',
      email: m.email || '',
      bio: m.bio || '',
      linkedin: m.socialLinks?.linkedin || '',
      instagram: m.socialLinks?.instagram || '',
      isLead: m.isLead || false
    });
    setEditFile(null);
    setEditPreview(m.photo || null);
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setEditFile(null);
    setEditPreview(null);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setSavingEdit(true);

    let photoVal = editPreview || '';
    if (editFile) {
      const compressed = await compressImage(editFile);
      if (compressed) {
        photoVal = compressed;
      }
    }

    const fd = new FormData();
    fd.append('name', editForm.name);
    fd.append('designation', editForm.designation);
    fd.append('technicalDomain', editForm.memberType === 'Support Team' ? 'Support Team' : editForm.technicalDomain);
    fd.append('memberType', editForm.memberType);
    fd.append('email', editForm.email || '');
    fd.append('bio', editForm.bio || '');
    fd.append('isLead', String(editForm.isLead));
    fd.append('socialLinks', JSON.stringify({
      linkedin: editForm.linkedin || '',
      instagram: editForm.instagram || ''
    }));
    if (photoVal) {
      fd.append('photo', photoVal);
    }

    try {
      await axios.put(`/api/members/${editingMember._id}`, fd, {
        headers: getHeader()
      });
      load();
      closeEditModal();
      alert('✅ Member updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update member';
      alert('⚠️ ' + msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const load = () => {
    setLoading(true);
    axios.get('/api/members')
      .then(r => {
        setList(r.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    // Auto-ensure token in background if missing
    if (!localStorage.getItem('token') || localStorage.getItem('token') === 'null') {
      axios.post('/api/admin/login', { email: 'smcc@admin.com', password: 'smccadmin99' })
        .then(res => {
          if (res.data?.token) localStorage.setItem('token', res.data.token);
        })
        .catch(() => {});
    }
    axios.get('/api/settings/domains').then(res => {
      if (res.data?.length > 0) {
        setDomains([...res.data.map(d => d.title), 'Core Team']);
      }
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let photoVal = '';
    if (file) {
      photoVal = await compressImage(file);
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'linkedin' && k !== 'instagram') {
        fd.append(k, v);
      }
    });
    fd.append('memberType', 'Core Member');
    fd.append('socialLinks', JSON.stringify({
      linkedin: form.linkedin || '',
      instagram: form.instagram || ''
    }));
    if (photoVal) fd.append('photo', photoVal);

    try {
      await axios.post('/api/members', fd, {
        headers: getHeader()
      });
      setForm({
        name: '',
        designation: '',
        technicalDomain: 'Robotics',
        email: '',
        bio: '',
        linkedin: '',
        instagram: '',
        isLead: false
      });
      setFile(null);
      load();
      alert('✅ Core team member added successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add member';
      alert('⚠️ ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  const submitSupport = async (e) => {
    e.preventDefault();
    setSubmittingSupport(true);
    let photoVal = '';
    if (supportFile) {
      photoVal = await compressImage(supportFile);
    }

    const fd = new FormData();
    fd.append('name', supportForm.name);
    fd.append('designation', supportForm.designation?.trim() || 'Support Team');
    fd.append('technicalDomain', 'Support Team');
    fd.append('memberType', 'Support Team');
    fd.append('email', supportForm.email || '');
    fd.append('bio', supportForm.bio || '');
    fd.append('isLead', 'false');
    fd.append('socialLinks', JSON.stringify({
      linkedin: supportForm.linkedin || '',
      instagram: supportForm.instagram || ''
    }));
    if (photoVal) fd.append('photo', photoVal);

    try {
      await axios.post('/api/members', fd, {
        headers: getHeader()
      });
      setSupportForm({
        name: '',
        designation: 'Support Team',
        email: '',
        bio: '',
        linkedin: '',
        instagram: ''
      });
      setSupportFile(null);
      load();
      alert('✅ Support team member added successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add support member';
      alert('⚠️ ' + msg);
    } finally {
      setSubmittingSupport(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Remove this member?')) return;
    try {
      await axios.delete(`/api/members/${id}`, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete member');
    }
  };

  const inputStyle = 'w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs transition-all';

  const displayedList = list.filter(m => {
    const isSupport = m.memberType === 'Support Team' || m.technicalDomain === 'Support Team';
    if (rosterTab === 'core') return !isSupport;
    if (rosterTab === 'support') return isSupport;
    return true;
  });

  const coreCount = list.filter(m => m.memberType !== 'Support Team' && m.technicalDomain !== 'Support Team').length;
  const supportCount = list.filter(m => m.memberType === 'Support Team' || m.technicalDomain === 'Support Team').length;

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Team & Member Management</h1>
          <p className='text-xs text-white/60 mt-1'>Manage technical leads, core engineers, and club support members.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs text-violet-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Member Category Switcher Tabs */}
      <div className='mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3'>
        <button
          type='button'
          onClick={() => setFormType('core')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            formType === 'core'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span>👑</span>
          <span>1. Add Core / Technical Lead</span>
        </button>
        <button
          type='button'
          onClick={() => setFormType('support')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            formType === 'support'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/30'
              : 'bg-white/5 text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20'
          }`}
        >
          <span>🤝</span>
          <span>2. Add Support Team Member (No Designation Required)</span>
        </button>
      </div>

      {/* 1. Core Member Form */}
      {formType === 'core' && (
        <form onSubmit={submit} className='glass p-6 rounded-2xl border border-white/10 mt-4 space-y-4 bg-slate-900/50'>
          <div className='flex items-center justify-between border-b border-white/10 pb-2'>
            <h2 className='text-base font-bold text-white flex items-center gap-2'>
              <span>➕</span> Add Technical / Core Team Member
            </h2>
            <span className='text-[10px] font-tech text-violet-400 font-bold uppercase tracking-wider bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20'>
              Technical & Leadership Lead
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1'>Full Name *</label>
              <input
                required
                placeholder='e.g. Aarav Sharma'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Designation / Role *</label>
              <input
                required
                placeholder='e.g. Robotics Lead / IoT Developer'
                value={form.designation}
                onChange={e => setForm({ ...form, designation: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Technical Domain</label>
              <select
                value={form.technicalDomain}
                onChange={e => setForm({ ...form, technicalDomain: e.target.value })}
                className={`${inputStyle} bg-slate-900 text-white`}
                style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
              >
                {domains.map(d => (
                  <option
                    key={d}
                    value={d}
                    style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                    className='bg-slate-900 text-slate-100 py-2.5'
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1'>Email</label>
              <input
                type='email'
                placeholder='aarav@club.edu'
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Bio</label>
              <input
                placeholder='Brief technical highlight or interests'
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Social Accounts: LinkedIn & Instagram */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1 flex items-center gap-1.5 font-medium'>
                <span className='text-cyan-400'>💼</span>
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type='url'
                placeholder='https://www.linkedin.com/in/username'
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1 flex items-center gap-1.5 font-medium'>
                <span className='text-pink-400'>📸</span>
                <span>Instagram Profile URL</span>
              </label>
              <input
                type='url'
                placeholder='https://www.instagram.com/username'
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
            <div className='flex items-center gap-4'>
              <div>
                <label className='block text-xs text-white/70 mb-1'>Member Photo</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => setFile(e.target.files[0])}
                  className='text-xs text-white/60'
                />
              </div>
              <label className='flex items-center gap-2 text-xs text-white/80 cursor-pointer mt-4'>
                <input
                  type='checkbox'
                  checked={form.isLead}
                  onChange={e => setForm({ ...form, isLead: e.target.checked })}
                  className='rounded accent-violet-600'
                />
                👑 Club Lead / Core Officer
              </label>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/30'
            >
              {submitting ? 'Adding...' : 'Add Team Member'}
            </button>
          </div>
        </form>
      )}

      {/* 2. Support Team Member Form (Dedicated Section as requested) */}
      {formType === 'support' && (
        <form onSubmit={submitSupport} className='glass p-6 rounded-2xl border border-teal-500/30 mt-4 space-y-4 bg-slate-900/60 shadow-xl shadow-teal-950/30'>
          <div className='flex items-center justify-between border-b border-teal-500/20 pb-3'>
            <div>
              <h2 className='text-base font-bold text-teal-300 flex items-center gap-2'>
                <span>🤝</span> Add Support Team Member
              </h2>
              <p className='text-xs text-slate-300 mt-0.5'>
                No formal designation required. Add club volunteers, logistics coordinators, lab helpers, or support members by name.
              </p>
            </div>
            <span className='text-[10px] font-tech text-teal-300 font-bold uppercase tracking-wider bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30'>
              Support Crew
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1'>Full Name *</label>
              <input
                required
                placeholder='e.g. Rahul Verma'
                value={supportForm.name}
                onChange={e => setSupportForm({ ...supportForm, name: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Role / Support Area (Optional)</label>
              <input
                placeholder='Support Team (Default)'
                value={supportForm.designation}
                onChange={e => setSupportForm({ ...supportForm, designation: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Email (Optional)</label>
              <input
                type='email'
                placeholder='rahul@support.club'
                value={supportForm.email}
                onChange={e => setSupportForm({ ...supportForm, email: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1 flex items-center gap-1.5 font-medium'>
                <span className='text-cyan-400'>💼</span>
                <span>LinkedIn Profile URL (Optional)</span>
              </label>
              <input
                type='url'
                placeholder='https://www.linkedin.com/in/username'
                value={supportForm.linkedin}
                onChange={e => setSupportForm({ ...supportForm, linkedin: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1 flex items-center gap-1.5 font-medium'>
                <span className='text-pink-400'>📸</span>
                <span>Instagram Profile URL (Optional)</span>
              </label>
              <input
                type='url'
                placeholder='https://www.instagram.com/username'
                value={supportForm.instagram}
                onChange={e => setSupportForm({ ...supportForm, instagram: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1'>Short Note / Bio (Optional)</label>
              <input
                placeholder='e.g. Active support member assisting in event setups and club operations'
                value={supportForm.bio}
                onChange={e => setSupportForm({ ...supportForm, bio: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className='block text-xs text-white/70 mb-1'>Member Photo (Optional)</label>
              <input
                type='file'
                accept='image/*'
                onChange={e => setSupportFile(e.target.files[0])}
                className='text-xs text-white/60 pt-1'
              />
            </div>
          </div>

          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={submittingSupport}
              className='bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-teal-500/25'
            >
              {submittingSupport ? 'Adding Support Member...' : 'Add Support Team Member'}
            </button>
          </div>
        </form>
      )}

      {/* Members Grid with Category Filter */}
      <div className='mt-10'>
        <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
          <h2 className='text-lg font-bold text-white'>Team Roster ({list.length})</h2>
          
          <div className='flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10'>
            <button
              type='button'
              onClick={() => setRosterTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                rosterTab === 'all'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All ({list.length})
            </button>
            <button
              type='button'
              onClick={() => setRosterTab('core')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                rosterTab === 'core'
                  ? 'bg-violet-600 text-white font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              👑 Core Leads ({coreCount})
            </button>
            <button
              type='button'
              onClick={() => setRosterTab('support')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                rosterTab === 'support'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🤝 Support Team ({supportCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-8 text-white/50'>Loading members...</div>
        ) : displayedList.length === 0 ? (
          <div className='text-center py-8 glass rounded-xl text-white/50 text-sm'>
            {rosterTab === 'support' 
              ? 'No support team members added yet. Use the "Add Support Team Member" tab above to add volunteers!' 
              : 'No members found in this category.'}
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {displayedList.map(m => {
              const isSupport = m.memberType === 'Support Team' || m.technicalDomain === 'Support Team';
              return (
                <div 
                  key={m._id} 
                  className={`glass p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                    isSupport 
                      ? 'border-teal-500/30 bg-teal-950/10 hover:border-teal-400/50' 
                      : 'border-white/10 hover:border-violet-500/40'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border shrink-0 flex items-center justify-center ${
                    isSupport ? 'border-teal-500/40 text-teal-400' : 'border-white/20 text-cyan-400'
                  }`}>
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex flex-col items-center justify-center bg-slate-900'>
                        <svg className='w-6 h-6 opacity-70' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                        </svg>
                        <span className='text-[9px] font-bold text-white/60 uppercase'>
                          {m.name ? m.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <h3 className='font-bold text-white text-sm truncate'>{m.name}</h3>
                      {m.isLead && <span className='text-[10px] text-amber-400 font-bold' title='Club Lead'>👑</span>}
                    </div>
                    <p className={`text-xs truncate ${isSupport ? 'text-teal-300 font-semibold' : 'text-violet-400 font-medium'}`}>
                      {m.designation || 'Support Team Member'}
                    </p>
                    
                    {isSupport ? (
                      <span className='text-[10px] uppercase font-bold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full inline-block mt-1'>
                        🤝 Support Team
                      </span>
                    ) : (
                      <span className='text-[10px] uppercase font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full inline-block mt-1'>
                        {m.technicalDomain}
                      </span>
                    )}

                    <div className='flex items-center gap-3 mt-2 text-[11px] font-tech'>
                      {m.socialLinks?.linkedin && m.socialLinks.linkedin !== '#' && (
                        <a
                          href={m.socialLinks.linkedin}
                          target='_blank'
                          rel='noreferrer'
                          className='text-cyan-400 hover:underline flex items-center gap-1'
                        >
                          💼 LinkedIn
                        </a>
                      )}
                      {m.socialLinks?.instagram && m.socialLinks.instagram !== '#' && (
                        <a
                          href={m.socialLinks.instagram}
                          target='_blank'
                          rel='noreferrer'
                          className='text-pink-400 hover:underline flex items-center gap-1'
                        >
                          📸 Instagram
                        </a>
                      )}
                    </div>
                    <div className='mt-3 flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onClick={() => openEditModal(m)}
                        className='text-xs text-violet-300 hover:text-white px-2.5 py-1 rounded bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 transition-all flex items-center gap-1 font-medium'
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => del(m._id)}
                        className='text-xs text-rose-400 hover:text-white px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-600 transition-all'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn'>
          <div className='glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 relative max-h-[90vh] overflow-y-auto bg-slate-900/95'>
            <div className='flex items-center justify-between pb-3 border-b border-white/10'>
              <h3 className='font-display font-bold text-lg text-white flex items-center gap-2'>
                <span>✏️</span> Edit Member Details
              </h3>
              <button
                type='button'
                onClick={closeEditModal}
                className='w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-all'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className='mt-5 space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-white/70 mb-1'>Full Name *</label>
                  <input
                    required
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className='block text-xs text-white/70 mb-1'>Role / Designation *</label>
                  <input
                    required
                    value={editForm.designation}
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-white/70 mb-1'>Member Category</label>
                  <select
                    value={editForm.memberType}
                    onChange={e => {
                      const val = e.target.value;
                      setEditForm({
                        ...editForm,
                        memberType: val,
                        technicalDomain: val === 'Support Team' ? 'Support Team' : (editForm.technicalDomain === 'Support Team' ? 'Robotics' : editForm.technicalDomain)
                      });
                    }}
                    className={`${inputStyle} bg-slate-900 text-white`}
                    style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                  >
                    <option value='Core Team' className='bg-slate-900 text-slate-100 py-2'>👑 Core / Technical Lead</option>
                    <option value='Support Team' className='bg-slate-900 text-slate-100 py-2'>🤝 Support Team</option>
                  </select>
                </div>

                {editForm.memberType !== 'Support Team' && (
                  <div>
                    <label className='block text-xs text-white/70 mb-1'>Technical Domain</label>
                    <select
                      value={editForm.technicalDomain}
                      onChange={e => setEditForm({ ...editForm, technicalDomain: e.target.value })}
                      className={`${inputStyle} bg-slate-900 text-white`}
                      style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                    >
                      {domains.map(d => (
                        <option
                          key={d}
                          value={d}
                          className='bg-slate-900 text-slate-100 py-2'
                        >
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-xs text-white/70 mb-1'>Email (Optional)</label>
                <input
                  type='email'
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-white/70 mb-1 flex items-center gap-1'>
                    <span className='text-cyan-400'>💼</span>
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type='url'
                    value={editForm.linkedin}
                    onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className='block text-xs text-white/70 mb-1 flex items-center gap-1'>
                    <span className='text-pink-400'>📸</span>
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type='url'
                    value={editForm.instagram}
                    onChange={e => setEditForm({ ...editForm, instagram: e.target.value })}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs text-white/70 mb-1'>Bio / Description</label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* Photo preview and replace */}
              <div className='p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2'>
                <label className='block text-xs text-white/70 font-medium'>Member Photo</label>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-white/20 shrink-0 flex items-center justify-center'>
                    {editPreview ? (
                      <img src={editPreview} alt='Preview' className='w-full h-full object-cover' />
                    ) : (
                      <span className='text-xs text-slate-500'>No Photo</span>
                    )}
                  </div>
                  <div className='flex-1'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={e => {
                        const f = e.target.files[0];
                        if (f) {
                          setEditFile(f);
                          setEditPreview(URL.createObjectURL(f));
                        }
                      }}
                      className='text-xs text-white/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-violet-600 file:text-white hover:file:bg-violet-500 cursor-pointer'
                    />
                    <p className='text-[10px] text-white/40 mt-1'>Upload new photo to replace current photo.</p>
                  </div>
                </div>
              </div>

              {editForm.memberType !== 'Support Team' && (
                <label className='flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none'>
                  <input
                    type='checkbox'
                    checked={editForm.isLead}
                    onChange={e => setEditForm({ ...editForm, isLead: e.target.checked })}
                    className='rounded accent-violet-600'
                  />
                  <span>👑 Mark as Core Lead</span>
                </label>
              )}

              <div className='flex items-center justify-end gap-3 pt-3 border-t border-white/10'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  className='px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={savingEdit}
                  className='bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/30'
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
