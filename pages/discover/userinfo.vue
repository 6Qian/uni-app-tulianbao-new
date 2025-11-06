<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text"></view>
			<view class="userinfoheaderright" @click="blacklist = true"></view>
		</view>
		<view class="top">
			<view class="userinfos">
				<view class="avatar">
					<image mode="widthFix" :src="info.avatar"></image>
				</view>
				<view class="name">{{info.username}}</view>
				<view class="vicon"></view>
				<view class="focus active" v-if="info.is_black">
					<view class="icon"></view>
					<view class="tt">已拉黑</view>
				</view>
				<view @click="liked" class="focus active" v-else-if="info.is_like">
					<view class="icon"></view>
					<view class="tt">已关注</view>
				</view>
				<view @click="liked" class="focus" v-else>
					<view class="icon"></view>
					<view class="tt">关注</view>
				</view>
			</view>
			<view class="usersign">{{info.desc?info.desc:"~"}}</view>
			<view class="usernolist">
				<view class="lis">
					<view class="ts">{{info.beloved_count}}</view>
					<view class="tt">被喜欢</view>
				</view>
				<view class="lis">
					<view class="ts">{{info.like_count}}</view>
					<view class="tt">喜欢</view>
				</view>
				<view class="lis">
					<view class="ts">{{info.fans_count}}</view>
					<view class="tt">粉丝</view>
				</view>
				<view class="lis">
					<view class="ts">{{info.focus_count}}</view>
					<view class="tt">关注</view>
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 608rpx;"></view>
		<view class="table" style="z-index: 111;position: relative;">
			<view class="lis" :class="{ active: isActive === 0 }" @click="setActive(0)">动态</view>
			<view class="lis" :class="{ active: isActive === 1 }" @click="setActive(1)">创作</view>
		</view>

		<view v-if="info.is_black" style="width: 100%;text-align: center;height: 512rpx;line-height: 512rpx;font-size: 28rpx;color: #999;">
			拉黑已屏蔽Ta的所有内容
		</view>

		<view v-else>
			<view v-if="isActive === 0" style="position: relative;z-index: 111;">
				<dynamic-item v-if="dynamic.length>0" :touser="false" :list="dynamic"></dynamic-item>
				<view v-else>
					<view class="no-data">
						<view class="icon">
							<image src="/static/nocre.png" mode="aspectFill"></image>
						</view>
						<view class="tt">暂无动态</view>
					</view>
				</view>
			</view>
			<view v-if="isActive === 1" style="position: relative;z-index: 111;">
				<article-item v-if="article.length>0" :list="article"></article-item>
				<view v-else>
					<view class="no-data">
						<view class="icon">
							<image src="/static/nody.png" mode="aspectFill"></image>
						</view>
						<view class="tt">暂无创作</view>
					</view>
				</view>
			</view>
		</view>

		<view class="blacklistpopopmusk" v-if="blacklist" @click="blacklist = false"></view>
		<view class="blacklistpopopcenter" v-if="blacklist">
			<view class="lis" @click="beblack">
				<view class="tt" v-if="info.is_black">解除拉黑</view>
				<view class="tt" v-else>拉黑Ta</view>
			</view>
			<view class="lis" @click="ToJb()">
				<view class="tt">举报Ta</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				blacklist: false,
				isActive: 0,
				list: [],
				id: 0,
				info: {},

				dynamic: [],
				article: [],
				page: [1, 1],
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
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
			this.id = e.id
			this.init()
			this.getList();
		},
		onReachBottom() {
			this.getList(true)
		},
		methods: {
			ToJb(){
				uni.navigateTo({
					url:"/pages/home/report"
				})
			},
			getList(a) {
				if (a === true) {
					this.page[this.isActive]++;
				}
				this.app.ajax({
					url: this.isActive == 1 ? "/article/index" : "/dynamic/index",
					data: {
						page: this.page[this.isActive],
						user_id: this.id
					},
					success: (res) => {
						let name = this.isActive == 1 ? 'article' : 'dynamic';
						if (this.page == 1) {
							this[name] = res.data
						} else {
							this[name] = this[name].concat(res.data)
						}
					},
				});
			},
			beblack() {
				this.app.ajax({
					url: "/user/beblack",
					data: {
						id: this.id
					},
					method: 'post',
					load: true,
					success: (res) => {
						if (res.code === 200) {
							this.blacklist = false
							this.init()
						} else {
							this.app.toast(res.message)
						}
					},
				});
			},
			liked() {
				this.app.ajax({
					url: "/user/belike",
					data: {
						id: this.id
					},
					method: 'post',
					load: true,
					success: (res) => {
						if (res.code === 200) {
							this.init()
						} else {
							this.app.toast(res.message)
						}
					},
				});
			},
			init() {
				this.app.ajax({
					url: "/index/userHome",
					data: {
						id: this.id
					},
					success: (res) => {
						this.info = res.data
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				if (!this.article.length && index == 1) {
					this.getList()
				}
			},
			ToReg() {
				console.log(666)
				uni.navigateTo({
					url: "/pages/public/reg"
				})
			},
			ToRetrieve() {
				uni.navigateTo({
					url: "/pages/public/retrieve"
				})
			},
			ToLogin() {
				uni.switchTab({
					url: "/pages/home/index"
				})
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>


<style>
	page {
		background: #f5f5f5;
	}

	.return {
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}

	.headerws {
		background: #f9285c;
	}

	.top {
		width: 100%;
		padding: 192rpx 4% 112rpx;
		box-sizing: border-box;
		background: #f9285c;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
	}

	.top .ts {
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}

	.table {
		width: 100%;
		height: 88rpx;
		background: red;
		background: linear-gradient(180deg, #ECE3FF 0%, #FFFFFF 83%);
		border-radius: 32rpx 32rpx 0 0;
		display: flex;
		justify-content: space-between;
		margin-top: -32rpx;
	}

	.table .lis {
		width: 50%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #111;
		position: relative;
	}

	.table .lis.active {
		font-size: 32rpx;
		font-weight: bold;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		margin-top: -16rpx;
	}

	.table .lis::before {
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

	.table .lis.active::before {
		display: block;
	}

	.pwdlogin {
		width: 100%;
		padding: 40rpx 4%;
		box-sizing: border-box;
	}

	.pwdlogin .title {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #111;
		margin-bottom: 16rpx;
	}

	.pwdlogin .title:nth-child(3) {
		margin-top: 32rpx;
	}

	.pwdlogin .input {
		width: 100%;
		height: 80rpx;
		position: relative;
	}

	.pwdlogin input {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 2rpx #f5f5f5 solid;
		font-size: 28rpx;
		color: #ccc;
	}

	.pwdlogin .send {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		color: #f9285c;
	}

	.uni-input-placeholder {
		font-size: 28rpx;
		color: #ccc;
	}

	.pwdlogin .more {
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 48rpx;
		margin-top: 16rpx;
	}

	.pwdlogin .more .los {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #f9285c;
	}

	.login {
		width: 92%;
		margin: 64rpx 4% 40rpx;
		height: 88rpx;
		border-radius: 16rpx;
		line-height: 88rpx;
		background: #f9285c;
		color: #fff;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
	}

	.wxlogin {
		width: 92%;
		margin: 0 4%;
		height: 88rpx;
		border-radius: 16rpx;
		background: linear-gradient(90deg, rgba(68, 220, 96, 0.2) 6%, rgba(40, 196, 69, 0.2) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.wxlogin .icon {
		width: 48rpx;
		height: 48rpx;
		background: url(../../static/wxlogin.png) no-repeat;
		background-size: 100% 100%;
	}

	.wxlogin .tt {
		height: 48rpx;
		line-height: 48rpx;
		font-weight: bold;
		margin-left: 24rpx;
		font-size: 32rpx;
		color: #28C445;
	}

	.protocol {
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 50;
		left: 0;
		bottom: 64rpx;
	}

	.protocol .select {
		width: 28rpx;
		height: 28rpx;
		border: 2rpx #999 solid;
		border-radius: 28rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.protocol .select text {
		width: 16rpx;
		height: 16rpx;
		background: #f9285c;
		border-radius: 16rpx;
		display: block;
		display: none;
	}

	.protocol .select.active {
		border-color: #f9285c;
	}

	.protocol .select.active text {
		display: block;
	}

	.protocol .tt {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 12rpx;
	}

	.protocol .tt text {
		color: #333;
	}

	.userinfos {
		width: 100%;
		height: 96rpx;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.userinfos .avatar {
		width: 88rpx;
		height: 88rpx;
		background: #fff;
		flex-shrink: 0;
		border-radius: 96rpx;
		margin-right: 16rpx;
	}

	.userinfos .name {
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.userinfos .vicon {
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/vicon.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 8rpx;
	}

	.userinfos .focus {
		height: 56rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 20rpx;
		right: 0;
		padding: 0 24rpx;
		border-radius: 8rpx;
	}

	.userinfos .focus .icon {
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/adds.png) no-repeat;
		background-size: 100% 100%;
	}

	.userinfos .focus.active {
		background: rgba(255, 255, 255, 0.25);
	}

	.userinfos .focus.active .icon {
		display: none;
	}

	.userinfos .focus.active .tt {
		margin-left: 0;
		color: #fff;
	}

	.userinfos .focus .tt {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		margin-left: 16rpx;
		color: #f9285c;
	}

	.usersign {
		width: 100%;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #fff;
		margin-top: 24rpx;
	}

	.usernolist {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 48rpx;
	}

	.usernolist .lis {}

	.usernolist .lis .ts {
		width: 128rpx;
		text-align: center;
		font-size: 32rpx;
		height: 48rpx;
		line-height: 48rpx;
	}

	.usernolist .lis .tt {
		width: 128rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		opacity: 0.75;
		margin-top: 8rpx;
	}

	.blacklistpopopmusk {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99999;
	}

	.blacklistpopopcenter {
		position: fixed;
		right: 4%;
		top: 160rpx;
		z-index: 99999;
		border-radius: 8rpx;
		background: #333333;
		border-radius: 8rpx;
		padding: 0 24rpx;
	}
	.blacklistpopopcenter .lis{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	.blacklistpopopcenter .icon {
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/blacklist.png) no-repeat;
		background-size: 100% 100%;
	}

	.blacklistpopopcenter .tt {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 24rpx;
		color: #fff;
	}

	.latest {
		width: 100%;
	}

	.latest .list {
		width: 100%;
	}

	.latest .lis {
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		margin-bottom: 32rpx;
		background: #fff;
	}

	.latest .lis .userinfo {
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.latest .lis .userinfo .avatar {
		width: 48rpx;
		height: 48rpx;
		background: #ccc;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}

	.latest .lis .userinfo .ts {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.latest .lis .userinfo .time {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 0;
		right: 0;
	}

	.latest .lis .text {
		width: 100%;
		margin-top: 24rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		color: #333;
	}

	.imglist {
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
	}

	.imglist .imglis {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		background: #ccc;
		margin-right: 16.66rpx;
		flex-shrink: 0;
	}

	.imglist .imglis:last-child {
		margin-right: 0;
	}

	.lisdata {
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		height: 40rpx;
	}

	.lisdata .left {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}

	.lisdata .right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.lisdata .right .rrlis {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 24rpx;
	}

	.lisdata .right .rrlis .icon {
		width: 32rpx;
		height: 32rpx;
	}

	.lisdata .right .rrlis:nth-child(1) .icon {
		background: url(../../static/link.png) no-repeat;
		background-size: 100% 100%;
	}

	.lisdata .right .rrlis:nth-child(2) .icon {
		background: url(../../static/comment.png) no-repeat;
		background-size: 100% 100%;
	}

	.lisdata .right .rrlis.active:nth-child(1) .icon {
		background: url(../../static/linkactive.png) no-repeat;
		background-size: 100% 100%;
	}

	.lisdata .right .rrlis.active:nth-child(1) .tt {
		color: #f9285c;
		font-weight: bold;
	}

	.lisdata .right .rrlis .tt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #666;
	}

	.comment {
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 24rpx;
	}

	.comment .colis {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.comment .colis .avatar {
		width: 40rpx;
		height: 40rpx;
		background: #ccc;
		border-radius: 40rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	.comment .colis .name {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
		flex-shrink: 0;
	}

	.comment .colis .tt {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 16rpx;
		overflow: hidden;
	}
</style>