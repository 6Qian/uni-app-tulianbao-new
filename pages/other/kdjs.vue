<template>
	<view class="content">
		<view class="paymentlist">
			<view class="lis">
				<view class="ts">订单状态</view>
				<view class="ttt" v-if="row.status == 0">匹配中...</view>
				<view class="ttt" v-if="row.status == 1">交易中...</view>
				<view class="ttt" v-if="row.status == 2">已完成</view>
				<view class="ttt" v-if="row.status == 3">已取消</view>
			</view>
			<view class="lis">
				<view class="ts">交易时间</view>
				<view class="ttt">29:59</view>
			</view>
			<view class="lis">
				<view class="ts">付款用户</view>
				<view class="ttt">{{row.nickname}}</view>
			</view>
			<view class="lis">
				<view class="ts">付款方式</view>
				<view class="ttt" >
					<span style="margin-left: 20rpx;" v-for="(item,index) in row.pay_type">
						<span v-if="item == 'alipay'">支付宝 </span>
						<span v-if="item == 'wechat'">微信 </span>
						<span v-if="item == 'bank'">银行卡 </span>
					</span>
				</view>
			</view>
			<view class="lis">
				<view class="ts">订单时间</view>
				<view class="ttt" >{{row.time}}</view>
			</view>
			<view class="lis">
				<view class="ts">脉点数量</view>
				<view class="ttt">{{row.point_num}}</view>
			</view>
			<view class="lis">
				<view class="ts">订单金额</view>
				<view class="ttt">{{row.price}}</view>
			</view>
			
			<view class="lis">
				<view class="ts">付款时间</view>
				<view class="ttt">{{row.pay_status?row.pay_time:'等待付款中'}}</view>
			</view>
			<view class="lis" v-if="row.pay_status">
				<view class="ts">付款截图</view>
				<view class="ttt"></view>
			</view>
			<view class="lis" v-if="row.pay_status">
				<view class="imglist">
					<view class="img" v-for="(item,index) in row.pay_image">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 200rpx;"></view>
		<template v-if="row.status == 1">
			<view class="pobtn" v-if="!row.pay_status">等待付款中</view>
			<view class="pobtn" v-else @click="finish()">收到了立即放币</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0,
				row:{}
			};
		},
		onLoad(args){
			this.id = args.id
			this.init();
		},
		onShow(){
			this.init();
		},
		methods: {
			init(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/my_sell_order_info",
					method: "get",
					data: {
						id: _this.id
					},
					success(res){
						_this.row = res.data
					}
				});
			},
			finish(){
				uni.showModal({
					title: '提示',
					content: '确认吗？订单将会完成',
					success: (ccc) => {
						if (ccc.confirm) {
							let _this = this;
							_this.app.ajax({
								url: "/exchange/confirm_sell_order",
								load:true,
								method:"post",
								data:{
									id:_this.id,
								},
								success(res) {
									_this.app.toast(res.msg)
									if(res.code) {
										setTimeout(()=>{
											_this.ToState();
										},1000)
									}
								}
							});
						}
					}
				});
			},
			ToState(){
				uni.redirectTo({
					url:"/pages/index/success?msg="
				})
			}
		},
	};
</script>

<style>
	page{
		background: #fff;
	}
	.paymentlist {
		width: 100%;
		background: #fff;
	}

	.paymentlist .lis:last-child {
		border-bottom: none;
	}

	.paymentlist .lis {
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.paymentlist .lis .icon {
		width: 40rpx;
		height: 40rpx;
		background: #eee;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}

	.paymentlist .lis .ts {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.paymentlist .lis .ttt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 32rpx;
		right: 4%;
	}
	.imglist{
		width: 100%;
		height: 128rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.imglist .up{
		width: 128rpx;
		height: 128rpx;
		background: #fff;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		margin-right: 32rpx;
	}
	.imglist .up image{
		width: 128rpx;
		height: 128rpx;
	}
	.imglist  .img{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
	}
	.imglist  .img image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
	}
	.pobtn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		text-align: center;
		
		background: linear-gradient(45deg, #303241, #696b76);
		position: fixed;
		bottom: 80rpx;
		left: 4%;
		border-radius: 88rpx;
		font-weight: bold;
		color: #fff;
	}
	.bbbtn{
		width: 92%;
		position: fixed;
		bottom: 64rpx;
		left: 4%;
		border-radius: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 88rpx;
		background: #12121f;
		color: #fff;
	}
</style>