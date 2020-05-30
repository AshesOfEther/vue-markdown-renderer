# Vue Markdown Renderer

This is a customizable Vue component that parses Markdown and renders the output. It differs from just using a parser directly and binding the output to `v-html` in that the output is rendered like any other components which is faster and allows you to for example use `v-simple-table` instead of `table` for tables when using Vuetify.

**Note:** At the moment, HTML and [link reference definitions](https://spec.commonmark.org/0.29/#link-reference-definitions) are not supported. However, they may be in future versions.

## Usage

First install it:
```bash
npm install --save vue-markdown-renderer
# or
yarn add vue-markdown-renderer
```

Then, tell Vue to use it:
```js
import mdRenderer from "vue-markdown-renderer";

Vue.use(mdRenderer, {/* Configuration */});
````

Finally, use it in your template:
```html
<template>
	<div>
		...
		<markdown-renderer :value="text"></markdown-renderer>
		...
	</div>
</template>
<script>
export default {
	data() {
		return {
			text: "# _Hello, world!_"
		}
	}
}
```

## Reference

### Configuration

- `marked`: Will be passed to [`marked.use`](https://marked.js.org/#/USING_PRO.md#use). [More info here](https://marked.js.org/#/USING_ADVANCED.md#options). Note: Passing any renderer functions won't work, since this component uses its own renderer. Use the `mappings` option instead.
- `elements`: Names of elements and components to be used in the output. Can also take components directly by passing the object you get by importing them. Keys:
	- `code`
	- `headingPrefix`
	- `blockquote`
	- `orderedList`
	- `unorderedList`
	- `listElement`
	- `table`
	- `tableHead`
	- `tableHeadCell`
	- `tableBody`
	- `tableRow`
	- `tableCell`
	- `paragraph`
	- `link`
	- `routerLink`
	- `image`
	- `strong`
	- `emphasis`
	- `lineBreak`
- `mappings`: This is an object where the key is a type of token that Marked outputs and the value is one of the following:
	- A function, which will be called with an object that contains the following values:
		- `token`: The token that's being rendered. You can see what tokens look like [here](https://marked.js.org/demo/?outputType=lexer&text=**This%20is%20a%20bold%20piece%20of%20text%20that%20contains%20a%20%60code%20span%60**).
		- `createElement`: A function that, as the name implies, creates an element. [More info here](https://vuejs.org/v2/guide/render-function.html#createElement-Arguments).
		- `config`: The configuration, including default values for anything that you didn't set.
		- `processTokens`: If the token has subtokens `token.tokens`, this function should be called with them, `createElement` and `config`, and the return value should be passed as the last argument to `createElement`, like this:
		  ```js
		  ({token, createElement, config}) => createElement(
		  	config.elements.headingPrefix + token.depth,
		  	processTokens(token.tokens, createElement, config)
		  )
		  ```		
		The function should output either a string, which will be inserted as a plain piece of text, or the value returned from calling `createElement`.
	- A string, which is the name of an element or component.
	- A component, like when you import a `.vue` file.

### Component

The component is called `markdown-renderer` and takes a single prop, `value`, which should contain the Markdown that is to be rendered.

## License

This project is licensed under the Lesser General Public License version 3 or later. You can find the full license [here](LICENSE).