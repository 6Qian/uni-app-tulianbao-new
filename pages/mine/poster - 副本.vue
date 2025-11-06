<template>
	<view class="content">
		<view class="poster">
			<swiper class="image-container" style="width: 100%;
				height: 100%;" previous-margin="0rpx" next-margin="0rpx" @change="currentIndex = $event.detail.current">
				<swiper-item class="swiper-item" v-for="(item, index) in posters">
					<image class="image" style="width: 100%;" :src="item" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>


		<!-- <view class="poster" v-else>
			<image src="/static/ancja.png" mode="widthFix" style="width: 100%;"></image>
		</view> -->


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

		<l-painter ref="painter" useCORS custom-style="position:fixed;left:200%;"></l-painter>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				info: {},

				//当前海报下标
				currentIndex: 0,

				//所有海报版式
				posters: [],

				//海报模板
				templatePosters: [
					"/static/hbbs.png",
					// "/static/hbb.png",
					"/static/hb.png",
				],

			}
		},
		methods: {
			download() {
				var _this = this;
				const poster = _this.posters[_this.currentIndex];
				console.log(_this.posters)
				// #ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: poster,
					success: (res) => {
						_this.app.toast("海报保存成功");
					},
					fail: (err) => {
						_this.app.toast("海报保存失败");
					}
				});
				// #endif


				// #ifdef H5
				try {
					// 创建<a>标签
					const a = document.createElement('a');
					// 设置下载链接为Blob URL
					a.href = poster;
					// 设置下载文件名（自定义，需包含扩展名，如.jpg/.png）
					a.download = `image-${new Date().getTime()}.jpg`;
					// 触发下载
					document.body.appendChild(a);
					a.click();
					// 清理DOM
					document.body.removeChild(a);
					// 可选：释放Blob URL资源（如果后续不再使用该链接）
					// URL.revokeObjectURL(this.blobUrl);
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				} catch (err) {
					console.error('保存失败：', err);
					uni.showToast({
						title: '保存失败，请重试',
						icon: 'none'
					});
				}
				// #endif

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
			//海报生成器
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
							},
							{
								css: {

								},
								views: [


								]
							}

						]
					}).then(e => {
						_this.$refs.painter.canvasToTempFilePathSync({
							fileType: "jpg",
							pathType: 'url',
							quality: 0.9,
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

		},
		onLoad(e) {
			this.app.ajax({
				url: "/user/profile",
				success: (res) => {
					this.info = res.data
					this.createPoster();
				},
			});
		},
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
</style>