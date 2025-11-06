<template>
	<view class="content">
		<view class="tables">
			<view :class="'lis ' + (isActive == 1 ? 'active' : '')"  @click="setActive(1)">待审核</view>
			<view :class="'lis ' + (isActive == 2 ? 'active' : '')"  @click="setActive(2)">已完成</view>
			<view :class="'lis ' + (isActive == 3 ? 'active' : '')"  @click="setActive(3)">已拒绝</view>
			<view :class="'lis ' + (isActive == 0 ? 'active' : '')"  @click="setActive(0)">待完成</view>
		</view>
		<view style="width: 100%;height: 104rpx;"></view>
		<view class="task" v-if="list.length > 0">
			<view class="list">
				<view class="lis" @click="ToDetail(item)" v-for="(item,index) in list" :key="index">
					<view class="info">
						<view class="icon">
							<image :src="item.image"></image>
						</view>
						<view class="text">
							<view class="ts">{{item.name}} 
								<view class="remaining wait" v-if="item.status == 0">待完成</view>
								<view class="remaining " v-if="item.status == 1">待审核</view>
								<view class="remaining success" v-if="item.status == 2">已完成</view>
								<view class="remaining danger" v-if="item.status == 3">已拒绝</view>
								<!-- <view v-if="item.status_text">({{item.status_text}})</view> -->
							</view>
							<view class="tt">{{item.name}}-({{item.status_text}})</view>
						</view>
					</view>
					<view class="onts">
						<view class="lls">
							<image :src="item.avatar" mode="aspectFill"></image>
							<view class="nsj">{{item.username}}</view>
						</view>
						<view class="rrs">{{item.price}}金币</view>
					</view>
				</view>
				
			</view>
		</view>
		<view v-else>
			<view class="no-data">
				<view class="icon">
					<image src="/static/notimelog.png" mode="aspectFill"></image>
				</view>
				<view class="tt">暂无数据</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				list:[],
				page: 1,
				isActive: 1,
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
					url: "/task/myTaskLog",
					data:{page:this.page,status:this.isActive},
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
			ToDetail(item){
				uni.navigateTo({
					url:"/pages/task/review_details?id="+item.id
				})
			}
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.tables{
		width: 100%;
		display: flex;
		justify-content: space-between;
		background: #fff;
		box-sizing: border-box;
		padding: 8rpx 4% 16rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
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
		left: 4rpx;
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
	.task{
		width: 100%;
		box-sizing: border-box;
	}
	.task .list{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.task .list .lis{
		width: 100%;
		padding: 24rpx;
		background: #fff;
		border-radius: 16rpx;
		box-sizing: border-box;
		margin-bottom: 32rpx;
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
		background: #f5f5f5;
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
		font-size: 28rpx;
		color: #111;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}
	.task .list .lis .info .text .ts .remaining{
		color: #f9285c;
		font-size: 24rpx;
		font-weight: normal;
	}
	.task .list .lis .info .text .ts .remaining.wait{
		color: #FFA100;
	}
	.task .list .lis .info .text .ts .remaining.success{
		color: #999;
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
	.task .list .lis .onts{
		width: 100%;
		height: 48rpx;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		line-height: 48rpx;
	}
	.task .list .lis .onts .rrs{
		font-size: 32rpx;
		font-weight: bold;
		color: #f9285c;
	}
	.onts .lls{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.onts .lls image{
		width: 48rpx;
		height: 48rpx;
	}
	.onts .lls .nsj{
		margin-left: 16rpx;
		font-size: 24rpx;
		color: #333;
	}
</style>