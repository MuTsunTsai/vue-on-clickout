/**
 * vue-on-clickout v1.0.1
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,i){"function"==typeof define&&define.amd?define([],i):"object"==typeof exports?module.exports=i():e.VueOnClickout=i()}(this,function(){const e={install(e){const i="clickout";e.directive(i,{bind(e){e.__clickoutFlag=!1,e.addEventListener("click",()=>e.__clickoutFlag=!0),e.__clickoutHandler=()=>{e.__clickoutFlag||e.dispatchEvent(new Event(i)),e.__clickoutFlag=!1},document.addEventListener("click",e.__clickoutHandler)},unbind(e){document.removeEventListener("click",e.__clickoutHandler)}}),e.mixin({beforeCreate(){let e=this._c;this._c=function(t,n,c,o){return n&&n.on&&n.on[i]&&(n.directives=n.directives||[],n.directives.some(e=>e.name==i)||n.directives.push({name:i,rawName:"v-"+i})),e(t,n,c,o)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});