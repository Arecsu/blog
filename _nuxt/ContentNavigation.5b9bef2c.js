import{q as f,h as m,e as v,j as d,u as l}from"./query.5a034d8f.js";import{l as _,_ as g,i as h,m as y,p as w,q as C,j as P,k as s}from"./entry.017b6764.js";import{_ as $}from"./nuxt-link.b23475c6.js";import{w as c,s as j,u as N}from"./utils.9fe295b0.js";import{u as T}from"./preview.2ee03f63.js";import"./Icon.vue.831a0a86.js";/* empty css                              *//* empty css                        *//* empty css                          *//* empty css                          *//* empty css                                *//* empty css                     */import"./client-only.d7faa2d6.js";/* empty css                      *//* empty css                    */const x=async n=>{const{content:t}=_().public;typeof(n==null?void 0:n.params)!="function"&&(n=f(n));const a=n.params(),i=t.experimental.stripQueryParameters?c(`/navigation/${`${m(a)}.${t.integrity}`}/${v(a)}.json`):c(`/navigation/${m(a)}.${t.integrity}.json`);if(j())return(await g(()=>import("./client-db.84060ff9.js"),["./client-db.84060ff9.js","./entry.017b6764.js","./entry.b132c223.css","./query.5a034d8f.js","./utils.9fe295b0.js","./preview.2ee03f63.js","./index.a6ef77ff.js"],import.meta.url).then(o=>o.generateNavigation))(a);const e=await $fetch(i,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:d(a),previewToken:T().getPreviewToken()}});if(typeof e=="string"&&e.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return e};const Y=h({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(n){const{query:t}=y(n),a=w(()=>{var e;return typeof((e=t.value)==null?void 0:e.params)=="function"?t.value.params():t.value});if(!a.value&&C("dd-navigation").value){const{navigation:e}=N();return{navigation:e}}const{data:i}=await l(`content-navigation-${m(a.value)}`,()=>x(a.value));return{navigation:i}},render(n){const t=P(),{navigation:a}=n,i=o=>s($,{to:o._path},()=>o.title),e=(o,p)=>s("ul",p?{"data-level":p}:null,o.map(r=>r.children?s("li",null,[i(r),e(r.children,p+1)]):s("li",null,i(r)))),u=o=>e(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):u(a)}});export{Y as default};