<template>
	<view class="content">
		<view class="top">
			<view class="icon"></view>
			<view class="ts" v-if="info.status">已回复</view>
			<view class="ts" v-else>未回复</view>
		</view>
		<view class="mose" v-if="info.super_content">
			<view class="title">处理结果</view>
			<view class="tt" v-html="info.super_content"></view>
		</view>
		<view class="mose">
			<view class="title">反馈内容</view>
			<view class="tt">{{info.content}}</view>
			<view class="imglist" v-if="info.images && info.images.length>0" v-for="(a,b) in info.images" :key="b">
				<view class="imglis">
					<image mode="aspectFill" :src="a"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			}
		},
		onLoad(a) {
			this.info = JSON.parse(a.info)
		},
		methods: {
			
		}
	}
</script>

<style>
	.top{
		width: 100%;
		padding: 128rpx 4%;
		box-sizing: border-box;
		background: #fff;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.top .icon{
		width: 128rpx;
		height: 128rpx;
		display: block;
		margin: 0 auto;
		background: url(../../static/kiosc.png) no-repeat;
		background-size: 100% 100%;
	}
	.top  .ts{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 24rpx;
	}
	.mose{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.mose .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.mose  .tt{
		margin-top: 16rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #999;
	}
	.imglist{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
	}
	.imglist .imglis{
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		background: #ccc;
		margin-right: 16.66rpx;
		flex-shrink: 0;
	}
	.imglist .imglis:last-child{
		margin-right: 0;
	}
</style>