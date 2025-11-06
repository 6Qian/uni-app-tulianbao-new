<template>
	<view class="content">
		<view class="title">{{info.title}}</view>
		<view class="time"><text>{{ app.getDateDiff(info.time * 1000) }} </text> <text>{{info.classify}} {{info.eye}}人浏览</text></view>
		<view class="center">
			<image v-if="!info.is_buy" :src="info.image" mode="widthFix"></image>
			<view v-if="info.is_buy && info.images && info.images.length > 0">
				<image v-for="(a,b) in info.images" :key="b" :src="a" mode="widthFix"></image>
			</view>
			<view class="tt" v-html="info.content"> </view>
			<view class="unlock" @click="buy"  v-if="!info.is_buy && !modelsp"><view class="utt">试看结束，完整内容请购买</view><view class="icon"></view><view class="itt">({{info.price}}金币)</view></view>
		</view>
		
		<article-item v-if="info.rand && info.rand.length>0" :list="info.rand"></article-item>
		
		
	</view>
</template>


<script>
	export default {
		data() {
			return {
				id:0,
				info:{},
			}
		},
		onLoad(e) {
			this.id = e.id
			this.init()
		},
		methods: {
			ToTaskDetail(item){
				uni.navigateTo({
					url:"/pages/task/task_detail?id="+item.id
				})
			},
			buy(){
				this.app.confirm({
					content: "需要扣除“"+this.info.price+"金币”，确认吗？",
					confirmText: "购买",
					success:()=>{
						this.app.ajax({
							url: "/article/buy",
							data: { id: this.id },
							method: "post",
							success:(res)=> {
								this.app.toast(res.message)
								if(res.code === 200){
									this.init()
								}
							}
						});
					}
				})
			},
			init() {
				this.app.ajax({
					url: "/article/detail",
					data:{id:this.id},
					success:(res)=> {
						this.info = res.data
					},
				});
			},
		}
	}
</script>

<style>
	page {
		background: #f5f5f5;
	}

	.title {
		width: 100%;
		padding: 16rpx 4% 8rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		line-height: 56rpx;
		font-weight: bold;
		overflow: hidden;
		background: #fff;
	}

	.time {
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		background: #fff;
	}

	.center {
		width: 100%;
		padding: 0 4% 32rpx;
		box-sizing: border-box;
		background: #fff;
		position: relative;
	}

	.center image {
		width: 100%;
		border-radius: 8rpx;
		margin-top: 32rpx;
	}

	.center .tt {
		width: 100%;
		margin-top: 32rpx;
		line-height: 48rpx;
		color: #999;
		font-size: 28rpx;
	}
	.unlock{
		width: 100%;
		height: 200rpx;
		background-image: linear-gradient(transparent, #fff, #fff, #fff);
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.unlock .utt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #111;
		font-weight: bold;
	}
	.unlock  .icon{
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/unlock.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 16rpx;
	}
	.unlock  .itt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #EA282F;
		margin-left: 8rpx;
	}
	.project{
		width: 100%;
		background: #fff;
		margin-top: 32rpx;
		padding: 0 4%;
		box-sizing: border-box;
	}
	.project .tab{
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.project .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: #F5F3F4;
		border-radius: 56rpx;
		font-size: 28rpx;
		color: #333;
	}
	.project .tab .lis.active{
		background: rgba(149, 102, 255, 0.1);
		color: rgba(149, 102, 255, 1);
	}
	.project .list{
		width: 100%;
	}
	.project .list .lis{
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.project .list .lis .text{
		width: 100%;
		height: 160rpx;
		margin-right: 24rpx;
	}
	.project .list .lis .text .ts{
		font-size: 28rpx;
		line-height: 48rpx;
		font-weight: bold;
		height: 96rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
	}
	.project .list .lis .text .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.project .list .lis .img{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
		flex-shrink: 0;
		position: relative;
		flex-shrink: 0;
	}
	.project .list .lis .img image{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
	}
	.project .list .lis .tag{
		height: 48rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 16rpx 0 16rpx 0;
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 24rpx;
	}
	.project .list .lis .tag .icon{
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0;
		background: url(../../static/hos11.png) no-repeat;
		background-size: 100% 100%;
	}
	.project .list .lis .tag .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #fff;
		margin-left: 8rpx;
	}
</style>