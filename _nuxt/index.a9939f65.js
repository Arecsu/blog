import{_ as r}from"./eSFlat.vue.32878599.js";import{_ as i}from"./nuxt-link.2997e067.js";import{u as p,g as d,c as l,a as s,b as a,d as o,w as m,o as u,p as f,e as x}from"./entry.6974249a.js";import{u as h}from"./asyncData.ff262ce1.js";import{q as y}from"./query.a9d4ff2b.js";import{_ as v}from"./_plugin-vue_export-helper.c27b6911.js";import"./Emoji.vue.4dedecd2.js";import"./preview.dd6a2b41.js";import"./utils.03f0a925.js";const w=e=>(f("data-v-1fa4a64f"),e=e(),x(),e),N={class:"notas-index-container"},k={class:"under-construction"},I=w(()=>s("br",null,null,-1)),C={__name:"index",async setup(e){let t,n;return p({title:"notas"}),[t,n]=d(()=>h("notes",()=>y("notes").where({draft:{$ne:!0}}).sort({title:1}).only(["_path","title"]).find())),t=await t,n(),(S,b)=>{const _=r,c=i;return u(),l("div",N,[s("p",k,[a(_,{e:"🚧"}),o(" UNDER CONSTRUCTION "),I]),s("p",null,[o("Meanwhile, I collect some "),a(c,{to:"/notes/links"},{default:m(()=>[o("bookmarks here")]),_:1}),o(".")])])}}},R=v(C,[["__scopeId","data-v-1fa4a64f"]]);export{R as default};