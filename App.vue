<script>
	import $app from "./common/common.js";
	export default {
		onLaunch: function() {
			
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				uni.request({
					url: $app.host + '/index/checkHotUpdate',
					method: "get",
					data: {
						version: widgetInfo.version,
					},
					success: (result) => {
						var res = result.data
						if (res.code === 200) {
							uni.downloadFile({
								url: res.data,
								success: (downloadResult) => {
									if (downloadResult.statusCode === 200) {
										plus.runtime.install(downloadResult
											.tempFilePath, {
												force: false
											},
											function() {
												plus.runtime.restart();
											},
											function(e) {});
									}
								}
							});
						}
					}
				});
			});
			// #endif
		},
		onShow: function() {
			// #ifdef APP-PLUS
			// let args = plus.runtime.arguments;
			// console.log('args', args)
			// if (args) {
			// 	let scheme = args.split('//')[1];
			// 	uni.navigateTo({
			// 		url:scheme
			// 	})
			// 	scheme = ''
			// 	plus.runtime.arguments = null;
			// 	plus.runtime.arguments = "";
			// }

			// #endif

		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			
			// 调用
			// const statusBarHeight = getIosStatusBarHeight();
			// console.log("状态栏高度：", statusBarHeight + "px");
		}
	}
</script>

<style>
	page {}


	.border{
		border: 2rpx solid red!important;
	}
	
	.tables {
		z-index: 188;
	}

	.imglis {
		background: transparent !important;
	}

	.imglis image {
		width: 100%;
		height: 100%;
	}

	.avatar {
		background: transparent !important;
		border-radius: 300rpx !important;
	}

	.avatar image {
		width: 100%;
		height: 100%;
		border-radius: 300rpx;
	}

	.status-bars {
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		box-sizing: content-box;
	}

	.headers {
		width: 100%;
		height: 96rpx;
	}
	
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		height: 96rpx;
		padding-top: var(--status-bar-height);
		z-index: 999;
		box-sizing: content-box;
		background: transparent;
	}

	.headerws {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		height: 96rpx;
		padding-top: var(--status-bar-height);
		z-index: 999;
		box-sizing: content-box;
		background: #fff;
	}

	.header .return {
		width: 40rpx;
		height: 40rpx;
		background: url(./static/returns.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 24rpx;
		left: 4%;
		z-index: 999;
	}

	.header .text {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		color: #333;
	}

	.header .right {
		height: 96rpx;
		line-height: 96rpx;
		font-size: 28rpx;
		color: #999;
		position: absolute;
		bottom: 0;
		right: 4%;
		z-index: 9999;
	}

	.userinfoheaderright {
		width: 48rpx;
		height: 48rpx;
		background: url(./static/hmore.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 24rpx;
		right: 4%;
		z-index: 999;
	}

	.no-data {
		width: 100%;
		padding: 160rpx 0;
	}

	.no-data .icon {
		width: 200rpx;
		height: 200rpx;
		display: block;
		margin: 0 auto;
	}

	.no-data .icon image {
		width: 200rpx;
		height: 200rpx;
	}

	.no-data .tt {
		width: 100%;
		font-size: 28rpx;
		text-align: center;
		color: #999;
	}
</style>