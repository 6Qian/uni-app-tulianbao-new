<template>
	<view class="content">
		<view class="poster">
			<swiper class="image-container" style="width: 100%; height: 100%;" 
				previous-margin="0rpx" next-margin="0rpx" 
				@change="currentIndex = $event.detail.current">
				<swiper-item class="swiper-item" v-for="(item, index) in posters" :key="index">
					<image class="image" style="width: 100%;" :src="item" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>

		<view class="morebtn">
			<view class="lis" @click="copy(info.link)">
				<view class="icon"></view>
				<view class="tt">复制链接</view>
			</view>
			<view class="lis" @click="download">
				<view class="icon"></view>
				<view class="tt">保存图片</view>
			</view>
			<view class="lis" @click="copy(info.code)">
				<view class="icon"></view>
				<view class="tt">复制邀请码</view>
			</view>
		</view>

		<!-- 图片预览层 - 仅用于iOS H5套壳环境 -->
		<view v-if="showPreview" class="preview-mask" @click="showPreview = false">
			<view class="preview-container" @click.stop>
				<img 
					:src="previewImageUrl" 
					class="preview-img safari-fix"
					crossorigin="anonymous"
					:alt="'海报_' + currentIndex"
				>
				<text class="preview-tip">长按图片选择'添加到照片'</text>
				<button class="close-btn" @click="showPreview = false">关闭</button>
			</view>
		</view>

		<l-painter ref="painter" useCORS custom-style="position:fixed;left:200%;"></l-painter>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				info: {},
				currentIndex: 0,
				posters: [],
				templatePosters: [
					"/static/hbbs.png",
					"/static/hb.png",
				],
				// 环境判断变量
				isIOS: false,         // 是否为iOS系统
				isSafari: false,      // 是否为Safari浏览器
				isAndroidApp: false,  // 是否为安卓App环境
				
				// 预览相关变量 (仅iOS H5使用)
				showPreview: false,
				previewImageUrl: ''
			}
		},
		onLoad(e) {
			// 检测设备环境
			const sysInfo = uni.getSystemInfoSync();
			this.isIOS = sysInfo.platform === 'ios';
			this.isAndroidApp = sysInfo.platform === 'android';
			
			// 仅在iOS H5环境下检测是否为Safari浏览器
			if (this.isIOS && sysInfo.platform !== 'ios') {
				const userAgent = navigator.userAgent.toLowerCase();
				this.isSafari = userAgent.indexOf('safari') !== -1 
					&& userAgent.indexOf('chrome') === -1;
			}
			
			this.app.ajax({
				url: "/user/profile",
				success: (res) => {
					this.info = res.data
					this.createPoster();
				},
			});
		},
		methods: {
			download() {
				var _this = this;
				const poster = _this.posters[_this.currentIndex];
				
				if (!poster) {
					_this.app.toast("图片加载中，请稍候");
					return;
				}

				// 安卓App环境 - 使用原始保存方法
				if (this.isAndroidApp) {
					uni.saveImageToPhotosAlbum({
						filePath: poster,
						success: (res) => {
							_this.app.toast("海报保存成功");
						},
						fail: (err) => {
							_this.app.toast("海报保存失败");
						}
					});
				}
				// iOS环境 (包括H5套壳)
				else if (this.isIOS) {
					// 转换图片为Blob格式以兼容Safari
					_this.convertToBlobAndShow(poster);
				}
				// 其他H5环境 (非iOS非安卓App)
				else {
					try {
						const a = document.createElement('a');
						a.href = poster;
						a.download = `image-${new Date().getTime()}.jpg`;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
					} catch (err) {
						console.error('保存失败：', err);
						uni.showToast({
							title: '保存失败，请长按图片保存',
							icon: 'none'
						});
					}
				}
			},
			
			// 转换图片为Blob格式，解决iOS Safari长按问题
			convertToBlobAndShow(imageUrl) {
				const _this = this;
				
				uni.showLoading({
					title: '处理图片中...'
				});
				
				// 创建XMLHttpRequest解决跨域问题
				const xhr = new XMLHttpRequest();
				xhr.open('GET', imageUrl, true);
				xhr.responseType = 'blob';
				
				xhr.onload = function() {
					uni.hideLoading();
					if (this.status === 200) {
						// 将blob转换为可在Safari中长按保存的URL
						const blob = this.response;
						_this.previewImageUrl = window.URL.createObjectURL(blob);
						_this.showPreview = true;
					} else {
						// 转换失败时使用原始URL
						_this.previewImageUrl = imageUrl;
						_this.showPreview = true;
					}
				};
				
				xhr.onerror = function() {
					uni.hideLoading();
					_this.previewImageUrl = imageUrl;
					_this.showPreview = true;
				};
				
				xhr.send();
			},
			
			copy(str) {
				let _this = this;
				uni.setClipboardData({
					data: str,
					showToast: false,
					success() {
						_this.app.toast("复制成功");
					},
					fail() {
						_this.app.toast("复制失败");
					}
				});
			},
			
			// 海报生成器
			_posterGenerator(path) {
				return new Promise((resolve, reject) => {
					const _this = this;

					_this.$refs.painter.render({
						css: {
							width: '1500rpx'
						},
						views: [{
								type: 'image',
								src: path,
								css: {
									width: '100%'
								},

							},
							{
								type: "qrcode",
								text: _this.info.link,
								css: {
									background: "#FFF",
									padding: "22rpx",
									width: "200rpx",
									height: "200rpx",
									position: 'absolute',
									bottom: '28rpx',
									right: "80rpx",
								},
							},
							{
								type: 'image',
								src: _this.info.avatar,
								css: {
									padding: "22rpx",
									width: "200rpx",
									height: "200rpx",
									position: 'absolute',
									bottom: '28rpx',
									left: "50rpx",
								},

							},
							{
								text: _this.info.username,
								type: "text",
								css: {
									color: "black",
									fontSize: "62rpx",
									position: 'absolute',
									bottom: '175rpx',
									left: "330rpx",
								}
							},
							{
								text: '邀请您加入途练宝',
								type: "text",
								css: {
									color: "#333",
									fontSize: "48rpx",
									position: 'absolute',
									bottom: '80rpx',
									left: "330rpx",
								}
							},
							{
								text: "ID：" + _this.info.id,
								type: "text",
								css: {
									color: "black",
									fontSize: "62rpx",
									fontWeight: "bold",
									position: 'absolute',
									top: '10rpx',
									left: "30rpx",
								}
							}
						]
					}).then(e => {
						_this.$refs.painter.canvasToTempFilePathSync({
							fileType: "jpg",
							pathType: 'url',
							quality: 0.2,
							success: res => resolve(res.tempFilePath),
							fail: (err) => reject("海报生成失败"),
						});
					}).catch((err) => {
						reject("海报生成失败.")
					});
				});
			},

			// 生成海报地址
			async createPoster() {
				const _this = this;
				_this.posters.splice(0, _this.posters.length);
				uni.showLoading({
					title: "生成中.."
				})
				for await (const url of _this.templatePosters) {
					try {
						_this.posters.push(await _this._posterGenerator(url));
					} catch (_) {}
				}
				console.log(_this.posters)
				uni.hideLoading()
			},

		}
	}
