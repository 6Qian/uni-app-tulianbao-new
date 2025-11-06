<template>
	<web-view :src="conf._ucl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				conf: {},
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init(){
				// this.app.ajax({
				// 	url: "/config/get",
				// 	success:(res)=> {
				// 		this.conf = res.data
				// 	},
				// });
				this.app.ajax({
					url: "/work/customerfeed",
					success:(res)=> {
						console.log(res,'rrrrrrr')
						this.conf = res.data
					},
				});
				
			},
		}
	}
</script>

<style>
</style>