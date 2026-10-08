type Platform = "ChatGPT" | "Gemini" | "Perplexity" | "Copilot";
type Status = "Mentioned" | "Not Mentioned" | "Monitoring";
type Prompt = { id:number;text:string;platform:Platform;status:Status;position:number|null;mentions:number;lastChecked:string };
const platforms:Platform[]=["ChatGPT","Gemini","Perplexity","Copilot"];
const statuses:Status[]=["Mentioned","Not Mentioned","Monitoring"];
const seeds=["Best AI search optimization tools for brands","How can a brand improve ChatGPT visibility?","Best GEO agencies in India","How to get cited by Perplexity?","AI search optimization platform comparison","Best digital marketing tools for AI discovery","How does generative engine optimization work?","Best way to track AI brand mentions","How to optimize content for AI search?","Best generative engine optimization strategy","How do AI assistants choose which brands to recommend?","Best AI visibility dashboard for marketing teams"];
function dataset():Prompt[]{return Array.from({length:12000},(_,i)=>({id:i+1,text:`${seeds[i%seeds.length]} #${i+1}`,platform:platforms[i%4],status:statuses[i%3],position:i%9===0?null:(i%8)+1,mentions:12+((i*17)%88),lastChecked:`${(i%12)+1} min ago`}));}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const randomInt=(min:number,max:number)=>Math.floor(Math.random()*(max-min+1))+min;
export default async function handler(req:any,res:any){
 if(req.method!=="GET"){res.status(405).json({error:"Method not allowed"});return;}
 const latency=randomInt(200,3000); await sleep(latency);
 if(Math.random()<0.1){res.status(503).json({error:"Mock API failure. Please retry the request."});return;}
 const all=dataset();
 const requestedId=Number(req.query?.id)||0;
 if(requestedId){const item=all.find(p=>p.id===requestedId);if(!item){res.status(404).json({error:"Prompt not found"});return;}res.setHeader("Cache-Control","no-store");res.status(200).json({item});return;}
 const query=typeof req.query?.search==="string"?req.query.search.trim().toLowerCase():"";
 const platform=typeof req.query?.platform==="string"?req.query.platform:"All";
 const status=typeof req.query?.status==="string"?req.query.status:"All";
 const sort=typeof req.query?.sort==="string"?req.query.sort:"mentions_desc";
 const page=Math.max(1,Number(req.query?.page)||1); const pageSize=Math.min(50,Math.max(10,Number(req.query?.pageSize)||25));
 let rows=all;
 if(query)rows=rows.filter(p=>p.text.toLowerCase().includes(query));
 if(platform!=="All")rows=rows.filter(p=>p.platform===platform);
 if(status!=="All")rows=rows.filter(p=>p.status===status);
 rows=[...rows].sort((a,b)=>{if(sort==="mentions_asc")return a.mentions-b.mentions||a.id-b.id;if(sort==="position_asc")return(a.position??999)-(b.position??999)||a.id-b.id;if(sort==="position_desc")return(b.position??-1)-(a.position??-1)||a.id-b.id;if(sort==="id_asc")return a.id-b.id;if(sort==="id_desc")return b.id-a.id;return b.mentions-a.mentions||a.id-b.id;});
 const total=rows.length,totalPages=Math.max(1,Math.ceil(total/pageSize)),safePage=Math.min(page,totalPages),start=(safePage-1)*pageSize;
 res.setHeader("Cache-Control","no-store");res.status(200).json({items:rows.slice(start,start+pageSize),total,page:safePage,pageSize,totalPages,latencyMs:latency});
}
