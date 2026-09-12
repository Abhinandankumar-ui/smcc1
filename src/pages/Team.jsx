import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [activeDomain, setActiveDomain] = useState('All');
  const [domainList, setDomainList] = useState(['All', 'Robotics', 'IoT', 'Automation', 'Drone/CV']);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch dynamic domains from backend
  useEffect(() => {
    axios.get('/api/settings/domains').then(res => {
      if (res.data?.length > 0) {
        setDomainList(['All', ...res.data.map(d => d.title)]);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('/api/members')
      .then(res => {
        setMembers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const coreMembers = members.filter(m => {
    const isSupport = m.memberType === 'Support Team' || m.technicalDomain === 'Support Team';
    if (isSupport) return false;
    const matchesDomain = activeDomain === 'All' || m.technicalDomain === activeDomain;
    const matchesSearch = !search || 
      m.name?.toLowerCase().includes(search.toLowerCase()) || 
      m.designation?.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const supportMembers = members.filter(m => {
    const isSupport = m.memberType === 'Support Team' || m.technicalDomain === 'Support Team';
    if (!isSupport) return false;
    const matchesSearch = !search || 
      m.name?.toLowerCase().includes(search.toLowerCase()) || 
      (m.designation && m.designation.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>
      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-sm'>
          Core Engineers & Mentors
        </span>
        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          Meet the Minds Behind the Tech
        </h1>
        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          Our collective brings together passionate undergraduate hardware fabricators, firmware developers, and robotics researchers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className='max-w-4xl mx-auto mb-14 space-y-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search team members by name or designation...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-5 py-4 pl-12 rounded-2xl glass-input text-xs sm:text-sm'
          />
          <span className='absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-base'>
            🔍
          </span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-tech font-bold'
            >
              Clear ✕
            </button>
          )}
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          {domainList.map(d => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDomain === d
                  ? 'btn-primary-gradient shadow-lg scale-105'
                  : 'glass text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className='text-center py-20 text-cyan-400 font-tech text-xs'>
          <span className='inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2' />
          Loading member directory...
        </div>
      ) : coreMembers.length === 0 && supportMembers.length === 0 ? (
        <div className='text-center py-16 glass rounded-3xl p-8 border border-white/10 max-w-md mx-auto'>
          <p className='text-lg font-bold text-white font-display'>No members found in this category.</p>
          <p className='text-xs text-slate-400 mt-1'>Check back soon or apply to become a club member!</p>
        </div>
      ) : (
        <>
          {/* Core Technical Leads Grid */}
          {coreMembers.length > 0 && (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {coreMembers.map(m => (
                <div
                  key={m._id}
                  className='glass-card p-7 rounded-3xl flex flex-col items-center text-center justify-between group border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.20)]'
                >
                  <div className='w-full flex flex-col items-center'>
                    {/* Photo with Glowing Cyan/Indigo Border */}
                    <div className='relative w-28 h-28 mx-auto rounded-2xl overflow-hidden mb-4 border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300 bg-slate-900'>
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={m.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-cyan-400'>
                          <svg className='w-11 h-11 text-cyan-400/70' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                          </svg>
                          <span className='font-display font-bold text-xs text-white/70 mt-0.5 uppercase tracking-wider'>
                            {m.name ? m.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') : 'SMC'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Domain Pill */}
                    <span className='font-tech text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2 inline-block'>
                      {m.technicalDomain || 'Robotics'}
                    </span>

                    {/* Name & Role */}
                    <h3 className='font-display font-bold text-2xl text-white group-hover:text-cyan-300 transition-colors'>
                      {m.name}
                    </h3>
                    <p className='text-xs font-tech text-cyan-300 font-bold mt-1'>
                      {m.designation}
                    </p>

                    {/* Bio */}
                    <p className='text-xs text-slate-300 mt-3.5 line-clamp-3 leading-relaxed'>
                      {m.bio || 'Core engineering member contributing to innovative club hardware and software modules.'}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className='flex items-center gap-3 mt-6 pt-4 border-t border-white/10 w-full justify-center text-xs font-tech font-bold'>
                    {m.socialLinks?.linkedin && (
                      <a
                        href={m.socialLinks.linkedin !== '#' ? m.socialLinks.linkedin : 'https://www.linkedin.com/in/smart-mech-circle-club-a40024436'}
                        target='_blank'
                        rel='noreferrer'
                        className='text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors flex items-center gap-1'
                      >
                        <span>LinkedIn</span>
                        <span>↗</span>
                      </a>
                    )}
                    {(m.socialLinks?.instagram || m.socialLinks?.github) && (
                      <a
                        href={
                          m.socialLinks?.instagram && m.socialLinks.instagram !== '#'
                            ? m.socialLinks.instagram
                            : 'https://www.instagram.com/thesmartmech_circle?utm_source=qr&stkn=NDJ5OWk4cWFqbWR0'
                        }
                        target='_blank'
                        rel='noreferrer'
                        className='text-slate-300 hover:text-pink-400 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors flex items-center gap-1'
                      >
                        <span>Instagram</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dedicated Support Team Section */}
          {supportMembers.length > 0 && activeDomain === 'All' && (
            <div className='mt-20 pt-12 border-t border-white/10'>
              <div className='text-center max-w-2xl mx-auto mb-10'>
                <span className='font-tech text-xs font-bold uppercase tracking-widest text-teal-300 bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/30 shadow-sm'>
                  Club Operations & Volunteers
                </span>
                <h2 className='font-display text-3xl sm:text-4xl font-black mt-3 text-white'>
                  🤝 Support & Operations Team
                </h2>
                <p className='mt-2 text-slate-300 text-xs sm:text-sm'>
                  Dedicated club members, coordinators, and volunteers providing essential support across lab projects, event management, and operations.
                </p>
              </div>

              <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {supportMembers.map(m => (
                  <div
                    key={m._id}
                    className='glass-card p-5 rounded-2xl flex flex-col items-center text-center justify-between group border border-teal-500/20 hover:border-teal-400/50 hover:shadow-[0_8px_30px_-8px_rgba(20,184,166,0.25)] transition-all'
                  >
                    <div className='w-full flex flex-col items-center'>
                      {/* Photo */}
                      <div className='relative w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-3 border-2 border-teal-500/30 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300 bg-slate-900'>
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-teal-400'>
                            <svg className='w-8 h-8 text-teal-400/70' fill='currentColor' viewBox='0 0 24 24'>
                              <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                            </svg>
                            <span className='font-display font-bold text-[10px] text-white/70 mt-0.5 uppercase tracking-wider'>
                              {m.name ? m.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') : 'SMC'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pill */}
                      <span className='font-tech text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 mb-2 inline-block'>
                        Support Team
                      </span>

                      {/* Name */}
                      <h3 className='font-display font-bold text-lg text-white group-hover:text-teal-300 transition-colors'>
                        {m.name}
                      </h3>
                      <p className='text-xs font-tech text-teal-300/90 font-medium mt-0.5'>
                        {m.designation && m.designation !== 'Support Team' ? m.designation : 'Support Member'}
                      </p>

                      {/* Bio */}
                      {m.bio && (
                        <p className='text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed'>
                          {m.bio}
                        </p>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className='flex items-center gap-2 mt-4 pt-3 border-t border-white/10 w-full justify-center text-[11px] font-tech font-bold'>
                      {m.socialLinks?.linkedin && m.socialLinks.linkedin !== '#' && (
                        <a
                          href={m.socialLinks.linkedin}
                          target='_blank'
                          rel='noreferrer'
                          className='text-slate-300 hover:text-cyan-400 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1'
                        >
                          <span>LinkedIn ↗</span>
                        </a>
                      )}
                      {m.socialLinks?.instagram && m.socialLinks.instagram !== '#' && (
                        <a
                          href={m.socialLinks.instagram}
                          target='_blank'
                          rel='noreferrer'
                          className='text-slate-300 hover:text-pink-400 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1'
                        >
                          <span>Instagram ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Join the Team Callout */}
      <div className='mt-20 glass p-8 sm:p-12 rounded-3xl border border-indigo-500/40 text-center max-w-3xl mx-auto relative overflow-hidden bg-gradient-to-br from-[#0a0f24] via-[#101738] to-[#070b1a] shadow-xl shadow-indigo-500/10'>
        <h3 className='font-display font-black text-2xl sm:text-3xl text-white'>
          Want to Engineer Hardware with Us?
        </h3>
        <p className='text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed'>
          Recruitment opens every academic term. Apply to work on real rovers, high-altitude balloons, and edge IoT devices.
        </p>
        <Link
          to='/join'
          className='btn-primary-gradient inline-block mt-6 px-8 py-3.5 rounded-xl text-xs font-black shadow-lg'
        >
          Submit Member Application →
        </Link>
      </div>
    </div>
  );
}
