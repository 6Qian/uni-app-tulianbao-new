<template>
	<view class="content">
		<!-- <view class="tables">
			<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">待支付</view>
			<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">已完成</view>
			<view class="lis"  :class="{ active: isActive === 2 }"  @click="setActive(2)">已取消</view>
		</view> -->
		
		<view class="orderlist" v-if="list.length > 0">
			<!-- <view class="lis" @click="ToDetail()">
				<view class="ordernow"><view class="tt">订单号 164249845662644665</view><view class="tt wait">待支付</view></view>
				<view class="info">
					<view class="img"></view>
					<view class="text">
						<view class="ts">智能AI自动写小说，日更30万字，可签约各大网文平台，复制粘贴一键生成</view>
						<view class="tt">169金币</view>
					</view>
				</view>
				<view class="time">
					<view class="left">2024-11-07 03:03</view>
					<view class="right">
						<view class="rilis">取消订单</view>
						<view class="rilis">去支付</view>
					</view>
				</view>
			</view> -->
			
			
			<view class="lis" v-for="(item,index) in list">
				<view class="ordernow"><view class="tt">订单号 {{item.trade_no}}</view><view class="tt success">已完成</view></view>
				<view class="info">
					<view class="img">
						<image mode="aspectFill" :src="item.image"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.title}}</view>
						<view class="tt">{{item.price}}金币</view>
					</view>
				</view>
				<view class="time">
					<view class="left">{{ app.getDateDiff(item.create_time * 1000) }}</view>
				</view>
			</view>
			
			
		</view>

		
		<view class="no-data"  v-else>
			<view class="icon">
				<image src="../../static/norder.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无订单</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isActive: 0,
				list:{},
				page: 1,
			}
		},
		onLoad() {
	
		},
		onShow(){
			this.getList();
		},
		onReachBottom() {
			this.page++
			this.getList()
		},
		methods: {
			getList() {
				this.app.ajax({
					url: "/article/buyLog",
					data:{page:this.page},
					success:(res)=> {
						console.log(res)
						if(this.page == 1){
							this.list = res.data
						}else{
							this.list = this.list.concat(res.data)
						}
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				this.page = 1
				this.getList();
			},
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.tables{
		display: flex;
		justify-content: space-between;
		background: #fff;
		box-sizing: border-box;
		padding: 8rpx 4% 16rpx;
	}
	.tables .lis{
		padding: 0 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #999;
		position: relative;
		margin: 0 16rpx;
	}
	.tables .lis::before{
		content: '';
		width: 136rpx;
		height: 40rpx;
		background: url(../../static/tableactives.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 10rpx;
		left: 4rpx;
		display: none;
	}
	.tables .lis.active::before{
		display: block;
	}
	.tables .lis.active{
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.orderlist{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.orderlist .lis{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 32rpx;
	}
	.orderlist .lis .ordernow{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #999;
		display: flex;
		justify-content: space-between;
	}
	.orderlist .lis .ordernow .tt.wait{
		color: #FFA100;
	}
	.orderlist .lis .ordernow .tt.success{
		color: #00d312;
	}
	.orderlist .lis .ordernow .tt.cancel{
		color: #999;
	}
	.orderlist .lis  .info{
		width: 100%;
		height: 160rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 24rpx;
	}
	.orderlist .lis  .info .img{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
		background: #f5f5f5;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.orderlist .lis  .info .img image{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
	}
	.orderlist .lis  .info  .text{
		width: 100%;
		height: 160rpx;
	}
	.orderlist .lis  .info  .text .ts{
		line-height: 48rpx;
		font-size: 30rpx;
		max-height: 96rpx;
		overflow: hidden;
		font-weight: bold;
	}
	.orderlist .lis  .info  .text .tt{
		width: 100%;
		height: 40rpx;
		font-size: 30rpx;
		line-height: 32rpx;
		color: #EA282F;
		font-weight: bold;
		margin-top: 24rpx;
		
	}
	.orderlist .lis .time{
		width: 100%;
		height: 48rpx;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
	}
	.orderlist .lis .time .left{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
	}
	.orderlist .lis .time .right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.orderlist .lis .time .right .rilis{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 24rpx;
		padding: 0 24rpx;
		border-radius: 8rpx;
	}
	.orderlist .lis .time .right .rilis:nth-child(1){
		background: #eee;
		color: #999;
	}
	.orderlist .lis .time .right .rilis:nth-child(2){
		background: #f9285c;
		color: #fff;
	}
	
</style>