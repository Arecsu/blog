import{i as m,a2 as f,p as o,o as d,a as x,D as S,u as r}from"./entry.f0cd01d8.js";import{u as z}from"./config.f3a92db7.js";import{_ as I}from"./_plugin-vue_export-helper.c27b6911.js";const y=m({__name:"IconCSS",props:{name:{type:String,required:!0},size:{type:String,default:""}},setup(p){var c;const s=p;f(n=>({"55df08f6":r(l)}));const e=z();(c=e==null?void 0:e.nuxtIcon)!=null&&c.aliases;const _=o(()=>{var n;return(((n=e==null?void 0:e.nuxtIcon)==null?void 0:n.aliases)||{})[s.name]||s.name}),l=o(()=>`url('https://api.iconify.design/${_.value.replace(":","/")}.svg')`),a=o(()=>{var t,i,u;if(!s.size&&typeof((t=e.nuxtIcon)==null?void 0:t.size)=="boolean"&&!((i=e.nuxtIcon)!=null&&i.size))return;const n=s.size||((u=e.nuxtIcon)==null?void 0:u.size)||"1em";return String(Number(n))===n?`${n}px`:n});return(n,t)=>(d(),x("span",{style:S({width:r(a),height:r(a)})},null,4))}});const h=I(y,[["__scopeId","data-v-85fb98be"]]);export{h as default};
