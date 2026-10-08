import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { getPromptById } from "../services/api";
import { Loading, PageTitle } from "../components/UI";

export default function PromptDetail(){
 const {id}=useParams(); const navigate=useNavigate(); const location=useLocation();
 const query=useQuery({queryKey:["prompt-detail",id],queryFn:({signal})=>getPromptById(Number(id),signal),retry:0,enabled:Boolean(id)});
 const close=()=>{if(location.state?.from)navigate(`/prompts?${location.state.from}`);else navigate(-1);};
 if(query.isPending)return <><PageTitle title="Prompt detail" sub="Deep-linked record view."/><Loading/></>;
 if(query.isError)return <><PageTitle title="Prompt detail" sub="This record could not be loaded."/><div className="state" role="alert"><AlertTriangle size={34}/><h3>Unable to load prompt</h3><p>{query.error.message}</p><button className="primary" onClick={()=>query.refetch()}><RefreshCw size={16}/> Retry</button></div></>;
 const p=query.data!;
 return <><PageTitle title="Prompt detail" sub="This view can be shared directly and closed without losing the explorer state." action={<button className="secondary" onClick={close}><ArrowLeft size={16}/> Back to explorer</button>}/><div className="panel detail-card"><div><span className="detail-label">Prompt</span><h2>{p.text}</h2></div><dl className="detail-grid"><div><dt>Platform</dt><dd>{p.platform}</dd></div><div><dt>Status</dt><dd>{p.status}</dd></div><div><dt>Position</dt><dd>{p.position?`#${p.position}`:"Not ranked"}</dd></div><div><dt>Mentions</dt><dd>{p.mentions}</dd></div><div><dt>Last checked</dt><dd>{p.lastChecked}</dd></div><div><dt>Record ID</dt><dd>{p.id}</dd></div></dl></div></>;
}
