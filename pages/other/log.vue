<template>
	<view class="content">
		<view class="list" v-if="list.length>0">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="icon">
					<image src="/static/img/level_g.png" mode="aspectFill"></image>
				</view>
				<view class="text">
					<view class="ts">{{item.remark}}</view>
					<view class="tt">{{ app.getDateDiff(item.create_time * 1000) }}</view>
				</view>
				<view class="mow">{{item.type == 1?'+' : '-'}} {{item.score}}</view>
			</view>
		</view>
		<view v-else>
			<no-data ref="no-data"></no-data>
		</view>
		
		
		
	</view>
</template>


<script>
	export default {
		data() {
			return {
				list: [],
				page: 1,
				hasMore: true,
				hasLoading: false,
			}
		},
		onLoad() {
			
		},
		mounted(){
			this.getList();
		},
		onReachBottom(){
			this.getList();
		},
		methods: {
			getList(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/logs",
					data: {
						page: _this.page,
					},
					success(res){
						if(_this.page == 1){
							_this.list = res.data.lists;
						}else{
							_this.list = _this.list.concat(res.data.lists);
						}
						_this.page++;
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
	.list{
		width: 100%;
		background: #fff;
	}
	.list .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.list .lis .icon{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.list .lis .icon image{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
	}
	.list .lis .text{
		width: 100%;
		height: 80rpx;
	}
	.list .lis .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.list .lis .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.list .lis .mow{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		position: absolute;
		top: 32rpx;
		right: 4%;
	}
</style>