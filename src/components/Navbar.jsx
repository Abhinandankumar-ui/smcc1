import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data?.announcement?.active && res.data.announcement.message) {
        setAnnouncement(res.data.announcement);
      }
    }).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Event and Workshop', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <>
      {/* Dynamic Announcement Ticker Banner - High-Energy Gradient */}
      {announcement && (
        <div className='bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 px-4 py-2 text-center text-xs font-semibold text-white flex items-center justify-center gap-2 relative z-50 shadow-md shadow-indigo-600/25'>
          <span className='w-2 h-2 rounded-full bg-white animate-ping' />
          <span>{announcement.message}</span>
          {announcement.link && (
            <Link to={announcement.link} className='font-black underline ml-1 hover:text-cyan-200 transition-colors'>
              Learn More →
            </Link>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <nav className='sticky top-0 z-50 glass-nav px-4 sm:px-8 py-3.5 transition-all duration-300'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          {/* Brand Logo with Electric Flare */}
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='relative'>
              <img
                src='/smcc-logo.jpg'
                alt='SMC Club Logo'
                className='w-11 h-11 rounded-full object-cover border-2 border-cyan-400/70 shadow-lg shadow-cyan-500/35 group-hover:scale-105 group-hover:border-cyan-300 group-hover:shadow-cyan-400/60 transition-all duration-300 bg-black'
              />
              <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070a14] animate-pulse' />
            </div>
            <div className='flex flex-col'>
              <span className='font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5 leading-none'>
                SMC CLUB
                <span className='w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping' />
              </span>
              <span className='font-tech text-[10px] text-cyan-400 font-bold tracking-wider uppercase mt-1'>
                Smart Mech Circle Club
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className='hidden lg:flex items-center gap-1.5 text-sm font-medium'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className='hidden lg:flex items-center gap-3'>
            <Link
              to='/join'
              className='btn-primary-gradient px-5 py-2 rounded-xl text-xs flex items-center gap-1.5'
            >
              <span>⭐ Join The Team</span>
              <span>→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className='flex items-center gap-2 lg:hidden'>
            <Link
              to='/join'
              className='btn-primary-gradient text-xs px-3 py-1.5 rounded-lg'
            >
              Join
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 rounded-xl bg-white/5 text-white/90 hover:text-white border border-white/10 focus:outline-none'
              aria-label='Toggle Navigation'
            >
              {isOpen ? (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7' />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className='lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5 animate-fadeIn'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className='pt-2 mt-2 border-t border-white/5'>
              <Link
                to='/join'
                onClick={() => setIsOpen(false)}
                className='block w-full py-2.5 text-center rounded-xl btn-primary-gradient text-xs font-bold'
              >
                ⭐ Join The Team →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
