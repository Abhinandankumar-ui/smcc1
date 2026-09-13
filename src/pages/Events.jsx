import { getImageUrl } from '../utils/imageUrl';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // RSVP Registration Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpForm, setRsvpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    course: '',
    technicalDomain: 'Robotics'
  });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null);

  const tabs = ['All', 'Workshops', 'Competitions', 'Past Events'];

  const fetchEvents = () => {
    setLoading(true);
    axios.get('/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRsvpSubmitting(true);
    setRsvpStatus(null);

    try {
      const res = await axios.post(`/api/events/${selectedEvent._id}/register`, rsvpForm);
      setRsvpStatus({
        type: 'success',
        message: res.data.message || 'Seat reserved successfully! Check your email for event updates.'
      });
      fetchEvents();
      setTimeout(() => {
        setRsvpForm({
          fullName: '',
          email: '',
          phone: '',
          studentId: '',
          course: '',
          technicalDomain: 'Robotics'
        });
      }, 2000);
    } catch (err) {
      setRsvpStatus({
        type: 'error',
        message: err.response?.data?.error || 'Registration failed. Please verify your details.'
      });
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const filteredEvents = events.filter(e => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Workshops') return e.category === 'Workshop';
    if (activeTab === 'Competitions') return e.category === 'Competition';
    if (activeTab === 'Past Events') return e.category === 'Past' || e.status === 'Completed';
    return true;
  });

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>
      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <span className='font-tech text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-sm'>
          Event and Workshop
        </span>
        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          Event and Workshop
        </h1>
        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          Join intensive hands-on hardware workshops, technical events, and guest engineering seminars hosted at our campus lab.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-14'>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'btn-primary-gradient shadow-lg scale-105'
                : 'glass text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className='text-center py-20 text-cyan-400 font-tech text-xs'>
          <span className='inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2' />
          Loading club programs...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className='text-center py-16 glass rounded-3xl p-8 border border-white/10 max-w-md mx-auto'>
          <p className='text-lg font-bold text-white font-display'>No events found in this category.</p>
          <p className='text-xs text-slate-400 mt-1'>Check back soon as new workshop schedules are announced frequently.</p>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredEvents.map(e => {
            const isCompleted = e.status === 'Completed' || e.category === 'Past';

            return (
              <div
                key={e._id}
                className='glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-emerald-400/50 hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.20)]'
              >
                <div>
                  {/* Event Banner */}
                  <div className='h-52 overflow-hidden relative bg-slate-950'>
                    <img
                      src={getImageUrl(e.image) || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                      alt={e.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute top-3 left-3 flex gap-2'>
                      <span className='text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-cyan-500/40 text-cyan-300 shadow-md'>
                        {e.category}
                      </span>
                      <span className={`text-[10px] font-tech font-bold px-3 py-1 rounded-full backdrop-blur ${
                        isCompleted
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-950/90 border border-emerald-500/40 text-emerald-400'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 text-xs font-tech text-cyan-300 font-bold mb-2'>
                      <span>📅 {e.date}</span>
                      {e.time && <span>• ⏰ {e.time}</span>}
                    </div>

                    <h3 className='font-display font-bold text-xl text-white group-hover:text-emerald-300 transition-colors'>
                      {e.title}
                    </h3>

                    <p className='text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed'>
                      {e.description}
                    </p>

                    <div className='mt-5 pt-4 border-t border-white/10'>
                      <p className='text-xs text-slate-200 flex items-center gap-1.5 font-tech'>
                        <span className='text-cyan-400'>📍</span> <span>{e.location || 'Robotics & IoT Lab 304'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer RSVP button */}
                <div className='p-6 pt-0'>
                  {isCompleted ? (
                    <div className='text-center py-3 rounded-xl bg-white/5 text-slate-400 text-xs font-tech'>
                      Event Concluded
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedEvent(e); setRsvpStatus(null); }}
                      className='w-full py-3.5 rounded-xl btn-primary-gradient text-xs font-bold'
                    >
                      Register Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn'>
          <div className='glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 relative max-h-[90vh] overflow-y-auto'>
            <button
              onClick={() => setSelectedEvent(null)}
              className='absolute top-5 right-5 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white'
            >
              ✕
            </button>

            <span className='font-tech text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'>
              Register • {selectedEvent.category}
            </span>

            <h2 className='font-display font-extrabold text-2xl text-white mt-3'>
              {selectedEvent.title}
            </h2>
            <p className='text-xs font-tech text-slate-300 mt-1'>
              📅 {selectedEvent.date} {selectedEvent.time ? `• ${selectedEvent.time}` : ''} • 📍 {selectedEvent.location}
            </p>

            {rsvpStatus && (
              <div className={`p-4 rounded-xl text-xs font-semibold mt-4 ${
                rsvpStatus.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {rsvpStatus.message}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className='mt-6 space-y-4'>
              <div>
                <label className='block text-xs text-slate-300 mb-1 font-medium'>Full Name *</label>
                <input
                  required
                  placeholder='e.g. Aarav Sharma'
                  value={rsvpForm.fullName}
                  onChange={e => setRsvpForm({ ...rsvpForm, fullName: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-slate-300 mb-1 font-medium'>College Email *</label>
                  <input
                    required
                    type='email'
                    placeholder='aarav@college.edu'
                    value={rsvpForm.email}
                    onChange={e => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                    className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-300 mb-1 font-medium'>Phone / WhatsApp</label>
                  <input
                    placeholder='+91 98765 43210'
                    value={rsvpForm.phone}
                    onChange={e => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                    className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                  />
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-slate-300 mb-1 font-medium'>Student Roll / ID *</label>
                  <input
                    required
                    placeholder='e.g. 21BCE1024'
                    value={rsvpForm.studentId}
                    onChange={e => setRsvpForm({ ...rsvpForm, studentId: e.target.value })}
                    className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-300 mb-1 font-medium'>Course & Year</label>
                  <input
                    placeholder='e.g. B.Tech ECE 3rd Yr'
                    value={rsvpForm.course}
                    onChange={e => setRsvpForm({ ...rsvpForm, course: e.target.value })}
                    className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                  />
                </div>
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  disabled={rsvpSubmitting}
                  className='w-full py-3.5 rounded-xl btn-primary-gradient text-xs font-black'
                >
                  {rsvpSubmitting ? 'Registering...' : 'Complete Registration →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
