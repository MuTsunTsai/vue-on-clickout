/**
 * vue-on-clickout v1.0.5
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.VueOnClickout=t()}(this,function(){const e={install(e){const t="clickout";let i=[];e.directive(t,{bind(e){i.push(e),e.__clickoutFlag=!1;let c=e.addEventListener.bind(e);c("click",()=>e.__clickoutFlag=!0),c(t,t=>{t.cancelBubble&&e.dispatchEvent(new Event("clickoutstop",{bubbles:!0}))}),c("clickoutstop",()=>e.__clickoutFlag=!0)},unbind(e){i.splice(i.indexOf(e),1)}}),document.addEventListener("click",()=>{i.forEach(e=>(function(e){let t=e,i=0;for(;t!=document.body&&null!=t;)t=t.parentNode,i++;e.__clickoutDepth=i})(e)),i.sort((e,t)=>t.__clickoutDepth-e.__clickoutDepth);for(let e of i)e.__clickoutFlag||e.dispatchEvent(new Event(t)),e.__clickoutFlag=!1}),e.mixin({beforeCreate(){let e=this._c;this._c=function(i,c,n,o){return c&&c.on&&c.on[t]&&(c.directives=c.directives||[],c.directives.some(e=>e.name==t)||c.directives.push({name:t,rawName:"v-"+t})),e(i,c,n,o)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});