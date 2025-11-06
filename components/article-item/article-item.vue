<template>
	<view class="project">
		<view class="list" v-for="(item, index) in list" :key="item.id">
			<view class="lis" v-show="!item.hidden" @click="ToProjectDetail(item)">
				<view class="img">
					
					<image :src="item.image" mode="aspectFill"></image>
					<view class="tag" >
						<view class="icon">
						</view>
						<view class="tt">{{item.price}}金币</view>
					</view>
				</view>
				<view class="text">
					<view class="ts">{{item.title}}</view>
					
					<view class="tt">{{ app.getDateDiff(item.time * 1000) }}  </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: "article-item",
	props: {
		list: {
			type: Array,
			default: []
		},
	},
	data() {
		return {
			hiddenItems: uni.getStorageSync('hiddenProjectItems') || {}
		};
	},
	created() {
		// 初始化项目隐藏状态
		this.initHiddenStatus();
	},
	methods: {
		initHiddenStatus() {
			// 恢复已隐藏的项目状态
			this.list.forEach(item => {
				if (this.hiddenItems[item.id]) {
					item.hidden = true;
				}
			});
		},
		ToProjectDetail(item) {
			uni.navigateTo({
				url: "/pages/task/project_detail?id=" + item.id
			})
		},
		dislikeItem(item, index) {
			// 标记当前项目为隐藏
			this.$set(item, 'hidden', true);
			
			// 更新本地缓存
			this.hiddenItems[item.id] = true;
			uni.setStorageSync('hiddenProjectItems', this.hiddenItems);
			
			// 显示操作反馈
			uni.showToast({
				title: '已隐藏该内容',
				icon: 'none'
			});
		}
	}
}
</script>

<style scoped>
.project{
	width: 100%;
	background: transparent;
	padding: 0 4%;
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
	background: transparent;
}
.project .list .lis{
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	background: #fff;
	margin-bottom: 32rpx;
	padding: 16rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
}
.project .list .lis .text{
	width: 100%;
	height: 160rpx;
	margin-left: 24rpx;
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
	background: #f5f5f5;
	flex-shrink: 0;
	position: relative;
	flex-shrink: 0;
}
.project .list .lis .img image{
	width: 240rpx;
	height: 160rpx;
	border-radius: 16rpx;
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
	background: url(../../static/uuusb.png) no-repeat;
	background-size: 100% 100%;
}
.project .list .lis .tag .tt{
	height: 48rpx;
	line-height: 48rpx;
	font-size: 24rpx;
	color: #fff;
	margin-left: 8rpx;
}

.dislike-btn {
	width: 100%;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
	margin-bottom: 20rpx;
}
</style>