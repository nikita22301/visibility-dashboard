import {NavLink,Outlet} from "react-router-dom";
import {BarChart3,Search,Globe2,Users,Settings,Menu,Sun,Moon,ChevronRight} from "lucide-react";
import {useStore} from "../store";

const links=[
  ["/","Overview",BarChart3],
  ["/prompts","Prompts",Search],
  ["/platforms","Platforms",Globe2],
  ["/competitors","Competitors",Users],
  ["/settings","Settings",Settings]
] as const;

export default function Layout(){
  const {sidebar,toggleSidebar,closeSidebar,dark,toggleDark}=useStore();
  const mobileNavClick=()=>{
    if(typeof window!=="undefined" && window.innerWidth<=720) closeSidebar();
  };

  return <div className={dark?"app dark":"app"}>
    <aside className={sidebar?"sidebar open":"sidebar collapsed"}>
      <div className="brand"><div className="logo">D</div>{sidebar&&<div><b>DareAI</b><span>Search Intelligence</span></div>}</div>
      <nav>{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} onClick={mobileNavClick}><Icon size={19}/>{sidebar&&label}</NavLink>)}</nav>
      <div className="side-bottom"><button className="icon-btn" onClick={toggleDark} aria-label="Toggle theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>{sidebar&&<span>AI-first visibility</span>}</div>
    </aside>

    <button className="mobile-overlay" aria-label="Close navigation" onClick={closeSidebar}/>

    <main><header><button className="icon-btn" onClick={toggleSidebar} aria-label="Toggle navigation"><Menu/></button><div className="crumb">Workspace <ChevronRight size={14}/> Overview</div><div className="header-actions"><span className="status-dot"/> Live data <button className="avatar" aria-label="Account">N</button></div></header><section className="content"><Outlet/></section></main>
  </div>
}
