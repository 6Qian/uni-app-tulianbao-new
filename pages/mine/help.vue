<template>
	<view class="content">
		<view class="helplist">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="qa">
					<view class="icon">Q</view>
					<view class="tt">{{item.title}}</view>
				</view>
				<view class="qa">
					<view class="icon">A</view>
					<view class="tt" v-html="item.content"></view>
				</view>
			</view>
			
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				list:[],
			}
		}, 
		onLoad() {
			this.init()
		},
		methods: {
			init(){
				this.app.ajax({
					url:"/index/help",
					method:"get",
					success:(res)=>{
						this.list = res.data
					},
				});
			},
		},
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.helplist{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		
	}
	.helplist .lis{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #fff;
		margin-bottom: 32rpx;
	}
	.helplist .lis .qa{
		width: 100%;
		position: relative;
		margin-bottom: 24rpx;
	}
	.helplist .lis .qa .icon{
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		position: absolute;
		top: 4rpx;
		left: 0;
		background: red;
		border-radius: 8rpx;
		color: #fff;
	}
	.helplist .lis .qa:last-child{
		margin-bottom: 0;
	}
	.helplist .lis .qa .tt{
		width: 100%;
		line-height: 48rpx;
		font-size: 28rpx;
		padding-left: 56rpx;
		box-sizing: border-box;
	}
	.helplist .lis .qa:nth-child(1) .tt{
		color: #333;
	}
	.helplist .lis .qa:nth-child(1) .icon{
		background: #f9285c;
	}
	.helplist .lis .qa:nth-child(2) .tt{
		color: #999;
	}
	.helplist .lis .qa:nth-child(2) .icon{
		background: #cd73f1;
	}
</style>