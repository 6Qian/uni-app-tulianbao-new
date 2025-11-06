<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				conf: {},
				form: '',
				url:''
			}
		},
		onLoad(o) {
			this.url = decodeURIComponent(o.url)
		},
		methods: {
			
		}
	}
</script>

<style>
</style>