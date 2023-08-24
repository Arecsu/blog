import{k as w,f as _,o as i,c as r,g as l,j as g}from"./entry.f0122258.js";const h=["innerHTML"],d=["src","alt"],$=["srcset","src","alt"],j=w({__name:"Emoji",props:{e:{},t:{default:"c"},i:{type:Boolean,default:!1},f:{default:"svg"}},async setup(u){let n,a;const t=u;let o,c;const e=`https://raw.githubusercontent.com/Arecsu/fluent-webmoji/main/assets/${[...t.e].map(s=>s.codePointAt(0).toString(16)).join("-")}`,f=t.t==="c"?`${e}/color-128x.webp`:`${e}/flat-128x.webp`,m=()=>t.t==="c"?`${e}/color.min.svg`:`${e}/flat.min.svg`,p=()=>t.t==="c"?`${e}/color-32x.webp 32w,
       ${e}/color-64x.webp 64w,
       ${e}/color-128x.webp 128w
       ${e}/color.min.svg 256w`:`${e}/flat-32x.webp 32w,
       ${e}/flat-64x.webp 64w,
       ${e}/flat-128x.webp 128w
       ${e}/flat.min.svg 256w`;return t.i===!0?(o=m(),c=([n,a]=_(()=>fetch(o).then(s=>s.text())),n=await n,a(),n)):(o=t.f==="svg"?m():p(),c=null),(s,x)=>t.i?(i(),r("span",{key:0,class:"emoji-inline-svg",innerHTML:l(c)},null,8,h)):t.f==="svg"?(i(),r("img",{key:1,class:"emoji-inline",width:"64",height:"64",src:l(o),alt:s.e},null,8,d)):t.f==="img"?(i(),r("img",{key:2,class:"emoji-inline",width:"64",height:"64",srcset:l(o),src:l(f),alt:s.e},null,8,$)):g("",!0)}});export{j as _};
