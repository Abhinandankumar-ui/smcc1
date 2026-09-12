import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import JoinTeam from './pages/JoinTeam';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import AdminMembers from './pages/admin/Members';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminProjects from './pages/admin/AdminProjects';
import EditProject from './pages/admin/EditProject';
import AdminSettings from './pages/admin/AdminSettings';

export default function App(){
 const location = useLocation();
 const hideFooter = location.pathname === '/join' || location.pathname.startsWith('/admin');

 useEffect(() => {
   window.scrollTo(0, 0);
 }, [location.pathname]);

 return (
  <div className='min-h-screen flex flex-col bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950'>
   <Navbar/>
   <main className='flex-1'>
     <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/projects' element={<Projects/>}/>
       <Route path='/team' element={<Team/>}/>
       <Route path='/events' element={<Events/>}/>
       <Route path='/gallery' element={<Gallery/>}/>
       <Route path='/contact' element={<Contact/>}/>
       <Route path='/join' element={<JoinTeam/>}/>
       <Route path='/admin' element={<AdminLogin/>}/>
       <Route path='/admin/dashboard' element={<Dashboard/>}/>
       <Route path='/admin/applications' element={<Applications/>}/>
       <Route path='/admin/members' element={<AdminMembers/>}/>
       <Route path='/admin/events' element={<AdminEvents/>}/>
       <Route path='/admin/gallery' element={<AdminGallery/>}/>
       <Route path='/admin/enquiries' element={<AdminEnquiries/>}/>
       <Route path='/admin/projects' element={<AdminProjects/>}/>
       <Route path='/admin/projects/edit/:id' element={<EditProject/>}/>
       <Route path='/admin/settings' element={<AdminSettings/>}/>
     </Routes>
   </main>
   {!hideFooter && <Footer/>}
  </div>
 );
}
