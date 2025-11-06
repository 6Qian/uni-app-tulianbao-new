<template>
    <view class="container">
		
		<view class="paymentlist">
			<view class="lis">
				<view class="icon">
					<image src="/static/img/cc1.png" mode="aspectFill"></image>
				</view>
				<view class="ts">银行卡</view>
				<view class="ttt" @click="bank = true">{{info.is_bank?"已绑定":"立即绑定"}}</view>
			</view>
			<view class="lis">
				<view class="icon">
					<image src="/static/img/cc2.png" mode="aspectFill"></image>
				</view>
				<view class="ts">支付宝</view>
				<view class="ttt" @click="alipay = true">{{info.is_alipay?"已绑定":"立即绑定"}}</view>
			</view>
			<view class="lis">
				<view class="icon">
					<image src="/static/img/cc3.png" mode="aspectFill"></image>
				</view>
				<view class="ts">微信</view>
				<view class="ttt" @click="wechatpay = true">{{info.is_wechat?"已绑定":"立即绑定"}}</view>
			</view>
		</view>
		
		
		<view class="popups" v-if="bank">
			<view class="bos" @click="bank = false"></view>
			<view class="popupscenter">
				<view class="tts">绑定收款信息</view>
				<view class="ttt">请核对清楚相关信息</view>
				
				<!-- 银行卡 -->
				<view class="pox">
					<view class="ts">银行姓名</view>
					<input type="text" placeholder="请输入您的姓名" v-model="bankinfo.real">
					<view class="ts">银行卡号</view>
					<input type="text" placeholder="请输入您的卡号" v-model="bankinfo.account">
					<view class="ts">银行名称</view>
					<input type="text" placeholder="请输入您的银行" v-model="bankinfo.name">
					<view class="ts">银行支行</view>
					<input type="text" placeholder="请输入您的支行" v-model="bankinfo.branch">
					<view class="ts">联系方式</view>
					<input type="text" placeholder="例如 微信号Hub888  手机号188*****888" >
				</view>
				
				<view class="btn" @click="bind('bank')">立即绑定/修改</view>
			</view>
		</view>
		
		
		
		<view class="popups" v-if="alipay">
			<view class="bos" @click="alipay = false"></view>
			<view class="popupscenter">
				<view class="tts">绑定收款信息</view>
				<view class="ttt">请核对清楚相关信息</view>
				
				<view class="pox" >
					<view class="ts">支付宝姓名</view>
					<input type="text" placeholder="请输入您的姓名" v-model="alipayinfo.name">
					<view class="ts">支付宝账户</view>
					<input type="text" placeholder="请输入您的账户" v-model="alipayinfo.account">
					<view class="ts">联系方式</view>
					<input type="text" placeholder="例如 微信号Hub888  手机号188*****888" >
					<view class="ts">收款码</view>
					<view class="imglist">
						<view class="up" @click="chooseImage('alipayinfo')">
							<image src="../../static/img/adduser.png" mode="aspectFill"></image>
						</view>
						<view class="img" v-if="alipayinfo.image">
							<image :src="alipayinfo.image" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="btn" @click="bind('alipay')">立即绑定/修改</view>
			</view>
		</view>
		
		
		<view class="popups" v-if="wechatpay">
			<view class="bos" @click="wechatpay = false"></view>
			<view class="popupscenter">
				<view class="tts">绑定收款信息</view>
				<view class="ttt">请核对清楚相关信息</view>
				
				<view class="pox">
					<view class="ts">微信姓名</view>
					<input type="text" placeholder="请输入您的姓名" v-model="wechatinfo.name">
					<view class="ts">微信号账户</view>
					<input type="text" placeholder="请输入您的账户" v-model="wechatinfo.account">
					<view class="ts">联系方式</view>
					<input type="text" placeholder="例如 微信号Hub888  手机号188*****888" >
					<view class="ts">收款码</view>
					<view class="imglist">
						<view class="up"  @click="chooseImage('wechatinfo')">
							<image src="../../static/img/adduser.png" mode="aspectFill"></image>
						</view>
						<view class="img" v-if="wechatinfo.image">
							<image :src="wechatinfo.image" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="btn" @click="bind('wechat')">立即绑定/修改</view>
			</view>
		</view>
    </view>
</template>

<script>
	var sourceType = [
		['camera'], //拍照
		['album'], //相册
		['camera', 'album'] //拍照或相册
	]
	var sizeType = [
		['compressed'], //压缩
		['original'], //原图
		['compressed', 'original'] //压缩或原图
	]
