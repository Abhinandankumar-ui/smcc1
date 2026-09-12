import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [hero, setHero] = useState({
    badge: '',
    titlePrefix: '',
    titleHighlight: '',
    description: ''
  });

  const [announcement, setAnnouncement] = useState({
    message: '',
    active: false,
    link: '/join'
  });

  const [stats, setStats] = useState([]);
  const [domains, setDomains] = useState([]);
  const [labInfo, setLabInfo] = useState({
    location: '',
    email: '',
    phone: '',
    timings: ''
  });

  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    instagram: '',
    discord: ''
  });

  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');

  useEffect(() => {
    axios.get('/api/settings')
      .then(res => {
        if (res.data) {
          if (res.data.hero) setHero(res.data.hero);
          if (res.data.announcement) setAnnouncement(res.data.announcement);
          if (res.data.stats) setStats(res.data.stats);
          if (res.data.domains) setDomains(res.data.domains);
          if (res.data.labInfo) setLabInfo(res.data.labInfo);
          if (res.data.socialLinks) setSocialLinks(res.data.socialLinks);
          if (res.data.mission) setMission(res.data.mission);
          if (res.data.vision) setVision(res.data.vision);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Stats handlers
  const handleStatChange = (index, field, value) => {
    const updated = [...stats];
    updated[index][field] = value;
    setStats(updated);
  };

  const addStat = () => {
    setStats([...stats, { value: '10+', label: 'New Metric', icon: '⚡' }]);
  };

  const removeStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  // Domains handlers
  const handleDomainChange = (index, field, value) => {
    const updated = [...domains];
    updated[index][field] = value;
    setDomains(updated);
  };

  const handleDomainTopicsChange = (index, commaSeparated) => {
    const updated = [...domains];
    updated[index].topics = commaSeparated.split(',').map(t => t.trim()).filter(Boolean);
    setDomains(updated);
  };

  const addDomain = () => {
    setDomains([
      ...domains,
      {
        title: 'New Track',
        icon: '🔬',
        badge: 'Specialization',
        desc: 'Description of the new technical domain and hardware prototypes.',
        topics: ['Topic 1', 'Topic 2'],
        color: 'from-cyan-500/20 to-blue-500/10',
        border: 'border-cyan-500/30'
      }
    ]);
  };

  const removeDomain = (index) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      await axios.put('/api/settings', {
        hero,
        announcement,
        stats,
        domains,
        labInfo,
        socialLinks,
        mission,
        vision
      }, { headers: getHeader() });

      setMsg('Club settings successfully updated! Homepage, About, and all pages will now reflect these changes.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = 'w-full px-4 py-2.5 rounded-xl glass-input text-xs';

  if (loading) return <div className='p-12 text-center text-slate-400 font-tech text-xs'>Loading club configuration...</div>;

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <span className='font-tech text-xs text-cyan-400 uppercase tracking-widest'>Dynamic Control Panel</span>
          <h1 className='font-display text-3xl font-extrabold text-white mt-1'>Club Content & Settings</h1>
          <p className='text-xs text-slate-400 mt-1'>Customize hero texts, statistics, technical tracks, lab coordinates, and top announcement banner.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs font-tech text-cyan-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {msg && (
        <div className='p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mt-4'>
          ✓ {msg}
        </div>
      )}

      <form onSubmit={handleSave} className='space-y-8 mt-6'>
        {/* 1. Top Announcement Ticker */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <div className='flex items-center justify-between border-b border-white/10 pb-2'>
            <h2 className='font-display text-lg font-bold text-cyan-400'>
              1. Top Site Announcement Ticker
            </h2>
            <label className='flex items-center gap-2 text-xs font-tech text-slate-300 cursor-pointer'>
              <input
                type='checkbox'
                checked={announcement.active}
                onChange={e => setAnnouncement({ ...announcement, active: e.target.checked })}
                className='rounded accent-cyan-500'
              />
              <span>Display Banner</span>
            </label>
          </div>

          <div className='grid sm:grid-cols-3 gap-4'>
            <div className='sm:col-span-2'>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Announcement Text</label>
              <input
                value={announcement.message}
                onChange={e => setAnnouncement({ ...announcement, message: e.target.value })}
                placeholder='e.g. 🚀 Registrations are now open for our annual Robotics Hackathon!'
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Target Route / URL</label>
              <input
                value={announcement.link}
                onChange={e => setAnnouncement({ ...announcement, link: e.target.value })}
                placeholder='e.g. /join or /events'
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <h2 className='font-display text-lg font-bold text-violet-400 border-b border-white/10 pb-2'>
            2. Homepage Hero Banner Content
          </h2>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Top Tagline Badge</label>
            <input
              value={hero.badge}
              onChange={e => setHero({ ...hero, badge: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Title Prefix</label>
              <input
                value={hero.titlePrefix}
                onChange={e => setHero({ ...hero, titlePrefix: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Title Gradient Highlight</label>
              <input
                value={hero.titleHighlight}
                onChange={e => setHero({ ...hero, titleHighlight: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Hero Description</label>
            <textarea
              rows={2}
              value={hero.description}
              onChange={e => setHero({ ...hero, description: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        {/* 3. Numerical Statistics */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <div className='flex items-center justify-between border-b border-white/10 pb-2'>
            <h2 className='font-display text-lg font-bold text-emerald-400'>
              3. Homepage Numerical Metrics ({stats.length})
            </h2>
            <button
              type='button'
              onClick={addStat}
              className='text-xs font-tech font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors'
            >
              + Add Stat
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {stats.map((stat, i) => (
              <div key={i} className='p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 relative'>
                <button
                  type='button'
                  onClick={() => removeStat(i)}
                  className='absolute top-2 right-2 text-rose-400 hover:text-rose-300 text-xs font-bold'
                >
                  ✕
                </button>
                <div>
                  <label className='block text-[10px] font-tech text-slate-400'>Icon</label>
                  <input
                    value={stat.icon || '⚡'}
                    onChange={e => handleStatChange(i, 'icon', e.target.value)}
                    className='w-14 px-2 py-1 rounded-lg glass-input text-xs text-center'
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-tech text-slate-400'>Value (e.g. 15+)</label>
                  <input
                    value={stat.value}
                    onChange={e => handleStatChange(i, 'value', e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-tech text-slate-400'>Label</label>
                  <input
                    value={stat.label}
                    onChange={e => handleStatChange(i, 'label', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Technical Domains & Tracks */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <div className='flex items-center justify-between border-b border-white/10 pb-2'>
            <h2 className='font-display text-lg font-bold text-cyan-400'>
              4. Technical Tracks & Domains ({domains.length})
            </h2>
            <button
              type='button'
              onClick={addDomain}
              className='text-xs font-tech font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors'
            >
              + Add Track
            </button>
          </div>

          <div className='space-y-4'>
            {domains.map((dom, i) => (
              <div key={i} className='p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3 relative'>
                <button
                  type='button'
                  onClick={() => removeDomain(i)}
                  className='absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xs font-bold'
                >
                  Delete Track ✕
                </button>

                <div className='grid sm:grid-cols-3 gap-3'>
                  <div>
                    <label className='block text-[10px] font-tech text-slate-400 mb-1'>Icon & Title</label>
                    <div className='flex gap-2'>
                      <input
                        value={dom.icon || '🦾'}
                        onChange={e => handleDomainChange(i, 'icon', e.target.value)}
                        className='w-14 px-2 py-1 rounded-xl glass-input text-xs text-center'
                      />
                      <input
                        value={dom.title}
                        onChange={e => handleDomainChange(i, 'title', e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-[10px] font-tech text-slate-400 mb-1'>Badge / Sub-header</label>
                    <input
                      value={dom.badge || 'Engineering'}
                      onChange={e => handleDomainChange(i, 'badge', e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className='block text-[10px] font-tech text-slate-400 mb-1'>Topics (Comma Separated)</label>
                    <input
                      value={dom.topics ? dom.topics.join(', ') : ''}
                      onChange={e => handleDomainTopicsChange(i, e.target.value)}
                      placeholder='ROS2, Nav2, Gazebo, LiDAR'
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-[10px] font-tech text-slate-400 mb-1'>Short Track Description</label>
                  <textarea
                    rows={2}
                    value={dom.desc}
                    onChange={e => handleDomainChange(i, 'desc', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Lab Contact Coordinates & Hours */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <h2 className='font-display text-lg font-bold text-amber-400 border-b border-white/10 pb-2'>
            5. Laboratory Headquarters & Timings
          </h2>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Lab Room & Block</label>
              <input
                value={labInfo.location}
                onChange={e => setLabInfo({ ...labInfo, location: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Lab Workbench Hours</label>
              <input
                value={labInfo.timings}
                onChange={e => setLabInfo({ ...labInfo, timings: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Official Email</label>
              <input
                value={labInfo.email}
                onChange={e => setLabInfo({ ...labInfo, email: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Helpline / Contact Phone</label>
              <input
                value={labInfo.phone}
                onChange={e => setLabInfo({ ...labInfo, phone: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 6. Social Media Handles */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <h2 className='font-display text-lg font-bold text-violet-400 border-b border-white/10 pb-2'>
            6. Official Social Links
          </h2>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='block text-[10px] font-tech text-slate-400 mb-1'>GitHub</label>
              <input
                value={socialLinks.github}
                onChange={e => setSocialLinks({ ...socialLinks, github: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-[10px] font-tech text-slate-400 mb-1'>LinkedIn</label>
              <input
                value={socialLinks.linkedin}
                onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-[10px] font-tech text-slate-400 mb-1'>Discord</label>
              <input
                value={socialLinks.discord}
                onChange={e => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className='block text-[10px] font-tech text-slate-400 mb-1'>Instagram</label>
              <input
                value={socialLinks.instagram}
                onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 7. Mission & Vision */}
        <div className='glass-card p-6 rounded-3xl space-y-4'>
          <h2 className='font-display text-lg font-bold text-emerald-400 border-b border-white/10 pb-2'>
            7. Club Mission & Vision
          </h2>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Mission Statement</label>
            <textarea
              rows={3}
              value={mission}
              onChange={e => setMission(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Vision Statement</label>
            <textarea
              rows={3}
              value={vision}
              onChange={e => setVision(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className='sticky bottom-4 z-40 glass p-4 rounded-2xl border border-cyan-500/40 flex items-center justify-between shadow-2xl'>
          <span className='text-xs font-tech text-slate-300'>
            💡 Updates apply in real-time to the public site.
          </span>
          <button
            type='submit'
            disabled={saving}
            className='px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 hover:opacity-95 transition-all'
          >
            {saving ? 'Saving Configurations...' : 'Save All Settings →'}
          </button>
        </div>
      </form>
    </div>
  );
}
