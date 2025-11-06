<template>
	<view class="content">
		<textarea name="" id="" cols="30" rows="10" placeholder="请输入你要举报的理由" maxlength="1000"
			ref="reasonTextarea"></textarea>
		<view class="btn" @tap="handleReport">立即举报</view>
	</view>
</template>

<script>
	export default {
		methods: {
			handleReport() {

				// 显示带加载图标的提示
				const loading = uni.showLoading({
					title: '处理中...',
					mask: true // 防止重复点击
				});

				// 模拟异步处理（实际需替换为真实接口请求）
				setTimeout(() => {
					uni.hideLoading(); // 隐藏加载提示
					uni.showToast({
						title: '举报成功',
						icon: 'none',
						duration: 2000
					});

					// 可选：重置输入框
					this.$refs.reasonTextarea.value = '';
				}, 2000);
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		padding: 16rpx 4%;
		overflow: hidden;
		box-sizing: border-box;
	}

	textarea {
		width: 100%;
		font-size: 28rpx;
		line-height: 48rpx;
		overflow: scroll;
		height: 320rpx;
		background: #f5f5f5;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		background-image: linear-gradient(90deg, #9a72f3 0%, #da8ff7 100%);
		color: #fff;
		text-align: center;
		border-radius: 88rpx;
		margin-top: 64rpx;
		cursor: pointer;
		/* 添加点击手势提示 */
	}
</style>