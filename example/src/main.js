import Vue from "vue";
import App from "./App.vue";

import mdRenderer from "../../lib/index";

Vue.config.productionTip = false;

Vue.use(mdRenderer, {
	
});

new Vue({
	render: h => h(App),
}).$mount("#app");
