# Changelog

## 0.2.7
- Fixed bug where formatting in certain places was not being applied.

## 0.2.6
- Fixed bug where email addresses were getting mangled by Marked, which doesn't work the way we render Markdown ([#2](https://github.com/TobiasSN/vue-markdown-renderer/issues/2)).

## 0.2.5
- It's now possible to pass tokenizer and renderer functions to Marked without overwriting the defaults.

## 0.2.4
- The value prop on the renderer component is now required.

## 0.2.3
- Fixed bug where Marked wasn't getting its config.

## 0.2.2
- Fixed bug where configuration was incorrectly merged with the default one.

## 0.2.1
- Fixed bug where config wasn't being properly merged with the default config.

## 0.2.0
- Mappings can now access the `processTokens` function.

## 0.1.1
- Fixed bug where certain characters are replaced with HTML escape codes.