import marked from "marked";

import defaultConfig from "../src/defaultConfig";
import MarkdownRenderer from "../src/MarkdownRenderer";

export default {
	install(Vue, config) {
		// Only load the component when it will actually be used.
		Vue.component("markdown-renderer", MarkdownRenderer);

		// Merge the default config with the one provided and store it.
		Vue.prototype.$mdConfig = mergeObjects(defaultConfig, config);

		// Give the Marked config to Marked.
		marked.use(Vue.prototype.$mdConfig.marked);
	}
}

// Goes through a and replaces any property with the value in b if it has one with the same key.
function mergeObjects(a, b) {
	const out = {};
	new Set([...Object.keys(a), ...Object.keys(b)]).forEach((key) => {
		if (b.hasOwnProperty(key)) {
			if (typeof(a[key]) == "object" && typeof(b[key]) == "object") {
				out[key] = mergeObjects(a[key], b[key]);
			} else {
				out[key] = b[key];
			}
		} else {
			out[key] = a[key];
		}
	});
	return out;
}