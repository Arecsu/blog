import{u as f}from"./asyncData.8d866881.js";import{l as v,_ as g,i as l,m as d,p as h,q as _,j as y,k as r}from"./entry.a4bd5276.js";import{q as w,h as p,e as C,j as P}from"./query.c146c7b8.js";import{_ as $}from"./nuxt-link.e4e40fe7.js";import{w as c,s as j,u as N}from"./utils.0551b608.js";import{u as T}from"./preview.de0f61fc.js";const D=async e=>{const{content:t}=v().public;typeof(e==null?void 0:e.params)!="function"&&(e=w(e));const a=e.params(),s=t.experimental.stripQueryParameters?c(`/navigation/${`${p(a)}.${t.integrity}`}/${C(a)}.json`):c(`/navigation/${p(a)}.${t.integrity}.json`);if(j())return(await g(()=>import("./client-db.b0ca49a9.js"),["./client-db.b0ca49a9.js","./entry.a4bd5276.js","./entry.d19c7298.css","./query.c146c7b8.js","./utils.0551b608.js","./preview.de0f61fc.js","./index.a6ef77ff.js"],import.meta.url).then(o=>o.generateNavigation))(a);const n=await $fetch(s,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:P(a),previewToken:T().getPreviewToken()}});if(typeof n=="string"&&n.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return n},R=l({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=d(e),a=h(()=>{var n;return typeof((n=t.value)==null?void 0:n.params)=="function"?t.value.params():t.value});if(!a.value&&_("dd-navigation").value){const{navigation:n}=N();return{navigation:n}}const{data:s}=await f(`content-navigation-${p(a.value)}`,()=>D(a.value));return{navigation:s}},render(e){const t=y(),{navigation:a}=e,s=o=>r($,{to:o._path},()=>o.title),n=(o,u)=>r("ul",u?{"data-level":u}:null,o.map(i=>i.children?r("li",null,[s(i),n(i.children,u+1)]):r("li",null,s(i)))),m=o=>n(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):m(a)}});export{R as default};
