import{u as f}from"./asyncData.28c8f1f7.js";import{y as v,_ as g,n as d,C as l,D as h,E as _,z as y,B as r}from"./entry.2f03ad9a.js";import{h as p,u as C}from"./preview.1037ef69.js";import{_ as w}from"./nuxt-link.d5e35ce0.js";import{q as P,e as $,j as N}from"./query.7c925e14.js";import{w as c,s as j,u as D}from"./utils.c8fb6d9a.js";const E=async e=>{const{content:t}=v().public;typeof(e==null?void 0:e.params)!="function"&&(e=P(e));const a=e.params(),s=t.experimental.stripQueryParameters?c(`/navigation/${`${p(a)}.${t.integrity}`}/${$(a)}.json`):c(`/navigation/${p(a)}.${t.integrity}.json`);if(j())return(await g(()=>import("./client-db.21e5ed73.js"),["./client-db.21e5ed73.js","./entry.2f03ad9a.js","./entry.46a378a8.css","./query.7c925e14.js","./preview.1037ef69.js","./utils.c8fb6d9a.js","./index.a6ef77ff.js"],import.meta.url).then(o=>o.generateNavigation))(a);const n=await $fetch(s,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:N(a),previewToken:C().getPreviewToken()}});if(typeof n=="string"&&n.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return n},R=d({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=l(e),a=h(()=>{var n;return typeof((n=t.value)==null?void 0:n.params)=="function"?t.value.params():t.value});if(!a.value&&_("dd-navigation").value){const{navigation:n}=D();return{navigation:n}}const{data:s}=await f(`content-navigation-${p(a.value)}`,()=>E(a.value));return{navigation:s}},render(e){const t=y(),{navigation:a}=e,s=o=>r(w,{to:o._path},()=>o.title),n=(o,u)=>r("ul",u?{"data-level":u}:null,o.map(i=>i.children?r("li",null,[s(i),n(i.children,u+1)]):r("li",null,s(i)))),m=o=>n(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):m(a)}});export{R as default};