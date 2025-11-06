<template>
	<view class="content">


		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">邀请好友</view>
		</view>

		<view class="tops" style="z-index: 10;">
			<view class="userinfo">
				<view class="avatar">
					<image mode="aspectFill" style="width: 100%; height: 100%;" :src="info.avatar"></image>
				</view>
				<view class="text">
					<view class="ts">{{info.username}}&nbsp;&nbsp;&nbsp;{{info.team_title}}</view>
					<view class="tt">累计邀请了{{info.child}}人</view>
				</view>
				<view class="ewm" @click="getTeamInfo()" style="right: 130rpx;">
					<view class="hmore"></view>
					<view class="ttt">团队信息</view>
				</view>
				<view class="ewm" @click="ToEwm()">
					<view class="icon"></view>
					<view class="ttt">邀请好友</view>
				</view>
			</view>
			 <!-- v-if="!modelsp" -->
			<view class="invdata" style="position: relative;">
				<image src="/static/kccbg.png"
					style="width: 720rpx; height: 166rpx; position: absolute; left: -15rpx; top: 0;" mode=""></image>
				<view class="lis" style="position: relative;">
					<view class="ts">{{info.today_child_reward}}</view>
					 <!-- v-if="!modelsp" -->
					<view class="tt">今日奖励</view>
					<!-- <view class="tt" v-else>今日收入金币</view> -->
				</view>
				<view class="lis" style="position: relative;">
					<view class="ts">{{info.child_reward}}</view>
					 <!-- v-if="!modelsp" -->
					<view class="tt">累计奖励</view>
					<!-- <view class="tt" v-else>累计收入金币</view> -->
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 554rpx;"></view>
		<view class="myteam">
			<view class="title">
				<!-- v-if="!modelsp" -->
				<view class="left">我的团队</view>
				<!-- v-if="!modelsp" -->
				<view class="right">
					<view @click="setType(1)" :class="'lis '+(type == 1 ? 'active' : '') ">直推({{listinfo.child_1}})
					</view>
					<view @click="setType(2)" :class="'lis '+(type == 2 ? 'active' : '') ">有效({{listinfo.child_1_vip}})
					</view>
					<view class="hr"></view>
					<view @click="setType(3)" :class="'lis '+(type == 3 ? 'active' : '') ">二级({{listinfo.child_2}})
					</view>
					<view @click="setType(4)" :class="'lis '+(type == 4 ? 'active' : '') ">有效({{listinfo.child_2_vip}})
					</view>
				</view>
			</view>
			<view v-if="list.length<=0">
				<view class="no-data">
					<view class="icon">
						<image src="../../static/noteam.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无团队人员</view>
				</view>
			</view>
			<view v-else>
				<!-- v-if="!modelsp" -->
				<view class="telis" v-for="(item,index) in list" :key="index">
					<view class="avatar">
						<image mode="aspectFill" style="width: 100%; height: 100%;" :src="item.avatar"></image>
					</view>
					<view class="name">{{item.username}}</view>
					<view class="mos">{{item.score}}金币</view>
				</view>
			</view>
		</view>


		<view class="giveawaypopupmusk" v-if="giveaway" @click="giveaway = false"></view>
		<view class="giveawaypopupcenter" v-if="giveaway">
			<view class="pcts">
				团队信息
				<view class="text" style="font-size: 14px;display: inline-block;">（ 上级id: {{info.p_userid || '0'}} 上级用户名:{{info.p_username || '无'}}）</view>
			</view>
			<view class="pctt">仅供参考，无其他用途</view>

			<view class="lis">
				<view class="lls">二级后总人数：<span style="color: red;">{{result}}</span></view>
			</view>
			<view class="lis">
				<view class="lls">二级后有效人数：<span style="color: red;">{{resultVip}}</span></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				header_class: 'header',
				type: 1,
				list: {},
				listinfo: {},
				page: 1,
				info: {},
				giveaway: false,
				result: 0,
				resultVip: 0,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header headerws';
			} else {
				this.header_class = 'header';
			}
		},
		onReachBottom() {
			this.page++
			this.getList()
		},
		onLoad() {
			this.init();
			this.getList();
		},
		methods: {
			init() {
				this.app.ajax({
					url: "/share/index",
					success: (res) => {
						this.info = res.data
					},
				});
			},
			getTeamInfo() {
				uni.showLoading({
					title: '加载中'
				})
				this.app.ajax({
					url: "/share/getTeamInfo",
					success: (res) => {
						uni.hideLoading()
						this.giveaway = true;
						this.result = res.data.result
						this.resultVip = res.data.resultVip
					},
				});
			},
			getList() {
				this.app.ajax({
					url: "/share/child",
					data: {
						page: this.page,
						action: this.type
					},
					success: (res) => {
						if (this.page == 1) {
							this.listinfo = res.data.info
							this.list = res.data.list
						} else {
							this.list = this.list.concat(res.data.list)
						}
					},
				});
			},
			setType(index) {
				this.type = index;
				this.page = 1
				this.getList();
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			},
			ToEwm() {
				uni.navigateTo({
					url: "/pages/mine/poster"
				})
			}
		}
	}
