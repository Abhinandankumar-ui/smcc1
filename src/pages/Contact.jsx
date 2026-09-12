import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [labInfo, setLabInfo] = useState(null);

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data?.labInfo) {
        setLabInfo(res.data.labInfo);
      }
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await axios.post('/api/contact', form);
      setMsg({
        type: 'success',
        text: 'Thank you! Your transmission has reached our lab leads. We will reply shortly.'
      });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to dispatch message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const lab = labInfo || {
    location: 'Robotics & IoT Lab--Room No. 3064, FET, Rama University',
    email: 'smcc.robotics@gmail.com',
    timings: 'Monday – Friday: 9:00 AM – 5:00 PM'
  };

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>
      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-sm'>
          Connect With Us
        </span>
        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          Lab Inquiries & Transmissions
        </h1>
        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          Have questions about joining technical sprints, hardware sponsorship, project collaboration, or borrowing lab components?
        </p>
      </div>

      <div className='grid lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start'>
        {/* Left: Contact Info */}
        <div className='lg:col-span-5 space-y-6'>
          <div className='glass-card p-8 rounded-3xl space-y-6 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.20)]'>
            <div>
              <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-400'>
                Command Center
              </span>
              <h2 className='font-display font-black text-3xl text-white mt-1'>
                Innovation Lab
              </h2>
            </div>

            <div className='space-y-4 text-xs font-tech'>
              <div className='flex items-start gap-3 p-4 rounded-2xl bg-space-950/80 border border-white/10'>
                <span className='text-2xl'>📍</span>
                <div>
                  <p className='font-bold text-white text-sm'>Physical Location</p>
                  <p className='text-slate-300 mt-1 leading-relaxed'>{lab.location}</p>
                </div>
              </div>

              <div className='flex items-start gap-3 p-4 rounded-2xl bg-space-950/80 border border-white/10'>
                <span className='text-2xl'>✉️</span>
                <div>
                  <p className='font-bold text-white text-sm'>Official Email</p>
                  <p className='text-cyan-300 mt-1'>{lab.email}</p>
                </div>
              </div>


              <div className='flex items-start gap-3 p-4 rounded-2xl bg-space-950/80 border border-white/10'>
                <span className='text-2xl'>⏱️</span>
                <div>
                  <p className='font-bold text-white text-sm'>Workbench Timings</p>
                  <p className='text-emerald-400 mt-1 font-bold'>{lab.timings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dispatch Message Form */}
        <div className='lg:col-span-7'>
          <form onSubmit={submit} className='glass-card p-8 rounded-3xl space-y-4 border border-white/10 hover:border-indigo-400/50 hover:shadow-[0_12px_35px_-8px_rgba(99,102,241,0.20)]'>
            <div>
              <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-400'>
                Message Gateway
              </span>
              <h3 className='font-display font-black text-3xl text-white mt-1'>
                Send a Message
              </h3>
            </div>

            {msg.text && (
              <div className={`p-4 rounded-xl text-xs font-semibold ${
                msg.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {msg.text}
              </div>
            )}

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Full Name *</label>
              <input
                required
                placeholder='Enter your full name'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs'
              />
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>Email Address *</label>
                <input
                  required
                  type='email'
                  placeholder='Enter your email address'
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-slate-300 mb-1'>Phone / WhatsApp</label>
                <input
                  placeholder='Enter your phone or WhatsApp number'
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl glass-input text-xs'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>Your Message / Inquiry *</label>
              <textarea
                required
                rows={4}
                placeholder='Type your message, inquiry, or collaboration proposal here...'
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className='w-full px-4 py-3 rounded-xl glass-input text-xs'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-4 rounded-xl btn-primary-gradient text-xs font-black'
            >
              {loading ? 'Dispatching...' : 'Dispatch Message to Club Leads →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
