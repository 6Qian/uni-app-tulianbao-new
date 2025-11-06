<template>
	<view>
		<image src="../../static/looos.png" class="ttc" mode="aspectFill"
			style="width: 100%; height: 380rpx; border-bottom-right-radius: 30rpx;border-bottom-left-radius: 30rpx;"></image>
		<view class="navbar" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="fhicon" @click="returns"></view>
			<h4 class="title">积分兑换</h4>
			<text @click="golog">明细</text>
		</view>
		<view class="status-bars" :style="{paddingTop:statusBarHeight+'px'}"></view>

		<view class="userinfo">
			<view class="lis" style="position: relative; width: 690rpx; height: 254rpx;">
				<image src="/static/coinbg.png" style="width: 100%; height: 100%; position: absolute; left: 0; right: 0; z-index: 0;" mode=""></image>
				<view class="text">金币</view>
				<h4 style="color: #F9285C;">{{list.money}}</h4>
			</view>
			<view class="bdalpasy" style="background: #F9285C;" v-if="list.is_alipay">
				<!-- <h4>{{list.account}}</h4> -->
				<h4>已绑定支付宝</h4>
				<view>
					<text @click="bindalipay()">更换</text>
					<!-- <navigator style="display: inline-block; margin-left: 30rpx;" hover-class="none" :url="`/pages/mine/FillInfo?alipay_name=${list.alipay_name}&alipay_account=${list.alipay_account}`">
						<text>完善实名信息</text>
					</navigator> -->
				</view>
			</view>
			<view class="bdalpasy" style="background: #F9285C;" @click="bindalipay()" v-else>
				<h4>未完善支付宝信息</h4>
				<text>完善</text>
			</view>
		</view>

		<view class="moneylist" style="margin-top: 80rpx;">
			<view class="lis" v-for="(item,index) in list.list" :key="index" :class="['',Inv1== index?'on':'']"
				@click="Inv1=index">
				<h4><text>¥</text>{{item}}</h4>
				<view class="tag" v-if="item==1&&index==0">新人</view>
			</view>
		</view>

		<button class="btn" @click="confirm" style="border:#F9285C solid 1px; color: #ffffff; background-color: #F9285C;">申请积分兑换</button>
		<view class="tttxxx" v-html="list.tip"></view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: {
					list: []
				},
				money: '',
				Inv1: 0,
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
			}
		},
		onShow() {
			this.init()
		},
		onPageScroll(e) {
			if (e.scrollTop > 44) {
				this.header_class = 'navbars';
			} else {
				this.header_class = 'navbar';
			}
		},
		methods: {
			golog() {
				uni.navigateTo({
					url: "/pages/mine/walletlog"
				})
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			},
			init() {
				this.app.ajax({
					url: "/withdraw/info",
					success: (res) => {
						// res.data.alipay_account = 'ali4444'
						// res.data.alipay_name = 'ali'
						if(res.data.alipay_account === null ||  res.data.alipay_name === null) {
							res.data.alipay_account = '';
							res.data.alipay_name = '';
						}
						this.list = res.data
					},
				});
			},


			bindalipay() {
				uni.navigateTo({
					url:`/pages/mine/FillInfo?alipay_name=${this.list.alipay_name}&alipay_account=${this.list.alipay_account}`
				})
				
				
				return
				this.app.ajax({
					url: "/alipayOauth/getOauthUrl",
					success: (res) => {
						let that = this;
						let r = res.data
						setTimeout(function() {
							uni.showModal({
								title: '',
								content: '是否完成绑定？',
								success: function(res) {
									if (res.confirm) {
										that.getinfo();
									}
								}
							});
						}, 4000)
						let jump_url = r;
						let alipayUrl = 'alipays://platformapi/startapp?saId=10000007&qrcode=' + jump_url +
							'?_s=web-other';
						let platform = uni.getSystemInfoSync().platform; //获取平台判断
						if (platform == 'android') {
							plus.runtime.openURL(alipayUrl)
						} else if (platform == 'ios') {
							plus.runtime.launchApplication({
								action: alipayUrl
							})
						}
					},
				});
			},
			// 发起积分兑换
			confirm() {
				let rate = (parseFloat(this.list.list[this.Inv1]) * parseFloat(this.list.rate) / 100).toFixed(2)
				let m = (parseFloat(rate) + parseFloat(this.list.list[this.Inv1])).toFixed(2)
				uni.showModal({
					title: '',
					// content: "确认积分兑换将会扣除您的金币，\r\n" + this.list.list[this.Inv1] + '金币 + ' + rate +
					// 	"手续费金币，\r\n点击确认将扣除共" + m + "金币",
					content: "确认积分兑换将会扣除您的金币，\r\n" + this.list.list[this.Inv1] + '金币',
					success: (aa) => {
						if (aa.confirm) {
							uni.showLoading({
								title: '请稍等...'
							})
							var that = this
							this.app.ajax({
								url: "/withdraw/confirm",
								method: "post",
								data: {
									money: this.list.list[this.Inv1]
								},
								success: (res) => {
									uni.hideLoading()
									uni.showToast({
										title: res.message,
										icon: 'none'
									})
									that.init()
								},
							});
						}
					}
				});

			},
		}
	}
