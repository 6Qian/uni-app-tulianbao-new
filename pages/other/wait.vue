<template>
	<view class="content">
		<view class="wait">
			<image src="../../static/img/wait.png" mode="aspectFill"></image>
		</view>
		<view class="ts">等待对方确定中...</view>
	</view>
</template>

<script>
</script>

<style>
	.wait{
		width: 128rpx;
		height: 128rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f5f5f5;
		border-radius: 128rpx;
		margin: 128rpx  auto 0;
		border: 4rpx #eee solid;
	}
	.wait image{
		width: 80rpx;
		height: 80rpx;
		animation: spin 6s infinite linear; 
	}
	.ts{
		width: 100%;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		color: #999;
		margin-top: 48rpx;
	}
	@keyframes spin {
	      from {
	        transform: rotate(0deg); /* 起始角度为 0 度 */
	      }
	      to {
	        transform: rotate(360deg); /* 结束角度为 360 度 */
	      }
	    }
</style>