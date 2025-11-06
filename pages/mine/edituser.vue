<template>
	<view class="content">
		<view class="useravatar" @click="upload">
			<image :src="info.avatar" mode="aspectFill"></image>
			<view class="addicon"></view>
		</view>
		<view class="fosc">
			<view class="input">
				<view class="ts">昵称</view>
				<input type="text" v-model="info.username">
			</view>
			<view class="input">
				<view class="ts">联系</view>
				<input type="text" v-model="info.contact">
			</view>
			<view class="input">
				<view class="ts">简介</view>
				<input type="text" v-model="info.desc">
			</view>
		</view>
		<view class="btn" @click="update">保存修改</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				info:{},
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			update(){
				this.app.ajax({
					url: "/user/edit",
					method: "post",
					data: this.info,
					success:(res)=> {
						this.app.toast(res.message)
					},
				});
			},
			init(){
				this.app.ajax({
					url: "/user/profile",
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			upload(index){
				let _this = this;
				uni.hideKeyboard();
				uni.chooseImage({
				    count: 1, //默认9
					sizeType:"compressed",
				    success(res) {
						_this.app.uploadOss({
							load: true,
							filePath: res.tempFiles[0].path,
							success(res){
								_this.$forceUpdate();
								_this.info.avatar = res.data.url;
							}
						});
				    }
				});
			},
		}
	}
</script>


<style>
	page{
		background: #f5f5f5;
		overflow: hidden;
	}
	.useravatar{
		width: 168rpx;
		height: 168rpx;
		background: #fff;
		border-radius: 168rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		display: block;
		margin: 64rpx auto;
		position: relative;
	}
	.useravatar image{
		width: 160rpx;
		height: 160rpx;
		border-radius: 160rpx;
	}
	.useravatar .addicon{
		width: 56rpx;
		height: 56rpx;
		position: absolute;
		bottom: 8rpx;
		border-radius: 48rpx;
		right: 8rpx;
		background: url(../../static/unad.png) no-repeat;
		background-size: 100% 100%;
	}
	.fosc{
		width: 92%;
		margin: 0 4%;
		border-radius: 16rpx;
		background: #fff;
	}
	.fosc .input{
		width: 100%;
		height: 88rpx;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 32rpx;
		box-sizing: border-box;
	}
	.fosc .input .ts{
		width: 64rpx;
		flex-shrink: 0;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #333;
		margin-right: 32rpx;
	}
	.fosc .input input{
		width: 70%;
		height: 88rpx;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #333;
	}
	.fosc .input:last-child{
		border: none;
	}
	.btn{
		width: 92%;
		height: 88rpx;
		margin: 48rpx 4%;
		text-align: center;
		line-height: 88rpx;
		font-weight: bold;
		color: #fff;
		border-radius: 16rpx;
		background: #f9285c;
	}
</style>