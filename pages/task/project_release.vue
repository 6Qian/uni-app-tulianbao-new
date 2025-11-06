<template>
	<view class="content">
		<view class="pocs">
			<input type="text" class="title" placeholder="请输入标题" v-model="form.title">
			<textarea name="" id="" cols="30" rows="10" placeholder="请输入创作内容" v-model="form.content" maxlength="1000"></textarea>
			<view class="imglist">
				<view class="addimg" @tap="upload(-1)"></view>
				<view class="imglis" @tap="imageClick(index)" v-for="(item,index) in form.images">
					<image :src="item" mode="aspectFill"></image>
				</view>
				
			</view>
		</view>
		<view class="mosc">
			<view class="ts">分类</view>
			
			<picker @change="changeClass" style="width: 100%;" :value="classifyIdx" range-key="name" :range="classify">
				<view class="uni-input" v-if="classify[classifyIdx]">{{classify[classifyIdx].name}}</view>
			</picker>
		</view>
		<view class="mosc" v-if="!modelsp">
			<view class="ts">定价</view>
			<input type="text" placeholder="请输入金币数量" v-model="form.price"/>
		</view>
		<view class="btn" @click="go">发布</view>
	</view>
</template>

<script>
	export default {
	    data() {
	        return {
	            form:{
					title:"",
					content:"",
					classify_id:0,
					images:[],
					price:"10"
				},
				classify:[],
				classifyIdx:0,
	        }
	    },
		onLoad(){
			this.init()
		},
	    methods: {
			go(){
				this.app.ajax({
					url:"/article/add",
					data:this.form,
					load:true,
					method:"post",
					success:(res)=>{
						if(res.code == 200){
							this.app.alert({
								content:res.message,
								success:()=>{
									this.app.goBack();
								}
							})
						}else{
							this.app.toast(res.message)
						}
					},
				});
			},
			//图片被点击后
			imageClick(index){
				var _this = this;
				uni.hideKeyboard();
				uni.showActionSheet({
					itemList: ['查看', '替换', '删除'],
					success(res) {
						if(res.tapIndex == 0){
							_this.app.openImage(0,[_this.form.images[index]]);
						}else if(res.tapIndex == 1){
							_this.upload(index);
						}else if(res.tapIndex == 2){
							_this.form.images.splice(index,1);
						}
					}
				});
			},
			//上传图片
			upload(index){
				let _this = this;
				uni.hideKeyboard();
				uni.chooseImage({
				    count: 1, //默认9
					sizeType:['compressed'],
				    success(res) {
						// const tempFilePath = res.tempFiles[0].path;
						// let compressedPath;
						//     try {
						// 		// 判断平台：H5 用 Canvas 压缩，其他端用 uni.compressImage
						// 		const platform = uni.getSystemInfoSync().platform;
						// 		if (platform === 'h5') {
						// 			// H5 端压缩
						// 			compressedPath = await _this.app.compressImageH5(tempFilePath, {
						// 			  quality: 0.7, // 压缩质量（0-1）
						// 			  maxWidth: 1200 // 最大宽度
						// 			});
						// 		} else {
						// 			// 小程序/App 端用官方 API 压缩
						// 			const compressRes = await new Promise((resolve) => {
						// 				uni.compressImage({
						// 					src: tempFilePath,
						// 					quality: 30, // 压缩质量（0-100）
						// 					success: resolve
						// 				});
						// 			});
						// 			compressedPath = compressRes.tempFilePath;
						// 		}
						// 		_this.app.uploadOss({
						// 			load: true,
						// 			filePath: compressedPath,
						// 			success(res){
						// 				_this.$forceUpdate();
						// 				if(index === -1){
						// 					_this.form.images.push(res.data.url);
						// 				}else{
						// 					_this.form.images[index] = res.data.url;
						// 				}
						// 			}
						// 		});
						// 	} catch (err) {
						// 	  console.error('压缩失败：', err);
						// 	  uni.showToast({ title: '图片压缩失败', icon: 'none' });
						// 	}
						res.tempFiles.forEach((item,j)=>{
							const maxSize = 20 * 1024 * 1024; // 20M
						    if (item.size > maxSize) {
								uni.showToast({
								  title: '图片大小不能超过20M',
								  icon: 'none'
								});
								return; // 超过限制，终止处理
						    }
							_this.app.uploadOss({
								load: true,
								filePath: item.path,
								success(res){
									_this.$forceUpdate();
									if(index === -1){
										_this.form.images.push(res.data.url);
									}else{
										_this.form.images[index] = res.data.url;
									}
								}
							});
						})
				    }
				});
			},
			init(){
				this.app.ajax({
					url: "/article/getClassify",
					data:{is_user:1},
					success:(res)=> {
						this.classify = res.data
						this.form.classify_id = this.classify[0].id
					},
				});
			},
	        changeClass: function(e) {
				this.classifyIdx = e.detail.value;
	            this.form.classify_id = this.classify[this.classifyIdx].id
	        },
	    }
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.pocs{
		width: 100%;
		background: #fff;
		padding-bottom: 32rpx;
		margin-bottom: 32rpx;
	}
	input.title{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		border-bottom: 2rpx #f5f5f5 solid;
		margin-left: 4%;
		font-size: 28rpx;
	}
	textarea{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		line-height: 48rpx;
		font-size: 28rpx;
	}
	.imglist{
		width: 100%;
		height: 128rpx;
		margin-top: 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		overflow: scroll;
		overflow: hidden;
		padding: 0 4%;
		box-sizing: border-box;
	}
	.imglist .imglis{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		margin-left: 24rpx;
		flex-shrink: 0;
	}
	.imglist .imglis image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
	}
	.imglist .addimg{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		background: url(../../static/reaelseadd.png) no-repeat;
		background-size: 100% 100%;
		flex-shrink: 0;
	}
	.btn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
		border-radius: 16rpx;
		position: fixed;
		bottom: 64rpx;
		left: 4%;
		text-align: center;
		background: #f9285c;
	}
	.mosc{
		width: 100%;
		height: 88rpx;
		background: #fff;
		padding: 0 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.mosc .ts{
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #333;
		text-align: left;
		width: 100rpx;
	}
	.mosc select{
		width: 100%;
		height: 88rpx;
		border: none;
		outline: none;
	}
	.mosc  input{
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #999;
	}
	.mosc:nth-last-child(2){
		border-top: 2rpx #f5f5f5 solid;
	}
	select{
		background: #fff !important;
		font-size: 28rpx !important;
	}
</style>
