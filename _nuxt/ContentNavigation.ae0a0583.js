import{l as f,_ as v,i as d,m as l,p as _,q as g,j as h,k as s}from"./entry.43657bc1.js";import{q as y,h as m,e as w,j as C,u as P}from"./query.7706ae4d.js";import{_ as $}from"./nuxt-link.312bff4b.js";import{w as c,s as j,u as N}from"./utils.d532a7bc.js";import{u as T}from"./preview.2e9247fa.js";import"./Icon.vue.88f0815e.js";/* empty css                              *//* empty css                        *//* empty css                          *//* empty css                          *//* empty css                                *//* empty css                     */import"./Header.vue.2b7ac74b.js";/* empty css                      *//* empty css                    */const x=async n=>{const{content:t}=f().public;typeof(n==null?void 0:n.params)!="function"&&(n=y(n));const a=n.params(),i=t.experimental.stripQueryParameters?c(`/navigation/${`${m(a)}.${t.integrity}`}/${w(a)}.json`):c(`/navigation/${m(a)}.${t.integrity}.json`);if(j())return(await v(()=>import("./client-db.e0322e1a.js"),["./client-db.e0322e1a.js","./entry.43657bc1.js","./entry.b132c223.css","./query.7706ae4d.js","./utils.d532a7bc.js","./preview.2e9247fa.js","./index.a6ef77ff.js"],import.meta.url).then(o=>o.generateNavigation))(a);const e=await $fetch(i,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:C(a),previewToken:T().getPreviewToken()}});if(typeof e=="string"&&e.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return e};const V=d({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(n){const{query:t}=l(n),a=_(()=>{var e;return typeof((e=t.value)==null?void 0:e.params)=="function"?t.value.params():t.value});if(!a.value&&g("dd-navigation").value){const{navigation:e}=N();return{navigation:e}}const{data:i}=await P(`content-navigation-${m(a.value)}`,()=>x(a.value));return{navigation:i}},render(n){const t=h(),{navigation:a}=n,i=o=>s($,{to:o._path},()=>o.title),e=(o,p)=>s("ul",p?{"data-level":p}:null,o.map(r=>r.children?s("li",null,[i(r),e(r.children,p+1)]):s("li",null,i(r)))),u=o=>e(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):u(a)}});export{V as default};
