import s from"./ContentSlot.3ddf5151.js";import{l as o,x as m,B as p,M as u}from"./entry.c4e5a255.js";import"./utils.a78c8371.js";import"./preview.e2292dd3.js";const d=o({name:"Markdown",extends:s,setup(t){const{parent:e}=u(),{between:n,default:r}=m(),a=p(()=>typeof t.unwrap=="string"?t.unwrap.split(" "):["*"]);return{fallbackSlot:r,tags:a,between:n,parent:e}}});export{d as default};