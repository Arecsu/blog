import u from"./RecipeSidebar.f28f6682.js";import d from"./Icon.14bb2d92.js";import{u as f,_ as h}from"./ContentDoc.e49b4361.js";import{u as y,q as g}from"./query.e0292832.js";import{H as x,A as C,a as v,e as c,u as t,b as r,c as T,h as $,f as k,t as w,o as i}from"./entry.38813949.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./config.7eaa8f3a.js";import"./ContentRenderer.2a5fcdfb.js";import"./ContentRendererMarkdown.f7550fa2.js";import"./index.a6ef77ff.js";import"./preview.c901f81e.js";import"./ContentQuery.53cb1d31.js";import"./utils.20c9b1d3.js";const B={class:"recipe-layout"},N={class:"recipe-container"},V={class:"recipe-title",ref:"recipeTitle"},z={__name:"[...slug]",async setup(b){let o,s;const n=x(),_=`recipe-${n.params.slug[0]}`;f({head:{titleTemplate:a=>`${a.toLowerCase()} · a9r`}});const{data:e}=([o,s]=C(()=>y(_,()=>g("recetas").where({_path:n.path}).findOne(),"$TthFMbhPsT")),o=await o,s(),o);return(a,D)=>{const p=u,m=d,l=h;return i(),v("div",B,[c(p,{icon:t(e).icon,title:t(e).title},null,8,["icon","title"]),r("div",N,[r("span",V,[t(e).icon?(i(),T(m,{key:0,class:"recipe-icon-title",name:t(e).icon},null,8,["name"])):$("",!0),k(w(t(e).title),1)],512),c(l,{class:"recipe",tag:"div"})])])}}};export{z as default};
