(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{279:function(e,t,r){var map={"./pizza.webp":280};function n(e){var t=c(e);return r(t)}function c(e){if(!r.o(map,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return map[e]}n.keys=function(){return Object.keys(map)},n.resolve=c,e.exports=n,n.id=279},280:function(e,t,r){e.exports=r.p+"img/pizza.fd5cf60.webp"},286:function(e,t,r){var content=r(292);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(29).default)("07ee1b77",content,!0,{sourceMap:!1})},291:function(e,t,r){"use strict";r(286)},292:function(e,t,r){var n=r(28)(!1);n.push([e.i,"article img{border-radius:.4em;width:100%}",""]),e.exports=n},310:function(e,t,r){"use strict";r.r(t);var n=r(8),c=(r(50),{asyncData:function(e){return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.$content,n=e.params,t.next=3,r("recipes",n.slug).fetch();case 3:return c=t.sent,t.abrupt("return",{recipe:c});case 5:case"end":return t.stop()}}),t)})))()},methods:{formatDate:function(e){return new Date(e).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"})}},head:function(){return{titleTemplate:this.recipe.title+" // %s"}}}),o=(r(291),r(22)),component=Object(o.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("article",{staticClass:"post-content"},[n("h1",[e._v(e._s(e.recipe.title))]),e._v(" "),n("img",{attrs:{src:r(279)("./"+e.recipe.cover),alt:""}}),e._v(" "),n("nuxt-content",{attrs:{document:e.recipe}})],1)}),[],!1,null,null,null);t.default=component.exports}}]);