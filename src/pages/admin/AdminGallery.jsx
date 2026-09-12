import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function AdminGallery() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Media type selection: 'image' or 'video'
  const [mediaType, setMediaType] = useState('image');
  
  // Video source: 'file' or 'url'
  const [videoSource, setVideoSource] = useState('file');
  
  // Create Inputs
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Workshops');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: 'Workshops',
    mediaType: 'image',
    videoSource: 'file',
    videoUrl: '',
    date: ''
  });
  const [editFile, setEditFile] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const categories = [
    'Workshops',
    'Competitions',
    'Project Demonstrations',
    'Club Activities'
  ];

  const load = () => {
    setLoading(true);
    axios.get('/api/gallery')
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
  }, []);

  // Open Edit Modal
  const openEdit = (item) => {
    const isVideo = item.mediaType === 'video' || !!item.videoUrl;
    const isExternalUrl = !!(item.videoUrl && item.videoUrl.startsWith('http'));
    
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      category: item.category || 'Workshops',
      mediaType: isVideo ? 'video' : 'image',
      videoSource: isExternalUrl ? 'url' : 'file',
      videoUrl: item.videoUrl || '',
      date: item.date || (item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])
    });
    setEditFile(null);
    setEditThumbnailFile(null);
  };

  const closeEdit = () => {
    setEditingItem(null);
    setEditFile(null);
    setEditThumbnailFile(null);
  };

  // Submit Edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setEditSubmitting(true);
    const fd = new FormData();
    fd.append('title', editForm.title || 'Club Media');
    fd.append('category', editForm.category);
    fd.append('mediaType', editForm.mediaType);
    fd.append('date', editForm.date);

    if (editForm.mediaType === 'image') {
      if (editFile) {
        fd.append('image', editFile);
      }
    } else {
      if (editForm.videoSource === 'url') {
        fd.append('videoUrl', editForm.videoUrl.trim());
      } else if (editFile) {
        fd.append('media', editFile);
      }
      if (editThumbnailFile) {
        fd.append('image', editThumbnailFile);
      }
    }

    try {
      await axios.put(`/api/gallery/${editingItem._id}`, fd, {
        headers: getHeader()
      });
      closeEdit();
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update gallery media');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Submit New Upload
  const upload = async (e) => {
    e.preventDefault();

    if (mediaType === 'image') {
      if (!file) return alert('Please select an image file to upload');
    } else {
      if (videoSource === 'file' && !file) {
        return alert('Please select a video file to upload (.mp4, .webm, etc.)');
      }
      if (videoSource === 'url' && !videoUrl.trim()) {
        return alert('Please enter a valid YouTube or video URL');
      }
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('mediaType', mediaType);
    fd.append('title', title || (mediaType === 'video' ? 'Club Video' : 'Club Moment'));
    fd.append('category', category);
    fd.append('date', date || new Date().toISOString().split('T')[0]);

    if (mediaType === 'image') {
      fd.append('image', file);
    } else {
      if (videoSource === 'file') {
        fd.append('media', file);
      } else {
        fd.append('videoUrl', videoUrl.trim());
      }
      if (thumbnailFile) {
        fd.append('image', thumbnailFile);
      }
    }

    try {
      await axios.post('/api/gallery', fd, {
        headers: getHeader()
      });
      setTitle('');
      setFile(null);
      setThumbnailFile(null);
      setVideoUrl('');
      setDate(new Date().toISOString().split('T')[0]);
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => { input.value = ''; });

      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload gallery media');
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this item from the gallery?')) return;
    try {
      await axios.delete(`/api/gallery/${id}`, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete item');
    }
  };

  const inputStyle = 'p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs transition-all';

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Visual & Video Gallery</h1>
          <p className='text-xs text-white/60 mt-1'>Upload, edit captions, custom media dates, and manage video clips.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs text-violet-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Upload Form */}
      <form onSubmit={upload} className='glass p-6 rounded-2xl border border-white/10 mt-6 bg-slate-900/60 space-y-4'>
        {/* Media Type Switcher */}
        <div className='flex items-center gap-3 border-b border-white/10 pb-3'>
          <span className='text-xs font-tech text-slate-300 font-bold'>Upload Type:</span>
          <div className='inline-flex p-1 rounded-xl bg-slate-950 border border-white/10'>
            <button
              type='button'
              onClick={() => { setMediaType('image'); setFile(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mediaType === 'image'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📷 Photo / Image
            </button>
            <button
              type='button'
              onClick={() => { setMediaType('video'); setFile(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mediaType === 'video'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎥 Video
            </button>
          </div>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <label className='block text-xs text-white/70 mb-1'>Caption / Title</label>
            <input
              placeholder={mediaType === 'video' ? 'e.g. Quadcopter Autonomous Flight Test' : 'e.g. RoboSoccer Championship Finals'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`${inputStyle} w-full`}
            />
          </div>

          <div>
            <label className='block text-xs text-white/70 mb-1'>Track / Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`${inputStyle} w-full bg-slate-900 text-white`}
              style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
            >
              {categories.map(c => (
                <option
                  key={c}
                  value={c}
                  style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                  className='bg-slate-900 text-slate-100 py-2.5'
                >
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-xs text-white/70 mb-1'>Event / Media Date</label>
            <input
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
              className={`${inputStyle} w-full`}
            />
          </div>

          {/* Media Input depending on image / video */}
          {mediaType === 'image' ? (
            <div>
              <label className='block text-xs text-white/70 mb-1'>Select Image File *</label>
              <input
                type='file'
                accept='image/*'
                required
                onChange={e => setFile(e.target.files[0])}
                className='text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20'
              />
            </div>
          ) : (
            <div>
              <label className='block text-xs text-white/70 mb-1'>Video Source</label>
              <div className='flex gap-2 mb-2'>
                <button
                  type='button'
                  onClick={() => { setVideoSource('file'); setVideoUrl(''); }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg border ${
                    videoSource === 'file'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  type='button'
                  onClick={() => { setVideoSource('url'); setFile(null); }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg border ${
                    videoSource === 'url'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  🔗 YouTube / Link
                </button>
              </div>

              {videoSource === 'file' ? (
                <input
                  type='file'
                  accept='video/mp4,video/webm,video/ogg,video/quicktime,video/*'
                  required={videoSource === 'file'}
                  onChange={e => setFile(e.target.files[0])}
                  className='text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30'
                />
              ) : (
                <input
                  type='url'
                  placeholder='https://www.youtube.com/watch?v=...'
                  required={videoSource === 'url'}
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className={`${inputStyle} w-full`}
                />
              )}
            </div>
          )}
        </div>

        {/* Video Thumbnail Optional */}
        {mediaType === 'video' && videoSource === 'file' && (
          <div className='pt-2 border-t border-white/5'>
            <label className='block text-xs text-white/60 mb-1'>
              Optional Video Cover / Thumbnail Photo:
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={e => setThumbnailFile(e.target.files[0])}
              className='text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white'
            />
          </div>
        )}

        <div className='flex justify-end pt-2'>
          <button
            type='submit'
            disabled={submitting}
            className={`font-bold text-xs px-7 py-3 rounded-xl transition-all shadow-md ${
              mediaType === 'video'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110 shadow-violet-600/30'
            }`}
          >
            {submitting ? 'Uploading...' : mediaType === 'video' ? '🎬 Add Video to Gallery' : '📷 Upload Photo'}
          </button>
        </div>
      </form>

      {/* Gallery Grid */}
      <div className='mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold text-white'>Gallery Collection ({list.length})</h2>
          <div className='text-xs text-slate-400 font-tech'>
            Photos: {list.filter(g => g.mediaType !== 'video').length} • Videos: {list.filter(g => g.mediaType === 'video').length}
          </div>
        </div>

        {loading ? (
          <div className='text-center py-12 text-white/50 font-tech text-xs'>Loading gallery...</div>
        ) : list.length === 0 ? (
          <div className='text-center py-12 glass rounded-2xl text-white/50 text-sm'>No media items uploaded yet.</div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {list.map(g => {
              const isVideo = g.mediaType === 'video' || !!g.videoUrl;
              const ytId = isVideo && g.videoUrl ? getYouTubeId(g.videoUrl) : null;
              const thumbnail = g.image || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
              const displayDate = g.date
                ? new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <div key={g._id} className='relative group rounded-2xl overflow-hidden glass border border-white/10 aspect-[4/3] bg-slate-950 shadow-md'>
                  {thumbnail ? (
                    <img src={thumbnail} alt={g.title} className='h-full w-full object-cover group-hover:scale-105 transition-all duration-300' />
                  ) : isVideo && g.videoUrl ? (
                    <video src={g.videoUrl} className='h-full w-full object-cover' muted preload='metadata' />
                  ) : (
                    <div className='h-full w-full flex items-center justify-center bg-slate-900 text-slate-600'>
                      No Preview
                    </div>
                  )}

                  {/* Video Indicator Overlay */}
                  {isVideo && (
                    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                      <div className='w-10 h-10 rounded-full bg-cyan-500/80 backdrop-blur text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform'>
                        ▶
                      </div>
                    </div>
                  )}

                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-3 opacity-90 group-hover:opacity-100 transition-opacity'>
                    <div className='flex justify-between items-start'>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isVideo ? 'bg-cyan-500 text-slate-950' : 'bg-violet-600 text-white'
                      }`}>
                        {isVideo ? '🎥 Video' : '📷 Photo'}
                      </span>
                      <div className='flex items-center gap-1.5'>
                        <button
                          onClick={() => openEdit(g)}
                          title='Edit this item'
                          className='bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-lg transition-all shadow flex items-center gap-1'
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => del(g._id)}
                          title='Delete this item'
                          className='bg-rose-600/90 hover:bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-all shadow'
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className='flex items-center justify-between text-[9px] font-tech text-cyan-300'>
                        <span>{g.category}</span>
                        <span className='text-slate-300'>📅 {displayDate}</span>
                      </div>
                      <p className='text-xs font-semibold text-white truncate mt-0.5'>{g.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Gallery Item Modal */}
      {editingItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn'>
          <div className='glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto bg-slate-950/95'>
            <button
              onClick={closeEdit}
              className='absolute top-5 right-5 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white z-10'
            >
              ✕
            </button>

            <span className='font-tech text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'>
              Admin Control • Edit Gallery Item
            </span>
            <h2 className='font-display font-bold text-2xl text-white mt-2'>
              Edit Media Details
            </h2>

            {/* Current Preview */}
            <div className='mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4'>
              <div className='w-20 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center'>
                {editingItem.image ? (
                  <img src={editingItem.image} alt='current preview' className='w-full h-full object-cover' />
                ) : editingItem.videoUrl && getYouTubeId(editingItem.videoUrl) ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeId(editingItem.videoUrl)}/hqdefault.jpg`}
                    alt='yt preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-xs text-slate-500'>Media</span>
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xs text-slate-300 font-semibold truncate'>{editingItem.title}</p>
                <p className='text-[10px] text-cyan-400 font-tech mt-0.5'>{editingItem.category} • {editingItem.mediaType || 'image'}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className='mt-5 space-y-4'>
              {/* Media Type Switcher */}
              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1.5'>Media Format</label>
                <div className='inline-flex p-1 rounded-xl bg-slate-900 border border-white/10'>
                  <button
                    type='button'
                    onClick={() => setEditForm({ ...editForm, mediaType: 'image' })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      editForm.mediaType === 'image'
                        ? 'bg-violet-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📷 Photo
                  </button>
                  <button
                    type='button'
                    onClick={() => setEditForm({ ...editForm, mediaType: 'video' })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      editForm.mediaType === 'video'
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎥 Video
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>Caption / Title *</label>
                <input
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className={`${inputStyle} w-full`}
                />
              </div>

              {/* Category & Date Grid */}
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-medium text-slate-300 mb-1'>Category / Track</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className={`${inputStyle} w-full bg-slate-900 text-white`}
                    style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                  >
                    {categories.map(c => (
                      <option
                        key={c}
                        value={c}
                        style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                        className='bg-slate-900 text-slate-100 py-2'
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-medium text-slate-300 mb-1'>Event / Media Date *</label>
                  <input
                    type='date'
                    required
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className={`${inputStyle} w-full`}
                  />
                </div>
              </div>

              {/* Media File Replacement Options */}
              {editForm.mediaType === 'image' ? (
                <div>
                  <label className='block text-xs font-medium text-slate-300 mb-1'>
                    Replace Photo File (Optional)
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={e => setEditFile(e.target.files[0])}
                    className='text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20'
                  />
                  <p className='text-[10px] text-slate-400 mt-1'>Leave empty to keep the existing photo.</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  <label className='block text-xs font-medium text-slate-300'>Video Source</label>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => setEditForm({ ...editForm, videoSource: 'file' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                        editForm.videoSource === 'file'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      📁 Upload New Video File
                    </button>
                    <button
                      type='button'
                      onClick={() => setEditForm({ ...editForm, videoSource: 'url' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                        editForm.videoSource === 'url'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      🔗 YouTube / Online Link
                    </button>
                  </div>

                  {editForm.videoSource === 'url' ? (
                    <div>
                      <label className='block text-xs text-slate-300 mb-1'>Video URL / YouTube Link</label>
                      <input
                        type='url'
                        placeholder='https://www.youtube.com/watch?v=...'
                        value={editForm.videoUrl}
                        onChange={e => setEditForm({ ...editForm, videoUrl: e.target.value })}
                        className={`${inputStyle} w-full`}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className='block text-xs text-slate-300 mb-1'>Upload Video File (.mp4, .webm, etc.)</label>
                      <input
                        type='file'
                        accept='video/mp4,video/webm,video/ogg,video/quicktime,video/*'
                        onChange={e => setEditFile(e.target.files[0])}
                        className='text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30'
                      />
                      <p className='text-[10px] text-slate-400 mt-1'>Leave empty to keep existing video file.</p>
                    </div>
                  )}

                  <div>
                    <label className='block text-xs text-slate-300 mb-1'>
                      Optional Custom Video Cover / Thumbnail
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={e => setEditThumbnailFile(e.target.files[0])}
                      className='text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white'
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex items-center justify-end gap-3 pt-4 border-t border-white/10'>
                <button
                  type='button'
                  onClick={closeEdit}
                  className='px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={editSubmitting}
                  className='px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all'
                >
                  {editSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
