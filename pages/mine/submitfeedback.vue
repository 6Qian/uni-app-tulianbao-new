<template>
	<view class="content">
		<textarea name="" id="" cols="30" rows="10" placeholder="请输入反馈内容" v-model="content"></textarea>
		<view class="imglist">
			<view class="addimg" @tap="upload(-1)"></view>
			<view class="imglis" @tap="imageClick(index)" v-for="(item,index) in images">
				<image :src="item" mode="aspectFill"></image>
			</view>
			
		</view>
		<view class="btn" @click="go">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				images:[],
				content:"",
			}
		}, 
		onLoad() {
		},
		methods: {
			go(){
				this.app.ajax({
					url:"/work/addfeed",
					data:{content:this.content,images:this.images},
					load:true,
					method:"post",
					success:(res)=>{
						this.app.alert({
							content:res.message,
							success:()=>{
								this.app.goBack();
							}
						})
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
							_this.app.openImage(0,[_this.images[index]]);
						}else if(res.tapIndex == 1){
							_this.upload(index);
						}else if(res.tapIndex == 2){
							_this.images.splice(index,1);
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
						for(let j in res.tempFiles){
							const maxSize = 20 * 1024 * 1024; // 20M
							if (res.tempFiles[j].size > maxSize) {
								uni.showToast({
								  title: '图片大小不能超过20M',
								  icon: 'none'
								});
								return; // 超过限制，终止处理
							}
							_this.app.uploadOss({
								load: true,
								filePath: res.tempFiles[j].path,
								success(res){
									_this.$forceUpdate();
									if(index === -1){
										_this.images.push(res.data.url);
									}else{
										_this.images[index] = res.data.url;
									}
								}
							});
						}
				    }
				});
			},
		},
	}
</script>

<style>
	textarea{
		width: 100%;
		padding: 24rpx;
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
</style>
