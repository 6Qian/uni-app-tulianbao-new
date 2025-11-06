<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">创作</view>
			<view class="addpro"  @click="ToRelease()">
				<view class="icon"></view>
				<view class="tt">去发布</view>
			</view>
		</view>
		<view class="status-bars"></view>
		<article-item v-if="list.length>0" :list="list"></article-item>
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nocre.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无创作</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				list:[],
				page: 1,
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
		onShow(){
			this.getList();
		},
		onReachBottom() {
			this.page++
			this.getList()
		},
		onLoad() {
			
		},
		methods: {
			getList() {
				this.app.ajax({
					url: "/article/index",
					data:{page:this.page,user_id:this.app.getUserInfo().id},
					success:(res)=> {
						if(this.page == 1){
							this.list = res.data
						}else{
							this.list = this.list.concat(res.data)
						}
					},
				});
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
			ToRelease(){
				uni.navigateTo({
					url:"/pages/task/project_release"
				})
			}
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.header{
		background: #fff;
	}
	.headerws{
		background: #fff;
	}
	.header .return{
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro{
		height: 48rpx;
		background: #fff;
		padding: 0 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 24rpx;
		right: 4%;
		border-radius: 8rpx;
		border: 2rpx #f9285c solid;
		box-sizing: border-box;
	}
	.addpro .icon{
		width: 24rpx;
		height: 24rpx;
		background: url(../../static/adds.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #f9285c;
	}
	.project{
		width: 100%;
		background: #fff;
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
		background: #ccc;
		flex-shrink: 0;
		position: relative;
		flex-shrink: 0;
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
		background: #fff;
	}
	.project .list .lis .tag .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #fff;
		margin-left: 8rpx;
	}
</style>