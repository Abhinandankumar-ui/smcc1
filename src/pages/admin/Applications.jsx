import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [promoteId, setPromoteId] = useState(null);

  const load = () => {
    setLoading(true);
    let url = '/api/applications?';
    if (filter) url += `status=${filter}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;

    axios.get(url, { headers: getHeader() })
      .then(r => {
        setApps(r.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Login required');
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, [filter]);

  const update = async (id, status) => {
    try {
      await axios.put(`/api/applications/${id}/status`, { status }, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    }
  };

  const del = async (id) => {
    if (!confirm('Permanently delete this application?')) return;
    try {
      await axios.delete(`/api/applications/${id}`, { headers: getHeader() });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handlePromote = async (id, name) => {
    const desig = prompt(`Enter club designation for ${name}:`, 'Hardware Engineer');
    if (!desig) return;

    try {
      setPromoteId(id);
      const res = await axios.post(`/api/applications/${id}/promote`, { designation: desig }, { headers: getHeader() });
      alert(res.data.message || 'Promoted to member!');
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to promote');
    } finally {
      setPromoteId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Membership Applications</h1>
          <p className='text-xs text-white/60 mt-1'>Review, approve, reject, and promote applicants to core member roster.</p>
        </div>
        <Link to='/admin/dashboard' className='text-xs text-violet-400 hover:underline'>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filters & Search */}
      <div className='flex flex-wrap items-center gap-3 mt-6'>
        <div className='flex gap-2'>
          {['', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === s
                  ? 'bg-violet-600 text-white shadow'
                  : 'glass border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className='flex gap-2 ml-auto'>
          <input
            placeholder='Search by name, email, phone...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 w-56'
          />
          <button type='submit' className='bg-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl'>
            Search
          </button>
        </form>
      </div>

      {/* Applications List */}
      <div className='mt-6 space-y-3'>
        {loading ? (
          <div className='text-center py-12 text-white/50'>Loading applications...</div>
        ) : apps.length === 0 ? (
          <div className='text-center py-12 glass rounded-xl text-white/50 text-sm'>No applications match these filters.</div>
        ) : (
          apps.map(a => {
            const isPending = a.status === 'Pending';
            const isApproved = a.status === 'Approved';
            const isRejected = a.status === 'Rejected';
            const photoSrc = a.profilePhoto || null;

            return (
              <div key={a._id} className='glass p-5 rounded-2xl border border-white/10'>
                <div className='flex gap-4'>
                  {/* Photo */}
                  {photoSrc ? (
                    <img src={photoSrc} alt={a.fullName} className='w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0' />
                  ) : (
                    <div className='w-16 h-16 rounded-2xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300 text-2xl shrink-0'>
                      {a.fullName?.[0]?.toUpperCase() || 'A'}
                    </div>
                  )}

                  {/* Details */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-bold text-white'>{a.fullName}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isRejected ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {a.status}
                      </span>
                      {a.promotedToMember && (
                        <span className='text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'>
                          ✓ Member
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-white/60 mt-1'>
                      📧 {a.email} • 📞 {a.phone} • {a.gender} • 🎓 {a.course || 'N/A'}
                    </p>
                    <p className='text-xs text-cyan-300 mt-0.5 font-medium'>
                      Domain: {a.areaOfInterest || 'Robotics'}
                    </p>
                    {a.whyJoin && (
                      <p className='text-xs text-white/50 mt-1.5 line-clamp-2 italic'>
                        "{a.whyJoin}"
                      </p>
                    )}
                    {a.address && (
                      <p className='text-[10px] text-white/40 mt-1'>📍 {a.address}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/10'>
                  {!a.promotedToMember && isApproved && (
                    <button
                      disabled={promoteId === a._id}
                      onClick={() => handlePromote(a._id, a.fullName)}
                      className='bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-md transition-all'
                    >
                      ⚡ Promote to Member
                    </button>
                  )}

                  <button
                    onClick={() => update(a._id, 'Approved')}
                    disabled={isApproved}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isApproved ? 'bg-emerald-600/30 text-emerald-300 cursor-default' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => update(a._id, 'Rejected')}
                    disabled={isRejected}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isRejected ? 'bg-rose-600/30 text-rose-300 cursor-default' : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => update(a._id, 'Pending')}
                    disabled={isPending}
                    className='px-3 py-1.5 rounded-xl text-xs font-semibold glass border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30'
                  >
                    ⏳ Pending
                  </button>
                  <button
                    onClick={() => del(a._id)}
                    className='ml-auto px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-all'
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
