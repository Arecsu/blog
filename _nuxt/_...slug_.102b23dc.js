import u from"./RecipeSidebar.afa7ca3c.js";import d from"./Icon.0eabe3a5.js";import{u as h,_ as f}from"./ContentDoc.eb695c82.js";import{u as y,q as g}from"./query.24424277.js";import{h as x,f as C,c as v,b as c,g as t,a as r,i as T,j as k,d as w,t as B,o as i}from"./entry.47ef2209.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./config.d07d6427.js";import"./ContentRenderer.8c76a11f.js";import"./ContentRendererMarkdown.59c993ee.js";import"./index.a6ef77ff.js";import"./preview.9643bec8.js";import"./ContentQuery.6a4eb358.js";import"./utils.1fc4263d.js";const N={class:"recipe-layout"},V={class:"recipe-container"},$={class:"recipe-title",ref:"recipeTitle"},z={__name:"[...slug]",async setup(b){let o,n;const s=x(),_=`recipe-${s.params.slug[0]}`;h({head:{titleTemplate:a=>`${a.toLowerCase()} · a9r`}});const{data:e}=([o,n]=C(()=>y(_,()=>g("recetas").where({_path:s.path}).findOne(),"$TthFMbhPsT")),o=await o,n(),o);return(a,q)=>{const p=u,m=d,l=f;return i(),v("div",N,[c(p,{icon:t(e).icon,title:t(e).title},null,8,["icon","title"]),r("div",V,[r("span",$,[t(e).icon?(i(),T(m,{key:0,class:"recipe-icon-title",name:t(e).icon},null,8,["name"])):k("",!0),w(B(t(e).title),1)],512),c(l,{class:"recipe",tag:"div"})])])}}};export{z as default};