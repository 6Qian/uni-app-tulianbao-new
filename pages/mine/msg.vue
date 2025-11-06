<template>
	<view class="content">
		<view class="list" v-if="list.length>0">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="newmsg" v-if="is_notice && index == 0"></view>
				<view class="ts">{{item.title}}</view>
				<view class="tt" v-html="item.content"></view>
				<view class="hr"></view>
				<view class="time">{{ app.getDateDiff(item.create_time * 1000) }}</view>
			</view>
		</view>
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nodata.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无消息</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				list:{},
				is_notice:null,
			}
		},
		onShow() {
			this.init();
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/notice/list",
					success:(res)=> {
						this.list = res.data.list
						this.is_notice = res.data.is_notice
					},
				});
			},
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.list{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.list .lis{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 32rpx;
		position: relative;
	}
	.list .lis .newmsg{
		width: 12rpx;
		height: 12rpx;
		background: red;
		border-radius: 12rpx;
		position: absolute;
		top: 24rpx;
		right: 24rpx;
	}
	.list .lis .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
	}
	.list .lis .tt{
		width: 100%;
		height: auto;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		margin: 16rpx 0;
	}
	.list .lis .hr{
		width: 100%;
		height: 2rpx;
		background: #f5f5f5;
		margin-bottom: 16rpx;
	}
	.list .lis  .time{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #ccc;
	}
</style>