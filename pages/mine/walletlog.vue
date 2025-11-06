<template>
	<view class="content">
		<view class="tables" v-if="!modelsp">
			<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">获得</view>
			<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">消耗</view>
			<view class="lis"  :class="{ active: isActive === 2 }"  @click="setActive(2)">赠送</view>
		</view>
		<view style="width: 100%;height: 96rpx;" v-if="!modelsp"></view>
		
		<view class="loglist" v-if="list.length>0">
			
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="ts">
					<view class="lts">{{item.note}}</view>
					<view class="rts" v-if="item.type">+{{item.score}}</view>
					<view class="rts" v-else>-{{item.score}}</view>
				</view>
				<view class="tt">{{ app.getDateDiff(item.create_time * 1000) }}</view>
			</view>
		</view>
		
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nolog.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无明细</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isActive: 1,
				list:{},
				page: 1,
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
					url: "/score/log",
					data:{page:this.page,action:this.isActive},
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
				this.page = 1
				this.getList();
			},
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
	.loglist{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.loglist .lis{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #fff;
		margin-bottom: 32rpx;
	}
	.loglist .lis .ts{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		font-weight: bold;
	}
	.loglist .lis .tt{
		margin-top: 8rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
</style>