import type { Dashboard, Platform, Prompt } from "../types";

const wait = (ms:number) => new Promise(r=>setTimeout(r,ms));
const platforms: Platform[] = ["ChatGPT","Gemini","Perplexity","Copilot"];
const seedPrompts = [
  "Best AI search optimization tools for brands",
  "How can a brand improve ChatGPT visibility?",
  "Best GEO agencies in India",
  "How to get cited by Perplexity?",
  "AI search optimization platform comparison",
  "Best digital marketing tools for AI discovery",
  "How does generative engine optimization work?",
  "Best way to track AI brand mentions"
];

let prompts: Prompt[] = Array.from({length:32},(_,i)=>({
  id:i+1, text:seedPrompts[i%seedPrompts.length],
  platform:platforms[i%4], status:i%5===0?"Not Mentioned":i%7===0?"Monitoring":"Mentioned",
  position:i%9===0?null:(i%8)+1, mentions:12+(i*7)%84,
  lastChecked:`${(i%12)+1} min ago`
}));

export async function getDashboard():Promise<Dashboard>{
  await wait(450);
  return {
    visibility:78, visibilityDelta:12.4, mentions:1248, mentionsDelta:18.7,
    citations:683, citationsDelta:9.2, prompts:32, promptsDelta:6.1,
    chart:Array.from({length:14},(_,i)=>({date:`Oct ${i+1}`,score:62+i+(i%4)*2,mentions:55+i*8})),
    platforms:[
      {name:"ChatGPT",score:84,mentions:412,color:""},
      {name:"Perplexity",score:79,mentions:336,color:""},
      {name:"Gemini",score:72,mentions:287,color:""},
      {name:"Copilot",score:68,mentions:213,color:""}
    ]
  };
}
export async function getPrompts():Promise<Prompt[]>{ await wait(350); return [...prompts]; }
export async function trackPrompt(text:string,platform:Platform):Promise<Prompt>{
  await wait(500);
  const p:Prompt={id:Date.now(),text,platform,status:"Monitoring",position:null,mentions:0,lastChecked:"just now"};
  prompts=[p,...prompts]; return p;
}
export async function deletePrompt(id:number){ await wait(250); prompts=prompts.filter(p=>p.id!==id); }