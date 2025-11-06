<template>
	<view class="main">
		<!-- <view class="describe1">
			<view>邀请徒弟奖励会员价的20%</view>
			<view>邀请徒孙奖励会员价的10%</view>
		</view>
		<view class="content">
			<view class="left">
				<view class="title">徒弟</view>
				<view class="scale">
					<text class="text">20</text>
					<text class="unit">%</text>
				</view>
			</view>
			<view class="right">
				<view class="title">徒孙</view>
				<view class="scale">
					<text class="text">10</text>
					<text class="unit">%</text>
				</view>
			</view>
		</view>
		<view class="describe">
			<view class="tt">
				奖励规则：邀请好友可以永久获得好友佣金提成和会员奖励。
			</view>
			<view class="tt">
				升级团队长条件：邀请2个有效用户可以升级为初级团队长。
			</view>
			<view class="tt">
				团队长特权：可享受一级20%任务奖励，二级10%任务奖励。
			</view>
		</view> -->
		<image src="/static/rule.jpg" mode="aspectFill" style="width:100%;height: 100%;"></image>
	</view>
</template>


<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
		},
		onLoad() {
			
		},
	}
</script>

<style lang="scss" scoped>
	page{
		overflow: hidden;
	}
	.main{
		width: 100%;
		height: 100vh;
		overflow: hidden;
		margin: 0;
		padding: 0;
		// background: url(/static/kkcs.png) no-repeat;
		// background: url(/static/rule.jpg) no-repeat;
		// background-size: 100% 100%;
		// background-size: cover;
	}
	.content{
		height: 540rpx;
		background: url(/static/kkcs.png) no-repeat;
		border-radius: 10px;
		margin: 20rpx 40rpx 40rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.left {
			width: 40%;
			height: 80%;
			background: url(/static/bag-open.png) no-repeat;
			background-size: 100% 100%;
			position: relative;
		}
		.right{
			width: 40%;
			height: 80%;
			background: url(/static/bag-open.png) no-repeat;
			background-size: 100% 100%;
			position: relative;
		}
		.title {
			font-size: 24rpx;
			text-align: center;
			height: 40rpx;
			line-height: 40rpx;
			width: 60%;
			margin: 0 auto;
			background: #ee8c30;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			color: #fff;
			font-weight: bold;
			letter-spacing: 2px;
		}
		.scale {
			position: absolute;
			top:35%;
			text-align: center;
			width: 100%;
			.text {
				font-size: 54rpx;
				font-weight: bold;
				color: #f00000;
			}
			.unit {
				font-size: 30rpx;
				color: #f00000;
				margin-left: 4rpx;
			}
		}
	}
	.describe{
		padding:40rpx 40rpx;
		line-height: 24px;
		color: #222;
		font-size: 28rpx;
	}
	.describe1 {
		padding:60rpx 40rpx 0;
		line-height: 24px;
		color: #222;
		font-size: 30rpx;
		font-weight: bold;
	}
</style>