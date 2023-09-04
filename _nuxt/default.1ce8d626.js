import{_ as k}from"./nuxt-link.0eaa2197.js";import F from"./Icon.4f500af0.js";import{B as $,h as _,G as B,a3 as H,a4 as A,l as x,a5 as I,A as E,n as V,R as N,a6 as T,a7 as j,o as h,c as p,a as l,b as c,a8 as D,w as f,j as L,a9 as b,d as g,p as O,e as R,k as z,u as P,m as U}from"./entry.8926bf81.js";import{_ as C}from"./_plugin-vue_export-helper.c27b6911.js";import"./config.f192c59f.js";const q=()=>$("color-mode").value;function w(t){return typeof t=="function"?t():_(t)}const G=()=>{};function J(...t){if(t.length!==1)return B(...t);const e=t[0];return typeof e=="function"?H(A(()=>({get:e,set:G}))):x(e)}function K(t,e){const n=I(y()),a=J(t),i=E({get(){var o;const r=a.value;let d=e!=null&&e.getIndexOf?e.getIndexOf(n.value,r):r.indexOf(n.value);return d<0&&(d=(o=e==null?void 0:e.fallbackIndex)!=null?o:0),d},set(o){s(o)}});function s(o){const r=a.value,d=r.length,Z=(o%d+d)%d,S=r[Z];return n.value=S,S}function v(o=1){return s(i.value+o)}function m(o=1){return v(o)}function u(o=1){return v(-o)}function y(){var o,r;return(r=w((o=e==null?void 0:e.initialValue)!=null?o:w(t)[0]))!=null?r:void 0}return V(a,()=>s(i.value)),{state:n,index:i,next:m,prev:u}}const Q={key:0,class:"button-no-style"},W={class:"colormode-placeholder-dark"},X={class:"colormode-placeholder-light"},Y={key:0},ee={key:1},te=`<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23FFB02E' d='M5.01 29.034h21.98c1.66 0 3.01-1.35 3.01-3.01v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6c0 1.67 1.35 3.01 3.01 3.01Z'/%3E%3Cpath fill='%2326EAFC' d='M28 17.034H4a2 2 0 0 0-2 2v2h27.99v-2c0-1.1-.89-2-1.99-2Z'/%3E%3Cpath fill='%237D4533' d='M24.25 6.974 7.12 24.104c-.2.2-.2.52 0 .72.2.2.52.2.72 0l17.13-17.13c.2-.2.2-.52 0-.72-.2-.2-.52-.2-.72 0Z'/%3E%3Cpath fill='%23F8312F' d='M22.82 24.944c.76.76 1.95.82 2.52.08 3.9-5.1 3.49-12.46-1.21-17.16-4.7-4.7-12.08-5.12-17.18-1.22-.74.56-.68 1.75.08 2.51l.76.76 11.18 3.08 3.08 11.18.77.77Z'/%3E%3Cpath fill='%23F4F4F4' d='M22.04 24.174c5.08-5.08 6-12.38 2.06-16.32-3.94-3.94-11.23-3.02-16.31 2.06l14.25 14.26Z'/%3E%3Cpath fill='%23F8312F' d='M18.47 20.594c5.08-5.08 7.6-10.79 5.63-12.75-1.97-1.96-7.67.56-12.75 5.64l7.12 7.11Z'/%3E%3C/svg%3E" alt="🏖️">`,ne=`<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%236D4534' d='M26.713 2a4.79 4.79 0 0 1-1.145 3.122A6.124 6.124 0 0 1 27 9.062c0 1.528-.307 2.727-.86 3.666.554 1.314.86 2.757.86 4.272a11 11 0 0 1-5.933 9.766l.12 1.234-5.228.53-5.15-.53.123-1.235A10.999 10.999 0 0 1 5 17c0-1.546.319-3.017.894-4.351-.524-.927-.814-2.102-.814-3.588 0-1.5.543-2.877 1.432-3.939A4.81 4.81 0 0 1 5.366 2h5.649c1.077 0 1.987.357 2.768 1h4.504c.78-.643 1.634-1 2.71-1h5.716Z'/%3E%3Cpath fill='%23FFDEA7' d='M7.84 14.596C9.78 15.74 12.573 16 15.67 16h.74c3.061 0 5.828-.253 7.765-1.366.295.858.455 1.779.455 2.736C24.63 22.064 20.77 28 16 28c-4.77 0-8.63-5.936-8.63-10.63 0-.97.165-1.904.47-2.774Z'/%3E%3Cpath fill='%23FF822D' d='M14.545 13h2.99a1.5 1.5 0 0 0-1.49-1.5c-.827 0-1.5.673-1.5 1.5ZM16 28c1.83 0 3.556-.447 5.074-1.238.47.737.783 1.582.895 2.49.05.41-.29.748-.704.748h-10.53c-.414 0-.755-.337-.704-.748a5.985 5.985 0 0 1 .897-2.488A10.953 10.953 0 0 0 16 28Z'/%3E%3Cpath fill='%231C1C1C' d='M14 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm12 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'/%3E%3Cpath fill='%23FCD53F' d='M13.748 9.514a3.305 3.305 0 1 1-6.61 0 3.305 3.305 0 0 1 6.61 0Zm11.093 0a3.305 3.305 0 1 1-6.61 0 3.305 3.305 0 0 1 6.61 0Z'/%3E%3Cpath fill='%23533566' d='M12.479 9.514a2.035 2.035 0 1 1-4.071 0 2.035 2.035 0 0 1 4.07 0Zm11.093 0a2.035 2.035 0 1 1-4.07 0 2.035 2.035 0 0 1 4.07 0Z'/%3E%3C/svg%3E" alt="🦉">`,ae=`<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23635994' d='M30 7.876v18.277A3.845 3.845 0 0 1 26.149 30H5.85A3.845 3.845 0 0 1 2 26.153V5.847A3.845 3.845 0 0 1 5.851 2h18.257c.93 0 1.82.37 2.48 1.02l2.392 2.378c.65.66 1.02 1.548 1.02 2.478Z'/%3E%3Cpath fill='%23E6E6E6' d='M6 18h20v12H6V18Z'/%3E%3Cpath fill='%23F8312F' d='M6 17.5A1.5 1.5 0 0 1 7.5 16h17a1.5 1.5 0 0 1 1.5 1.5V19H6v-1.5Z'/%3E%3Cpath fill='%23321B41' d='M24.116 2A3.53 3.53 0 0 1 26 2.551v8.7c0 .97-.79 1.75-1.75 1.75H7.75A1.747 1.747 0 0 1 6 11.25V2h18.116Z'/%3E%3Cpath fill='%23E6E6E6' d='M22.64 12H12.36c-.75 0-1.36-.61-1.36-1.36V3.27c0-.7.57-1.27 1.27-1.27H24v8.64c0 .75-.61 1.36-1.36 1.36Z'/%3E%3Cpath fill='%23321B41' d='M22.03 11h-2.06a.978.978 0 0 1-.97-.982V3.982c0-.54.436-.982.97-.982h2.06c.534 0 .97.441.97.982v6.046a.976.976 0 0 1-.97.972Z'/%3E%3C/svg%3E" alt="💾">`,oe={__name:"HeaderThemeSwitch",setup(t){const e=q(),n=x(!1),a=E(()=>{switch(e.preference){case"light":return{tooltip:`vitamina D ${te}`,icon:"light"};case"dark":return{tooltip:`oscuro ${ne}`,icon:"dark"}}return{tooltip:`igual que el sistema ${ae}`,icon:e.value}}),{state:i,next:s}=K(["dark","light","system"],{});return N(()=>{i.value=e.value,T(()=>e.preference=i.value),n.value=!0}),(v,m)=>{const u=F,y=j("tippy");return _(n)?D((h(),p("button",{key:1,class:"button-no-style",onClick:m[0]||(m[0]=o=>_(s)())},[c(b,{name:"slide-up"},{default:f(()=>[_(a).icon==="dark"?(h(),p("div",Y,[c(u,{name:"tabler:ghost-filled",size:"1.2em"})])):_(a).icon==="light"?(h(),p("div",ee,[c(u,{name:"ic:outline-lightbulb",size:"1.1em"})])):L("",!0)]),_:1})])),[[y,{content:`${_(a).tooltip}`,placement:"bottom-end",delay:[50,150],allowHTML:!0}]]):(h(),p("button",Q,[l("div",W,[c(u,{name:"tabler:ghost-filled",size:"1.2em"})]),l("div",X,[c(u,{name:"ic:outline-lightbulb",size:"1.1em"})])]))}}},le=C(oe,[["__scopeId","data-v-1f50794e"]]);const ie={},M=t=>(O("data-v-ea14e760"),t=t(),R(),t),se={class:"header-container"},ce=M(()=>l("span",{style:{"font-style":"italic"}},"/--",-1)),re={class:"header-right-side"},de=M(()=>l("span",{class:"header-arrow"},"↙",-1));function ue(t,e){const n=k,a=le;return h(),p("div",se,[l("header",null,[l("nav",null,[l("ul",null,[l("li",null,[c(n,{to:"/"},{default:f(()=>[ce,g("base")]),_:1})]),l("li",null,[c(n,{to:"/notas"},{default:f(()=>[g("notas")]),_:1})]),l("li",null,[c(n,{to:"/recetas"},{default:f(()=>[g("recetas")]),_:1})])])]),l("div",re,[c(a,{class:"dark-mode-button"}),de])])])}const _e=C(ie,[["render",ue],["__scopeId","data-v-ea14e760"]]),he=t=>Object.fromEntries(Object.entries(t).filter(([,e])=>e!==void 0)),pe=(t,e)=>(n,a)=>(P(()=>t({...he(n),...a.attrs},a)),()=>{var i,s;return e?(s=(i=a.slots).default)==null?void 0:s.call(i):null}),fe={accesskey:String,autocapitalize:String,autofocus:{type:Boolean,default:void 0},class:[String,Object,Array],contenteditable:{type:Boolean,default:void 0},contextmenu:String,dir:String,draggable:{type:Boolean,default:void 0},enterkeyhint:String,exportparts:String,hidden:{type:Boolean,default:void 0},id:String,inputmode:String,is:String,itemid:String,itemprop:String,itemref:String,itemscope:String,itemtype:String,lang:String,nonce:String,part:String,slot:String,spellcheck:{type:Boolean,default:void 0},style:String,tabindex:String,title:String,translate:String},me=z({name:"NoScript",inheritAttrs:!1,props:{...fe,title:String,body:Boolean,renderPriority:[String,Number]},setup:pe((t,{slots:e})=>{var i;const n={...t},a=(((i=e.default)==null?void 0:i.call(e))||[]).filter(({children:s})=>s).map(({children:s})=>s).join("");return a&&(n.children=a),{noscript:[n]}})});const ge={},ve={class:"global-container"},ye={class:"the-page"};function Ce(t,e){const n=_e,a=me;return h(),p("div",ve,[l("div",ye,[c(b,{name:"header"},{default:f(()=>[c(n)]),_:1}),c(a,null,{default:f(()=>[g(`
        <style>
          main {
            display: block !important;
          }
          .header-container {
            display: grid !important;
          }
          .dark-mode-button {
            display: none !important;
          }
        </style>
      `)]),_:1}),l("main",null,[U(t.$slots,"default")])])])}const Me=C(ge,[["render",Ce]]);export{Me as default};
