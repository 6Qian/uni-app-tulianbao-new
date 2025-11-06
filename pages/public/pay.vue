<template>
	<view class="wrapper chlid">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				src: '',
				order_id: '',
				settime:'',
				vip:false
			}
		},
		onLoad(e) {
			this.src = e.src
			this.order_id = e.id
			if(e.vip){
				this.vip = true;
			}
			this.searchOrderPay()
		},
		onUnload() {
			clearTimeout(this.settime)
		},
		methods: {
			// 查询支付结果
			searchOrderPay() {
				return
				this.app.ajax({
					url: "/payment/query",
					data:{order_id: this.order_id},
					method:"get",
					success:(res)=> {
						if(res.code === 200){
							this.app.toast("支付成功");
							if(this.vip){
								this.app.openUrl({url:"/pages/mine/vip"})
							}
						}else{
							this.settime = setTimeout(() => {
								this.searchOrderPay()
							}, 1500)
						}
					},
				});
			},
		}
	}
</script>
