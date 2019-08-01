
const VueOnClickout = {
	install(Vue) {
		const event = "clickout";
		Vue.directive(event, {
			bind(el) {
				el.__clickoutFlag = false;
				el.__clickoutStop = false;
				el.addEventListener('click', () => el.__clickoutFlag = true);
				el.addEventListener(event, (e) => {
					if(e.cancelBubble) {
						let p = el;
						do {
							p = p.parentNode;
							p.__clickoutStop = true;
						} while(p != document.body);
					}
				})
				el.__clickoutHandler = () => {
					if(!el.__clickoutFlag && !el.__clickoutStop) el.dispatchEvent(new Event(event));
					el.__clickoutFlag = false;
					el.__clickoutStop = false;
				};
				document.addEventListener('click', el.__clickoutHandler);
			},
			unbind(el) {
				document.removeEventListener('click', el.__clickoutHandler);
			}
		});

		Vue.mixin({
			beforeCreate() {
				let original_c = this._c;
				function hack_c(a, b, c, d) {
					if(b && b.on && b.on[event]) {
						b.directives = b.directives || [];
						if(!b.directives.some(d => d.name == event))
							b.directives.push({ name: event, rawName: "v-" + event });
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