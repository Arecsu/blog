import{u as g}from"./asyncData.27709ac1.js";import{k as h,l as d,f as $,o as c,c as a,g as l,j as v}from"./entry.0958df44.js";const b=["innerHTML"],x=["src","alt"],y=["srcset","src","alt"],A=h({__name:"Emoji",props:{e:{},t:{default:"c"},i:{type:Boolean,default:!1},f:{default:"svg"}},async setup(m){let n,r;const t=m;let s,i=d();const e=`https://raw.githubusercontent.com/Arecsu/fluent-webmoji/main/assets/${[...t.e].map(o=>o.codePointAt(0).toString(16)).join("-")}`,f=t.t==="c"?`${e}/color-128x.webp`:`${e}/flat-128x.webp`,u=()=>t.t==="c"?`${e}/color.min.svg`:`${e}/flat.min.svg`,p=()=>t.t==="c"?`${e}/color-32x.webp 32w,
       ${e}/color-64x.webp 64w,
       ${e}/color-128x.webp 128w
       ${e}/color.min.svg 256w`:`${e}/flat-32x.webp 32w,
       ${e}/flat-64x.webp 64w,
       ${e}/flat-128x.webp 128w
       ${e}/flat.min.svg 256w`;if(t.i===!0){s=u();const{data:o,error:w}=([n,r]=$(()=>g(s,()=>$fetch(s).then(_=>_.text()),"$etYTILK89l")),n=await n,r(),n);i.value=o.value}else s=t.f==="svg"?u():p();return(o,w)=>t.i?(c(),a("span",{key:0,class:"emoji-inline-svg",innerHTML:l(i)},null,8,b)):t.f==="svg"?(c(),a("img",{key:1,class:"emoji-inline",width:"64",height:"64",src:l(s),alt:o.e},null,8,x)):t.f==="img"?(c(),a("img",{key:2,class:"emoji-inline",width:"64",height:"64",srcset:l(s),src:l(f),alt:o.e},null,8,y)):v("",!0)}});export{A as _};
