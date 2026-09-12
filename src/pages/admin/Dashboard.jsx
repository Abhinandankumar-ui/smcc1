import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const getHeader = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token')
});

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [promoteId, setPromoteId] = useState(null);
  const navigate = useNavigate();

  const fetchStats = () => {
    axios.get('/api/admin/stats', { headers: getHeader() })
      .then(r => setS(r.data))
      .catch(() => {
        navigate('/admin');
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);
      await axios.put(`/api/applications/${id}/status`, { status }, { headers: getHeader() });
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setLoadingId(null);
    }
  };

  const handlePromote = async (id, name) => {
    const desig = prompt(`Enter Club Designation for ${name}:`, 'Hardware Engineer');
    if (!desig) return;

    try {
      setPromoteId(id);
      const res = await axios.post(`/api/applications/${id}/promote`, { designation: desig }, { headers: getHeader() });
      alert(res.data.message || 'Promoted to member!');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to promote to member');
    } finally {
      setPromoteId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  if (!s) return (
    <div className='p-12 text-center text-white/60'>
      Loading dashboard metrics... <Link to='/admin' className='text-violet-400 underline ml-2'>Login</Link>
    </div>
  );

  const statCard = 'glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-orange-500/50 shadow-lg';

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <span className='font-tech text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30'>
            Admin Control Center
          </span>
          <h1 className='font-display text-3xl font-black text-white mt-2'>Dashboard Overview</h1>
        </div>
        <button
          onClick={handleLogout}
          className='self-start sm:self-center text-xs font-tech font-bold text-rose-400 hover:text-white border border-rose-500/30 px-4 py-2 rounded-xl hover:bg-rose-600 transition-all'
        >
          Sign Out ✕
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8'>
        <div className={statCard}>
          <p className='text-xs font-tech text-slate-400 font-bold uppercase'>Applications</p>
          <p className='font-display text-3xl font-black text-white mt-1'>{s.total}</p>
          <span className='text-[11px] font-tech text-amber-400 mt-1 font-bold'>⚡ {s.pending} pending</span>
        </div>
        <div className={statCard}>
          <p className='text-xs font-tech text-slate-400 font-bold uppercase'>Projects</p>
          <p className='font-display text-3xl font-black text-cyan-300 mt-1'>{s.projects || 0}</p>
          <span className='text-[11px] font-tech text-slate-400 mt-1'>Live showcase</span>
        </div>
        <div className={statCard}>
          <p className='text-xs font-tech text-slate-400 font-bold uppercase'>Club Members</p>
          <p className='font-display text-3xl font-black text-emerald-400 mt-1'>{s.members || 0}</p>
          <span className='text-[11px] font-tech text-slate-400 mt-1'>Active roster</span>
        </div>
        <div className={statCard}>
          <p className='text-xs font-tech text-slate-400 font-bold uppercase'>Events & Meets</p>
          <p className='font-display text-3xl font-black text-orange-400 mt-1'>{s.events || 0}</p>
          <span className='text-[11px] font-tech text-slate-400 mt-1'>Event and Workshop</span>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className='flex flex-wrap gap-2.5 mt-8'>
        <Link to='/admin/applications' className='btn-primary-gradient text-xs font-black px-4 py-2.5 rounded-xl shadow-md'>
          📋 Applications ({s.pending})
        </Link>
        <Link to='/admin/projects' className='glass border border-white/10 hover:border-cyan-400 text-white text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all'>
          🚀 Projects ({s.projects || 0})
        </Link>
        <Link to='/admin/members' className='glass border border-white/10 hover:border-orange-400 text-white text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all'>
          👥 Members ({s.members || 0})
        </Link>
        <Link to='/admin/events' className='glass border border-white/10 hover:border-emerald-400 text-white text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all'>
          📅 Events ({s.events || 0})
        </Link>
        <Link to='/admin/gallery' className='glass border border-white/10 hover:border-fuchsia-400 text-white text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all'>
          🖼️ Gallery ({s.gallery || 0})
        </Link>
        <Link to='/admin/enquiries' className='glass border border-white/10 hover:border-amber-400 text-white text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all'>
          💬 Enquiries {s.unreadEnquiries ? `(${s.unreadEnquiries} new)` : ''}
        </Link>
        <Link to='/admin/settings' className='glass border border-orange-500/40 text-orange-400 text-xs font-tech font-bold px-4 py-2.5 rounded-xl hover:bg-orange-500/10 transition-all ml-auto'>
          ⚙️ Club Settings
        </Link>
      </div>

      {/* Recent Applications Section */}
      <div className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold text-white'>Recent Applications</h2>
          <Link to='/admin/applications' className='text-xs text-cyan-400 hover:underline'>View All →</Link>
        </div>

        <div className='mt-3 space-y-3'>
          {s.recent && s.recent.length > 0 ? (
            s.recent.map(a => {
              const isPending = a.status === 'Pending';
              const isApproved = a.status === 'Approved';
              const isRejected = a.status === 'Rejected';

              return (
                <div key={a._id} className='glass p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    {a.profilePhoto ? (
                      <img
                        src={a.profilePhoto}
                        alt={a.fullName}
                        className='w-11 h-11 rounded-full object-cover border border-white/20'
                      />
                    ) : (
                      <div className='w-11 h-11 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300'>
                        {a.fullName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-white text-sm'>{a.fullName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          isRejected ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {a.status}
                        </span>
                        {a.promotedToMember && (
                          <span className='text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'>
                            ✓ Member
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-white/60 mt-0.5'>
                        {a.course || 'No course'} • Track: <span className='text-cyan-300'>{a.areaOfInterest}</span> • {a.email}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-2 self-end md:self-center'>
                    {!a.promotedToMember && isApproved && (
                      <button
                        disabled={promoteId === a._id}
                        onClick={() => handlePromote(a._id, a.fullName)}
                        className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all font-bold'
                      >
                        ⚡ Promote to Member
                      </button>
                    )}

                    <button
                      disabled={loadingId === a._id || isApproved}
                      onClick={() => updateStatus(a._id, 'Approved')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isApproved
                          ? 'bg-emerald-600/30 text-emerald-300 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      ✓ Approve
                    </button>
                    <button
                      disabled={loadingId === a._id || isRejected}
                      onClick={() => updateStatus(a._id, 'Rejected')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isRejected
                          ? 'bg-rose-600/30 text-rose-300 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-white/50 text-xs glass p-4 rounded-xl'>No applications recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
