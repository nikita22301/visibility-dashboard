import {useState} from "react";
import {PageTitle} from "../components/UI";
import {Bell,Shield,Database,UserRound,X,Save} from "lucide-react";

export default function Settings(){
  const [workspace,setWorkspace]=useState("DareAI Search Intelligence");
  const [editOpen,setEditOpen]=useState(false);
  const [workspaceDraft,setWorkspaceDraft]=useState(workspace);
  const [notifications,setNotifications]=useState(true);
  const [retention,setRetention]=useState("90 days");
  const [securityOpen,setSecurityOpen]=useState(false);
  const [mfa,setMfa]=useState(false);
  const [session,setSession]=useState("30 minutes");
  const [saved,setSaved]=useState("");

  const flash=(message:string)=>{
    setSaved(message);
    window.setTimeout(()=>setSaved(""),1800);
  };

  const saveWorkspace=()=>{
    const value=workspaceDraft.trim();
    if(!value) return;
    setWorkspace(value);
    setEditOpen(false);
    flash("Workspace profile updated.");
  };

  const saveSecurity=()=>{
    setSecurityOpen(false);
    flash("Security settings updated.");
  };

  return <>
    <PageTitle title="Settings" sub="Manage workspace preferences and monitoring."/>
    {saved&&<div className="save-message" role="status">{saved}</div>}
    <div className="settings">
      <section className="panel setting"><div className="setting-icon"><UserRound/></div><div><h2>Workspace profile</h2><p>{workspace}</p></div><button className="secondary" onClick={()=>{setWorkspaceDraft(workspace);setEditOpen(true)}}>Edit</button></section>
      <section className="panel setting"><div className="setting-icon"><Bell/></div><div><h2>Notifications</h2><p>Receive alerts when visibility changes significantly.</p></div><label className="switch"><input type="checkbox" checked={notifications} onChange={e=>{setNotifications(e.target.checked);flash(e.target.checked?"Notifications enabled.":"Notifications disabled.")}}/><span/></label></section>
      <section className="panel setting"><div className="setting-icon"><Database/></div><div><h2>Data retention</h2><p>Keep AI search snapshots for {retention.toLowerCase()}.</p></div><select value={retention} onChange={e=>{setRetention(e.target.value);flash(`Data retention set to ${e.target.value}.`)}}><option>90 days</option><option>180 days</option><option>1 year</option></select></section>
      <section className="panel setting"><div className="setting-icon"><Shield/></div><div><h2>Security</h2><p>Workspace access and session controls.</p></div><button className="secondary" onClick={()=>setSecurityOpen(true)}>Manage</button></section>
    </div>

    {editOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setEditOpen(false)}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="workspace-title"><button className="modal-x" onClick={()=>setEditOpen(false)} aria-label="Close workspace editor"><X/></button><h2 id="workspace-title">Edit workspace profile</h2><p>Update the workspace name shown across the dashboard.</p><label>Workspace name<input autoFocus value={workspaceDraft} onChange={e=>setWorkspaceDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveWorkspace()}}/></label><button className="primary full" onClick={saveWorkspace} disabled={!workspaceDraft.trim()}><Save size={16}/> Save changes</button></div></div>}

    {securityOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSecurityOpen(false)}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="security-title"><button className="modal-x" onClick={()=>setSecurityOpen(false)} aria-label="Close security settings"><X/></button><h2 id="security-title">Security controls</h2><p>Configure session and sign-in protections for this demo workspace.</p><label>Session timeout<select value={session} onChange={e=>setSession(e.target.value)}><option>15 minutes</option><option>30 minutes</option><option>1 hour</option><option>4 hours</option></select></label><label className="inline-check"><input type="checkbox" checked={mfa} onChange={e=>setMfa(e.target.checked)}/> Require multi-factor authentication</label><button className="primary full" onClick={saveSecurity}><Save size={16}/> Save security settings</button></div></div>}
  </>;
}
