
const VueOnClickout = {
	install(Vue) {
		const cout = "clickout";
		let clickoutList = [];
		Vue.directive(cout, {
			bind(el) {
				clickoutList.push(el);
				el.__clickoutFlag = false;
				let add = el.addEventListener.bind(el);
				add('click', () => el.__clickoutFlag = true);
				add(cout, (e) => {
					if(e.cancelBubble) clickoutList.forEach(p => {
						if(p.contains(el)) p.__clickoutFlag = true;
					});
				});
			},
			unbind(el) {
				clickoutList.splice(clickoutList.indexOf(el), 1);
			}
		});

		function elSort(e1, e2) {
			if(e2.contains(e1)) return -1;
			if(e1.contains(e2)) return 1;
			return 0;
		}

		document.addEventListener('click', () => {
			clickoutList.sort(elSort);
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