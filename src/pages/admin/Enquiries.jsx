import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function Enquiries() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const load = () => {
    setLoading(true);
    const url = statusFilter && statusFilter !== 'All' 
      ? `/api/contact?status=${statusFilter}` 
      : '/api/contact';

    axios.get(url, { headers: getHeader() })
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
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/contact/${id}/status`, { status }, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/contact/${id}`, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete message');
    }
  };

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Visitor Messages & Enquiries</h1>
          <p className='text-xs text-white/60 mt-1'>Review outreach queries from potential sponsors, students, and collaborators.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs text-violet-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className='flex gap-2 mt-6'>
        {['All', 'Unread', 'Read', 'Replied'].map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              statusFilter === tab
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'glass border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='mt-6 space-y-3'>
        {loading ? (
          <div className='text-center py-8 text-white/50'>Loading messages...</div>
        ) : list.length === 0 ? (
          <div className='text-center py-8 glass rounded-xl text-white/50 text-sm'>No enquiries found in this view.</div>
        ) : (
          list.map(e => (
            <div key={e._id} className='glass p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4'>
              <div className='space-y-2 flex-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-bold text-white text-base'>{e.name}</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    e.status === 'Unread' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    e.status === 'Replied' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {e.status || 'Unread'}
                  </span>
                </div>
                <p className='text-xs text-cyan-300 font-medium'>
                  📧 {e.email} {e.phone ? `• 📞 ${e.phone}` : ''}
                </p>
                <p className='text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5'>
                  {e.message}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2 self-end md:self-start shrink-0'>
                <a
                  href={`mailto:${e.email}?subject=Regarding your SMC Club Inquiry`}
                  onClick={() => updateStatus(e._id, 'Replied')}
                  className='text-xs bg-violet-600 hover:bg-violet-500 text-white font-bold px-3 py-1.5 rounded-xl transition-all'
                >
                  ✉️ Reply
                </a>
                {e.status !== 'Read' && (
                  <button
                    onClick={() => updateStatus(e._id, 'Read')}
                    className='text-xs glass border border-white/20 text-white/80 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all'
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => del(e._id)}
                  className='text-xs text-rose-400 hover:text-white px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 transition-all'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
