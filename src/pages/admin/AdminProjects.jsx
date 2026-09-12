import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    description: '',
    domain: 'Robotics',
    technologies: '',
    teamMembers: '',
    githubUrl: '',
    demoUrl: '',
    featured: false
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [domains, setDomains] = useState(['Robotics', 'IoT', 'Automation', 'Drone/CV', 'General']);

  const loadProjects = () => {
    setLoading(true);
    axios.get('/api/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
    axios.get('/api/settings/domains').then(res => {
      if (res.data?.length > 0) {
        setDomains(res.data.map(d => d.title));
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      await axios.post('/api/projects', fd, {
        headers: getHeader()
      });
      resetForm();
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add project');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      domain: 'Robotics',
      technologies: '',
      teamMembers: '',
      githubUrl: '',
      demoUrl: '',
      featured: false
    });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, { headers: getHeader() });
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const inputStyle = 'w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs transition-all';

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Manage Projects</h1>
          <p className='text-xs text-white/60 mt-1'>Add, edit, or remove hardware and software innovations.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs text-violet-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Project Form */}
      <form onSubmit={handleSubmit} className='glass p-6 rounded-2xl border border-white/10 mt-6 space-y-4 bg-slate-900/50'>
        <h2 className='text-base font-bold text-white border-b border-white/10 pb-2'>
          ➕ Add New Project
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs text-white/70 mb-1'>Project Name *</label>
            <input
              required
              placeholder='e.g. Autonomous ROS2 Mobile Rover'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs text-white/70 mb-1'>Technical Domain *</label>
            <select
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
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

        <div>
          <label className='block text-xs text-white/70 mb-1'>Description *</label>
          <textarea
            required
            rows={2}
            placeholder='Detailed summary of the hardware architecture, sensors, and use case...'
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className={inputStyle}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs text-white/70 mb-1'>Technologies (comma-separated)</label>
            <input
              placeholder='e.g. ROS2, Python, LiDAR, Raspberry Pi'
              value={form.technologies}
              onChange={e => setForm({ ...form, technologies: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs text-white/70 mb-1'>Team Members (comma-separated)</label>
            <input
              placeholder='Enter team members separated by commas'
              value={form.teamMembers}
              onChange={e => setForm({ ...form, teamMembers: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs text-white/70 mb-1'>GitHub Repository URL</label>
            <input
              placeholder='https://github.com/...'
              value={form.githubUrl}
              onChange={e => setForm({ ...form, githubUrl: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs text-white/70 mb-1'>Demo / Video URL</label>
            <input
              placeholder='https://...'
              value={form.demoUrl}
              onChange={e => setForm({ ...form, demoUrl: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
          <div className='flex items-center gap-4'>
            <div>
              <label className='block text-xs text-white/70 mb-1'>Project Image</label>
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
                checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className='rounded accent-violet-600'
              />
              ⭐ Feature on Homepage
            </label>
          </div>

          <div className='flex items-center gap-2'>
            <button
              type='submit'
              disabled={submitting}
              className='bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/30'
            >
              {submitting ? 'Saving...' : 'Add Project'}
            </button>
          </div>
        </div>
      </form>

      {/* Projects Grid */}
      <div className='mt-8'>
        <h2 className='text-lg font-bold text-white mb-4'>Existing Projects ({projects.length})</h2>
        {loading ? (
          <div className='text-center py-8 text-white/50'>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className='text-center py-8 glass rounded-xl text-white/50 text-sm'>No projects added yet.</div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {projects.map(p => (
              <div key={p._id} className='glass p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3'>
                {p.image && (
                  <img src={p.image} alt={p.name} className='h-32 w-full object-cover rounded-lg' />
                )}
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='text-[10px] font-bold text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/10'>
                      {p.domain}
                    </span>
                    {p.featured && (
                      <span className='text-[10px] text-amber-400 font-semibold'>★ Featured</span>
                    )}
                  </div>
                  <h3 className='font-bold text-white text-base mt-2'>{p.name}</h3>
                  <p className='text-xs text-white/60 mt-1 line-clamp-2'>{p.description}</p>
                </div>

                <div className='flex items-center justify-end gap-2 pt-2 border-t border-white/10'>
                  <Link
                    to={`/admin/projects/edit/${p._id}`}
                    className='text-xs text-violet-300 hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all inline-block'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className='text-xs text-rose-400 hover:text-white px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-600 transition-all'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
