<template>
	<view class="content">
		<view class="money">
			<view class="ts">{{info.score}}</view>
			<view class="tt">我的金币</view>
		</view>
		<view class="center">
			<!-- <view class="title">接收用户</view>
			
			<view class="selectuser" v-if="user.check" @click="giveaway = true">
				<view class="avatar">
					<image mode="aspectFill" :src="user.avatar"></image>
				</view>
				<view class="text">
					<view class="tts">{{user.username}}</view>
					<view class="ttt">{{user.mobile}}</view>
				</view>
			</view>
			<view class="selectuser" v-else @click="giveaway = true">
				<view class="avatar"></view>
				<view class="ts">请选择接收用户</view>
			</view> -->
			<view class="title">游戏账号</view>
			<view class="input">
				<input type="text" placeholder="请输入游戏账号" v-model="username">
				
			</view>
			<view class="title" style="margin-top: 30rpx;">兑换数量</view>
			<view class="input">
				<input type="number" placeholder="请输入数量" v-model="num">
				<view class="sedo" @click="num = info.score">全部</view>
			</view>
			<!-- <view class="tips">
				<view class="icon"></view>
				<view class="tt">为保证安全，我们会收取 <text>{{ (parseFloat(num?num:0) * parseFloat(info.rate) / 100).toFixed(2)}}</text> 手续费</view>
			</view> -->
			<view class="btn" @click="go">立即兑换</view>
			<!-- <view class="title" style="font-size: 28rpx;">为了您的积分安全，请谨慎兑换</view>
			<view class="guosc" v-html="info.desc"></view> -->
		</view>
		
		<view class="giveawaypopupmusk" v-if="giveaway" @click="giveaway = false"></view>
		<view class="giveawaypopupcenter" v-if="giveaway">
			<view class="pcts">选择用户</view>
			<view class="pctt">兑换后无法撤回，请谨慎操作!</view>
			<view class="pcinput">
				<input type="text" v-model="uid" placeholder="请输入你要兑换的用户ID">
				<view class="setn" @click="query">查询</view>
			</view>
			<view class="lis" v-if="user.id" @click="user.check = 1; giveaway = false">
				<view class="lls">{{user.username}}</view>
				<view class="rrs">{{user.mobile}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				giveaway:false,
				info:{},
				num:"",
				user:{},
				uid:'',
				username:''
			}
		},
		onShow(){
			this.init();
		},
		methods: {
			go(){
				if(!this.username){
					this.app.toast('请输入游戏账号');
					return;
				}
				if(!this.num){
					this.app.toast('请输入兑换数量');
					return;
				}
				this.app.confirm({
					content: "兑换结果不可逆，确认兑换吗？",
					confirmText: "确认",
					success:()=>{
						this.app.ajax({
							url: "/user/Convertgoldenbeans",
							data: { username: this.username,score:this.num },
							method: "post",
							success:(res)=> {
								if(res.code === 200){
									this.app.alert({
										content:res.message,
										success:()=>{
											this.num = '';
										}
									})
									this.init();
								}else{
									this.app.toast(res.message)
								}
							}
						});
					}
				})
			},
			init(){
				this.app.ajax({
					url: "/user/giveIndex",
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			query(){
				this.app.ajax({
					url: "/user/giveQuery",
					method:"post",
					load:true,
					data:{id:this.uid},
					success:(res)=> {
						if(res.code === 200){
							this.user = res.data
						}else{
							this.app.toast(res.message)
						}
					},
				});
			},
		},
	}
</script>

<style>
	.money{
		width: 100%;
		padding: 128rpx 4% 120rpx;
		box-sizing: border-box;
		/* background: url(../../static/mncd.png) no-repeat; */
		background: url(../../static/mncds.png) no-repeat;
		background-size: 100% 100%;
	}
	.money .ts{
		width: 100%;
		text-align: center;
		font-size: 44rpx;
		font-weight: bold;
		color: #fff;
	}
	.money .tt{
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		opacity: 0.75;
		margin-top: 16rpx;
	}
	.center{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		margin-top: -32rpx;
		position: relative;
		z-index: 69;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
	}
	.center .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.center .selectuser{
		width: 100%;
		padding: 24rpx ;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #F5F3F4;
		margin-top: 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 48rpx;
	}
	.center .selectuser .avatar{
		width: 80rpx;
		height: 80rpx;
		background: #ccc;
		border-radius: 80rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}
	.center .selectuser  .ts{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.center .input{
		width: 100%;
		height: 96rpx;
		margin-top: 32rpx;
		position: relative;
	}
	.center .input input{
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.center .input .sedo{
		height: 96rpx;
		line-height: 96rpx;
		font-size: 28rpx;
		font-weight: bold;
		position: absolute;
		bottom: 0;
		right: 0;
		color: #f9285c;
	}
	.uni-input-placeholder{
		font-size: 32rpx;
		color: #999;
	}
	.tips{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 48rpx;
	}
	.tips .icon{
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/sdf.png) no-repeat;
		background-size: 100% 100%;
		margin-right: 8rpx;
	}
	.tips  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
	}
	.tips  .tt text{
		margin: 0 8rpx;
		font-weight: bold;
		color: #f9285c;
	}
	.center .btn{
		width: 100%;
		height: 88rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		border-radius: 16rpx;
		background: #f9285c;
		margin: 48rpx 0 64rpx;
	}
	.guosc{
		width: 100%;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
	}
	.giveawaypopupmusk{
		width: 100%;
		height: 100vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 128;
		background: rgba(0, 0, 0, 0.5);
	}
	.giveawaypopupcenter{
		width: 100%;
		padding: 32rpx 4% 64rpx;
		box-sizing: border-box;
		border-radius: 32rpx 32rpx 0 0;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 138;
		background: #fff;
	}
	.giveawaypopupcenter .pcts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.giveawaypopupcenter .pctt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.giveawaypopupcenter  .pcinput{
		width: 100%;
		height: 88rpx;
		background: #f5f5f5;
		border-radius: 16rpx;
		margin-top: 32rpx;
		position: relative;
	}
	.giveawaypopupcenter  .pcinput input{
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	.pcinput .uni-input-placeholder{
		font-size: 28rpx;
		color: #999;
	}
	.pcinput .setn{
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		position: absolute;
		bottom: 0;
		right: 24rpx;
		color: #f9285c;
	}
	.giveawaypopupcenter .lis{
		width: 100%;
		height: 88rpx;
		border: 2rpx #f5f5f5 solid;
		border-radius: 16rpx;
		margin-top: 32rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 24rpx;
	}
	.giveawaypopupcenter .lis .lls{
		height: 84rpx;
		line-height: 84rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.giveawaypopupcenter .lis .rrs{
		height: 84rpx;
		line-height: 84rpx;
		font-size: 24rpx;
		color: #999;
	}
	.selectuser .text{
		width: 100%;
		height: 80rpx;
	}
	.selectuser .text .tts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	.selectuser .text .ttt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
</style>