import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [settings, setSettings] = useState(null);
  const [domains, setDomains] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.allSettled([
      axios.get('/api/settings'),
      axios.get('/api/projects?limit=3'),
      axios.get('/api/events')
    ]).then(([settingsRes, projectsRes, eventsRes]) => {
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        const d = settingsRes.value.data;
        setSettings(d);
        if (d.domains?.length > 0) setDomains(d.domains);
        if (d.stats?.length > 0) setStats(d.stats);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value?.data) {
        setFeaturedProjects(projectsRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        const upcoming = eventsRes.value.data.filter(e => e.status === 'Upcoming' || e.category === 'Workshop');
        setUpcomingEvents(upcoming.slice(0, 3));
      }
      setLoading(false);
    });
  }, []);

  const hero = settings?.hero || {
    badge: 'Welcome to SMC Club • Smart Mech Circle Club',
    titlePrefix: 'Engineering the Future of',
    titleHighlight: 'Robotics & Connected IoT',
    description: 'A premier multidisciplinary hub for engineering enthusiasts passionate about autonomous robotics, smart IoT networks, wireless sensor telemetry, and intelligent cyber-physical systems.'
  };

  const defaultStats = [
    { value: '4+', label: 'Technical Domains', icon: '⚡' },
    { value: '20+', label: 'Hardware Prototypes', icon: '🤖' },
    { value: '120+', label: 'Active Innovators', icon: '👥' },
    { value: '15+', label: 'Workshops & Wins', icon: '🏆' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  if (loading) {
    return (
      <div className='min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden'>
        <div className='relative flex items-center justify-center'>
          <div className='w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin' />
          <div className='absolute w-10 h-10 rounded-full border-2 border-indigo-500/20 border-b-indigo-400 animate-spin' style={{ animationDirection: 'reverse' }} />
          <span className='absolute text-xs font-tech text-cyan-400 font-bold'>SMC</span>
        </div>
        <p className='font-tech text-xs tracking-widest uppercase text-slate-400 mt-5 flex items-center gap-2'>
          <span className='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse' />
          Loading SMC Systems...
        </p>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden'>
      {/* VIBRANT AMBIENT LIGHT MESH */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-[750px] tech-grid opacity-70 pointer-events-none -z-10' />
      <div className='absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 blur-[130px] rounded-full pointer-events-none -z-10' />
      <div className='absolute top-32 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10' />
      <div className='absolute top-96 left-1/3 w-[600px] h-[300px] bg-pink-600/15 blur-[140px] rounded-full pointer-events-none -z-10' />

      {/* 1. HERO SECTION */}
      <section className='pt-16 pb-20 px-6 max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-12 gap-12 items-center'>
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='lg:col-span-7 text-center lg:text-left space-y-6'
          >
            {/* Live Energetic Beacon Badge */}
            <div className='inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-xs font-tech text-cyan-300 shadow-md shadow-cyan-500/15'>
              <span className='w-2 h-2 rounded-full bg-cyan-400 animate-ping' />
              <span className='font-bold uppercase tracking-wider'>{hero.badge}</span>
            </div>

            {/* Headline with High-Energy Multi-Gradient */}
            <h1 className='font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]'>
              {hero.titlePrefix}{' '}
              <span className='gradient-text-electric block sm:inline'>
                {hero.titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className='text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal'>
              {hero.description}
            </p>

            {/* Action Buttons */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3'>
              <Link
                to='/join'
                className='btn-primary-gradient px-8 py-4 rounded-xl text-sm flex items-center gap-2 font-black'
              >
                <span>⭐ Apply to Join The Team</span>
                <span>→</span>
              </Link>
              <Link
                to='/projects'
                className='px-7 py-4 rounded-xl glass border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/15 hover:border-cyan-400 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30'
              >
                <span>Explore Lab Projects</span>
                <span>↗</span>
              </Link>
            </div>

            {/* Rapid Trust Badges */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-tech text-slate-300'>
              <div className='flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-sm'>
                <span className='text-cyan-400 font-bold'>⚡</span>
                <span className='font-semibold text-slate-200'>Open-Source Hardware</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-purple-500/30 shadow-sm'>
                <span className='text-purple-400 font-bold'>🔬</span>
                <span className='font-semibold text-slate-200'>Component Lending Lab</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-amber-500/30 shadow-sm'>
                <span className='text-amber-400 font-bold'>🏆</span>
                <span className='font-semibold text-slate-200'>National Techfests</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Visual: High-Voltage Telemetry Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className='lg:col-span-5 relative'
          >
            <div className='relative rounded-3xl overflow-hidden glass p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/15 bg-gradient-to-br from-space-900/95 via-[#0c1328] to-space-950/95'>
              {/* Corner Sci-Fi Telemetry Accents */}
              <div className='flex items-center justify-between font-tech text-[10px] tracking-wider uppercase mb-3'>
                <span className='text-cyan-300 font-bold flex items-center gap-1.5'>
                  <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                  LIVE IOT COMPONENT TELEMETRY
                </span>
                <span className='text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded border border-cyan-500/40 font-bold shadow-sm'>
                  NODE: #SMC-IOT-01
                </span>
              </div>

              {/* Visual Hardware Preview */}
              <div className='relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 mb-4 group'>
                <img
                  src={featuredProjects[0]?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                  alt={featuredProjects[0]?.name || 'Smart IoT Hardware'}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent' />
                <div className='absolute bottom-3 left-4 right-4 flex justify-between items-end'>
                  <div>
                    <span className='text-[10px] font-tech font-bold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 uppercase'>
                      {featuredProjects[0]?.technologies?.slice(0, 3).join(' • ') || 'ESP32-S3 • FREERTOS • MQTT'}
                    </span>
                    <h3 className='font-display font-black text-lg text-white mt-1'>
                      {featuredProjects[0]?.name || 'Smart IoT Gateway & Sensor Hub'}
                    </h3>
                  </div>
                  <span className='text-xs font-tech font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-sm shadow-emerald-500/20'>
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Live Telemetry Chips with IoT Hardware Components */}
              <div className='grid grid-cols-2 gap-2.5 font-tech text-xs'>
                <div className='p-3 rounded-xl bg-space-950/90 border border-cyan-500/30 shadow-inner'>
                  <span className='text-[10px] text-cyan-400/80 block font-bold'>CORE MCU CONTROLLER</span>
                  <span className='font-bold text-cyan-300'>ESP32-S3 Dual-Core (240MHz)</span>
                </div>
                <div className='p-3 rounded-xl bg-space-950/90 border border-amber-500/30 shadow-inner'>
                  <span className='text-[10px] text-amber-400/80 block font-bold'>ENVIRONMENTAL SENSORS</span>
                  <span className='font-bold text-amber-300'>BME680 (Air/Temp/Pressure)</span>
                </div>
                <div className='p-3 rounded-xl bg-space-950/90 border border-emerald-500/30 shadow-inner'>
                  <span className='text-[10px] text-emerald-400/80 block font-bold'>IOT WIRELESS GATEWAY</span>
                  <span className='font-bold text-emerald-300'>LoRa SX1276 (915MHz / 15km)</span>
                </div>
                <div className='p-3 rounded-xl bg-space-950/90 border border-pink-500/30 shadow-inner'>
                  <span className='text-[10px] text-pink-400/80 block font-bold'>SMART POWER & SOLAR BMS</span>
                  <span className='font-bold text-pink-300'>3.7V Li-ion + Solar MPPT (96%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Animated Statistics Bar */}
        <div className='mt-20 pt-8 border-t border-white/10'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
            {displayStats.map((s, idx) => {
              const statStyles = [
                { border: 'hover:border-cyan-400/60', text: 'gradient-text-electric', label: 'text-cyan-400' },
                { border: 'hover:border-amber-400/60', text: 'bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent', label: 'text-amber-400' },
                { border: 'hover:border-purple-400/60', text: 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent', label: 'text-purple-400' },
                { border: 'hover:border-emerald-400/60', text: 'bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent', label: 'text-emerald-400' },
              ][idx % 4];

              return (
                <div key={idx} className={`glass-card p-6 rounded-3xl text-center flex flex-col items-center justify-center group relative overflow-hidden ${statStyles.border}`}>
                  <span className='text-3xl mb-1 group-hover:scale-110 transition-transform duration-200'>{s.icon || '⚡'}</span>
                  <p className={`font-display font-black text-4xl sm:text-5xl tracking-tight ${statStyles.text}`}>
                    {s.value}
                  </p>
                  <p className={`text-xs font-tech font-bold mt-1 uppercase tracking-wider ${statStyles.label}`}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL TRACKS */}
      <section className='py-20 px-6 max-w-7xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30'>
            Specialized Engineering Tracks
          </span>
          <h2 className='font-display text-4xl sm:text-5xl font-black mt-3 text-white'>
            Our Technical Domains
          </h2>
          <p className='text-slate-300 text-sm mt-3 leading-relaxed'>
            From mechanical chassis fabrication and KiCAD PCB layout to ROS2 trajectory planning and edge machine learning.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {domains.map((d, i) => {
            const cardTheme = [
              { border: 'hover:border-cyan-400/60 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.25)]', badge: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300', text: 'group-hover:text-cyan-300', btn: 'text-cyan-400 hover:text-cyan-300' },
              { border: 'hover:border-purple-400/60 hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.25)]', badge: 'bg-purple-500/15 border-purple-500/35 text-purple-300', text: 'group-hover:text-purple-300', btn: 'text-purple-400 hover:text-purple-300' },
              { border: 'hover:border-amber-400/60 hover:shadow-[0_12px_35px_-8px_rgba(245,158,11,0.25)]', badge: 'bg-amber-500/15 border-amber-500/35 text-amber-300', text: 'group-hover:text-amber-300', btn: 'text-amber-400 hover:text-amber-300' },
              { border: 'hover:border-emerald-400/60 hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.25)]', badge: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300', text: 'group-hover:text-emerald-300', btn: 'text-emerald-400 hover:text-emerald-300' },
              { border: 'hover:border-pink-400/60 hover:shadow-[0_12px_35px_-8px_rgba(244,63,94,0.25)]', badge: 'bg-pink-500/15 border-pink-500/35 text-pink-300', text: 'group-hover:text-pink-300', btn: 'text-pink-400 hover:text-pink-300' },
              { border: 'hover:border-blue-400/60 hover:shadow-[0_12px_35px_-8px_rgba(59,130,246,0.25)]', badge: 'bg-blue-500/15 border-blue-500/35 text-blue-300', text: 'group-hover:text-blue-300', btn: 'text-blue-400 hover:text-blue-300' },
            ][i % 6];

            return (
              <motion.div
                key={d._id || i}
                whileHover={{ y: -6 }}
                className={`glass-card p-7 rounded-3xl flex flex-col justify-between group relative overflow-hidden border border-white/10 ${cardTheme.border}`}
              >
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-4xl p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform'>
                      {d.icon || '🦾'}
                    </span>
                    <span className={`font-tech text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${cardTheme.badge}`}>
                      {d.badge || 'Track'}
                    </span>
                  </div>
                  <h3 className={`font-display text-2xl font-black text-white ${cardTheme.text} transition-colors`}>
                    {d.title}
                  </h3>
                  <p className='text-xs text-slate-300 mt-3 leading-relaxed'>
                    {d.desc}
                  </p>

                  {/* Topics Preview Chips */}
                  {d.topics && d.topics.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-5'>
                      {d.topics.slice(0, 3).map((t, tidx) => (
                        <span key={tidx} className='text-[10px] font-tech font-semibold px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-cyan-300'>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='pt-6 mt-6 border-t border-white/10 flex items-center justify-between'>
                  <Link
                    to={`/projects?domain=${encodeURIComponent(d.title)}`}
                    className={`text-xs font-bold ${cardTheme.btn} flex items-center gap-1.5 font-tech`}
                  >
                    <span>Explore Track Projects</span>
                    <span>→</span>
                  </Link>
                  <span className='text-slate-500 font-tech font-bold text-xs'>0{i + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED HARDWARE INNOVATIONS */}
      <section className='py-20 px-6 max-w-7xl mx-auto border-t border-white/10'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
          <div>
            <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-400 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30'>
              Lab R&D Showcase
            </span>
            <h2 className='font-display text-4xl sm:text-5xl font-black mt-3 text-white'>
              Featured Innovations
            </h2>
            <p className='text-slate-300 text-sm mt-2'>
              Real hardware systems engineered, tested, and fabricated in our lab.
            </p>
          </div>
          <Link
            to='/projects'
            className='btn-cyan-gradient px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start md:self-auto shadow-lg'
          >
            <span>View All Projects ({featuredProjects.length}+)</span>
            <span>→</span>
          </Link>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {featuredProjects.map(p => (
            <div
              key={p._id}
              className='glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-cyan-400/50'
            >
              <div className='h-52 overflow-hidden relative bg-slate-950'>
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                  alt={p.name}
                  className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute top-3 left-3'>
                  <span className='text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-cyan-500/40 text-cyan-300 shadow-md'>
                    {p.domain}
                  </span>
                </div>
              </div>

              <div className='p-6 flex-1 flex flex-col justify-between'>
                <div>
                  <h3 className='font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors'>
                    {p.name}
                  </h3>
                  <p className='text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed'>
                    {p.description}
                  </p>

                  <div className='flex flex-wrap gap-1.5 mt-4'>
                    {p.technologies?.slice(0, 4).map((tech, tidx) => (
                      <span key={tidx} className='text-[10px] font-tech font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/25 text-cyan-300'>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-tech font-bold'>
                  <Link
                    to='/projects'
                    className='text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform'
                  >
                    <span>Blueprint Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKSHOPS & SPRINTS CALENDAR STRIP */}
      {upcomingEvents.length > 0 && (
        <section className='py-20 px-6 max-w-7xl mx-auto border-t border-white/10'>
          <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4'>
            <div>
              <span className='font-tech text-xs font-bold uppercase tracking-widest text-emerald-400 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30'>
                Hands-on Labs
              </span>
              <h2 className='font-display text-3xl sm:text-4xl font-black mt-3 text-white'>
                Event and Workshop
              </h2>
            </div>
            <Link to='/events' className='text-xs font-tech font-bold text-cyan-400 hover:underline'>
              View All Events & Workshops →
            </Link>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {upcomingEvents.map(e => (
              <div
                key={e._id}
                className='glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-emerald-400/50 hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.20)]'
              >
                <div>
                  {/* Event Image Banner */}
                  <div className='h-48 overflow-hidden relative bg-slate-950'>
                    <img
                      src={e.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                      alt={e.title}
                      className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute top-3 left-3 flex gap-2'>
                      <span className='text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-emerald-500/40 text-emerald-300 shadow-md'>
                        {e.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 text-xs font-tech text-cyan-300 font-bold mb-2'>
                      <span>📅 {e.date}</span>
                      {e.time && <span>• ⏰ {e.time}</span>}
                    </div>
                    <h3 className='font-display font-bold text-xl text-white group-hover:text-emerald-300 transition-colors leading-snug'>
                      {e.title}
                    </h3>
                    <p className='text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed'>
                      {e.description}
                    </p>
                  </div>
                </div>

                <div className='p-6 pt-0'>
                  <div className='pt-4 border-t border-white/10 flex items-center justify-between'>
                    <span className='text-[11px] font-tech text-slate-400'>
                      📍 {e.location || 'Robotics Lab 304'}
                    </span>
                    <Link
                      to='/events'
                      className='text-xs font-bold px-4 py-2 rounded-xl btn-primary-gradient shadow-md transition-all font-tech'
                    >
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. RECRUITMENT CALLOUT BANNER */}
      <section className='py-20 px-6 max-w-5xl mx-auto text-center'>
        <div className='relative rounded-3xl glass p-10 sm:p-14 border border-indigo-500/40 overflow-hidden shadow-2xl shadow-indigo-500/15 bg-gradient-to-br from-[#0a0f24] via-[#101738] to-[#070b1a]'>
          <div className='absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500/25 to-blue-600/20 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-purple-500/20 to-pink-600/20 rounded-full blur-3xl pointer-events-none' />

          <div className='relative z-10 max-w-2xl mx-auto space-y-5'>
            <span className='text-4xl inline-block animate-bounce'>🚀</span>
            <h2 className='font-display text-3xl sm:text-5xl font-black text-white tracking-tight'>
              Ready to Engineer Hardware?
            </h2>
            <p className='text-slate-200 text-sm sm:text-base leading-relaxed'>
              Whether you are an IoT developer passionate about sensors and cloud telemetry, or a robotics engineer skilled in ROS2 and automated hardware, our workbench is waiting for you.
            </p>
            <div className='pt-3'>
              <Link
                to='/join'
                className='btn-primary-gradient inline-block px-9 py-4 rounded-xl text-sm font-black shadow-xl'
              >
                Submit Member Application →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
