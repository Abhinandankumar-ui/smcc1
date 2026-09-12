import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Auto-ensure admin initialization
      await axios.post('/api/admin/init').catch(() => {});
      const r = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('token', r.data.token);
      nav('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 py-14'>
      <div className='w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-indigo-500/40 shadow-2xl shadow-indigo-500/15 relative overflow-hidden bg-gradient-to-br from-[#0a0f24] via-[#121836] to-[#070b1a]'>
        {/* Ambient energetic glow */}
        <div className='absolute -top-16 -right-16 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none' />

        <div className='relative z-10'>
          {/* Logo & Header */}
          <div className='text-center mb-8'>
            <img
              src='/smcc-logo.jpg'
              alt='SMC Club Logo'
              className='inline-block w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-xl shadow-cyan-500/35 mb-4 bg-black'
            />
            <h1 className='font-display text-3xl font-black tracking-tight text-white'>
              SMC Admin Portal
            </h1>
            <p className='text-xs text-slate-300 mt-2 leading-relaxed'>
              Sign in with your administrative credentials to manage club operations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2'>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={login} className='space-y-4'>
            <div>
              <label className='block text-xs font-tech font-bold uppercase tracking-wider text-cyan-400 mb-1.5'>
                Admin Email
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter admin email'
                className='w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-xs font-tech font-bold uppercase tracking-wider text-cyan-400 mb-1.5'>
                Password
              </label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••••••'
                className='w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full mt-3 py-3.5 px-4 rounded-xl btn-primary-gradient font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50'
            >
              {loading ? (
                <>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard →</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
