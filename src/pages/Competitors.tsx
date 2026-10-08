import {useMemo,useState} from "react";
import {PageTitle,Empty} from "../components/UI";
import {Search,Plus,MoreHorizontal,X} from "lucide-react";

type Competitor={name:string;score:number;mentions:number;change:number;you?:boolean};

const initialData:Competitor[]=[
  {name:"SearchPilot",score:82,mentions:1142,change:15.4},
  {name:"MarketMuse AI",score:74,mentions:968,change:8.2},
  {name:"Your brand",score:78,mentions:1248,change:12.4,you:true},
  {name:"RankFlow",score:67,mentions:812,change:5.9}
];

export default function Competitors(){
  const [data,setData]=useState(initialData);
  const [query,setQuery]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [name,setName]=useState("");
  const [saved,setSaved]=useState(false);

  const filtered=useMemo(()=>data.filter(item=>item.name.toLowerCase().includes(query.trim().toLowerCase())),[data,query]);

  const addCompetitor=()=>{
    const trimmed=name.trim();
    if(!trimmed || data.some(item=>item.name.toLowerCase()===trimmed.toLowerCase())) return;
    setData(prev=>[...prev,{name:trimmed,score:0,mentions:0,change:0},]);
    setName("");
    setShowAdd(false);
    setSaved(true);
    window.setTimeout(()=>setSaved(false),1800);
  };

  return <>
    <PageTitle title="Competitors" sub="See how your AI visibility compares to the market." action={<button className="primary" onClick={()=>setShowAdd(true)}><Plus size={17}/> Add competitor</button>}/>
    <div className="toolbar"><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search competitors…" aria-label="Search competitors"/>{query&&<button className="icon-btn" onClick={()=>setQuery("")} aria-label="Clear competitor search"><X size={15}/></button>}</div></div>
    {saved&&<div className="save-message" role="status">Competitor added successfully.</div>}
    <div className="panel table-panel">
      {filtered.length===0 ? <Empty text={`No competitors match “${query}”.`}/> : <table><thead><tr><th>Brand</th><th>Visibility score</th><th>AI mentions</th><th>30-day change</th><th/></tr></thead><tbody>{filtered.map((r)=><tr key={r.name}><td><strong>{r.name}</strong>{r.you&&<span className="you">YOU</span>}</td><td><div className="score-line"><b>{r.score}</b><div className="tiny-progress"><span style={{width:r.score+"%"}}/></div></div></td><td>{r.mentions.toLocaleString()}</td><td className={r.change>=0?"up":"down"}>{r.change>=0?"↑":"↓"} {Math.abs(r.change).toFixed(1)}%</td><td><button className="icon-btn" aria-label={`Actions for ${r.name}`}><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table>}
    </div>

    {showAdd&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAdd(false)}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-competitor-title"><button className="modal-x" onClick={()=>setShowAdd(false)} aria-label="Close add competitor dialog"><X/></button><h2 id="add-competitor-title">Add competitor</h2><p>Track another brand in your AI visibility benchmark.</p><label>Competitor name<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. GrowthAI" onKeyDown={e=>{if(e.key==="Enter")addCompetitor()}}/></label><button className="primary full" onClick={addCompetitor} disabled={!name.trim()}>Add competitor</button></div></div>}
  </>;
}
