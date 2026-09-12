import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [domains, setDomains] = useState(['Robotics', 'IoT', 'Automation', 'Drone/CV', 'General']);
  
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
  const [currentImage, setCurrentImage] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Load domains
    axios.get('/api/settings/domains').then(res => {
      if (res.data?.length > 0) {
        setDomains(res.data.map(d => d.title));
      }
    }).catch(() => {});

    // Load project details
    setLoading(true);
    axios.get(`/api/projects/${id}`)
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          domain: p.domain || 'Robotics',
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
          teamMembers: Array.isArray(p.teamMembers) ? p.teamMembers.join(', ') : (p.teamMembers || ''),
          githubUrl: p.githubUrl || '',
          demoUrl: p.demoUrl || '',
          featured: p.featured || false
        });
        setCurrentImage(p.image || '');
        setLoading(false);
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Failed to load project details');
        setLoading(false);
        navigate('/admin/projects');
      });
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      await axios.put(`/api/projects/${id}`, fd, {
        headers: getHeader()
      });
      navigate('/admin/projects');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, { headers: getHeader() });
      navigate('/admin/projects');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const inputStyle = 'w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs transition-all';

  if (loading) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center'>
        <div className='w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3'></div>
        <p className='text-xs text-white/50'>Loading project data...</p>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between pb-4 border-b border-white/10'>
        <div>
          <div className='flex items-center gap-2'>
            <Link to='/admin/projects' className='text-xs text-violet-400 hover:text-violet-300 transition-all'>
              ← Back to Projects
            </Link>
          </div>
          <h1 className='text-2xl font-bold text-white mt-1'>Edit Project</h1>
          <p className='text-xs text-white/60 mt-0.5'>Update project information, technical details, media, and team links.</p>
        </div>
        <button
          type='button'
          onClick={handleDelete}
          className='text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5'
        >
          🗑️ Delete Project
        </button>
      </div>

      <form onSubmit={handleSubmit} className='glass p-6 md:p-8 rounded-2xl border border-white/10 mt-6 space-y-5 bg-slate-900/50 shadow-xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-medium text-white/70 mb-1.5'>Project Name *</label>
            <input
              required
              placeholder='e.g. Autonomous ROS2 Mobile Rover'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-white/70 mb-1.5'>Technical Domain *</label>
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
          <label className='block text-xs font-medium text-white/70 mb-1.5'>Description *</label>
          <textarea
            required
            rows={4}
            placeholder='Detailed summary of the hardware architecture, sensors, and use case...'
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className={inputStyle}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-medium text-white/70 mb-1.5'>Technologies (comma-separated)</label>
            <input
              placeholder='e.g. ROS2, Python, LiDAR, Raspberry Pi'
              value={form.technologies}
              onChange={e => setForm({ ...form, technologies: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-white/70 mb-1.5'>Team Members (comma-separated)</label>
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
            <label className='block text-xs font-medium text-white/70 mb-1.5'>GitHub Repository URL</label>
            <input
              placeholder='https://github.com/...'
              value={form.githubUrl}
              onChange={e => setForm({ ...form, githubUrl: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-white/70 mb-1.5'>Demo / Video URL</label>
            <input
              placeholder='https://...'
              value={form.demoUrl}
              onChange={e => setForm({ ...form, demoUrl: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Image Preview & Upload */}
        <div className='p-4 rounded-xl bg-white/5 border border-white/10 space-y-3'>
          <label className='block text-xs font-medium text-white/70'>Project Image</label>
          <div className='flex flex-wrap items-center gap-4'>
            {(previewUrl || currentImage) && (
              <div className='relative'>
                <img
                  src={previewUrl || currentImage}
                  alt='Project preview'
                  className='h-24 w-36 object-cover rounded-lg border border-white/20'
                />
                <span className='absolute bottom-1 right-1 bg-black/70 text-[9px] px-1.5 py-0.5 rounded text-white'>
                  {previewUrl ? 'New image selected' : 'Current image'}
                </span>
              </div>
            )}
            <div className='flex-1'>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500 file:cursor-pointer'
              />
              <p className='text-[11px] text-white/40 mt-1'>
                Upload a new image to replace the current one. Formats: JPG, PNG, WebP.
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10'>
          <label className='flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none'>
            <input
              type='checkbox'
              checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
              className='rounded accent-violet-600 w-4 h-4'
            />
            ⭐ Feature on Homepage
          </label>

          <div className='flex items-center gap-3'>
            <Link
              to='/admin/projects'
              className='px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all'
            >
              Cancel
            </Link>
            <button
              type='submit'
              disabled={submitting}
              className='bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/30'
            >
              {submitting ? 'Saving Changes...' : 'Update Project'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
