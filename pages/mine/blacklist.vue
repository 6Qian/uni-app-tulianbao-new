<template>
	<view class="content">
		<view class="userlist" v-if="list.length>0">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="avatar">
					<image mode="widthFix" :src="item.avatar"></image>
				</view>
				<view class="text">
					<view class="ts">{{item.username}}</view>
					<view class="tt"><text>动态 {{item.dynamic_count}}</text><text>创作 {{item.article_count}}</text></view>
				</view>
				<view class="btns" @click="bued(item,index)">解除拉黑</view>
			</view>
		</view>
		
		<view class="no-data" v-else>
			<view class="icon">
				<image src="../../static/nobalck.png" mode="aspectFill"></image>
			</view>
			<view class="tt">暂无拉黑用户</view>
		</view>
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
			bued(item,index){
				this.app.ajax({
					url: "/user/unblack",
					data: { id: item.id },
					method: "post",
					success:(res)=> {
						this.app.toast(res.message)
						if(res.code === 200){
							this.list = this.list.filter(a => a.id !== item.id);
						}
					}
				});
			},
			getList() {
				this.app.ajax({
					url: "/user/blacklog",
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
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.userlist{
		width: 100%;
		background: #fff;
	}
	.userlist .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		position: relative;
	}
	.userlist .lis .avatar{
		width: 84rpx;
		height: 84rpx;
		background: #ccc;
		border-radius: 88rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.userlist .lis .text{
		width: 100%;
		height: 84rpx;
	}
	.userlist .lis .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.userlist .lis .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 4rpx;
	}
	.userlist .lis .text .tt text{
		margin-right: 16rpx;
	}
	.userlist .lis  .btns{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 24rpx;
		border-radius: 8rpx;
		background: #eee;
		color: #999;
		
		position: absolute;
		top: 46rpx;
		right: 4%;
		font-size: 24rpx;
	}
	.userlist .lis  .btns.acs{
		background: #f9285c;
		color: #fff;
	}
	.userlist .lis:last-child{
		border: none;
	}
</style>