<template>
	<view class="content">


		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text"></view>
		</view>
		<view class="top"></view>
		<view class="pot"></view>
		<view class="rankingslist">
			<view class="table">
				<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)" v-if="modelsp">知识日榜</view>
				<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)"  v-if="modelsp">知识月榜</view>
				<view class="lis"  :class="{ active: isActive === 2 }"  @click="setActive(2)" v-if="modelsp">知识年榜</view>
				<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)" v-if="!modelsp">热门项目</view>
				<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)" v-if="!modelsp">悬赏任务</view>
				<view class="lis"  :class="{ active: isActive === 2 }"  @click="setActive(2)" v-if="!modelsp">邀请奖励</view>
			</view>
			<view class="rlist" v-if="isActive === 0">
				<view class="lis" v-for="(item,index) in info.article" v-if="info.article && info.article.length>0">
					<view class="icon">{{index+1}}</view>
					<view class="avatar">
						<image mode="aspectFill" :src="item.image"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.title}}</view>
						<view class="tt">解锁{{item.count}}次</view>
					</view>
					<view class="money" >{{item.total_price}}金币</view>
				</view>
			</view>
			<view class="rlist" v-if="isActive === 1">
				<view class="lis" v-for="(item,index) in info.task" v-if="info.task && info.task.length>0">
					<view class="icon">{{index+1}}</view>
					<view class="avatar">
						<image mode="aspectFill" :src="item.image"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.name}}</view>
						<view class="tt" v-if="!modelsp">报名{{item.count}}次</view>
						<view class="tt">被查看了{{item.count}}次</view>
					</view>
					<view class="money" >{{item.total_price}}金币</view>
				</view>
			</view>
			<view class="rlist" v-if="isActive === 2">
				<view class="lis" v-for="(item,index) in info.user" v-if="info.user && info.user.length>0">
					<view class="icon">{{index+1}}</view>
					<view class="avatar">
						<image mode="aspectFill" :src="item.avatar"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.username}}</view>
						<view class="tt">邀请{{item.count}}人</view>
					</view>
					<view class="money" >{{item.total_price}}金币</view>
				</view>
			</view>
			
		</view>


	</view>
</template>
<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				info:{},
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight
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
			this.init();
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/index/rank",
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			},
			setActive(index) {
				this.isActive = index;
			}
		}
	}
</script>
<style>
	page {
		background: #f5f5f5;
	}
	.return{
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}
	.header .text{
		color: #fff;
	}
	.headerws{
		background: transparent;
		background-size: 100% ;
	}
	.top{
		width: 100%;
		height: 1013rpx;
		background: url(../../static/kfess.png) #f5f5f5 no-repeat;
		background-size: 100% 100%;
		position: fixed;
		top: 0;
		left: 0;
	}
	.pot{
		width: 100%;
		height: 550rpx;
	}
	.rankingslist{
		width: 92%;
		margin: 0 4%;
		background: #fff;
		position: relative;
		padding-bottom: 32rpx;
		z-index: 39;
		border-radius: 32rpx 32rpx 16rpx 16rpx;
	}
	.table{
		width: 100%;
		height: 88rpx;
		background: linear-gradient(180deg, #fecbd7 0%, #FFFFFF 83%);
		border-radius: 32rpx 32rpx 0 0;
		display: flex;
		justify-content: space-between;
	}
	.table .lis{
		width: 33.33%;
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
	.rankingslist .rlist{
		width: 100%;
	}
	.rankingslist .rlist .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.rankingslist .rlist .lis .icon{
		width: 74rpx;
		height: 47rpx;
		text-align: center;
		/* line-height: 44rpx; */
		font-size: 24rpx;
		color: #333;
		margin-right: 24rpx;
		flex-shrink: 0;
		font-weight: bold;
	}
	.rankingslist .rlist .lis:nth-child(1) .icon{
		background: url(../../static/rs1s.png) no-repeat;
		background-size: 100% 100%;
		color: #4B3606;
	}
	.rankingslist .rlist .lis:nth-child(2) .icon{
		background: url(../../static/rs2s.png) no-repeat;
		background-size: 100% 100%;
		color: #586066;
	}
	.rankingslist .rlist .lis:nth-child(3) .icon{
		background: url(../../static/rs3s.png) no-repeat;
		background-size: 100% 100%;
		color: #4B3606;
	}
	.rankingslist .rlist .lis .avatar{
		width: 80rpx;
		height: 80rpx;
		background: #ccc;
		border-radius: 80rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
		
	}
	.rankingslist .rlist .lis .text{
		width: 100%;
		height: 80rpx;
	}
	.rankingslist .rlist .lis .text .ts{
		width: 70%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
	}
	.rankingslist .rlist .lis .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.rankingslist .rlist .lis .money{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #f9285c;
		position: absolute;
		top: 32rpx;
		right: 4%;
	}
</style>