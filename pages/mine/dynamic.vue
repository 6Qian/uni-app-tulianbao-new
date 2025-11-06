<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">动态</view>
			<view class="addpro"  @click="ToRelease()">
				<view class="icon"></view>
				<view class="tt">发布</view>
			</view>
		</view>
		<view class="status-bars"></view>
		<dynamic-item v-if="list.length>0" :list="list"></dynamic-item>
		<!-- <view class="latest" >
			<view class="list">
				
				<view class="lis">
					<view class="userinfo" @click="ToUserInfo()">
						<view class="avatar"></view>
						<view class="ts">Name</view>
						<view class="time">02-12 03:05</view>
						<view class="more" @click="morepopup = true"></view>
					</view>
					<view class="text">广告赞助:简简潮牌鞋服工厂 您的专属衣柜 六年老店!各大站长推荐，诚信经营!</view>
		
					<view class="lisdata">
						<view class="left">50.2万浏览</view>
						<view class="right">
							<view class="rrlis">
								<view class="icon"></view>
								<view class="tt">512</view>
							</view>
							<view class="rrlis">
								<view class="icon"></view>
								<view class="tt">26</view>
							</view>
						</view>
					</view>
					<view class="morepopup" v-if="morepopup">
						<view class="vlis">
							<view class="vicon"></view>
							<view class="vtt">编辑</view>
						</view>
						<view class="vlis">
							<view class="vicon"></view>
							<view class="vtt">删除</view>
						</view>
					</view>
				</view>
				
			</view>
		</view> -->

		
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nody.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无动态</view>
		</view>
		
		<view class="morepopupmusk" v-if="morepopup" @click="morepopup = false"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				morepopup:false,
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
				if(this.app.isLogin()){
					this.app.ajax({
						url: "/dynamic/index",
						data:{page:this.page,user_id:this.app.getUserInfo().id},
						success:(res)=> {
							if(this.page == 1){
								this.list = res.data
							}else{
								this.list = this.list.concat(res.data)
							}
						},
					});
				}
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
			ToRelease(){
				this.app.openUrl({url:'/pages/discover/release'})
				
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
	.latest{
		width: 100%;
	}
	.latest .list{
		width: 100%;
	}
	.latest .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		margin-bottom: 32rpx;
		background: #fff;
	}
	.latest .lis .userinfo{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.latest .lis .userinfo .avatar{
		width: 48rpx;
		height: 48rpx;
		background: #ccc;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}
	.latest .lis .userinfo .ts{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.latest .lis .userinfo .time{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 0;
		right: 48rpx;
	}
	.latest .lis .userinfo .more{
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/dymo.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 4rpx;
		right: 0;
	}
	.latest .lis .text{
		width: 100%;
		margin-top: 24rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		color: #333;
	}
	.imglist{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
	}
	.imglist .imglis{
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		background: #ccc;
		margin-right: 16.66rpx;
		flex-shrink: 0;
	}
	.imglist .imglis:last-child{
		margin-right: 0;
	}
	.lisdata{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		height: 40rpx;
	}
	.lisdata .left{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.lisdata  .right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.lisdata  .right .rrlis{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 24rpx;
	}
	.lisdata  .right .rrlis .icon{
		width: 32rpx;
		height: 32rpx;
	}
	.lisdata  .right .rrlis:nth-child(1) .icon{
		background: url(../../static/link.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis:nth-child(2) .icon{
		background: url(../../static/comment.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis.active:nth-child(1) .icon{
		background: url(../../static/linkactive.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis.active:nth-child(1) .tt{
		color: #f9285c;
		font-weight: bold;
	}
	.lisdata  .right .rrlis .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #666;
	}
	.comment{
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 24rpx;
	}
	.comment .colis{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.comment .colis .avatar{
		width: 40rpx;
		height: 40rpx;
		background: #ccc;
		border-radius: 40rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}
	.comment .colis  .name{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
		flex-shrink: 0;
	}
	.comment .colis  .tt{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 16rpx;
		overflow: hidden;
	}
	.morepopup{
		width: 160rpx;
		height: 128rpx;
		background: #333;
		position: absolute;
		box-sizing: border-box;
		top: 100rpx;
		right: 4%;
		border-radius: 8rpx;
		z-index: 138;
	}
	.morepopup .vlis{
		width: 100%;
		display: flex;
		justify-content: center;
		height: 64rpx;
		align-items: center;
	}
	.morepopup .vlis .vicon{
		width: 32rpx;
		height: 32rpx;
		margin-right: 16rpx;
	}
	.morepopup .vlis .vtt{
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		color: #fff;
	}
	.morepopup .vlis:nth-child(1) .vicon{
		background: url(../../static/nh1.png) no-repeat;
		background-size: 100% 100%;
	}
	.morepopup .vlis:nth-child(2) .vicon{
		background: url(../../static/nh2.png) no-repeat;
		background-size: 100% 100%;
	}
	.morepopupmusk{
		width: 100%;
		height: 100vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 128;
	}
	.latest .lis{
		position: relative;
	}
</style>