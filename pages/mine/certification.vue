<template>
	<view class="content">
		<view class="tips">认证信息将用于途练宝平台服务，与账号唯一绑定，无法解除绑定。我们会对信息进行严格保密。</view>
		
		<view class="input">
			<view class="ts">证件类型</view>
			<view class="tt">居民身份证</view>
		</view>
		<view class="input">
			<view class="ts">证件类型</view>
			<input type="text" placeholder="请输入您的真实姓名" v-model="name">
		</view>
		<view class="input">
			<view class="ts">证件类型</view>
			<input type="text" placeholder="请输入您的身份证号码" v-model="card">
		</view>
		<view class="btn" @click="go" v-if="!this.is_real">提交</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				card: '',
				is_real:false,
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/user/idcard",
					method: "get",
					success:(res)=> {
						this.is_real = res.data.is_real
						if(this.is_real) {
							this.name = res.data.real_name
							this.card = '*****************';
						}
					}
				});
			},
			go(){
				this.app.ajax({
					url: "/user/idcard",
					load:true,
					data:{name:this.name,card:this.card},
					method: "post",
					success:(res)=> {
						this.app.toast(res.message)
						this.init()
					}
				});
			},
		}
	}
</script>

<style>
	.tips{
		width: 100%;
		padding: 24rpx 4%;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		box-sizing: border-box;
		background: #f5f5f5;
	}
	.input{
		width: 92%;
		margin: 32rpx 4%;
		height: 80rpx;
		border-radius: 16rpx;
		background: #f5f5f5;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	.input .ts{
		width: 144rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		flex-shrink: 0;
		color: #999;
	}
	.input .tt{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		color: #333;
	}
	.input input{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
	}
	.uni-input-placeholder{
		font-size: 26rpx;
		color: #999;
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
		margin: 64rpx 4% 0;
	}
</style>