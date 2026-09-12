import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [domains, setDomains] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data) {
        setSettings(res.data);
        if (res.data.domains?.length > 0) setDomains(res.data.domains);
        if (res.data.activities?.length > 0) setActivities(res.data.activities);
      }
    }).catch(() => { });
  }, []);

  const mission = settings?.mission || 'To provide every engineering student with the tools, lab components, and collaborative ecosystem needed to transition from theoretical textbook knowledge to building real-world robots, smart IoT devices, and autonomous cyber-physical systems.';
  const vision = settings?.vision || 'To establish an internationally recognized student hardware research collective producing open-source robotics innovations, high-impact telemetry research, and entrepreneurial deep-tech ventures.';
  const lab = settings?.labInfo || {
    location: 'Robotics & IoT Lab--Room No. 3064, FET, Rama University',
    email: 'smcc.robotics@gmail.com',
    timings: 'Monday – Friday: 9:00 AM – 5:00 PM'
  };

  const defaultInventory = [
    { title: 'Rapid Prototyping', icon: '🖨️', items: ['Dual Extrusion 3D Printers', 'Laser Acrylic Cutters', 'CNC PCB Milling Station'] },
    { title: 'IoT & Sensor Testing Bench', icon: '📡', items: ['4-Channel 100MHz Digital Oscilloscopes', 'Logic Analyzers & JTAG Programmers', 'SMD Hot-Air Rework Stations'] },
    { title: 'Robotics Testbed', icon: '🦾', items: ['6-DOF Robotic Arms with Grippers', 'Indoor Differential Drive Rovers', 'Gazebo & ROS2 Simulation Workstations'] },
    { title: 'Telemetry & Wireless', icon: '📡', items: ['LoRaWAN Outdoor Gateways', 'SDR (Software Defined Radio)', 'ESP32 & Nordic BLE Sensor Grids'] },
  ];

  const hardwareInventory = settings?.hardwareInventory?.length > 0 ? settings.hardwareInventory : defaultInventory;

  return (
    <div className='max-w-7xl mx-auto px-6 py-14'>
      {/* Header */}
      <div className='text-center max-w-3xl mx-auto mb-16'>
        <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-sm'>
          The Engineering Collective
        </span>
        <h1 className='font-display text-4xl sm:text-6xl font-black mt-3 text-white'>
          About SMC Club
        </h1>
        <p className='mt-3 text-slate-300 text-sm sm:text-base leading-relaxed'>
          Bridging the gap between computational intelligence and mechanical embodiment through multidisciplinary peer research.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className='grid md:grid-cols-2 gap-8 mb-20'>
        <div className='glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.20)]'>
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none' />
          <div className='text-4xl mb-4'>🎯</div>
          <h2 className='font-display font-black text-3xl text-white mb-3'>
            Our Core Mission
          </h2>
          <p className='text-sm text-slate-200 leading-relaxed font-normal'>
            {mission}
          </p>
        </div>

        <div className='glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-purple-400/50 hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.20)]'>
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none' />
          <div className='text-4xl mb-4'>🔭</div>
          <h2 className='font-display font-black text-3xl text-white mb-3'>
            Our Long-term Vision
          </h2>
          <p className='text-sm text-slate-200 leading-relaxed font-normal'>
            {vision}
          </p>
        </div>
      </div>

      {/* Dynamic Technical Tracks */}
      <section className='mb-20'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-300 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30'>
            Curriculum & Tooling
          </span>
          <h2 className='font-display text-4xl sm:text-5xl font-black mt-3 text-white'>
            Technical Domains & Syllabus
          </h2>
          <p className='text-slate-300 text-sm mt-2'>
            What our members learn, prototype, and document during regular club technical sprints.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {domains.map((d, i) => {
            const domainTheme = [
              { border: 'hover:border-cyan-400/60', badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', btn: 'text-cyan-400 hover:text-cyan-300' },
              { border: 'hover:border-purple-400/60', badge: 'bg-purple-500/15 border-purple-500/30 text-purple-300', btn: 'text-purple-400 hover:text-purple-300' },
              { border: 'hover:border-amber-400/60', badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300', btn: 'text-amber-400 hover:text-amber-300' },
              { border: 'hover:border-emerald-400/60', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', btn: 'text-emerald-400 hover:text-emerald-300' },
              { border: 'hover:border-pink-400/60', badge: 'bg-pink-500/15 border-pink-500/30 text-pink-300', btn: 'text-pink-400 hover:text-pink-300' },
              { border: 'hover:border-blue-400/60', badge: 'bg-blue-500/15 border-blue-500/30 text-blue-300', btn: 'text-blue-400 hover:text-blue-300' },
            ][i % 6];

            return (
              <div key={d._id || i} className={`glass-card p-7 rounded-3xl flex flex-col justify-between border border-white/10 ${domainTheme.border}`}>
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-4xl'>{d.icon || '🦾'}</span>
                    <span className={`font-tech text-[10px] font-bold px-3 py-1 rounded-full border ${domainTheme.badge}`}>
                      {d.badge || 'Domain'}
                    </span>
                  </div>
                  <h3 className='font-display text-2xl font-black text-white mb-2'>
                    {d.title}
                  </h3>
                  <p className='text-xs text-slate-300 mb-4 leading-relaxed'>
                    {d.desc}
                  </p>

                  {d.topics && d.topics.length > 0 && (
                    <div className='space-y-2 pt-4 border-t border-white/10'>
                      <span className='text-[10px] font-tech text-cyan-400 block font-bold uppercase tracking-wider'>
                        Core Syllabus:
                      </span>
                      {d.topics.map((top, idx) => (
                        <div key={idx} className='text-xs font-tech text-slate-200 flex items-start gap-2'>
                          <span className='text-cyan-400 font-bold'>›</span>
                          <span>{top}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='mt-6 pt-4 border-t border-white/10'>
                  <Link
                    to={`/projects?domain=${encodeURIComponent(d.title)}`}
                    className={`text-xs font-tech font-bold ${domainTheme.btn}`}
                  >
                    View Track Projects →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lab Facilities & Equipment Inventory */}
      <section className='mb-20'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='font-tech text-xs font-bold uppercase tracking-widest text-emerald-300 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-sm'>
            Physical Workbench Infrastructure
          </span>
          <h2 className='font-display text-4xl sm:text-5xl font-black mt-3 text-white'>
            Laboratory Facilities & Tools
          </h2>
          <p className='text-slate-300 text-sm mt-2'>
            Students have full access to professional fabrication, testing, and measurement stations.
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {hardwareInventory.map((item, idx) => (
            <div key={idx} className='glass-card p-6 rounded-3xl border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-8px_rgba(0,240,255,0.20)]'>
              <span className='text-4xl mb-3 block'>{item.icon}</span>
              <h3 className='font-display font-bold text-xl text-white mb-3'>
                {item.title}
              </h3>
              <ul className='space-y-2 text-xs font-tech text-slate-300'>
                {item.items.map((it, i) => (
                  <li key={i} className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50' />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Activities Strip */}
      {activities.length > 0 && (
        <section className='mb-20'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <span className='font-tech text-xs font-bold uppercase tracking-widest text-cyan-400'>
              How We Operate
            </span>
            <h2 className='font-display text-3xl sm:text-4xl font-black mt-2 text-white'>
              Core Club Activities
            </h2>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {activities.map((act, i) => (
              <div key={i} className='glass p-6 rounded-3xl border border-white/10 hover:border-cyan-400/40'>
                <span className='text-3xl mb-2 block'>{act.icon || '🛠️'}</span>
                <h4 className='font-display font-bold text-lg text-white mb-1'>{act.title}</h4>
                <p className='text-xs text-slate-300 leading-relaxed'>{act.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lab Location & Timings Card */}
      <div className='glass p-8 sm:p-10 rounded-3xl border border-cyan-500/40 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-cyan-500/15 bg-gradient-to-br from-[#0a0f24] via-[#101738] to-[#070b1a]'>
        <div className='space-y-2 text-center md:text-left'>
          <span className='font-tech text-xs font-bold text-cyan-300 uppercase tracking-widest'>Physical Lab Coordinates</span>
          <h3 className='font-display font-black text-2xl text-white'>{lab.location}</h3>
          <p className='text-xs text-cyan-300 font-tech'>⏱️ {lab.timings}</p>
          <p className='text-xs text-slate-300 font-tech'>✉️ {lab.email}</p>
        </div>
        <Link
          to='/contact'
          className='btn-primary-gradient px-8 py-3.5 rounded-xl text-xs font-bold shrink-0'
        >
          Contact Lab Leads →
        </Link>
      </div>
    </div>
  );
}
