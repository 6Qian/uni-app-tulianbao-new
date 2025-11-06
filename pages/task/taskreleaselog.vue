<template>
	<view class="content">

		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">发布记录</view>
			<view class="addpro" @click="ToRelease()">
				<view class="icon"></view>
				<view class="tt">发布</view>
			</view>
		</view>
		<view class="status-bars"></view>

		<view class="tables">
			<view class="lis" :class="{ active: isActive === 0 }" @click="setActive(0)">全部</view>
			<view class="lis" :class="{ active: isActive === 1 }" @click="setActive(1)">未结束</view>
			<view class="lis" :class="{ active: isActive === 2 }" @click="setActive(2)">已结束</view>
		</view>
		<view style="width: 100%;height: 108rpx;background: #fff;"></view>

		<view class="task" v-if="list.length > 0">
			<view class="list">
				<view class="lis" v-for="(item,index) in list" :key="index">
					<view class="info" @click="ToTaskDetail(item)">
						<view class="icon">
							<image mode="aspectFill" :src="item.image"></image>
						</view>
						<view class="text">
							<view class="ts">{{item.name}}
								<view class="remaining">押金剩余：{{item.row}} 任务剩余：{{item.row}} </view>
							</view>
							<view class="tt" style="height: 40rpx;line-height: 40rpx;">任务分类：{{item.classify}}</view>
							<view class="tt" style="color: #333;">{{item.desc}}</view>
						</view>
					</view>
					<view class="pwsc">
						<view style="font-size: 24rpx;color: #999;display: flex;justify-content: flex-start;">
							状态：
							<view v-if="item.status == 0">
								下架
							</view>
							<view v-if="item.status == 1">
								正常
							</view>
							<view v-if="item.status_text">-{{item.status_text}}</view>
						</view>
						<view class="pls">{{item.price}}金币</view>
						<view class="prs">
							<view class="btn b1" v-if="item.status != 1" @click="del(item,index)">删除</view>
							<view class="btn b2" @click="status(item,index)" v-if="item.status == 1">下架</view>
							<view class="btn b3" v-if="item.status > 1">重新发布</view>
						</view>
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

		<view class="logss" @click="ToReview()">审核</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				list: [],
				page: 1,
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
			}
		},
		onShow() {
			this.getList();
		},
		onReachBottom() {
			this.page++
			this.getList()
		},
		onLoad() {

		},
		methods: {
			ToReview(){
				uni.navigateTo({
					url:"/pages/task/review"
				})
			},
			status(item, index) {
				this.app.confirm({
					content: "下架将永久取消该任务，真的要下架吗？",
					confirmText: "确认",
					success: () => {
						this.app.ajax({
							url: "/task/status",
							data: {
								id: item.id
							},
							method: "post",
							success: (res) => {
								this.app.toast(res.message)
								if (res.code === 200) {
									this.list[index].status = 0;
									this.list[index].status_text = '已下架';
								}
							}
						});
					}
				})
			},
			del(item, index) {
				this.app.confirm({
					content: "删除无法恢复，确认吗？",
					confirmText: "删除",
					success: () => {
						this.app.ajax({
							url: "/task/del",
							data: {
								id: item.id
							},
							method: "post",
							success: (res) => {
								this.app.toast(res.message)
								if (res.code === 200) {
									this.list = this.list.filter(a => a.id !== item.id);
								}
							}
						});
					}
				})
			},
			ToTaskDetail(item) {
				uni.navigateTo({
					url: "/pages/task/task_detail?id=" + item.id
				})
			},
			getList() {
				this.app.ajax({
					url: "/task/index",
					data: {
						page: this.page,
						status: this.isActive,
						user_id: this.app.getUserInfo().id
					},
					success: (res) => {
						if (this.page == 1) {
							this.list = res.data
						} else {
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
			returns() {
				uni.navigateBack({
					delta: 1
				});
			},
			ToRelease() {
				uni.navigateTo({
					url: "/pages/task/task_release"
				})
			}
		}
	}
</script>

<style>
	page {
		background: #f5f5f5;
	}

	.header {
		background: #fff;
	}

	.headerws {
		background: #fff;
	}

	.header .return {
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100%;
	}

	.addpro {
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

	.addpro .icon {
		width: 24rpx;
		height: 24rpx;
		background: url(../../static/adds.png) no-repeat;
		background-size: 100% 100%;
	}

	.addpro .tt {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #f9285c;
	}

	.tables {
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

	.tables .lis {
		padding: 0 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #999;
		position: relative;
		margin: 0 16rpx;
	}

	.tables .lis::before {
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

	.tables .lis.active::before {
		display: block;
	}

	.tables .lis.active {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.task {
		width: 100%;
		box-sizing: border-box;
	}

	.task .list {
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}

	.task .list .lis {
		width: 100%;
		padding: 24rpx;
		background: #fff;
		border-radius: 16rpx;
		box-sizing: border-box;
		margin-bottom: 32rpx;
	}

	.task .list .lis .info {
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}

	.task .list .lis .info .icon {
		width: 128rpx;
		height: 128rpx;
		background: #ccc;
		flex-shrink: 0;
		border-radius: 16rpx;
		margin-right: 24rpx;
	}

	.task .list .lis .info .icon image {
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
	}

	.task .list .lis .info .text {
		width: 100%;
	}

	.task .list .lis .info .text .ts {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #111;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}

	.task .list .lis .info .text .ts .remaining {
		color: #f9285c;
		font-size: 24rpx;
		font-weight: normal;
	}

	.task .list .lis .info .text .ts .remaining.wait {
		color: #FFA100;
	}

	.task .list .lis .info .text .ts .remaining.success {
		color: #999;
	}

	.task .list .lis .info .text .tt {
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.task .list .lis .classfly {
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

	.task .list .lis .classfly .money {
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

	.task .list .lis .onts {
		width: 100%;
		height: 48rpx;
		margin-top: 16rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		line-height: 48rpx;
	}

	.task .list .lis .onts .rrs {
		font-size: 32rpx;
		font-weight: bold;
		color: #f9285c;
	}

	.task .list .lis .pwsc {
		width: 100%;
		margin-top: 24rpx;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
	}

	.task .list .lis .pwsc .pls {
		height: 48rpx;
		line-height: 48rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #f9285c;
	}

	.task .list .lis .pwsc .prs {
		height: 48rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.task .list .lis .pwsc .btn {
		height: 48rpx;
		line-height: 44rpx;
		border: 2rpx solid;
		border-radius: 8rpx;
		margin-left: 24rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		padding: 0 16rpx;
	}

	.task .list .lis .b1 {
		border-color: #AAAAAA;
		color: #333;
	}

	.task .list .lis .b2 {
		border-color: #f9285c;
		color: #f9285c;
	}

	.task .list .lis .b3 {
		background: #f9285c;
		border-color: #f9285c;
		color: #fff;
	}

	.logss {
		width: 96rpx;
		height: 96rpx;
		background: #f9285c;
		background-size: 100% 100%;
		position: fixed;
		bottom: 64rpx;
		right: 2.5%;
		z-index: 999;
		text-align: center;
		line-height: 96rpx;
		border-radius: 96rpx;
		font-size: 28rpx;
		color: #fff;
	}
</style>