</script>

<style>
	page {
		background: #fff;
		overflow: hidden;
	}

	.poster {
		width: 80%;
		height: 840rpx;
		border-radius: 16rpx;
		margin: 80rpx 10% 0;
	}

	.morebtn {
		width: 80%;
		margin: 80rpx 10% 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.morebtn .lis {
		margin: 0 64rpx;
		flex-shrink: 0;
	}

	.morebtn .lis .icon {
		width: 80rpx;
		height: 80rpx;
		background: #ccc;
		border-radius: 80rpx;
		display: block;
		margin: 0 auto;
	}

	.morebtn .lis .tt {
		width: 100%;
		text-align: center;
		font-size: 26rpx;
		margin-top: 16rpx;
		color: #333;
	}

	.morebtn .lis:nth-child(1) .icon {
		background: url(../../static/ik1.png) no-repeat;
		background-size: 100% 100%;
	}

	.morebtn .lis:nth-child(2) .icon {
		background: url(../../static/ik2.png) no-repeat;
		background-size: 100% 100%;
	}

	.morebtn .lis:nth-child(3) .icon {
		background: url(../../static/coma.png) no-repeat;
		background-size: 100% 100%;
	}

	/* 图片预览层样式 - 仅iOS H5使用 */
	.preview-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.preview-container {
		width: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.preview-img {
		max-width: 100%;
		max-height: 70vh;
		margin-bottom: 30rpx;
		pointer-events: auto;
		user-select: auto;
		-webkit-user-select: auto;
	}

	/* Safari特殊修复 */
	.safari-fix {
		-webkit-touch-callout: default;
		touch-action: manipulation;
	}

	.preview-tip {
		color: #ffffff;
		font-size: 30rpx;
		margin-bottom: 40rpx;
		text-align: center;
		line-height: 1.5;
	}

	.close-btn {
		background-color: #ffffff;
		color: #333333;
		padding: 15rpx 40rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
</style>
