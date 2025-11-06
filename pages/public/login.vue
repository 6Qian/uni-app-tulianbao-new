<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="app.goBack()"></view>
			<view class="text"></view>
		</view>
		<view class="top">
			<view class="ts">你好，</view>
			<view class="ts">欢迎使用途练宝</view>
		</view>
		<view class="table">
			<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">密码登录</view>
			<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">验证码登录</view>
		</view>
		<view class="pwdlogin" v-if="isActive === 0">
			<view class="title">手机号</view>
			<input type="text" placeholder="请输入手机号" v-model="mobile">
			<view class="title">密码</view>
			<input type="text" placeholder="请输入密码" v-model="password">
			<view class="more" >
				<view class="los" @click="ToReg()">注册</view>
				<view class="los" @click="ToRetrieve()">忘记密码</view>
			</view>
		</view>
		
		<view class="pwdlogin" v-if="isActive === 1">
			<view class="title">手机号</view>
			<input type="text" placeholder="请输入手机号" v-model="mobile">
			<view class="title">验证码</view>
			<view class="input">
				<input type="text" placeholder="请输入短信验证码" v-model="code">
				<view class="send" @click="sendCode">{{ countDown ? countDown+'s' : '获取验证码'}}</view>
			</view>
			<view class="more" >
				<view class="los" @click="ToReg()">注册</view>
				<view class="los" @click="ToRetrieve()">忘记密码</view>
			</view>
		</view>
		<view class="login" @click="ToLogin()">登陆</view>
		<view class="wxlogin" @click="wechatLogin" v-if="!modelsp"><view class="icon"></view><view class="tt">微信登陆</view></view>
		
		<view class="protocol">
			<view class="select active"><text></text></view>
			<view class="tt">我已阅读并同意<text @tap="app.openUrl({ url: '/pages/webview/yhxy' })">用户协议</text>和<text @tap="app.openUrl({ url: '/pages/webview/ysxy' })">隐私协议</text></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				mobile:"",
				password:"",
				code:"",
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
			wechatLogin(){
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success:(event)=> {
						const {
							code
						} = event
						this.app.ajax({
							url: "/user/wechatLogin",
							method: "post",
							data: {
								code: code,
							},
							success:(res)=> {
								this.app.toast(res.message)
								if(res.code === 200){
									this.app.loginSuccess(res.data);
									setTimeout(() => {
										uni.switchTab({
											url:"/pages/home/index"
										})
									},1000);
								}
							},
						});
					},
				})
			},
			sendCode() {
				if(this.countDown) return;
				this.app.ajax({
					url: "/sms/send",
					method: "post",
					data: {
						event: 'login',
						mobile: this.mobile,
					},
					success:(res)=> {
						this.app.toast(res.message)
						if(res.code === 200){
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
			ToReg(){
				uni.navigateTo({
					url:"/pages/public/reg"
				})
			},
			ToRetrieve(){
				uni.navigateTo({
					url:"/pages/public/retrieve"
				})
			},
			ToLogin(){
				this.app.ajax({
					url: "/user/"+(this.isActive==0?'login':'smsLogin'),
					method: "post",
					data: {
						mobile: this.mobile,
						password: this.password,
						code: this.code,
					},
					success:(res)=> {
						this.app.toast(res.message)
						if(res.code === 200){
							this.app.loginSuccess(res.data);
							setTimeout(() => {
								uni.switchTab({
									url:"/pages/home/index"
								})
							},1000);
						}
					},
				});
			}
		}
	}
</script>


<style>
	page{
		overflow: hidden;
	}
	.return{
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}
	.top{
		width: 100%;
		padding: 240rpx 4% 112rpx;
		box-sizing: border-box;
		background: #f9285c;
	}
	.top .ts{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}
	.table{
		width: 100%;
		height: 88rpx;
		/* background: linear-gradient(180deg, #ECE3FF 0%, #FFFFFF 83%); */
		background: #FFFFFF;
		border-radius: 32rpx 32rpx 0 0;
		display: flex;
		justify-content: space-between;
		margin-top: -32rpx;
	}
	.table .lis{
		width: 50%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #111;
		position: relative;
	}
	.table .lis.active{
		font-size: 32rpx;
		font-weight: bold;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		margin-top: -16rpx;
	}
	.table .lis::before{
		content: '';
		width: 216rpx;
		height: 64rpx;
		background: url(../../static/tableactives.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: 12rpx;
		left: 50%;
		margin-left: -108rpx;
		display: none;
	}
	.table .lis.active::before{
		display: block;
	}
	.pwdlogin{
		width: 100%;
		padding: 40rpx 4%;
		box-sizing: border-box;
	}
	.pwdlogin .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #111;
		margin-bottom: 16rpx;
	}
	.pwdlogin .title:nth-child(3){
		margin-top: 32rpx;
	}
	.pwdlogin .input{
		width: 100%;
		height: 80rpx;
		position: relative;
	}
	.pwdlogin input{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 2rpx #f5f5f5 solid;
		font-size: 28rpx;
		color: #ccc;
	}
	.pwdlogin  .send{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		color: #f9285c;
	}
	.uni-input-placeholder{
		font-size: 28rpx;
		color: #ccc;
	}
	.pwdlogin .more{
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 48rpx;
		margin-top: 16rpx;
	}
	.pwdlogin .more .los{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #f9285c;
	}
	.login{
		width: 92%;
		margin: 64rpx 4% 40rpx;
		height: 88rpx;
		border-radius: 16rpx;
		line-height: 88rpx;
		background: #f9285c;
		color: #fff;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
	}
	.wxlogin{
		width: 92%;
		margin: 0 4%;
		height: 88rpx;
		border-radius: 16rpx;
		background: linear-gradient(90deg, rgba(68, 220, 96, 0.2) 6%, rgba(40, 196, 69, 0.2) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wxlogin .icon{
		width: 48rpx;
		height: 48rpx;
		background: url(../../static/wxlogin.png) no-repeat;
		background-size: 100% 100%;
	}
	.wxlogin .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-weight: bold;
		margin-left: 24rpx;
		font-size: 32rpx;
		color: #28C445;
	}
	.protocol{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 50;
		left: 0;
		bottom: 64rpx;
	}
	.protocol .select{
		width: 28rpx;
		height: 28rpx;
		border: 2rpx #999 solid;
		border-radius: 28rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.protocol .select text{
		width: 16rpx;
		height: 16rpx;
		background: #f9285c;
		border-radius: 16rpx;
		display: block;
		display: none;
	}
	.protocol .select.active{
		border-color: #f9285c;
	}
	.protocol .select.active text{
		display: block;
	}
	.protocol .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 12rpx;
	}
	.protocol .tt text{
		color: #333;
	}
</style>