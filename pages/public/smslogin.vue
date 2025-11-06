<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="app.goBack()"></view>
			<view class="text"></view>
		</view>
		
		<view class="logo"></view>
		<view class="sols">Hi~ 欢迎来途练宝</view>
		
		<view class="forms">
			<view class="input">
				<input type="text" placeholder="请输入手机号码" v-model="mobile" maxlength="11">
			</view>
			<view class="input">
				<input type="text" placeholder="请输入短信验证码" v-model="code" maxlength="6">
				<view class="code" @click="sendCode">{{ countDown ? countDown+'s' : '获取验证码'}}</view>
			</view>
		</view>
		
		<view class="loginbtn" @click="ToLogin()">立即登录</view>
		<view class="tips">登录即代表您同意 <text @tap="app.openUrl({ url: '/pages/webview/yhxy' })">《用户协议》</text>与<text
				@tap="app.openUrl({ url: '/pages/webview/ysxy' })">《隐私协议》</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 1,
				mobile: "",
				password: "",
				code: "",
				countDown: 0,
				countDownTimer: null,
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header headerws';
			} else {
				this.header_class = 'header';
			}
		},
		onLoad() {
			
		},
		methods: {
			ToLoginTips(){
				uni.showModal({
					title:"提示",
					content:"该登录方式未开启",
					confirmColor:"#9a72f3",
					showCancel: false,
				})
			},
			wechatLogin() {
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success: (event) => {
						const {
							code
						} = event
						this.app.ajax({
							url: "/user/wechatLogin",
							method: "post",
							data: {
								code: code,
							},
							success: (res) => {
								this.app.toast(res.message)
								if (res.code === 200) {
									this.app.loginSuccess(res.data);
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/home/index"
										})
									}, 1000);
								}
							},
						});
					},
				})
			},
			sendCode() {
				if (this.countDown) return;
				this.app.ajax({
					url: "/sms/send",
					method: "post",
					data: {
						event: 'login',
						mobile: this.mobile,
					},
					success: (res) => {
						this.app.toast(res.message)
						if (res.code === 200) {
							this.countDown = 60;
							this.countDownTimer = setInterval(() => {
								this.countDown--;
								if (this.countDown === 0) {
									clearInterval(this.countDownTimer);
								}
							}, 1000);
						}

					},
				});
			},
			setActive(index) {
				this.isActive = index;
			},
			ToReg() {
				uni.navigateTo({
					url: "/pages/public/reg"
				})
			},
			ToRetrieve() {
				uni.navigateTo({
					url: "/pages/public/retrieve"
				})
			},
			ToLogin() {
				this.app.ajax({
					url: "/user/" + (this.isActive == 0 ? 'login' : 'smsLogin'),
					method: "post",
					data: {
						mobile: this.mobile,
						password: this.password,
						code: this.code,
					},
					success: (res) => {
						this.app.toast(res.message)
						if (res.code === 200) {
							this.app.loginSuccess(res.data);
							setTimeout(() => {
								uni.switchTab({
									url: "/pages/home/index"
								})
							}, 1000);
						}
					},
				});
			}
		}
	}
</script>


<style>
	page {
		background: #9a72f3;
		padding: 160rpx 0;
		box-sizing: border-box;
	}

	.logo {
		width: 320rpx;
		height: 320rpx;
		background: url(../../static/newimg/logo.png) no-repeat;
		background-size: 100% 100%;
		display: block;
		margin: 0 auto;
	}

	.sols {
		width: 100%;
		text-align: center;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
		margin: 0rpx 0 88rpx;
	}

	.loginbtn {
		width: 88%;
		background: #fff;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 28rpx;
		color: #9a72f3;
		border-radius: 88rpx;
		margin-left: 6%;
	}

	.tips {
		width: 100%;
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #fff;
		margin-top: 32rpx;
	}

	.tips text {
		color: #ffd710;
		margin: 0 8rpx;
	}
	.forms{
		width: 88%;
		margin-left: 6%;
		margin-bottom: 64rpx;
	}
	.forms .input{
		width: 100%;
		height: 88rpx;
		background: #fff;
		border-radius: 8rpx;
		margin-bottom: 40rpx;
		position: relative;
	}
	.forms .input input{
		width: 100%;
		height: 88rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
		color: #333;
		font-weight: bold;
	}
	.uni-input-placeholder{
		font-weight: normal;
		font-size: 26rpx;
		color: #999;
	}
	.forms .input .code{
		height: 88rpx;
		line-height: 88rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		background: #ffd710;
		position: absolute;
		color: #333;
		top: 0;
		right: 0;
		border-radius: 0 8rpx 8rpx 0;
	}
</style>