export default {
    data() {
        return {
			bank:false,
			alipay:false,
			wechatpay:false,
			
			info:{},
			bankinfo:{
				real:"",
				account:"",
				name:"",
				branch:"",
			},
			wechatinfo:{
				name:"",
				account:"",
				image:"",
			},
			alipayinfo:{
				name:"",
				account:"",
				image:"",
			},
			
			imageList: [], //保存图片路径集合
			imageLength: 3, //限制图片张数
			sourceTypeIndex: 2, //添加方式限制
			sizeTypeIndex: 2, //图片尺寸限制
        };
    },
	onLoad() {
		this.init();
	},
    methods: {
		init(){
			let _this = this;
			_this.app.ajax({
				url: "/exchange/profile",
				success(res) {
					_this.info = res.data.info
					_this.alipayinfo = _this.info.alipay;
					_this.wechatinfo = _this.info.wechat;
					_this.bankinfo = _this.info.bank;
				},
			});
		},
		bind(type){
			let _this = this;
			_this.app.ajax({
				url: "/exchange/bind?type="+type,
				load:true,
				method:"post",
				data:this[type+"info"],
				success(res) {
					_this.app.toast(res.msg)
					_this.init();
					_this.bank = false
					_this.wechatpay = false
					_this.alipay = false
				},
			});
		},
		chooseImage: async function(type) {
			let that = this
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				// #ifdef MP-WEIXIN
				sizeType: sizeType[this.sizeTypeIndex],
				// #endif
				count: 1,
				success: (res) => {
		
					res.tempFilePaths.forEach(r => {
						that.uploadFile(r,type)
					})
		
				}
			})
		},
		// 上传图片
		uploadFile(filePath,type) {
			uni.showLoading({
				title:'请稍等'
			})
			let _this = this;
			_this.app.uploadOss({
				load: true,
				filePath: filePath,
				success(res){
					_this.$forceUpdate();
					_this[type].image = res.data.net_url;
				}
			});
		},
		//预览图片
		previewImage: function(e) {
			var current = e.target.dataset.src
			uni.previewImage({
				current: current,
				urls: this.imageList
			})
		},
		//删除图片
		deleteImage: function(e) {
			var index = e.target.dataset.index;
			var that = this;
			var images = that.imageList;
			images.splice(index, 1);
			that.imageList = images;
		},
    }
};
</script>

<style>
	page{
		background: #f5f5f5;
		overflow: hidden;
	}
	.table{
		width: 92%;
		margin: 32rpx 4%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
	}
	.table .lis{
		width: 31%;
		height: 80rpx;
		background: #eee;
		color: #999;
	}
	.table .lis{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-right: 3.5%;
		width: 31%;
		text-align: center;
		color: #999;
		
	}
	.table .lis.active{
		background: linear-gradient(45deg, #303241, #696b76);
		color: #fff;
	}
	.table .lis:nth-child(3){
		margin-right: 0;
	}
	.pox{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		background: #f5f5f5;
		margin: 32rpx 0 64rpx;
		border-radius: 16rpx;
	}
	.pox .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.pox  input{
		width: 100%;
		height: 80rpx;
		border: 2rpx #eee solid;
		background: #fff;
		border-radius: 8rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
		margin: 24rpx 0;
		font-size: 28rpx;
		color: #333;
	}
	.popupscenter .btn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		text-align: center;
		background: linear-gradient(45deg, #303241, #696b76);
		border-radius: 88rpx;
		font-weight: bold;
		color: #fff;
		margin-left: 4%;
	}
	.uni-input-placeholder{
		font-size: 28rpx;
		color: #999;
	}
	.paymentlist{
		width: 100%;
		background: #fff;
	}
	.paymentlist .lis:last-child{
		border-bottom: none;
	}
	.paymentlist .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.paymentlist .lis .icon{
		width: 40rpx;
		height: 40rpx;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}
	.paymentlist .lis .icon image{
		width: 40rpx;
		height: 40rpx;
		border-radius: 48rpx;
	}
	.paymentlist .lis .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.paymentlist .lis .ttt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 32rpx;
		right: 4%;
	}
	.popups{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 97;
	}
	.popups .bos{
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 98;
	}
	.popupscenter{
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-radius: 24rpx 24rpx 0 0;
		background: #fff;
	}
	.popupscenter .tts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}
	.popupscenter .ttt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.imglist{
		width: 100%;
		height: 128rpx;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.imglist .up{
		width: 128rpx;
		height: 128rpx;
		background: #fff;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		margin-right: 32rpx;
	}
	.imglist .up image{
		width: 128rpx;
		height: 128rpx;
	}
	.imglist  .img{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.imglist  .img image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
	}
</style>