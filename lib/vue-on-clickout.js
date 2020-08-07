/**
 * vue-on-clickout v1.1.0
 * (c) 2019 Mu-Tsun Tsai
 * Released under the MIT License.
 */

!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.VueOnClickout=t()}(this,function(){const e={install(e){const t="clickout";let n=[],i=[],o=!1;function c(e,t){return t.contains(e)?1:e.contains(t)?-1:0}function s(e){o&&(n.sort(c),o=!1);for(let o of n)o.contains(e.target)||i.some(e=>e.contains(o))||o.dispatchEvent(new Event(t));i=[]}e.directive(t,{bind(e){n.push(e),o=!0,e.addEventListener(t,t=>{t.cancelBubble&&i.push(e)})},unbind(e){n.splice(n.indexOf(e),1)}}),document.addEventListener("click",s);var r=Event.prototype.stopPropagation;Event.prototype.stopPropagation=function(){r.apply(this),"click"==this.type&&s(this)},e.mixin({beforeCreate(){let e=this._c;this._c=function(n,i,o,c){return i&&i.on&&i.on[t]&&(i.directives=i.directives||[],i.directives.some(e=>e.name==t)||i.directives.push({name:t,rawName:"v-"+t})),e(n,i,o,c)}}})}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});