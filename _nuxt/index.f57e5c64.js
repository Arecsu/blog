import{_ as c}from"./nuxt-link.8fdd623f.js";import{u as i,g as p,c as r,F as l,r as u,k as d,o as t,l as m,w as f,a as x,t as y}from"./entry.b7f3c4d5.js";import{u as k}from"./asyncData.43e74779.js";import{q as h}from"./query.851c0917.js";import{_ as w}from"./_plugin-vue_export-helper.c27b6911.js";import"./preview.9883e466.js";import"./utils.3a91575f.js";const g={class:"recipes-list-container"},v={__name:"index",async setup(B){let e,s;i({title:"recetas"});const{data:n}=([e,s]=p(()=>k("recetas",()=>h("recetas").where({draft:{$ne:!0}}).sort({title:1}).only(["_path","title"]).find())),e=await e,s(),e);return(C,b)=>{const o=c;return t(),r("div",g,[(t(!0),r(l,null,u(d(n),({_path:a,title:_})=>(t(),m(o,{key:a,to:a},{default:f(()=>[x("span",null,y(_),1)]),_:2},1032,["to"]))),128))])}}},H=w(v,[["__scopeId","data-v-9cfed68b"]]);export{H as default};