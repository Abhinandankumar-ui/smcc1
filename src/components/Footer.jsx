import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data) setSettings(res.data);
    }).catch(() => {});
  }, []);

  const lab = settings?.labInfo || {
    location: 'Robotics & IoT Lab--Room No. 3064, FET, Rama University',
    email: 'smcc.robotics@gmail.com',
    timings: 'Monday – Friday: 9:00 AM – 5:00 PM'
  };

  const socials = settings?.socialLinks || {
    github: 'https://github.com',
    linkedin: 'https://www.linkedin.com/in/smart-mech-circle-club-a40024436',
    instagram: 'https://www.instagram.com/thesmartmech_circle?utm_source=qr&stkn=NDJ5OWk4cWFqbWR0',
    discord: 'https://discord.com'
  };

  return (
    <footer className='border-t border-white/10 bg-[#060913] relative overflow-hidden mt-24'>
      {/* Energetic ambient glow */}
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto px-6 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10'>
          {/* Brand Info */}
          <div className='lg:col-span-2 space-y-4'>
            <div className='flex items-center gap-3'>
              <img
                src='/smcc-logo.jpg'
                alt='SMC Club Logo'
                className='w-11 h-11 rounded-full object-cover border-2 border-cyan-400/70 shadow-lg shadow-cyan-500/30 bg-black'
              />
              <div className='flex flex-col'>
                <span className='font-display font-black text-2xl tracking-tight text-white'>
                  SMC CLUB<span className='text-cyan-400'>.</span>
                </span>
                <span className='font-tech text-[10px] text-cyan-400 font-bold tracking-wider uppercase'>
                  Smart Mech Circle Club
                </span>
              </div>
            </div>
            <p className='text-xs text-slate-300 leading-relaxed max-w-sm'>
              A premier student research collective engineering autonomous robotics, smart connected IoT grids, wireless telemetry sensors, and intelligent cyber-physical systems.
            </p>
            <div className='flex items-center gap-3 pt-2 font-tech'>
              <a
                href={socials.linkedin || 'https://www.linkedin.com/in/smart-mech-circle-club-a40024436'}
                target='_blank'
                rel='noreferrer'
                className='h-10 px-3.5 rounded-xl glass border border-cyan-500/30 flex items-center gap-2 text-xs text-slate-200 hover:text-white hover:bg-[#0077b5]/20 hover:border-[#0077b5] transition-all duration-300 shadow-md shadow-cyan-500/10 hover:shadow-[#0077b5]/30 group font-bold'
                title='LinkedIn'
              >
                <svg className='w-4 h-4 fill-cyan-400 group-hover:fill-[#00a0dc] transition-colors' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href={socials.instagram || 'https://instagram.com'}
                target='_blank'
                rel='noreferrer'
                className='h-10 px-3.5 rounded-xl glass border border-pink-500/30 flex items-center gap-2 text-xs text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/25 hover:to-purple-600/25 hover:border-pink-500 transition-all duration-300 shadow-md shadow-pink-500/10 hover:shadow-pink-500/30 group font-bold'
                title='Instagram'
              >
                <svg className='w-4 h-4 fill-pink-400 group-hover:fill-pink-300 transition-colors' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-display font-bold text-sm text-white mb-4 tracking-wide text-cyan-400'>
              EXPLORE
            </h4>
            <ul className='space-y-2.5 text-xs text-slate-300 font-medium'>
              <li><Link to='/about' className='hover:text-cyan-300 transition-colors'>About Club & Lab</Link></li>
              <li><Link to='/projects' className='hover:text-cyan-300 transition-colors'>Hardware Projects</Link></li>
              <li><Link to='/events' className='hover:text-cyan-300 transition-colors'>Event and Workshop</Link></li>
              <li><Link to='/team' className='hover:text-cyan-300 transition-colors'>Core Team & Leads</Link></li>
              <li><Link to='/gallery' className='hover:text-cyan-300 transition-colors'>Visual Archives</Link></li>
            </ul>
          </div>

          {/* Technical Tracks */}
          <div>
            <h4 className='font-display font-bold text-sm text-white mb-4 tracking-wide text-purple-400'>
              DOMAINS
            </h4>
            <ul className='space-y-2.5 text-xs text-slate-300 font-medium'>
              <li><Link to='/projects?domain=Robotics' className='hover:text-purple-300 transition-colors'>ROS2 Robotics</Link></li>
              <li><Link to='/projects?domain=IoT' className='hover:text-purple-300 transition-colors'>IoT & LoRaWAN</Link></li>
              <li><Link to='/projects?domain=Automation' className='hover:text-purple-300 transition-colors'>Industrial Automation</Link></li>
              <li><Link to='/projects?domain=Drone/CV' className='hover:text-purple-300 transition-colors'>Autonomous Drones</Link></li>
            </ul>
          </div>

          {/* Lab Headquarters */}
          <div className='space-y-3'>
            <h4 className='font-display font-bold text-sm text-white mb-4 tracking-wide text-amber-400'>
              R&D LAB
            </h4>
            <p className='text-xs text-slate-300 flex items-start gap-2'>
              <span>📍</span> <span>{lab.location}</span>
            </p>
            <p className='text-xs text-slate-300 flex items-center gap-2'>
              <span>✉️</span> <span>{lab.email}</span>
            </p>
            <div className='p-3 rounded-xl bg-space-900/90 border border-cyan-500/25 text-[11px] text-cyan-300 font-tech font-bold'>
              ⏱️ {lab.timings}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className='mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400'>
          <p>© {new Date().getFullYear()} SMC Club • Smart Mech Circle Club. Engineered for student innovators.</p>
          <div className='flex items-center gap-4 text-[11px] font-tech'>
            <span className='inline-flex items-center gap-1.5 text-emerald-400 font-bold'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
              Systems Online
            </span>
            <Link to='/admin' className='text-slate-400 hover:text-cyan-400 font-bold'>Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
