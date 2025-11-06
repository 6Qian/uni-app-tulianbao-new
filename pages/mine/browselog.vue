<template>
	<view class="content">
		
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">浏览记录</view>
			<view class="addpro"  @click="clear()">
				<view class="icon"></view>
				<view class="tt">清空</view>
			</view>
		</view>
		<view class="status-bars"></view>
		
		<view class="tables" v-if="!modelsp">
			<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">项目</view>
			<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">任务</view>
			<view class="lis"  :class="{ active: isActive === 2 }"  @click="setActive(2)">动态</view>
		</view>
		<view style="width: 100%;height: 108rpx;background: #fff;" v-if="!modelsp"></view>
		
		<view v-if="list.length>0">
			<article-item v-if="isActive == 0" :list="list"></article-item>
			<view class="task" v-if="isActive === 1">
				<view class="list" v-for="(item,index) in list" :key="index">
					<view class="lis" @click="ToTaskDetail(item)">
						<view class="info">
							<view class="icon">
								<image :src="item.image" mode="aspectFill"></image>
							</view>
							<view class="text">
								<view class="ts">{{item.name}} <view class="remaining">剩余{{item.row}}</view></view>
								<view class="tt">{{item.desc}}</view>
							</view>
						</view>
						<view class="classfly">任务分类: {{item.classify}} <view class="money">+{{item.price}}金币</view></view>
					</view>
				</view>
			</view>
			<dynamic-item :list="list" :touser="false" v-if="isActive == 2"></dynamic-item>
		</view>
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/notimelog.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无浏览记录</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				source:['article','task','dynamic'],
				list:[],
				page: 1,
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
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
			clear(){
				this.app.confirm({
					content: "清空将不可恢复，真的要清空吗？",
					confirmText: "清空",
					success:()=>{
						this.app.ajax({
							url: "/user/clearlog",
							load:true,
							method: "post",
							success:(res)=> {
								this.app.toast(res.message)
								this.page == 1;
								this.getList()
							}
						});
					}
				})
			},
			getList() {
				this.app.ajax({
					url: "/user/log",
					data:{page:this.page,source:this.source[this.isActive]},
					success:(res)=> {
						if(this.page == 1){
							this.list = res.data
						}else{
							this.list = this.list.concat(res.data)
						}
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				this.page = 1;
				this.getList()
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
			ToDetail(){
				this.app.openUrl({url:'/pages/mine/orderdetail'})
				
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
	.header .return{
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100%;
	}
	.headerws{
		background: #fff;
	}
	.addpro{
		height: 48rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 24rpx;
		right: 4%;
		border-radius: 8rpx;
		box-sizing: border-box;
	}
	.addpro .icon{
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/cjs.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #333;
	}
	.tables{
		width: 100%;
		display: flex;
		justify-content: space-between;
		background: #fff;
		box-sizing: border-box;
		padding: 8rpx 4% 16rpx;
		position: fixed;
		top: 176rpx;
		left: 0;
	}
	.tables .lis{
		padding: 0 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #999;
		position: relative;
		margin: 0 16rpx;
	}
	.tables .lis::before{
		content: '';
		width: 136rpx;
		height: 40rpx;
		background: url(../../static/tableactives.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 10rpx;
		left: -12rpx;
		display: none;
	}
	.tables .lis.active::before{
		display: block;
	}
	.tables .lis.active{
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.project{
		width: 100%;
		background: #fff;
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
		padding: 32rpx 4%;
		box-sizing: border-box;
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
	.project .time{
		width: 100%;
		background: #f5f5f5;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0 4%;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #999;
	}
	
	
	.task{
		width: 100%;
		background: #fff;
		box-sizing: border-box;
	}
	.task .tab{
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.task .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: #F5F3F4;
		border-radius: 56rpx;
		font-size: 28rpx;
		color: #333;
	}
	.task .tab .lis.active{
		background: rgba(149, 102, 255, 0.1);
		color: rgba(149, 102, 255, 1);
	}
	.task .list{
		width: 100%;
	}
	.task .list .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.task .list .lis .info{
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.task .list .lis .info .icon{
		width: 128rpx;
		height: 128rpx;
		background: #ccc;
		flex-shrink: 0;
		border-radius: 16rpx;
		margin-right: 24rpx;
	}
	.task .list .lis .info .icon image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
	}
	.task .list .lis .info .text{
		width: 100%;
		height: 128rpx;
	}
	.task .list .lis .info .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #111;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}
	.task .list .lis .info .text .ts .remaining{
		color: #f9285c;
	}
	.task .list .lis .info .text  .tt{
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.task .list .lis  .classfly{
		width: 100%;
		margin-top: 24rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background: #F5F3F4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: relative;
		font-size: 28rpx;
		color: #333;
	}
	.task .list .lis  .classfly .money{
		height: 64rpx;
		line-height: 64rpx;
		background: #f9285c;
		color: #fff;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 0 16rpx 16rpx 0;
		padding: 0 16rpx;
		font-size: 28rpx;
	}
	.task .time{
		width: 100%;
		background: #f5f5f5;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0 4%;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #999;
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
	.latest .times{
		width: 100%;
		background: #f5f5f5;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0 4%;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #999;
	}
</style>