</script>
<style>
	checkbox,
	radio {
		transform: scale(0.8);
	}

	.ctheme {
		color: #649FFF;
		display: inline-block;
	}

	checkbox .uni-checkbox-input {
		border-radius: 50%;
	}

	checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #1D87FF !important;
	}

	.agree {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx;
	}

	.nowrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.popoptitle {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-bottom: 32rpx;
	}

	.popoptitle h4 {
		width: 100%;
		font-size: 32rpx;
		color: #333;
	}

	.popoptitle text {
		width: 18%;
		height: 8rpx;
		background: #1d8dff;
		display: inline-block;
		margin-top: 8rpx;
		border-radius: 16rpx;
	}

	.line2 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		line-height: 30rpx;
		height: 80rpx;
	}

	.line1 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 30rpx;
		height: 50rpx;
	}

	.none {
		position: relative;
		width: 100%;
		height: 100vh;
		padding-top: 320rpx;
		color: #649FFF;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
	}

	.none image {

		width: 60%;
		margin-left: 20%;
	}

	.none .btn {
		width: 60%;
		margin-top: 32rpx;
		border-radius: 88rpx;
	}

	.none .p {
		width: 100%;
		text-align: center;
		margin-top: 32rpx;
		font-size: 32rpx;
		color: #999;

	}

	.navbar {
		width: 100%;
		display: flex;
		height: 88rpx;
		line-height: 88rpx;
		justify-content: center;
		font-weight: bold;
		color: #fff;
		position: fixed;
		z-index: 888;
		top: 0;
		left: 0;
		background: transparent;
		padding-top: var(--status-bar-height);
		color: #333;
		font-size: 32rpx;
	}

	.navbars {
		width: 100%;
		display: flex;
		height: 88rpx;
		line-height: 88rpx;
		justify-content: center;
		font-weight: bold;
		color: #333;
		position: fixed;
		z-index: 888;
		top: 0;
		left: 0;
		background: #fff;
		padding-top: var(--status-bar-height);
		font-size: 32rpx;
	}

	.navbar .fhicon {
		height: 48rpx;
		width: 48rpx;
		background: url(../../static/fhs.png) no-repeat;
		background-size: cover;
		position: absolute;
		bottom: 20rpx;
		left: 16rpx;
		z-index: 48;
	}

	.navbars .fhicon {
		height: 48rpx;
		width: 48rpx;
		background: url(../../static/fhs.png) no-repeat;
		background-size: cover;
		position: absolute;
		bottom: 20rpx;
		left: 16rpx;
		z-index: 48;
	}

	.navbars .tb {
		width: 100%;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 38;
		color: #fff;
	}

	.navbar text {
		height: 88rpx;
		line-height: 88rpx;
		position: absolute;
		bottom: 0;
		right: 20rpx;
		font-size: 28rpx;
		padding: 0 0rpx;
		font-weight: normal;
		color: #1D87FF;
		display: inline-block;
		z-index: 128;
	}

	.navbars text {
		height: 88rpx;
		line-height: 88rpx;
		position: absolute;
		bottom: 0;
		right: 20rpx;
		font-size: 28rpx;
		font-weight: normal;
		color: #1D87FF;
		display: inline-block;
		z-index: 48;
	}

	.status-bars {
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
	}

	button::after {
		border: none;
	}

	.clear {
		clear: both;
	}

	/deep/ ::-webkit-scrollbar {
		display: block;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: auto !important;
		background: transparent;
		overflow: auto !important;
	}

	scroll-view ::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.loading2 {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background-image: linear-gradient(transparent, #fff);
		color: #666;
		font-size: 28rpx;
		background: #fff;
	}

	/**/
	.navBar .right {
		position: absolute;
		right: 30rpx;
		color: #999999;
		font-size: 28rpx;
		font-weight: normal;
	}

	.container {
		padding: 32rpx;
	}

	.container .one {
		color: #fff;
		overflow: hidden;
		position: relative;
		background: #1D87FF;
		border-radius: 20rpx;
		padding: 30rpx 24rpx;
	}

	.container .one .pic {
		position: absolute;
		width: 254rpx;
		right: 0;
		bottom: 0;
	}

	.container .one .p {
		margin-top: 70rpx;
		opacity: 0.5;
		font-size: 24rpx;
	}

	.container .one .dt {
		font-size: 64rpx;
		font-family: DIN;
		margin-top: 32rpx;
	}

	.container .one .dd {
		display: flex;
		align-items: center;
		opacity: 0.8;
	}

	.container .one .dd .iconfont {
		margin-left: 10rpx;
	}

	.container .two {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 24rpx;
		margin-top: 32rpx;
	}

	.container .two .title {
		font-size: 32rpx;
		font-weight: bold;
		padding-bottom: 30rpx;
	}

	.container .two .bd {
		display: flex;
		flex-wrap: wrap;
		margin: -12rpx;
	}

	.container .two .bd>view {
		width: 33.333%;
		box-sizing: border-box;
		padding: 12rpx;
		font-size: 26rpx;
		position: relative;
	}

	.container .two .bd .p {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #eee;
		border-radius: 16rpx;
		height: 96rpx;
		color: #ccc;
	}

	.container .two .bd .on .p {
		color: #1D7FFF;
		border-color: #1D7FFF;
		background: rgba(29, 135, 255, 0.1);
	}

	.container .two .bd text {
		font-size: 32rpx;
		font-weight: normal;
	}

	.container .two .bd .span {
		position: absolute;
		top: 12rpx;
		right: 12rpx;
		font-size: 24rpx;
		color: #fff;
		background: #1D87FF;
		border-radius: 0 10rpx;
		line-height: 40rpx;
		padding: 0 6rpx;
	}

	.container .three {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 24rpx;
		margin-top: 32rpx;
	}

	.container .three .tab {
		font-size: 32rpx;
		color: #989898;
	}

	.container .three .tab .iconfont {
		font-size: 45rpx;
		margin-right: 15rpx;
	}

	.container .three .tab .flex_item {
		display: flex;
		align-items: center;
	}

	.container .three .tab .on {
		color: #1D87FF;
	}

	.container .three .tab .icon-zhifubao {
		color: #1D87FF;
	}

	.container .three .tab .icon-a-rongqi7 {
		color: limegreen;
	}

	.container .three .bd {
		margin: 0rpx 0 32rpx;
	}

	.container .three .bd .pic {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.container .three .bd .flex {
		height: 131rpx;
		background: #F5F6FA;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.container .three .bd .flex_item {
		font-size: 32rpx;
		color: #676767;
	}

	.container .three .bd .more {
		color: #989898;
	}

	.container .three .ft {
		font-size: 24rpx;
		line-height: 40rpx;
		margin-bottom: 80rpx;
	}

	.container .three .ft .p {
		color: #9A9A9A;
	}

	.bb {
		background-image: linear-gradient(90deg, #1d87ff 0%, #76b6ff 100%);
	}

	.ttc {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
	}

	.navbar .fhicon {
		height: 48rpx;
		width: 48rpx;
		background: url(../../static/fhs.png) no-repeat;
		background-size: cover;
		position: absolute;
		bottom: 20rpx;
		left: 16rpx;
		z-index: 48;
	}

	.navbar .title {
		color: #fff;
	}

	.navbar text {
		color: #fff;
	}

	.navbars text {
		color: #333;
	}

	.userinfo {
		width: 92%;
		margin: 0 4%;
		position: relative;
		z-index: 8;
		margin-bottom: 32rpx;
		display: flex;
		margin-top: 32rpx;
		justify-content: space-between;
		flex-wrap: wrap;

	}

	.userinfo .bdalpasy {
		width: 100%;
		height: 80rpx;
		background: red;
		border-radius: 0 0 16rpx 16rpx;
		background: red;
		display: flex;
		justify-content: space-between;
		padding: 0 32rpx;
		box-sizing: border-box;
		align-items: center;
		background-image: linear-gradient(90deg, #1d87ff 0%, #76b6ff 100%);
		color: #fff;
	}

	.userinfo .bdalpasy h4 {
		font-size: 30rpx;
	}

	.userinfo .bdalpasy text {
		font-size: 26rpx;
		opacity: 0.8;
	}

	.userinfo .lis {
		width: 100%;
		padding: 48rpx 32rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx 16rpx 0 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #FFFFFF 100%);
		border: 2rpx solid #FFFFFF;
		position: relative;
		overflow: hidden;
	}

	.userinfo .lis .right {
		height: 64rpx;
		position: absolute;
		top: 16rpx;
		right: 16rpx;
		z-index: 18;
		border-radius: 80rpx;
		opacity: 1;
	}

	.userinfo .lis h4 {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #1d8dff;
		position: relative;
		z-index: 28;
	}

	.userinfo .lis h4 text {
		display: inline-block;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		background: red;
		font-weight: normal;
		display: block;
		margin-left: 16rpx;
		padding: 0 24rpx;
		border-radius: 64rpx;
		background: #EF473A;
		color: #fff;
	}

	.userinfo .lis h4 image {
		height: 40rpx;
		margin-right: 16rpx;
	}

	.userinfo .lis .text {
		display: block;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #676767;
		text-align: left;
		position: relative;
		z-index: 28;
		margin-bottom: 24rpx;
	}

	.moneylist {
		width: 92%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin: 48rpx 4%;
	}

	.moneylist .lis {
		width: 31%;
		height: 100rpx;
		background: #f5f5f5;
		margin-bottom: 32rpx;
		border-radius: 8rpx;
		position: relative;
	}

	.moneylist .lis.on {
		/* background: linear-gradient(90deg, #c285f4 0%, #aea7f7 100%); */
		background: #F9285C;
		color: #fff;
	}

	.moneylist .lis.on h4 {
		color: #fff;
	}

	.moneylist .lis h4 {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: #999;
	}

	.moneylist .lis .tag {
		height: 40rpx;
		line-height: 40rpx;
		background: #fff;
		position: absolute;
		top: 0;
		padding: 0 16rpx;
		font-size: 24rpx;
		right: 0;
		border-radius: 0 8rpx 0 8rpx;
		color: #333;
	}

	.moneylist .lis text {
		font-size: 28rpx;
		font-weight: normal;
		margin-right: 8rpx;
	}

	.moneylist .lis:nth-child(3n+2) {
		margin-left: 3.5%;
	}

	.moneylist .lis:nth-child(3n+3) {
		margin-left: 3.5%;
	}

	.btn {
		width: 92%;
		margin-left: 4%;
	}

	.tttxxx {
		width: 92%;
		margin: 32rpx 4%;
		font-size: 28rpx;
		color: #999;
		line-height: 64rpx;
	}
</style>