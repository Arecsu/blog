import{n as o,u as s,E as d}from"./entry.a0cfc3a6.js";const p=r=>Object.fromEntries(Object.entries(r).filter(([,t])=>t!==void 0)),l=(r,t)=>(n,e)=>(s(()=>r({...p(n),...e.attrs},e)),()=>{var i,a;return t?(a=(i=e.slots).default)==null?void 0:a.call(i):null}),g={accesskey:String,autocapitalize:String,autofocus:{type:Boolean,default:void 0},class:[String,Object,Array],contenteditable:{type:Boolean,default:void 0},contextmenu:String,dir:String,draggable:{type:Boolean,default:void 0},enterkeyhint:String,exportparts:String,hidden:{type:Boolean,default:void 0},id:String,inputmode:String,is:String,itemid:String,itemprop:String,itemref:String,itemscope:String,itemtype:String,lang:String,nonce:String,part:String,slot:String,spellcheck:{type:Boolean,default:void 0},style:String,tabindex:String,title:String,translate:String},S=o({name:"NoScript",inheritAttrs:!1,props:{...g,title:String,body:Boolean,renderPriority:[String,Number]},setup:l((r,{slots:t})=>{var i;const n={...r},e=(((i=t.default)==null?void 0:i.call(t))||[]).filter(({children:a})=>a).map(({children:a})=>a).join("");return e&&(n.children=e),{noscript:[n]}})}),c=o({name:"Title",inheritAttrs:!1,setup:l((r,{slots:t})=>{var n,e,i;return{title:((i=(e=(n=t.default)==null?void 0:n.call(t))==null?void 0:e[0])==null?void 0:i.children)||null}})}),f=o({name:"Head",inheritAttrs:!1,setup:(r,t)=>()=>{var n,e;return(e=(n=t.slots).default)==null?void 0:e.call(n)}}),m=()=>d("header-title",()=>"");export{f as H,S as N,c as T,m as u};
