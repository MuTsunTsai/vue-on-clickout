/**
 * vue-on-clickout v1.0.6
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,n){"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?module.exports=n():e.VueOnClickout=n()}(this,function(){const e={install(e){const n="clickout";let t=[];function i(e,n){return n.contains(e)?-1:e.contains(n)?1:0}e.directive(n,{bind(e){t.push(e),e.__clickoutFlag=!1;let i=e.addEventListener.bind(e);i("click",()=>e.__clickoutFlag=!0),i(n,n=>{n.cancelBubble&&t.forEach(n=>{n.contains(e)&&(n.__clickoutFlag=!0)})})},unbind(e){t.splice(t.indexOf(e),1)}}),document.addEventListener("click",()=>{t.sort(i);for(let e of t)e.__clickoutFlag||e.dispatchEvent(new Event(n)),e.__clickoutFlag=!1}),e.mixin({beforeCreate(){let e=this._c;this._c=function(t,i,c,o){return i&&i.on&&i.on[n]&&(i.directives=i.directives||[],i.directives.some(e=>e.name==n)||i.directives.push({name:n,rawName:"v-"+n})),e(t,i,c,o)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});