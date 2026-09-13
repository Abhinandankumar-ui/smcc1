import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeDomain, setActiveDomain] = useState('All');
  const [search, setSearch] = useState('');
  const [domainList, setDomainList] = useState([
    'All',
    'Robotics',
    'IoT',
    'Automation',
    'Drone/CV'
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const [searchParams] = useSearchParams();

  // Load Dynamic Domains from backend
  useEffect(() => {
    axios
      .get('/api/settings/domains')
      .then((res) => {
        if (res.data?.length > 0) {
          const titles = ['All', ...res.data.map((d) => d.title)];
          setDomainList(titles);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const urlDomain = searchParams.get('domain');

    if (urlDomain) {
      setActiveDomain(urlDomain);
    }
  }, [searchParams]);

  const fetchProjects = (domain, searchQuery) => {
    setLoading(true);

    let url = '/api/projects?';

    if (domain && domain !== 'All') {
      url += `domain=${encodeURIComponent(domain)}&`;
    }

    if (searchQuery) {
      url += `search=${encodeURIComponent(searchQuery)}&`;
    }

    axios
      .get(url)
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(activeDomain, search);
    }, 250);

    return () => clearTimeout(timer);
  }, [activeDomain, search]);

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>

      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-12'>

        <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-sm'>
          Autonomous Hardware & Telemetry
        </span>

        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          Lab Hardware Innovations
        </h1>

        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          Explore autonomous rovers, IoT sensor grids, smart automation, and
          aerial drone systems engineered by student builders.
        </p>

      </div>

      {/* Filter and Search Bar */}
      <div className='max-w-4xl mx-auto mb-12 space-y-5'>

        {/* Search input */}
        <div className='relative'>

          <input
            type='text'
            placeholder='Search hardware by name, technology (e.g. ROS2, ESP32, FreeRTOS, YOLO)...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-5 py-4 pl-12 rounded-2xl glass-input text-sm'
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

        {/* Dynamic Domain Filter Tabs */}
        <div className='flex flex-wrap items-center justify-center gap-2'>

          {domainList.map((d) => (
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

      {/* Projects Grid */}
      {loading ? (

        <div className='text-center py-20 text-cyan-400 font-tech text-xs'>

          <span className='inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2' />

          Scanning hardware database...

        </div>

      ) : projects.length === 0 ? (

        <div className='text-center py-16 glass rounded-3xl p-8 border border-white/10 max-w-md mx-auto'>

          <p className='text-lg font-bold text-white font-display'>
            No hardware projects found.
          </p>

          <p className='text-xs text-slate-400 mt-1'>
            Try clearing your search filters or check another technical domain.
          </p>

          <button
            onClick={() => {
              setActiveDomain('All');
              setSearch('');
            }}
            className='mt-4 px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 text-xs font-tech font-bold border border-cyan-500/30'
          >
            Reset Filters
          </button>

        </div>

      ) : (

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>

          {projects.map((p) => (

            <div
              key={p._id}
              className='glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.20)]'
            >

              <div>

                {/* Project Image */}
                <div className='h-56 overflow-hidden relative bg-slate-950'>

                  <img
                    src={
                      p.image
                        ? getImageUrl(p.image)
                        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={p.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  <div className='absolute top-3 left-3 flex gap-2'>

                    <span className='text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-cyan-500/40 text-cyan-300 shadow-md'>
                      {p.domain}
                    </span>

                    {p.featured && (
                      <span className='text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md'>
                        ★ Featured
                      </span>
                    )}

                  </div>

                </div>

                {/* Content */}
                <div className='p-6'>

                  <h3 className='font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors'>
                    {p.name}
                  </h3>

                  <p className='text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed'>
                    {p.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className='flex flex-wrap gap-1.5 mt-4'>

                    {p.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className='text-[10px] font-tech font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/25 text-cyan-300'
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                  {/* Team members */}
                  {p.teamMembers && p.teamMembers.length > 0 && (
                    <div className='mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] font-tech text-slate-400'>

                      <span className='text-amber-400'>
                        👥 Builders:
                      </span>

                      <span className='text-slate-200 truncate'>
                        {p.teamMembers.join(', ')}
                      </span>

                    </div>
                  )}

                </div>

              </div>

              {/* Card Footer Actions */}
              <div className='p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4'>

                <button
                  onClick={() => setSelectedProject(p)}
                  className='text-xs font-tech font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1'
                >
                  <span>Specs & Blueprint</span>
                  <span>→</span>
                </button>

                <div className='flex items-center gap-2 font-tech text-xs'>

                  {p.demoUrl && p.demoUrl !== '#' && (
                    <a
                      href={p.demoUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors'
                      title='Live Telemetry'
                    >
                      Demo ↗
                    </a>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Project Specs & Blueprint Modal */}
      {selectedProject && (

        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn'>

          <div className='glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 relative max-h-[90vh] overflow-y-auto'>

            <button
              onClick={() => setSelectedProject(null)}
              className='absolute top-5 right-5 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white'
            >
              ✕
            </button>

            <span className='font-tech text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'>
              {selectedProject.domain}
            </span>

            <h2 className='font-display font-extrabold text-2xl sm:text-3xl text-white mt-3'>
              {selectedProject.name}
            </h2>

            {/* Modal Project Image */}
            <div className='mt-4 h-64 rounded-2xl overflow-hidden bg-slate-950 border border-white/10'>

              <img
                src={getImageUrl(selectedProject.image)}
                alt={selectedProject.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
                }}
              />

            </div>

            <div className='mt-6 space-y-4'>

              <div>

                <h4 className='font-tech text-xs text-cyan-400 uppercase tracking-wider font-bold mb-1'>
                  Architecture Overview
                </h4>

                <p className='text-sm text-slate-200 leading-relaxed'>
                  {selectedProject.description}
                </p>

              </div>

              <div>

                <h4 className='font-tech text-xs text-cyan-400 uppercase tracking-wider font-bold mb-2'>
                  Technologies & Frameworks
                </h4>

                <div className='flex flex-wrap gap-2'>

                  {selectedProject.technologies?.map((tech, i) => (
                    <span
                      key={i}
                      className='text-xs font-tech px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/25 text-cyan-300 font-medium'
                    >
                      {tech}
                    </span>
                  ))}

                </div>

              </div>

              {selectedProject.teamMembers?.length > 0 && (
                <div>

                  <h4 className='font-tech text-xs text-slate-400 uppercase tracking-wider font-bold mb-1'>
                    Lead Builders & Fabricators
                  </h4>

                  <p className='text-xs text-slate-200 font-tech'>
                    {selectedProject.teamMembers.join(' • ')}
                  </p>

                </div>
              )}

              <div className='pt-4 border-t border-white/10 flex gap-4'>

                {selectedProject.demoUrl &&
                  selectedProject.demoUrl !== '#' && (
                    <a
                      href={selectedProject.demoUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='flex-1 text-center py-3 rounded-xl btn-primary-gradient text-xs font-tech font-bold'
                    >
                      Open Live Telemetry ↗
                    </a>
                  )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
