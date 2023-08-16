import{_ as O}from"./nuxt-link.a9373bdd.js";import M from"./Icon.222302c6.js";import{A as N,g as d,C as R,a3 as z,a4 as B,B as v,a5 as L,z as $,l as P,a6 as q,a7 as D,a8 as C,o as h,c as g,b as u,w as m,i as T,j as E,a9 as I,R as x,a as l,d as y,Y as j,p as A,e as F,q as W,aa as X,k as Y}from"./entry.693d5503.js";import{_ as V}from"./_plugin-vue_export-helper.c27b6911.js";import"./config.ad191070.js";const G=()=>N("color-mode").value;function S(n){return typeof n=="function"?n():d(n)}const J=()=>{};function K(...n){if(n.length!==1)return R(...n);const e=n[0];return typeof e=="function"?z(B(()=>({get:e,set:J}))):v(e)}function Q(n,e){const o=L(k()),s=K(n),t=$({get(){var a;const _=s.value;let i=e!=null&&e.getIndexOf?e.getIndexOf(o.value,_):_.indexOf(o.value);return i<0&&(i=(a=e==null?void 0:e.fallbackIndex)!=null?a:0),i},set(a){c(a)}});function c(a){const _=s.value,i=_.length,H=(a%i+i)%i,w=_[H];return o.value=w,w}function r(a=1){return c(t.value+a)}function p(a=1){return r(a)}function f(a=1){return r(-a)}function k(){var a,_;return(_=S((a=e==null?void 0:e.initialValue)!=null?a:S(n)[0]))!=null?_:void 0}return P(s,()=>c(t.value)),{state:o,index:t,next:p,prev:f}}const U={__name:"HeaderThemeSwitch",setup(n){const e=G(),{state:o,next:s}=Q(["dark","light","system"],{initialValue:e.value});q(()=>e.preference=o.value);const t=$(()=>{switch(e.preference){case"light":return{tooltip:"vitamina D 🏖️",icon:"light"};case"dark":return{tooltip:"oscuroOooOo 🦉",icon:"dark"}}return{tooltip:"igual que el sistema 💿",icon:e.value}});return(c,r)=>{const p=M,f=D("tippy");return C((h(),g("button",{class:"button-no-style",onClick:r[0]||(r[0]=k=>d(s)())},[u(I,{name:"slide-up"},{default:m(()=>[d(t).icon==="dark"?(h(),T(p,{key:0,name:"tabler:ghost-filled",size:"1.2em"})):d(t).icon==="light"?(h(),T(p,{key:1,name:"ic:outline-lightbulb",size:"1.1em"})):E("",!0)]),_:1})])),[[f,{content:`${d(t).tooltip}`,placement:"bottom-start"}]])}}},Z=V(U,[["__scopeId","data-v-9af7878f"]]);const b=n=>(A("data-v-40f435eb"),n=n(),F(),n),ee=b(()=>l("div",{class:"noise-background"},null,-1)),te=b(()=>l("li",{class:"lines"}," //---- ",-1)),ne={class:"header-right-side"},ae=b(()=>l("span",{class:"header-arrow"},"↙",-1)),oe={__name:"Header",setup(n){const e=v(!1);return x(()=>{e.value=!0}),(o,s)=>{const t=O,c=Z;return h(),g("div",{class:j(["header-container",d(e)?"header-show":"header-hide"])},[ee,l("header",null,[l("nav",null,[l("ul",null,[te,l("li",null,[u(t,{to:"/notas"},{default:m(()=>[y("notas")]),_:1})]),l("li",null,[u(t,{to:"/recetas"},{default:m(()=>[y("recetas")]),_:1})]),l("li",null,[u(t,{to:"https://alejandro9r.xyz",target:"_blank"},{default:m(()=>[y("_hola!")]),_:1})])])]),l("div",ne,[u(c,{class:"dark-mode-button"}),ae])])],2)}}},se=V(oe,[["__scopeId","data-v-40f435eb"]]),le={__name:"MousePositionToVar",setup(n){const e=window.document.querySelector(":root"),o=s=>{const t=parseFloat(s.pageX/window.innerWidth*100);e.style.setProperty("--mouse-x",t+"%")};return x(()=>{window.addEventListener("mousemove",o)}),(s,t)=>null}},ce=le,re=W({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(n,{slots:e,attrs:o}){const s=v(!1);return x(()=>{s.value=!0}),t=>{var f;if(s.value)return(f=e.default)==null?void 0:f.call(e);const c=e.fallback||e.placeholder;if(c)return c();const r=t.fallback||t.placeholder||"",p=t.fallbackTag||t.placeholderTag||"span";return g(p,o,r)}}});const ue={class:"global-container"},_e={class:"the-page"},ie=l("div",{class:"noise-background"},null,-1),ve={__name:"default",setup(n){const e=v(!1);return x(()=>{e.value=!0}),(o,s)=>{const t=se,c=ce,r=re;return h(),g("div",ue,[l("div",_e,[u(t),u(I,{appear:"",name:"show-full-page"},{default:m(()=>[C(l("main",null,[Y(o.$slots,"default")],512),[[X,d(e)]])]),_:3})]),ie,u(r,null,{default:m(()=>[u(c)]),_:1})])}}};export{ve as default};
