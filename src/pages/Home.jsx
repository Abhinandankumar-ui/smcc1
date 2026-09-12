import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
export default function Home(){
 return <div className='overflow-hidden'>
  {/* HERO */}
  <section className='relative min-h-[90vh] flex items-center'>
    <div className='orb w-[600px] h-[600px] bg-violet-600 top-[-100px] left-[-100px]'/>
    <div className='orb w-[500px] h-[500px] bg-cyan-500 bottom-[-80px] right-[-80px] !opacity-30' style={{animationDelay:'2s'}}/>
    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]'/>
    <div className='max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center relative'>
      <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.8}}>
        <p className='inline-flex glass px-4 py-1.5 rounded-full text-xs tracking-widest text-violet-300'>● ANTIGRAVITY PREMIUM CLUB</p>
        <h1 className='text-6xl md:text-7xl font-black leading-[0.9] mt-6'>Build.<br/><span className='text-gradient'>Learn.</span><br/>Lead.</h1>
        <p className='mt-6 text-white/60 text-lg leading-relaxed'>India's most dynamic student club — premium events, real projects, elit community. Join & levitate your career.</p>
        <div className='flex gap-4 mt-8'><Link to='/join' className='premium-gradient px-8 py-4 rounded-full font-bold shadow-xl shadow-violet-600/25'>Join Our Team →</Link><Link to='/about' className='glass px-8 py-4 rounded-full font-semibold'>Explore →</Link></div>
        <div className='flex gap-8 mt-10'><div><p className='text-3xl font-black'>500+</p><p className='text-xs text-white/50 tracking-widest'>MEMBERS</p></div><div><p className='text-3xl font-black'>50+</p><p className='text-xs text-white/50 tracking-widest'>EVENTS</p></div><div><p className='text-3xl font-black'>4.9★</p><p className='text-xs text-white/50 tracking-widest'>RATING</p></div></div>
      </motion.div>
      <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.8,delay:0.2}} className='relative'>
        <div className='glass rounded-[2rem] p-6 md:p-8 relative'>
          <div className='premium-gradient h-2 rounded-full'/>
          <h3 className='mt-6 font-bold text-lg'>Upcoming Premium Event</h3><p className='text-violet-400 text-sm'>Hack the Future 2026 • 15 Dec</p>
          <div className='grid grid-cols-3 gap-3 mt-6'>{['AI Workshop','Startup Pitch','Awards'].map(t=><div key={t} className='bg-white/5 rounded-xl p-3 text-center'><p className='text-xs text-white/60'>{t}</p><p className='font-bold'>●</p></div>)}</div>
          <div className='mt-6 flex -space-x-2'>{[1,2,3,4].map(i=><img key={i} src={`https://i.pravatar.cc/100?img=${10+i}`} className='w-8 h-8 rounded-full border-2 border-[#050510]'/>)}<span className='w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold border-2 border-[#050510]'>+492</span></div>
        </div>
        <div className='absolute -bottom-6 -left-6 glass rounded-2xl p-4 flex gap-3'><span className='w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center'>✓</span><div><p className='text-sm font-bold'>Applications Open</p><p className='text-xs text-white/50'>Join in 2 mins</p></div></div>
      </motion.div>
    </div>
  </section>
  <section className='max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6'>
    {[{t:'Elite Activities',d:'Premium workshops & antigravity labs',c:'from-violet-600 to-fuchsia-500'},{t:'Grand Events',d:'National level fests & hackathons',c:'from-cyan-500 to-blue-500'},{t:'Premium Network',d:'Connect with top founders & mentors',c:'from-pink-500 to-orange-400'}].map(card=>
      <motion.div key={card.t} whileHover={{y:-8}} className='glass p-8 rounded-[1.5rem] relative overflow-hidden'>
        <div className={`absolute inset-0 bg-gradient-to-br ${card.c} opacity-10`}/>
        <h3 className='font-bold relative'>{card.t}</h3><p className='text-white/60 text-sm mt-2 relative'>{card.d}</p>
      </motion.div>
    )}
  </section>
 </div>
}
