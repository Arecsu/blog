import{u as _}from"./asyncData.b4147656.js";import{k as d,l as v,f as $,g as o,o as n,c as r,j as x}from"./entry.b536e625.js";const b=["src","alt"],y=["src","alt"],j=["srcset","src","alt"],B=d({__name:"Emoji",props:{e:{},t:{default:"c"},i:{type:Boolean,default:!1},f:{default:"svg"}},async setup(g){let c,i;const s=g;let l,a=v();const e=`https://raw.githubusercontent.com/Arecsu/fluent-webmoji/main/assets/${[...s.e].map(t=>t.codePointAt(0).toString(16)).join("-")}`,m=s.t==="c"?`${e}/color-128x.webp`:`${e}/flat-128x.webp`,p=()=>s.t==="c"?`${e}/color.min.svg`:`${e}/flat.min.svg`,u=()=>s.t==="c"?`${e}/color-32x.webp 32w,
       ${e}/color-64x.webp 64w,
       ${e}/color-128x.webp 128w
       ${e}/color.min.svg 256w`:`${e}/flat-32x.webp 32w,
       ${e}/flat-64x.webp 64w,
       ${e}/flat-128x.webp 128w
       ${e}/flat.min.svg 256w`,f=t=>t.replace("<svg",~t.indexOf("xmlns")?"<svg":'<svg xmlns="http://www.w3.org/2000/svg"').replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/{/g,"%7B").replace(/}/g,"%7D").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ");if(s.i===!0){l=p();const{data:t,error:w}=([c,i]=$(()=>_(l,()=>$fetch(l).then(h=>h.text()),"$etYTILK89l")),c=await c,i(),c);a.value=f(t.value)}else l=s.f==="svg"?p():u();return(t,w)=>s.i&&o(a)?(n(),r("img",{key:0,class:"emoji-inline",width:"64",height:"64",src:`data:image/svg+xml,${o(a)}`,alt:t.e},null,8,b)):s.f==="svg"?(n(),r("img",{key:1,class:"emoji-inline",width:"64",height:"64",src:o(l),alt:t.e},null,8,y)):s.f==="img"?(n(),r("img",{key:2,class:"emoji-inline",width:"64",height:"64",srcset:o(l),src:o(m),alt:t.e},null,8,j)):x("",!0)}});export{B as _};
