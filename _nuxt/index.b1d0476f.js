import{_ as c}from"./nuxt-link.013c162d.js";import{J as i,A as p,a as n,F as u,a3 as l,u as d,o as t,c as m,w as f,b as x,t as y}from"./entry.8ac089fc.js";import{u as h,q as k}from"./query.c28e0a6c.js";import{_ as w}from"./_plugin-vue_export-helper.c27b6911.js";import"./utils.646d394f.js";import"./preview.c111be5e.js";const v={class:"recipes-list-container"},B={__name:"index",async setup(b){let e,s;i({title:"recetas"});const{data:r}=([e,s]=p(()=>h("recetas",()=>k("recetas").where({draft:{$ne:!0}}).sort({title:1}).only(["_path","title"]).find())),e=await e,s(),e);return(g,A)=>{const o=c;return t(),n("div",v,[(t(!0),n(u,null,l(d(r),({_path:a,title:_})=>(t(),m(o,{key:a,to:a},{default:f(()=>[x("span",null,y(_),1)]),_:2},1032,["to"]))),128))])}}},E=w(B,[["__scopeId","data-v-9cfed68b"]]);export{E as default};
