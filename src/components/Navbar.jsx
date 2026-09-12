import { Link, useLocation } from 'react-router-dom'
export default function Navbar(){
 const loc=useLocation();
 const link = (to,label)=> <Link to={to} className={`text-sm tracking-wide transition ${loc.pathname===to?'text-violet-400 font-semibold':'text-white/70 hover:text-white'}`}>{label}</Link>
 return <nav className='sticky top-0 z-50 backdrop-blur-2xl bg-[#050510]/70 border-b border-white/10'>
  <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
    <Link to='/' className='flex items-center gap-2'><span className='w-9 h-9 rounded-xl premium-gradient flex items-center justify-center font-black'>C</span><span className='font-bold tracking-widest text-sm'>CLUB<span className='text-violet-400'>PREMIUM</span></span></Link>
    <div className='hidden md:flex gap-7 items-center'>
      {link('/','Home')}{link('/about','About')}{link('/team','Team')}{link('/events','Events')}{link('/gallery','Gallery')}{link('/contact','Contact')}
      <Link to='/join' className='premium-gradient px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-violet-600/30 hover:scale-105 transition'>Join Our Team →</Link>
      <Link to='/admin' className='border border-white/20 px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition'>Admin</Link>
    </div>
  </div>
 </nav>
}
