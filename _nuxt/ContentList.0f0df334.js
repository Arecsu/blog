import n from"./ContentQuery.6ff3fb69.js";import{i as c,j as l,k as p}from"./entry.017b6764.js";import"./query.5a034d8f.js";import"./utils.9fe295b0.js";import"./preview.2ee03f63.js";const u=(r,t)=>p("pre",null,JSON.stringify({message:"You should use slots with <ContentList>",slot:r,data:t},null,2)),j=c({name:"ContentList",props:{path:{type:String,required:!1,default:void 0},query:{type:Object,required:!1,default:void 0}},render(r){const t=l(),{path:f,query:a}=r,m={...a||{},path:f||(a==null?void 0:a.path)||"/"};return p(n,m,{default:t!=null&&t.default?({data:e,refresh:o,isPartial:d})=>t.default({list:e,refresh:o,isPartial:d,...this.$attrs}):e=>u("default",e.data),empty:e=>t!=null&&t.empty?t.empty(e):u("default",e==null?void 0:e.data),"not-found":e=>{var o;return t!=null&&t["not-found"]?(o=t==null?void 0:t["not-found"])==null?void 0:o.call(t,e):u("not-found",e==null?void 0:e.data)}})}});export{j as default};