<template>
	<view class="content">
		<view class="vos" v-if="!msg">
			<view class="icon yes"></view>
			<view class="ts">恭喜您！交易成功</view>
		</view>
		
		<view class="vos" v-else>
			<view class="icon no"></view>
			<view class="ts">{{msg}}</view>
		</view>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg:"",
			}
		},
		onLoad(e) {
			this.msg = e.msg
		},
		methods: {
			
		},
	}
</script>

<style>
	page {
		background: #fff;
	}

	.vos {
		width: 100%;
		padding: 128rpx 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.vos .icon {
		width: 128rpx;
		height: 128rpx;
		border-radius: 128rpx;
	}

	.vos .icon.yes {
		background: url(../../static/img/nkks1.png) no-repeat;
		background-size: 100% 100%;
	}
	.vos .icon.no {
		background: url(../../static/img/nkks2.png) no-repeat;
		background-size: 100% 100%;
	}

	.vos .ts {
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-top: 32rpx;
	}

	.kcs {
		width: 88%;
		background: #f5f5f5;
		margin: 0 6%;
		border-radius: 16rpx;
	}

	.kcs .lis:nth-child(1) {
		border-bottom: 2rpx #eee solid;
	}

	.kcs .lis {
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 88rpx;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.kcs .lis .left {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 24rpx;
		color: #999;
	}

	.kcs .lis .right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.kcs .lis .right .tt {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
	}

	.rights .tt {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.rights .tt .ttt {
		height: 88rpx;
		line-height: 88rpx;
	}

	.rights .tt .tticon {
		width: 100rpx;
		height: 40rpx;
		margin-left: 8rpx;
	}

	.kcs .lis .right .icon {
		width: 32rpx;
		height: 32rpx;
		border-radius: 32rpx;
		margin-left: 12rpx;
	}

	.footer {
		width: 100%;
		padding: 32rpx 4% 80rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		justify-content: space-between;
		border-radius: 32rpx 32rpx 0 0;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
	}

	.footer .ltbtn {
		background: linear-gradient(45deg, #303241, #696b76);
		width: 100%;
		height: 88rpx;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		font-size: 28rpx;
		border-radius: 88rpx;
	}

	.footer .rtbtn {
		width: 30%;
		height: 88rpx;
		line-height: 88rpx;
		background: #3662ec;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		border-radius: 88rpx;
		font-size: 24rpx;
	}
</style>