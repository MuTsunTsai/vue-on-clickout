/**
 * vue-on-clickout v1.0.7
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,n){"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?module.exports=n():e.VueOnClickout=n()}(this,function(){const e={install(e){const n="clickout";let i=[],t=!1;function c(e,n){return n.contains(e)?-1:e.contains(n)?1:0}e.directive(n,{bind(e){i.unshift(e),t=!0,e.__clicked=!1,e.addEventListener("click",()=>e.__clicked=!0),e.addEventListener(n,n=>{n.cancelBubble&&i.forEach(n=>{n.contains(e)&&(n.__clicked=!0)})})},unbind(e){i.splice(i.indexOf(e),1)}}),document.addEventListener("click",()=>{t&&(i.sort(c),t=!1);for(let e of i)e.__clicked||e.dispatchEvent(new Event(n)),e.__clicked=!1}),e.mixin({beforeCreate(){let e=this._c;this._c=function(i,t,c,d){return t&&t.on&&t.on[n]&&(t.directives=t.directives||[],t.directives.some(e=>e.name==n)||t.directives.push({name:n,rawName:"v-"+n})),e(i,t,c,d)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});