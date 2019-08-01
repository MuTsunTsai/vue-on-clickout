;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.VueOnClickout = factory();
  }
}(this, function() {

const VueOnClickout = {
	install(Vue) {
		const cout = "clickout", stop = "clickoutstop";
		let clickoutList = [];
		Vue.directive(cout, {
			bind(el) {
				clickoutList.push(el);
				el.__clickoutFlag = false;
				let add = el.addEventListener.bind(el);
				add('click', () => el.__clickoutFlag = true);
				add(cout, (e) => {
					if(e.cancelBubble) el.dispatchEvent(new Event(stop, { bubbles: true }));
				});
				add(stop, () => el.__clickoutFlag = true);
			},
			unbind(el) {
				clickoutList.splice(clickoutList.indexOf(el), 1);
			}
		});

		function getDepth(el) {
			let p = el, dep = 0;
			while(p != document.body && p != null) {
				p = p.parentNode; dep++;
			}
			el.__clickoutDepth = dep;
		}

		document.addEventListener('click', () => {
			clickoutList.forEach(e => getDepth(e));
			clickoutList.sort((e1, e2) => e2.__clickoutDepth - e1.__clickoutDepth);
			for(let el of clickoutList) {
				if(!el.__clickoutFlag) el.dispatchEvent(new Event(cout));
				el.__clickoutFlag = false;
			}
		});

		Vue.mixin({
			beforeCreate() {
				let original_c = this._c;
				function hack_c(a, b, c, d) {
					if(b && b.on && b.on[cout]) {
						b.directives = b.directives || [];
						if(!b.directives.some(d => d.name == cout))
							b.directives.push({ name: cout, rawName: "v-" + cout });
					}
					return original_c(a, b, c, d);
				}
				this._c = hack_c;
			}
		})
	}
}

if(typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(VueOnClickout);
}
return VueOnClickout;
}));
