<template>
	<view class="content">


		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">我的金币</view>
		</view>

		<view class="top">
			<view class="title">
				<view class="icon1"></view>
				<view class="ts">我的金币</view>
			</view>
			<view class="text">
				<view class="nos">{{info.score}}</view>
			</view>
			<view class="hoow" @click="ToGiveaway()" v-if="!modelsp">去赠送</view>
			<view class="morebtn" @click="ToLog()">
				金币明细
			</view>
		</view>

		<view class="wobox" >
			<view class="llcon">
				<view class="lltop">
					<view class="lis">
						<view class="llts">{{info.yesterday}}</view>
						<view class="lltt">昨日获得</view>
					</view>
					<view class="lis">
						<view class="llts">{{info.today}}</view>
						<view class="lltt">今日获得</view>
					</view>
					<view class="lis">
						<view class="llts">{{info.all}}</view>
						<view class="lltt">累计获得</view>
					</view>
				</view>
				<view class="lltips" v-if="!modelsp">
					金币是途练宝的核心积分，将来整个平台的发展都将围绕金币展开，为项目赋予更大的价值，解锁项目需要支付金币!
				</view>
				<view class="lltips" v-else>
					金币是途练宝的核心积分,主要可以用来查看项目和发布任务。没有其他作用，也不支持其他作用。感谢您的支持。
				</view>
			</view>
		</view>

		<view class="center">
			<view class="title">
				<view class="tt">金币应用</view>
			</view>
			<view class="mdlist">
				<view class="lis">
					<view class="icon">
						<image src="../../static/bbobos.png" mode="aspectFill"></image>
					</view>
					<view class="ttt">解锁项目</view>
				</view>
			</view>
		</view>
		<view class="center" v-if="!modelsp">
			<view class="title">
				<view class="tt">更多用途</view>
			</view>
			<view class="text">
				金币作为途练宝的核心积分，必定将发挥出巨大价值，使金币拥有具体用途。后续将丰富付费项目，同时金币将与各大品牌联动，打造名片奢侈品金币勋章挂件，彰显数字身份...等等更多金币用途敬请期待!
			</view>
		</view>


		<view style="width: 100%;height: 160rpx;"></view>


	</view>
