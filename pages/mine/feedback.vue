<template>
	<view class="content">
		<view class="list" v-if="list.length>0">
			<view class="lis" v-for="(item,index) in list" :key="index" @click="ToDetail(item)">
				<view class="ts">
					<view class="tsl">{{item.content}}</view>
					<view class="tsr" v-if="item.status">已回复</view>
					<view class="tsr no" v-else>未回复</view>
				</view>
				<view class="imglist" v-if="item.images && item.images.length>0" v-for="(a,b) in item.images" :key="b">
					<view class="imglis">
						<image mode="aspectFill" :src="a"></image>
					</view>
				</view>
				<view class="tt"><text>{{ app.getDateDiff(item.create_time * 1000) }}</text> <text>查看详情</text></view>
			</view>
		</view>
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nofes.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无反馈</view>
		</view>
		<view class="footerbtn" @click="ToSubmitFeedback()">我要反馈</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
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
					url: "/work/feedlog",
					data:{page:this.page},
					success:(res)=> {
						if(this.page == 1){
							this.list = res.data
						}else{
							this.list = this.list.concat(res.data)
						}
					},
				});
			},
			ToDetail(item){
				uni.navigateTo({
					url:"/pages/mine/feedbackdetail?info="+JSON.stringify(item)
				})
			},
			ToSubmitFeedback(){
				uni.navigateTo({
					url:"/pages/mine/submitfeedback"
				})
			}
		}
	}
</script>

<style>
	.list{
		width: 100%;
	}
	.list .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.list .lis .ts{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
	}
	.list .lis .ts .tsl{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.list .lis .ts .tsr{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #333;
	}
	.list .lis .ts .tsr.no{
		color: #FFA100;
	}
	.list .lis .tt{
		width: 100%;
		margin-top: 16rpx;
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
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
	.footerbtn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		position: fixed;
		bottom: 64rpx;
		left: 4%;
		font-size: 30rpx;
		color: #fff;
		border-radius: 16rpx;
		background: #f9285c;
		text-align: center;
	}
</style>