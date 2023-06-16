import{_ as N}from"./nuxt-link.013c162d.js";import H from"./Icon.db97eb6d.js";import{q as M,u as h,O as L,a4 as R,a5 as z,y as T,a6 as B,p as C,z as P,a7 as q,a8 as D,a9 as E,o as m,a as y,e as _,w as i,c as v,h as j,aa as A,i as F,Y as I,b as l,f as x,ab as W,ac as X,ad as Y,r as O}from"./entry.8ac089fc.js";import{_ as g}from"./_plugin-vue_export-helper.c27b6911.js";import"./config.efb573f9.js";const G=()=>M("color-mode").value;function S(t){return typeof t=="function"?t():h(t)}const J=()=>{};function K(...t){if(t.length!==1)return L(...t);const e=t[0];return typeof e=="function"?R(z(()=>({get:e,set:J}))):T(e)}function Q(t,e){const o=B(w()),a=K(t),n=C({get(){var c;const u=a.value;let d=e!=null&&e.getIndexOf?e.getIndexOf(o.value,u):u.indexOf(o.value);return d<0&&(d=(c=e==null?void 0:e.fallbackIndex)!=null?c:0),d},set(c){s(c)}});function s(c){const u=a.value,d=u.length,V=(c%d+d)%d,$=u[V];return o.value=$,$}function r(c=1){return s(n.value+c)}function f(c=1){return r(c)}function p(c=1){return r(-c)}function w(){var c,u;return(u=S((c=e==null?void 0:e.initialValue)!=null?c:S(t)[0]))!=null?u:void 0}return P(a,()=>s(n.value)),{state:o,index:n,next:f,prev:p}}const U={__name:"HeaderThemeSwitch",setup(t){const e=G(),{state:o,next:a}=Q(["dark","light","system"],{initialValue:e.value});q(()=>e.preference=o.value);const n=C(()=>{switch(e.preference){case"light":return{tooltip:"vitamina D 🏖️",icon:"light"};case"dark":return{tooltip:"oscuroOooOo 🦉",icon:"dark"}}return{tooltip:"igual que el sistema 💿",icon:e.value}});return(s,r)=>{const f=H,p=D("tippy");return E((m(),y("button",{class:"button-no-style",onClick:r[0]||(r[0]=w=>h(a)())},[_(A,{name:"slide-up"},{default:i(()=>[h(n).icon==="dark"?(m(),v(f,{key:0,name:"tabler:ghost-filled",size:"1.2em"})):h(n).icon==="light"?(m(),v(f,{key:1,name:"ic:outline-lightbulb",size:"1.1em"})):j("",!0)]),_:1})])),[[p,{content:`${h(n).tooltip}`,placement:"bottom-start"}]])}}},Z=g(U,[["__scopeId","data-v-9af7878f"]]),b=F({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(t,{slots:e,attrs:o}){const a=T(!1);return I(()=>{a.value=!0}),n=>{var p;if(a.value)return(p=e.default)==null?void 0:p.call(e);const s=e.fallback||e.placeholder;if(s)return s();const r=n.fallback||n.placeholder||"",f=n.fallbackTag||n.placeholderTag||"span";return y(f,o,r)}}});const ee={},k=t=>(W("data-v-94b44cc8"),t=t(),X(),t),te={class:"header-container"},ne=k(()=>l("div",{class:"noise-background"},null,-1)),oe=k(()=>l("li",{class:"lines"}," //---- ",-1)),ae={class:"header-right-side"},ce=k(()=>l("span",{class:"header-arrow"},"↙",-1));function le(t,e){const o=N,a=Z,n=b;return m(),y("div",te,[ne,l("header",null,[l("nav",null,[l("ul",null,[oe,l("li",null,[_(o,{to:"/notas"},{default:i(()=>[x("notas")]),_:1})]),l("li",null,[_(o,{to:"/recetas"},{default:i(()=>[x("recetas")]),_:1})]),l("li",null,[_(o,{to:"https://alejandro9r.xyz",target:"_blank"},{default:i(()=>[x("_hola!")]),_:1})])])]),l("div",ae,[_(n,null,{default:i(()=>[_(a,{class:"dark-mode-button"})]),_:1}),ce])])])}const se=g(ee,[["render",le],["__scopeId","data-v-94b44cc8"]]),re={__name:"MousePositionToVar",setup(t){const e=window.document.querySelector(":root"),o=a=>{const n=parseFloat(a.pageX/window.innerWidth*100);e.style.setProperty("--mouse-x",n+"%")};return I(()=>{window.addEventListener("mousemove",o)}),(a,n)=>null}},_e={name:Y,props:{placeholder:String,tag:{type:String,default:"span"}}};function ue(t,e,o,a,n,s){const r=b;return m(),v(r,{placeholder:o.placeholder,"placeholder-tag":o.tag},{default:i(()=>[O(t.$slots,"default")]),_:3},8,["placeholder","placeholder-tag"])}const ie=g(_e,[["render",ue]]);const de={},fe={class:"global-container"},pe={class:"the-page"},me=l("div",{class:"noise-background"},null,-1);function he(t,e){const o=se,a=re,n=b,s=ie;return m(),v(s,null,{default:i(()=>[l("div",fe,[l("div",pe,[_(o),l("main",null,[O(t.$slots,"default")])]),me,_(n,null,{default:i(()=>[_(a)]),_:1})])]),_:3})}const ke=g(de,[["render",he]]);export{ke as default};