</script>
<style>
	page {
		background: #fff;
	}

	.return {
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}

	.header .text {
		color: #fff;
	}

	.headerws {
		background: transparent;
	}

	.giveawaypopupmusk {
		width: 100%;
		height: 100vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 128;
		background: rgba(0, 0, 0, 0.5);
	}

	.giveawaypopupcenter {
		width: 100%;
		padding: 32rpx 4% 64rpx;
		box-sizing: border-box;
		border-radius: 32rpx 32rpx 0 0;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 138;
		background: #fff;
	}

	.giveawaypopupcenter .pcts {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.giveawaypopupcenter .pctt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.giveawaypopupcenter .pcinput {
		width: 100%;
		height: 88rpx;
		background: #f5f5f5;
		border-radius: 16rpx;
		margin-top: 32rpx;
		position: relative;
	}

	.giveawaypopupcenter .pcinput input {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.pcinput .uni-input-placeholder {
		font-size: 28rpx;
		color: #999;
	}

	.pcinput .setn {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		position: absolute;
		bottom: 0;
		right: 24rpx;
		color: #f9285c;
	}

	.giveawaypopupcenter .lis {
		width: 100%;
		height: 88rpx;
		border: 2rpx #f5f5f5 solid;
		border-radius: 16rpx;
		margin-top: 32rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 24rpx;
	}

	.giveawaypopupcenter .lis .lls {
		height: 84rpx;
		line-height: 84rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.giveawaypopupcenter .lis .rrs {
		height: 84rpx;
		line-height: 84rpx;
		font-size: 24rpx;
		color: #999;
	}

	.selectuser .text {
		width: 100%;
		height: 80rpx;
	}

	.selectuser .text .tts {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.selectuser .text .ttt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}

	.tops {
		width: 100%;
		padding: 224rpx 4% 48rpx;
		box-sizing: border-box;
		background: url(../../static/kkcs.png) no-repeat;
		background-size: 100% 100%;
		position: fixed;
		top: 0;
		left: 0;
	}

	.userinfo {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.userinfo .avatar {
		width: 88rpx;
		height: 88rpx;
		background: #fff;
		border-radius: 88rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}

	.userinfo .text {
		width: 100%;
		height: 88rpx;
	}

	.userinfo .text .ts {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
	}

	.userinfo .text .tt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #fff;
		opacity: 0.75;
		margin-top: 8rpx;
	}

	.userinfo .ewm {

		height: 88rpx;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.userinfo .ewm .icon {
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/ewm.png) no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;
	}

	.userinfo .ewm .hmore {
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/hmore.png) no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;
	}

	.userinfo .ewm .ttt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		margin-top: 8rpx;
	}

	.invdata {
		width: 100%;
		background: #f9285c;
		border-radius: 16rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 48rpx;
	}

	.invdata .lis {
		width: 50%;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.invdata .lis .ts {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}

	.invdata .lis .tt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #fff;
		margin-top: 8rpx;
		opacity: 0.75;
	}

	.myteam {
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
	}

	.myteam .title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64rpx;
	}

	.myteam .title .left {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 32rpx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.myteam .title .right {
		height: 64rpx;
		line-height: 64rpx;
		background: #f5f5f5;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 4rpx;
		box-sizing: border-box;
		border-radius: 100rpx;
		width: 100%;
		margin-left: 32rpx;
		overflow: hidden;
	}

	.myteam .title .right .lis {
		width: 50%;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		color: #999;
		border-radius: 100rpx;
		padding: 0 0rpx;
		text-align: center;
	}

	.myteam .title .right .lis.active {
		background: #fff;
		color: #333;
	}

	.telis {
		width: 100%;
		padding: 32rpx 0;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.telis .avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 48rpx;
		background: #ccc;
		flex-shrink: 0;
		flex-shrink: 0;
		margin-right: 24rpx;
	}

	.telis .name {
		height: 64rpx;
		line-height: 64rpx;
		font-weight: bold;
		font-size: 28rpx;
	}

	.telis .mos {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 32rpx;
		font-weight: bold;
		position: absolute;
		bottom: 32rpx;
		right: 0;
	}
</style>