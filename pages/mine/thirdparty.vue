<template>
	<view class="content">
		<view class="list">
			<view class="lis" @click="bind">
				<view class="ts">微信绑定</view>
				<view class="right">
					<view class="tt">{{info.is_bind?"已绑定":"未绑定"}}</view>
					<view class="icon"></view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				info:{},
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/user/bindWechat",
					success:(res)=> {
						this.info=res.data
					},
				});
			},
			bind() {
				let that = this
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success(event) {
						const {
							code
						} = event
						this.app.ajax({
							url: "/user/bindWechat",
							method:"post",
							data:{code:code},
							load:true,
							success:(res)=> {
								this.init();
								this.app.toast(res.message)
							},
						});
					},
					fail() {
						this.app.toast('绑定失败')
					}
				})
			},
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
		overflow: hidden;
	}
	.list{
		width: 92%;
		margin: 32rpx 4%;
		border-radius: 16rpx;
		background: #fff;
	}
	.list .lis{
		width: 100%;
		padding: 24rpx 24rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.list .lis .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
	.list .lis:last-child{
		border: none;
	}
	.list .lis .right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.list .lis .right .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.list .lis .right .icon{
		width: 14rpx;
		height: 24rpx;
		background: url(../../static/iws.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 8rpx;
	}
	.logutbtn{
		width: 92%;
		margin: 32rpx 4%;
		height: 88rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 28rpx;
		background: #fff;
		color: #EA282F;
	}
</style>