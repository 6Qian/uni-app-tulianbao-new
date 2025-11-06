<template>
	<view class="content">
		
		<view class="pwdlogin">
			<view class="title">真实姓名</view>
			<input type="text" placeholder="请输入真实姓名" v-model="alipay_name">
			<view class="title">支付宝账号</view>
			<input type="text" placeholder="请输入支付宝账号" v-model="alipay_account">
		</view>
		
		
		<view class="login" @click="sub()">提交</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				alipay_name:"",
				alipay_account:"",
			}
		},
		onLoad(o) {
			this.alipay_name = o.alipay_name || ''
			this.alipay_account = o.alipay_account || ''
		},
		methods: {
			sub(){
				if(!this.alipay_name.trim().length) return this.app.toast('请输入真实姓名');
				if(!this.alipay_account.trim().length) return this.app.toast('请输入支付宝账号');
				this.app.ajax({
					// url: "/user/edit",
					url: "/user/aliedit",
					method: "post",
					data: {
						alipay_name:this.alipay_name,
						alipay_account:this.alipay_account,
					},
					success:(res)=> {
						if(res.code==200){
							this.app.toast(res.message)
							setTimeout(()=>{
								uni.navigateBack()
							},1500)
						}else{
							this.app.toast(res.message)
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