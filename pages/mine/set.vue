<template>
	<view class="content">
		<view class="list">
			<view class="lis" @click="ToThirdParty()">
				<view class="ts">第三方绑定</view>
				<view class="right">
					<view class="tt"></view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="lis"  @click="ToBlacklist()">
				<view class="ts">拉黑用户</view>
				<view class="right">
					<view class="tt"></view>
					<view class="icon"></view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="lis"  @tap="app.openUrl({ url: '/pages/webview/yhxy' })">
				<view class="ts">用户协议</view>
				<view class="right">
					<view class="tt"></view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="lis" @tap="app.openUrl({ url: '/pages/webview/ysxy' })">
				<view class="ts">隐私协议</view>
				<view class="right">
					<view class="tt"></view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="lis">
				<view class="ts">版本号</view>
				<view class="right">
					<view class="tt">1.0.0</view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="lis" @click="ToLogout()">
				<view class="ts">账户注销</view>
				<view class="right">
					<view class="tt"></view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="lis">
				<view class="ts">备案号</view>
				<view class="right">
					<view class="tt">闽ICP备2023024027号-3A</view>
					<view class="icon"></view>
				</view>
			</view>
		</view>
		
		<view class="logutbtn" @click="logout">退出登陆</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
	
		},
		methods: {
			logout(){
				uni.showModal({
					title: '提示',
					content: "退出账号后，您将不可享受平台部分功能，确定退出吗？",
					success: (ccc) => {
						if (ccc.confirm) {
							this.app.loginExit();
							this.info = {}
						}
					}
				});
			},
			ToThirdParty(){
				uni.navigateTo({
					url:"/pages/mine/thirdparty"
				})
			},
			ToBlacklist(){
				uni.navigateTo({
					url:"/pages/mine/blacklist"
				})
			},
			ToProtocol(){
				uni.navigateTo({
					url:"/pages/webview/index"
				})
			},
			ToLogout(){
				uni.navigateTo({
					url:"/pages/mine/logout"
				})
			}
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