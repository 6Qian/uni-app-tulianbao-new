<template>
	<view class="content">
		


		<view class="status-bars"></view>
		<view v-if="isActive === 0">
			<dynamic-item ref="one" v-if="dynamic.length>0" :list="dynamic"></dynamic-item>
			<view v-else>
				<view class="no-data">
					<view class="icon">
						<image src="/static/nocre.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无数据</view>
				</view>
			</view>
		</view>
		<view v-if="isActive === 1">
			<dynamic-item ref="two" v-if="article.length>0" :list="article"></dynamic-item>
			<view v-else>
				<view class="no-data">
					<view class="icon">
						<image src="/static/nocre.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无数据</view>
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
				
				dynamic:[],
				article:[],
				page:[1,1],
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header headerws';
			} else {
				this.header_class = 'header';
			}
		},
		onLoad(e) {
			this.getList();
		},
		onReachBottom() {
			this.getList(true)
		},
		onPullDownRefresh() {
			this.page[this.isActive] = 1
			this.getList()
		},
		methods: {
			getList(a) {
				if(a === true){
					this.page[this.isActive]++;
				}
				this.app.ajax({
					url: "/dynamic/index",
					data:{page:this.page[this.isActive],user_id:(this.isActive == 0?0:-1)},
					success:(res)=> {
						let name = this.isActive == 1?'article':'dynamic';
						if(this.page[this.isActive] == 1){
							this[name] = res.data
						}else{
							this[name] = this[name].concat(res.data)
						}
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				if(!this.article.length && index == 1){
					this.getList()
				}
			},
			ToUserInfo(){
				uni.navigateTo({
					url:"/pages/discover/userinfo"
				})
			},
			ToDetail(){
				uni.navigateTo({
					url:"/pages/discover/detail"
				})
			},
			ToRelease(){
				uni.navigateTo({
					url:"/pages/discover/release"
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
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.headerws{
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tables{
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-radius: 64rpx;
		padding: 4rpx;
		box-sizing: border-box;
	}
	.tables .lis{
		padding: 0 24rpx;
		height: 52rpx;
		line-height: 52rpx;
		font-size: 28rpx;
		color: #111;
		border-radius: 52rpx;
	}
	.tables .lis.active{
		background: #f9285c;
		color: #fff;
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
	}
	.addpro .icon{
		width: 24rpx;
		height: 24rpx;
		background: url(../../static/redos.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #f9285c;
	}
	.status-bars{
		height: 96rpx;
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
	.tablessss{
		width: 50%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		text-align: center
	}
	.tsas{
		width: 320rpx;
		height: 64rpx;
		display: flex;
		justify-content: space-between;
	}
	.tsas .lis{
		width: 100%;
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	.tsas .lis .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #fff;
		opacity: 0.75;
		text-align: center;
	}
	.tsas .lis.active .tt{
		font-size: 30rpx;
		opacity: 1;
		font-weight: bold;
	}
	.tsas .lis.active .icon{
		width: 80rpx;
		height: 20rpx;
		background: url(../../static/avs.png) no-repeat;
		background-size: 100% 100%;
	}
</style>