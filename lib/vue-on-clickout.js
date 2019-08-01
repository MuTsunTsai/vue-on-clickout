/**
 * vue-on-clickout v1.0.4
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.VueOnClickout=t()}(this,function(){const e={install(e){const t="clickout";e.directive(t,{bind(e){e.__clickoutFlag=!1,e.__clickoutStop=!1,e.addEventListener("click",()=>e.__clickoutFlag=!0),e.addEventListener(t,t=>{if(t.cancelBubble){let t=e;do{(t=t.parentNode).__clickoutStop=!0}while(t!=document.body)}}),e.__clickoutHandler=()=>{e.__clickoutFlag||e.__clickoutStop||e.dispatchEvent(new Event(t)),e.__clickoutFlag=!1,e.__clickoutStop=!1},document.addEventListener("click",e.__clickoutHandler)},unbind(e){document.removeEventListener("click",e.__clickoutHandler)}}),e.mixin({beforeCreate(){let e=this._c;this._c=function(i,c,n,o){return c&&c.on&&c.on[t]&&(c.directives=c.directives||[],c.directives.some(e=>e.name==t)||c.directives.push({name:t,rawName:"v-"+t})),e(i,c,n,o)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});