</template>
<script>
	export default {
		data() {
			return {
				header_class: 'header',
				info:{},
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
		onShow() {
			this.init();
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/score/index",
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			},
			ToGiveaway(){
				uni.navigateTo({
					url:"/pages/mine/giveaway"
				})
			},
			ToLog(){
				uni.navigateTo({
					url:"/pages/mine/walletlog"
				})
			}

		},
	}
</script>
<style>
	page {
		background: #f5f5f5;
	}
	.return{
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}
	.header .text{
		color: #fff;
	}
	.headerws{
		background: url(../../static/nsnc.png) no-repeat;
		background-size: 100% ;
	}
	.topbg {
		width: 100%;
		height: 632rpx;
		background: #1c1d22;
		position: fixed;
		top: 0;
		left: 0;

	}

	.top {
		width: 100%;
		padding: 204rpx 4% 100rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 39;
		background: #202333;
		background: url(../../static/nsnc.png) no-repeat;
		background-size: 100% 100%;
	}

	.top .title {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 48rpx;
	}

	.top .title .icon1 {
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/cnc.png) no-repeat;
		background-size: 100% 100%;
		border-radius: 24rpx;
	}

	.top .title .icon2 {
		width: 24rpx;
		height: 24rpx;
		background: #dbd1ab;
		border-radius: 24rpx;
	}

	.top .title .ts {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		margin: 0 12rpx;
		color: #fff;
	}

	.top .text {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 16rpx;
	}

	.top .text .nos {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
	}

	.top .text .ros {
		height: 64rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 16rpx;
	}

	.top .text .ros .ttt {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 26rpx;
		color: #dbd1ab;
	}

	.top .text .ros .tms {
		width: 24rpx;
		height: 24rpx;
		background: #dbd1ab;
		border-radius: 24rpx;
		margin-left: 8rpx;
	}

	.top .morebtn {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 24rpx;
		font-weight: 600;
		background: rgba(255, 255, 255, .15);
		color: #fff;
		border-radius: 56rpx 0 0 56rpx;
		padding: 0 32rpx;
		position: absolute;
		top: 160rpx;
		right: 0;
	}

	.top .hoow {
		display: inline-block;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		font-weight: 600;
		background: #f9285c;
		color: #fff;
		border-radius: 56rpx;
		padding: 0 48rpx;
		margin-top: 48rpx;
	}

	.wobox {
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		margin-top: -48rpx;
	}

	.sgin {
		width: 100%;
		position: relative;
		z-index: 40;
		padding: 24rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
	}

	.sgin .ts {
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.sgin .ts .sts {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.sgin .ts .sts text {
		margin: 0 8rpx;
		color: #dfc69e;
	}

	.sgin .ts .srs {
		height: 40rpx;
		line-height: 36rpx;
		border: 2rpx #dcdcdc solid;
		padding: 0 16rpx;
		border-radius: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.sgin .ts .srs .icon {
		height: 16rpx;
		width: 16rpx;
		background: #999;
		border-radius: 20rpx;
	}

	.sgin .ts .srs .ttt {
		height: 36rpx;
		line-height: 36rpx;
		font-size: 22rpx;
		color: #999;
		margin-left: 8rpx;

	}

	.sgin .sginlist {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 24rpx;
	}

	.sgin .sginlist .lis {
		width: 12.5%;
	}

	.sgin .sginlist .lis .kis {
		width: 100%;
		padding: 16rpx 0;
		background: #faf6eb;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		border-radius: 8rpx;
	}

	.sgin .sginlist .lis .kis .icon {
		width: 32rpx;
		height: 32rpx;
		background: #927634;
		border-radius: 24rpx;
		margin-bottom: 12rpx;
	}

	.sgin .sginlist .lis .kis .toc {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #927634;
		text-align: center;
	}

	.sgin .sginlist .lis .tt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		text-align: center;
		margin-top: 8rpx;
	}

	.task {
		width: 92%;
		position: relative;
		z-index: 41;
		margin: 32rpx 4%;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #fff;
	}

	.task .tocs {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.task .tocs .tst {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.task .tocs .rst {
		height: 48rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.task .tocs .rst .rsts {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		margin-right: 8rpx;
	}

	.task .tocs .rst .icon {
		width: 16rpx;
		height: 16rpx;
		background: #999;
		border-radius: 16rpx;
	}

	.task .lis {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 2rpx #f5f5f5 solid;
		position: relative;
	}

	.task .lis:last-child {
		border-bottom: none;
	}

	.task .lis .icon {
		width: 80rpx;
		height: 80rpx;
		background: #eee;
		border-radius: 8rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}

	.task .lis .text {
		width: 100%;
		height: 80rpx;
	}

	.task .lis .text .ts {
		width: 100%;
		height: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: -2rpx;
	}

	.task .lis .text .tt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 4rpx;
	}

	.task .lis .text .tst {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.task .lis .text .rot {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 20rpx;
		padding: 0 8rpx;
		border-radius: 4rpx;
		background: #f7eec5;
		color: #ce9949;
		margin-left: 16rpx;
	}

	.task .lis .robt {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		font-weight: 600;
		padding: 0 32rpx;
		border-radius: 56rpx;
		position: absolute;
		top: 44rpx;
		right: 0;
		background: #373e48;
		color: #ebcd9b;

	}

	.levels {
		width: 92%;
		margin: 32rpx 4%;
	}

	.levels .topc {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		background: #1c1d22;
		background-size: cover;
		border-radius: 8rpx 8rpx 0 0;
	}

	.levels .topc .lis {
		width: 25%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #fff;
		flex-shrink: 0;
		text-align: center;
		border-right: 2rpx #999 solid;
	}

	.levels .topc .lis:last-child {
		border-right: none;
	}

	.levels .list {
		width: 100%;
		height: 96rpx;
		display: flex;
		justify-content: flex-start;
		background: #fff;
	}

	.levels .list .lis {
		width: 25%;
		flex-shrink: 0;
		height: 96rpx;
		line-height: 96rpx;
		font-size: 26rpx;
		text-align: center;
		border-right: 2rpx #f5f5f5 solid;
		border-bottom: 2rpx #f5f5f5 solid;
		box-sizing: border-box;
		color: #999;
		overflow: hidden;
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.levels .list .lis:last-child {
		border-right: none;
	}

	.levels .list:last-child {
		border-radius: 0 0 8rpx 8rpx;
	}

	.levels .list .lis image {
		width: 100rpx;
		height: 40rpx;
	}

	.sginbtn {
		width: 80%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		background: red;
		border-radius: 80rpx;
		margin: 48rpx 10% 16rpx;
		background-image: linear-gradient(90deg, #ffe6d0 0%, #ecce9c 100%);
		color: #513716;
	}

	.popup {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, .5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.popup .popupcenter {
		width: 80%;
		padding: 40rpx 24rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
	}

	.popup .popupcenter .ts {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: 600;
		text-align: center;
	}

	.popup .popupcenter .tt {
		line-height: 48rpx;
		font-size: 26rpx;
		margin: 32rpx 0 48rpx;
		color: #999;
	}

	.popup .popupcenter .btn {
		width: 80%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		background: red;
		border-radius: 80rpx;
		margin: 0 10% 0;
		background-image: linear-gradient(90deg, #ffe6d0 0%, #ecce9c 100%);
		color: #513716;
	}

	.llcon {
		width: 100%;
		padding: 32rpx 24rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
	}

	.llcon .lltop {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.llcon .lltop .lis {
		width: 33.33%;
		flex-shrink: 0;
	}

	.llcon .lltop .lis .llts {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		color: #333;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
	}

	.llcon .lltop .lis .lltt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		text-align: center;
		color: #999;
		margin-top: 8rpx;
	}

	.llcon .lltips {
		width: 100%;
		padding: 24rpx;
		line-height: 40rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 24rpx;
		box-sizing: border-box;
	}

	.banner {
		width: 92%;
		margin: 32rpx 4%;
		background: #ccc;
		color: #999;
		height: 160rpx;
		border-radius: 16rpx;
	}

	.mmlist {
		width: 92%;
		margin: 32rpx 4%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.mmlist .lis {
		width: 48%;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #fff;
		margin-bottom: 32rpx;
	}

	.mmlist .lltt {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.mmlist .llts {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		color: #333;
		font-size: 36rpx;
		font-family: 'ZhiMuTi';
	}

	.center {
		width: 92%;
		border-radius: 16rpx;
		padding: 24rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 28;
		background: #fff;
		margin: 32rpx 4%;
	}

	.center .title {
		width: 100%;
		height: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.center .title .left {
		width: 8rpx;
		height: 28rpx;
		background: #000;
		border-radius: 8rpx;
		border-radius: 32rpx;
	}

	.center .title .tt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.center .text {
		width: 100%;
		box-sizing: border-box;
		line-height: 56rpx;
		font-size: 26rpx;
		color: #666;
		border-radius: 8rpx;
		margin: 32rpx 0;
		box-sizing: border-box;
	}

	.center .text text {
		color: #a3e900;
		margin: 0 8rpx;
		font-weight: bold;
	}

	.mdlist {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 32rpx;
	}

	.mdlist .lis {
		width: 20%;
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.mdlist .lis .icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 88rpx;
		background: red;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(111, 180, 232, 0.2);
	}

	.mdlist .lis .icon image {
		width: 64rpx;
		height: 64rpx;
		border-radius: 88rpx;
	}

	.mdlist .lis .ttt {
		width: 100%;
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 12rpx;
	}

	.wobox {
		position: relative;
	}

	.llcon {
		position: relative;
		z-index: 19;
	}

	.top {
		z-index: 17;
	}
</style>