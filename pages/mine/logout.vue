<template>
	<view class="content">
		<view class="top">
			<view class="ts">账号注销</view>
			<view class="tt">以下信息将被清空且无法找回</view>
		</view>
		<view class="boss">
			<view class="lis">
				<view class="icon"></view>
				<view class="tt">身份、帐号信息</view>
			</view>
			<view class="lis" v-if="!modelsp">
				<view class="icon"></view>
				<view class="tt">订单及金币信息</view>
			</view>
			<view class="lis">
				<view class="icon"></view>
				<view class="tt">个人隐私信息</view>
			</view>
			<view class="lis">
				<view class="icon"></view>
				<view class="tt">项目、动态信息</view>
			</view>
		</view>
		<view class="tips">注：请先确保所有交易已完成且无纠纷，帐号删除后历史交易产生的金币、权益等将视为自动放弃</view>
		<view class="btn" @click="clear">确认注销</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		methods:{
			clear(){
				this.app.confirm({
					content: "注销将不可恢复，真的要注销吗？",
					confirmText: "注销",
					success:()=>{
						this.app.ajax({
							url: "/user/clear",
							method: "post",
							success:(res)=> {
								this.app.toast(res.message)
								this.app.loginExit();
								uni.switchTab({
									url:"/pages/home/index"
								})
							}
						});
					}
				})
			},
		}
	}
</script>


<style>
	.top{
		width: 100%;
		padding: 96rpx 4% 48rpx;
		box-sizing: border-box;
	}
	.top .ts{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
	}
	.top .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
		text-align: center;
		margin-top: 16rpx;
	}
	.boss{
		width: 92%;
		padding: 24rpx 40rpx;
		box-sizing: border-box;
		background: #f5f5f5;
		border-radius: 16rpx;
		margin-left: 4%;
	}
	.boss .lis{
		width: 100%;
		height: 64rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.boss .lis .icon{
		width: 12rpx;
		height: 12rpx;
		background: #BBBBBB;
		border-radius: 12rpx;
		margin-right: 24rpx;
	}
	.boss .lis  .tt{
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		color: #666666;
	}
	.tips{
		width: 92%;
		line-height: 48rpx;
		font-size: 24rpx;
		margin: 32rpx 4%;
	}
	.btn{
		width: 92%;
		height: 88rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		border-radius: 16rpx;
		color: #fff;
		background: #f9285c;
		position: fixed;
		bottom: 64rpx;
		left: 4%;
	}
</style>