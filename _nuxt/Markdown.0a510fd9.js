import s from"./ContentSlot.ba848003.js";import{k as o,v as m,A as p,L as u}from"./entry.8926bf81.js";import"./utils.0f830a56.js";import"./preview.0d3719d7.js";const d=o({name:"Markdown",extends:s,setup(t){const{parent:e}=u(),{between:n,default:r}=m(),a=p(()=>typeof t.unwrap=="string"?t.unwrap.split(" "):["*"]);return{fallbackSlot:r,tags:a,between:n,parent:e}}});export{d as default};