<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text"></view>
		</view>
		<view class="top">
			<view class="ts">忘记密码</view>
		</view>
		<view class="pwdlogin" >
			<view class="title">手机号</view>
			<input type="text" placeholder="请输入手机号" v-model="mobile">
			<view class="title">验证码</view>
			<view class="input">
				<input type="text" placeholder="请输入密码" v-model="code">
				<view class="send" @click="sendCode">{{ countDown ? countDown+'s' : '获取验证码'}}</view>
			</view>
			<view class="title">密码</view>
			<input type="text" placeholder="请输入密码" v-model="password">
			<view class="title">确认密码</view>
			<input type="text" placeholder="请再次输入密码"  v-model="password2">
		</view>
		
		<view class="login" @click="ToLogin()">确定</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				countDown: 0,
				countDownTimer: null,
				mobile:'',
				code:'',
				password:'',
				password2:'',
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
			sendCode() {
				if(this.countDown) return;
				this.app.ajax({
					url: "/sms/send",
					method: "post",
					data: {
						event: 'resetpwd',
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
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
			setActive(index) {
				this.isActive = index;
			},
			ToLogin(){
				if(!this.mobile) {
					this.app.toast('请输入手机号');
					return;
				}
				if(!this.password) {
					this.app.toast('请输入密码');
					return;
				}
				if(this.password !== this.password2){
					this.app.toast('两次密码不一致');
					return;
				}
				this.app.ajax({
					url: "/user/resetpwd",
					load:true,
					method:"post",
					data:{
						password:this.password,
						mobile:this.mobile,
						code:this.code,
					},
					success:(res)=>{
						if(res.code === 200){
							setTimeout(()=>{
								this.app.goBack(true);
							},1300)
						}
						this.app.toast(res.message)
					}
				})
			},
		}
	}
</script>


<style>
	page{
		overflow: hidden;
	}
	.top{
		width: 100%;
		padding: 192rpx 4% 16rpx;
		box-sizing: border-box;
		background: #fff;
	}
	.top .ts{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
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
		margin-top: 32rpx;
	}
	.pwdlogin .title:nth-child(1){
		margin-top: 0;
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
	.header .return{
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100% !important;
	}
</style>