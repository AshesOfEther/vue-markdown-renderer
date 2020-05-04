import marked from "marked";

// TODO: Find a good way to deal with HTML. Problem there is that we have no good way of
// knowing which elements/components require closing tags, and therefore if we should
// look for one or not. Parsing it should be doable by calling Vue.compile() with just the
// tag(s) and then calling the returned render function, while having identifiers in the
// slot(s) which will then be replaced by the rendered Markdown they represent.

// Each property can be one of the following:
// - A string which is the name of an element or component.
// - A function that takes the token and the createElement function and returns the output
//   of calling createElement.
const componentMapping = {
	// Block
	code: textContainer("code"),
	heading: ({token, createElement, config}) => createElement(
		config.elements.headingPrefix + token.depth,
		processTokens(token.tokens, createElement, config)
	),
	hr: ({createElement}) => createElement(
		"div",
		{
			style: {
				borderTop: "3px solid black"
			}
		}
	),
	blockquote: "blockquote",
	list: ({token, createElement, config}) => createElement(
		token.ordered ? config.elements.orderedList : config.elements.unorderedList,
		token.items.map(item => createElement(
			config.elements.listElement,
			processTokens(item.tokens, createElement, config)
		))	
	),
	table: ({token, createElement, config, config: {elements}}) => createElement(
		// You win, React devs, JSX would be useful here.
		elements.table,
		[
			createElement(elements.tableHead,
				[createElement(elements.tableRow, token.tokens.header.map(
					cell => createElement(elements.tableHeadCell, processTokens(cell, createElement, config))
				))]
			),
			createElement(elements.tableBody, token.tokens.cells.map(
				row => createElement(elements.tableRow, row.map(
					cell => createElement(elements.tableCell, processTokens(cell, createElement, config))
				))
			))
		]
	),
	// We need to use the raw text, as it isn't sanitized for HTML. Using the sanitized
	// text would cause weirdness like "Y&#39;all" instead of "Y'all".
	text: ({token}) => token.raw,
	paragraph: "paragraph",
	// Inline
	escape: ({token}) => token.text,
	link: ({token, createElement, config}) => {
		// Allow the option to make it a router link instead.
		return token.href.startsWith(">")
			? createElement(
				config.elements.routerLink,
				{ props: {
					to: token.href.substring(1)
				}},
				processTokens(token.tokens, createElement, config)
			)
			: createElement(
				config.elements.link,
				{ attrs: {
					href: token.href
				}},
				processTokens(token.tokens, createElement, config)
			)
	},
	strong: "strong",
	image: ({token, createElement, config}) => createElement(
		config.elements.image,
		{
			attrs: {
				src: token.href
			}
		}
	),
	em: "emphasis",
	codespan: textContainer("code"),
	br: "lineBreak"
}

// Returns a mapping for when the Markdown token only contains text and not more
// subtokens. Takes a key of config.elements.
function textContainer(elementNameKey) {
	return ({token, createElement, config}) => createElement(
		config.elements[elementNameKey],
		token.text
	);
}

function processTokens(tokens, createElement, config) {
	if (tokens == null) {
		return [];
	}

	return tokens.map((token) => {
		const mapping = config.mappings[token.type] || componentMapping[token.type];

		// Act differently depending on the type of mapping.
		switch(typeof(mapping)) {
			case "function":
				// This mapping needs to do something out of the ordinary.
				return mapping({token, createElement, config, processTokens});
			case "string":
				// This should be the key of a value in config.elements.
				return createElement(
					config.elements[mapping],
					processTokens(token.tokens, createElement, config)
				);
			case "object":
				// This is a component.
				return createElement(mapping, token.tokens);
			default:
				// This is an invalid mapping or it doesn't exist, don't do anything.
				return null;
		}
	});
}

export default {
	name: "markdown-renderer",
	render(createElement) {
		// Process the tokens in a seperate method so it can be done recursively.
		return createElement(
			"div",
			processTokens(this.tokens, createElement, this.$mdConfig)
		);
	},
	props: {
		value: String
	},
	computed: {
		tokens() {
			return marked.lexer(this.value, this.$mdConfig);
		}
	}
}