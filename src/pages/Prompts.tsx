import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Filter, RefreshCw, Search, XCircle } from "lucide-react";
import { getPrompts } from "../services/api";
import { Empty, Loading, PageTitle } from "../components/UI";
import type { Platform, PromptStatus } from "../types";

const PAGE_SIZE=25;
const ROW_HEIGHT=54;
const VIEWPORT_HEIGHT=560;
const OVERSCAN=7;
const platforms=["All","ChatGPT","Gemini","Perplexity","Copilot"];
const statuses=["All","Mentioned","Not Mentioned","Monitoring"];
const sorts=[
  ["mentions_desc","Mentions ↓"],["mentions_asc","Mentions ↑"],["position_asc","Best position"],["position_desc","Worst position"],["id_desc","Newest"],["id_asc","Oldest"],
];

export default function Prompts(){
  const [params,setParams]=useSearchParams();
  const urlSearch=params.get("search")||"";
  const platform=params.get("platform")||"All";
  const status=params.get("status")||"All";
  const sort=params.get("sort")||"mentions_desc";
  const page=Math.max(1,Number(params.get("page"))||1);
  const [search,setSearch]=useState(urlSearch);
  const [announcement,setAnnouncement]=useState("");
  const [scrollTop,setScrollTop]=useState(0);
  const listRef=useRef<HTMLDivElement>(null);
  const urlKey=params.toString()||"default";

  useEffect(()=>setSearch(urlSearch),[urlSearch]);

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      if(search===urlSearch)return;
      const next=new URLSearchParams(params);
      if(search.trim())next.set("search",search.trim());else next.delete("search");
      next.set("page","1");
      setParams(next);
    },350);
    return()=>window.clearTimeout(timer);
  },[search,urlSearch,params,setParams]);

  useEffect(()=>{
    const saved=sessionStorage.getItem(`prompt-scroll:${urlKey}`);
    if(saved && listRef.current) listRef.current.scrollTop=Number(saved);
  },[urlKey]);

  const query=useQuery({
    queryKey:["prompt-explorer",urlSearch,platform,status,sort,page],
    queryFn:({signal})=>getPrompts({search:urlSearch,platform,status,sort,page,pageSize:PAGE_SIZE},signal),
    retry:0,
    staleTime:0,
  });

  useEffect(()=>{
    if(query.data)setAnnouncement(`${query.data.total.toLocaleString()} results found. Page ${query.data.page} of ${query.data.totalPages}.`);
  },[query.data]);

  const rows=query.data?.items||[];
  const startIndex=Math.max(0,Math.floor(scrollTop/ROW_HEIGHT)-OVERSCAN);
  const endIndex=Math.min(rows.length,Math.ceil((scrollTop+VIEWPORT_HEIGHT)/ROW_HEIGHT)+OVERSCAN);
  const visibleRows=rows.slice(startIndex,endIndex);
  const topSpace=startIndex*ROW_HEIGHT;
  const bottomSpace=Math.max(0,(rows.length-endIndex)*ROW_HEIGHT);

  const update=(key:string,value:string)=>{
    const next=new URLSearchParams(params);
    if(value && value!=="All")next.set(key,value);else next.delete(key);
    if(key!=="page")next.set("page","1");
    setParams(next);
  };
  const changePage=(nextPage:number)=>{const next=new URLSearchParams(params);next.set("page",String(nextPage));setParams(next);listRef.current?.scrollTo({top:0});};

  const onScroll=(e:UIEvent<HTMLDivElement>)=>{
    const top=e.currentTarget.scrollTop;setScrollTop(top);sessionStorage.setItem(`prompt-scroll:${urlKey}`,String(top));
  };

  const statusLabel=useMemo(()=>query.isFetching?"Refreshing results…":`${query.data?.total.toLocaleString()||0} matching records`,[query.isFetching,query.data?.total]);

  return <>
    <PageTitle title="Data Explorer" sub="A production-style explorer built for slow networks, large datasets and unreliable requests."/>
    <div className="assignment-banner" role="note"><strong>Problem Statement 1</strong><span>12,000 records • server-side search/filter/sort/pagination • simulated 200ms–3s latency • ~10% failures • URL state</span></div>
    <div className="toolbar explorer-toolbar">
      <div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 12,000 prompts…" aria-label="Search prompts"/></div>
      <select value={platform} onChange={e=>update("platform",e.target.value)} aria-label="Filter by platform">{platforms.map(x=><option key={x}>{x}</option>)}</select>
      <select value={status} onChange={e=>update("status",e.target.value)} aria-label="Filter by status">{statuses.map(x=><option key={x}>{x}</option>)}</select>
      <select value={sort} onChange={e=>update("sort",e.target.value)} aria-label="Sort results">{sorts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
      <Filter size={18} aria-hidden="true"/>
    </div>

    <div className="explorer-meta"><span>{statusLabel}</span><span aria-live="polite" className="sr-only">{announcement}</span>{query.isFetching&&<span className="fetching">Loading latest results…</span>}</div>

    {query.isPending?<Loading/>:query.isError?<div className="state" role="alert"><AlertTriangle size={34}/><h3>Couldn’t load these results</h3><p>{query.error.message}</p><button className="primary" onClick={()=>query.refetch()}><RefreshCw size={16}/> Retry</button></div>:
      <div className="panel explorer-panel">
        <div className="table-scroll" ref={listRef} onScroll={onScroll} tabIndex={0} aria-label="Scrollable prompt results">
          <table className="virtual-table" aria-rowcount={query.data?.total||0} aria-colcount={7}>
            <thead><tr><th>Prompt</th><th>Platform</th><th>Status</th><th>Position</th><th>Mentions</th><th>Last checked</th><th>Details</th></tr></thead>
            <tbody>
              {topSpace>0&&<tr aria-hidden="true"><td colSpan={7} style={{height:topSpace,padding:0,border:0}}/></tr>}
              {visibleRows.map((p,i)=><tr key={p.id} aria-rowindex={startIndex+i+2}>
                <td className="prompt-cell"><Link className="row-link" to={`/prompts/${p.id}`} state={{from:urlKey}}>{p.text}</Link></td>
                <td>{p.platform}</td>
                <td><StatusBadge status={p.status}/></td><td>{p.position?`#${p.position}`:"—"}</td><td>{p.mentions}</td><td>{p.lastChecked}</td>
                <td><Link className="secondary small-link" to={`/prompts/${p.id}`} state={{from:urlKey}}>Open</Link></td>
              </tr>)}
              {bottomSpace>0&&<tr aria-hidden="true"><td colSpan={7} style={{height:bottomSpace,padding:0,border:0}}/></tr>}
            </tbody>
          </table>
          {!rows.length&&<Empty text="No prompts match these filters."/>}
        </div>
        <div className="pagination" aria-label="Pagination">
          <span>Page {query.data?.page||page} of {query.data?.totalPages||1}</span>
          <div><button className="icon-btn" disabled={page<=1||query.isFetching} onClick={()=>changePage(page-1)} aria-label="Previous page"><ChevronLeft size={18}/></button><button className="icon-btn" disabled={page>=(query.data?.totalPages||1)||query.isFetching} onClick={()=>changePage(page+1)} aria-label="Next page"><ChevronRight size={18}/></button></div>
        </div>
      </div>}
  </>;
}

function StatusBadge({status}:{status:PromptStatus}){return <span className={`badge ${status==="Mentioned"?"good":status==="Monitoring"?"warn":"bad"}`}>{status==="Mentioned"?<CheckCircle2 size={13}/>:status==="Monitoring"?<Clock3 size={13}/>:<XCircle size={13}/>} {status}</span>}
