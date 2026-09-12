import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function AdminEvents() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  // Attendee Modal State
  const [attendeeEvent, setAttendeeEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Workshop',
    status: 'Upcoming',
    description: '',
    maxSeats: 60
  });
  const [file, setFile] = useState(null);

  const categories = ['Workshop', 'Competition', 'Event', 'Past'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed'];

  const load = () => {
    setLoading(true);
    axios.get('/api/events')
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

  const openEdit = (e) => {
    setEditId(e._id);
    setForm({
      title: e.title || '',
      date: e.date || '',
      time: e.time || '',
      location: e.location || '',
      category: e.category || 'Workshop',
      status: e.status || 'Upcoming',
      description: e.description || '',
      maxSeats: e.maxSeats || 60
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'Workshop',
      status: 'Upcoming',
      description: '',
      maxSeats: 60
    });
    setFile(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      if (editId) {
        await axios.put(`/api/events/${editId}`, fd, {
          headers: getHeader()
        });
        alert('Event updated successfully!');
      } else {
        await axios.post('/api/events', fd, {
          headers: getHeader()
        });
        alert('New event published!');
      }
      cancelEdit();
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Are you sure you want to delete this event and its registrations?')) return;
    try {
      await axios.delete(`/api/events/${id}`, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    }
  };

  const viewAttendees = async (e) => {
    setAttendeeEvent(e);
    setLoadingAttendees(true);
    try {
      const res = await axios.get(`/api/events/${e._id}/registrations`, { headers: getHeader() });
      setAttendees(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const inputStyle = 'w-full px-4 py-2.5 rounded-xl glass-input text-xs';

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <span className='font-tech text-xs text-cyan-400 uppercase tracking-widest'>Admin Operations</span>
          <h1 className='font-display text-3xl font-extrabold text-white mt-1'>Events & Workshops Manager</h1>
          <p className='text-xs text-slate-400 mt-1'>Publish events, schedule workshops, and monitor student RSVP attendance.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs font-tech text-cyan-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Form Card (Add or Edit) */}
      <form onSubmit={submit} className='glass-card p-6 sm:p-8 rounded-3xl mt-6 space-y-4 relative'>
        <div className='flex items-center justify-between border-b border-white/10 pb-2'>
          <h2 className='font-display text-base font-bold text-white'>
            {editId ? '✏️ Edit Scheduled Program' : '➕ Announce New Event / Workshop'}
          </h2>
          {editId && (
            <button
              type='button'
              onClick={cancelEdit}
              className='text-xs font-tech text-rose-400 hover:underline'
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2'>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Event Title *</label>
            <input
              required
              placeholder='e.g. ROS2 Nav2 Hands-on Autonomous Driving Workshop'
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className={`${inputStyle} bg-slate-900 text-white`}
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
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Date *</label>
            <input
              required
              placeholder='e.g. Oct 24, 2026'
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Time</label>
            <input
              placeholder='e.g. 10:00 AM - 4:00 PM'
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Location</label>
            <input
              placeholder='e.g. Lab 304, Tech Block'
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className={`${inputStyle} bg-slate-900 text-white`}
              style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
            >
              {statuses.map(s => (
                <option
                  key={s}
                  value={s}
                  style={{ backgroundColor: '#0b1120', color: '#f8fafc' }}
                  className='bg-slate-900 text-slate-100 py-2.5'
                >
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-slate-300 mb-1'>Description & Curriculum</label>
          <textarea
            rows={2}
            placeholder='Topics covered, microcontrollers provided, prerequisites, certificates...'
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className={inputStyle}
          />
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
          <div className='flex items-center gap-6'>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Event Poster Banner</label>
              <input
                type='file'
                accept='image/*'
                onChange={e => setFile(e.target.files[0])}
                className='text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Seat Limit</label>
              <input
                type='number'
                value={form.maxSeats}
                onChange={e => setForm({ ...form, maxSeats: e.target.value })}
                className='w-24 px-3 py-2 rounded-xl glass-input text-xs font-tech'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 hover:opacity-95 transition-all'
          >
            {submitting ? 'Saving...' : editId ? 'Save Event Changes →' : 'Publish Event →'}
          </button>
        </div>
      </form>

      {/* Events List */}
      <div className='mt-10'>
        <h2 className='font-display text-xl font-bold text-white mb-4'>
          Scheduled Programs ({list.length})
        </h2>

        {loading ? (
          <div className='text-center py-10 text-slate-400 font-tech text-xs'>Loading programs...</div>
        ) : list.length === 0 ? (
          <div className='text-center py-8 glass rounded-2xl text-slate-400 text-xs'>No events found.</div>
        ) : (
          <div className='space-y-3'>
            {list.map(e => (
              <div
                key={e._id}
                className='glass-card p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4'
              >
                <div className='flex items-center gap-4'>
                  {e.image && (
                    <img
                      src={e.image}
                      alt={e.title}
                      className='w-16 h-12 object-cover rounded-xl border border-white/10 shrink-0'
                    />
                  )}
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-display font-bold text-white text-base'>{e.title}</h3>
                      <span className='font-tech text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'>
                        {e.category}
                      </span>
                      <span className='font-tech text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300'>
                        {e.status}
                      </span>
                    </div>
                    <p className='text-xs font-tech text-slate-400 mt-1'>
                      📅 {e.date} {e.time ? `• ${e.time}` : ''} • 📍 {e.location || 'Robotics Lab'} • 👥 {e.registeredCount || 0} Registered
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2 self-end md:self-center font-tech text-xs'>
                  <button
                    onClick={() => viewAttendees(e)}
                    className='px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all'
                  >
                    👥 Attendees ({e.registeredCount || 0})
                  </button>
                  <button
                    onClick={() => openEdit(e)}
                    className='px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(e._id)}
                    className='px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white transition-all'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendees RSVP Modal */}
      {attendeeEvent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn'>
          <div className='glass-card max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto'>
            <button
              onClick={() => setAttendeeEvent(null)}
              className='absolute top-5 right-5 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white'
            >
              ✕
            </button>

            <span className='font-tech text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300'>
              Attendee Roster
            </span>
            <h2 className='font-display font-bold text-2xl text-white mt-2'>
              {attendeeEvent.title}
            </h2>
            <p className='text-xs font-tech text-slate-400 mt-1'>
              Registered Count: {attendees.length}
            </p>

            <div className='mt-6'>
              {loadingAttendees ? (
                <div className='text-center py-8 text-slate-400 font-tech text-xs'>Loading attendees...</div>
              ) : attendees.length === 0 ? (
                <div className='text-center py-8 glass rounded-2xl text-slate-400 text-xs'>
                  No students have RSVP'd for this event yet.
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs font-tech'>
                    <thead>
                      <tr className='border-b border-white/10 text-slate-400'>
                        <th className='py-2 px-3'>Student Name</th>
                        <th className='py-2 px-3'>Email</th>
                        <th className='py-2 px-3'>Phone</th>
                        <th className='py-2 px-3'>Roll No / ID</th>
                        <th className='py-2 px-3'>Track</th>
                        <th className='py-2 px-3'>Status</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-white/5'>
                      {attendees.map(a => (
                        <tr key={a._id} className='hover:bg-white/5'>
                          <td className='py-2.5 px-3 font-semibold text-white'>{a.fullName}</td>
                          <td className='py-2.5 px-3 text-cyan-300'>{a.email}</td>
                          <td className='py-2.5 px-3 text-slate-300'>{a.phone || '-'}</td>
                          <td className='py-2.5 px-3 text-slate-400'>{a.studentId}</td>
                          <td className='py-2.5 px-3 text-violet-300'>{a.technicalDomain || '-'}</td>
                          <td className='py-2.5 px-3'>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
