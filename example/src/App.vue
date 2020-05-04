<template>
	<div id="app">
		<textarea v-model="text"></textarea>
		<markdown-renderer :value="text"></markdown-renderer>
	</div>
</template>

<script>
export default {
	name: "App",
	data() {
		return {
			text: ""
		}
	}
}
</script>

<style>
#app {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
