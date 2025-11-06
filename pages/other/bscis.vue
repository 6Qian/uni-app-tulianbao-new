<template>
	<view class="content">
		<view class="paymentlist">
			<view class="lis">
				<view class="ts">订单状态</view>
				<view class="ttt" v-if="row.status == 0">匹配中... <text>(投诉对方)</text></view>
				<view class="ttt" v-if="row.status == 1">交易中... <text>(投诉对方)</text></view>
				<view class="ttt" v-if="row.status == 2">已完成 <text>(投诉对方)</text></view>
				<view class="ttt" v-if="row.status == 3">已取消 <text>(投诉对方)</text></view>
			</view>
			<view class="lis" v-if="row.status == 1 && row.end_time>0">
				<view class="ts">交易时间</view>
				<view class="ttt">{{ app.getSecondTime(totalSeconds) }}</view>
			</view>
			<view class="lis">
				<view class="ts">付款用户</view>
				<view class="ttt">我</view>
			</view>
			<view class="lis">

				<view class="ts">付款方式</view>
				<view class="ttt" ><span style="margin-left: 20rpx;" v-for="(item,index) in row.pay_type">
						<span v-if="item == 'alipay'">支付宝 </span>
						<span v-if="item == 'wechat'">微信 </span>
						<span v-if="item == 'bank'">银行卡 </span>
					</span></view>
			</view>
			<view class="lis">

				<view class="ts">订单时间</view>
				<view class="ttt" >{{row.time}}</view>
			</view>
			<view class="lis">
	
				<view class="ts">脉点数量</view>
				<view class="ttt">{{row.point_num}}</view>
			</view>
			<view class="lis">

				<view class="ts">订单金额</view>
				<view class="ttt">{{row.price}}</view>
			</view>
			
			<view class="lis" v-if="!row.pay_status">
				<view class="ts">支付信息</view>
				
			</view>
			
			<view class="moscccc" style="width: 100%;" v-for="(item,index) in row.payinfo">
			<view class="kkkts">
				<view class="kkls">类型：{{item.type}}</view>
				<view class="kkls">账号：{{item.account}}</view>
				<view class="kkls">姓名：{{item.name}}</view>
				<view class="kkls" v-if="item.type == '银行卡'">银行名称:{{item.bank}}</view>
				<view class="kkls" v-if="item.type == '银行卡'">银行支行:{{item.branch}}</view>
			</view>
			<view class="imglist" v-if="item.image">
				<view class="img">
					<image :src="item.image" :data-src="item.image" mode="aspectFill" @tap="previewImage2"></image>
				</view>
			</view>
			</view>
			<view class="lis" v-if="!row.pay_status">
				
				<view class="ts">付款截图</view>
				<view class="ttt" style="color: red;">请付款后点击下方+号上传付款截图</view>
			</view>
			<view class="lis" v-if="!row.pay_status">
				<view class="imglist">
					<view class="up" v-if="imageList.length < imageLength" @tap="chooseImage">
						<image src="../../static/img/adduser.png" mode="aspectFill"></image>
					</view>
					<view class="img" v-for="(image,index) in imageList" :key="index">
						<image :src="image" :data-src="image" mode="aspectFill" @tap="previewImage"></image>
						<view class='del-btn' :data-index="index" @tap='deleteImage'>
							<view class='baicha'>删除</view>
						</view>
					</view>
				</view>
			</view>
			
			
			
		</view>
		<view style="width: 100%;height: 200rpx;"></view>
		<template v-if="row.status == 1">
			<view class="pobtn" v-if="!row.pay_status" @click="finish()">提交付款记录</view>
			<view class="pobtn" v-else >已付款，等待对方确认</view>
		</template>
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
				imageList: [], //保存图片路径集合
				imageLength: 3, //限制图片张数
				sourceTypeIndex: 2, //添加方式限制
				sizeTypeIndex: 2, //图片尺寸限制
				id:0,
				row:{},
				
				countdown: '', // 显示的倒计时文本
				totalSeconds: 60 * 5,
				inv:'',
			};
		},
		onLoad(args){
			this.id = args.id
			this.init();
		},
		onShow(){
			this.init();
		},
		methods: {
			startCountdown() {
			  this.updateCountdown();
			  this.inv = setInterval(() => {
				if (this.totalSeconds > 0) {
				  this.totalSeconds--;
				  this.updateCountdown();
				} else {
				  clearInterval(this.inv);
				}
			  }, 1000);
			},
			updateCountdown() {
			  const minutes = Math.floor(this.totalSeconds / 60);
			  const seconds = this.totalSeconds % 60;
			  this.countdown = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
			},
			padZero(num) {
			  return num < 10 ? '0' + num : num;
			},
			chooseImage: async function() {
				let that = this
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					// #ifdef MP-WEIXIN
					sizeType: sizeType[this.sizeTypeIndex],
					// #endif
					count: 1,
					success: (res) => {
			
						res.tempFilePaths.forEach(r => {
							that.uploadFile(r)
						})
			
					}
				})
			},
			// 上传图片
			uploadFile(filePath) {
				uni.showLoading({
					title:'请稍等'
				})
				let _this = this;
				_this.app.uploadOss({
					load: true,
					filePath: filePath,
					success(res){
						_this.$forceUpdate();
						_this.imageList = _this.imageList.concat(res.data.net_url);
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
			previewImage2: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [current]
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
			init(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/my_buy_order_info",
					method: "get",
					data: {
						id: _this.id
					},
					success(res){
						_this.row = res.data
						if(res.data.end_time && _this.inv == ''){
							_this.totalSeconds = res.data.end_time
							_this.startCountdown();
						}
					}
				});
			},
			finish(){
				uni.showModal({
					title: '提示',
					content: '确认吗？',
					success: (ccc) => {
						if (ccc.confirm) {
							let _this = this;
							_this.app.ajax({
								url: "/exchange/confirm_buy_order",
								load:true,
								method:"post",
								data:{
									id:_this.id,
									image:_this.imageList,
								},
								success(res) {
									_this.app.toast(res.msg)
									if(res.code) {
										setTimeout(()=>{
											_this.ToState();
										},1000)
									}
								}
							});
						}
					}
				});
			},
			ToState(){
				uni.redirectTo({
					url:"/pages/index/wait"
				})
			}
		},
	};
</script>

<style>
	page{
		background: #fff;
	}
	.paymentlist {
		width: 100%;
		background: #fff;
	}

	.paymentlist .lis:last-child {
		border-bottom: none;
	}

	.paymentlist .lis {
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.paymentlist .lis .icon {
		width: 40rpx;
		height: 40rpx;
		background: #eee;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}

	.paymentlist .lis .ts {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.paymentlist .lis .ttt {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 32rpx;
		right: 4%;
	}
	.imglist{
		width: 100%;
		height: 128rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.imglist .up{
		width: 128rpx;
		height: 128rpx;
		background: #f5f5f5;
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
		margin-right: 24rpx;
	}
	.imglist  .img image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
	}
	.pobtn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		text-align: center;
		
		background: linear-gradient(45deg, #303241, #696b76);
		position: fixed;
		bottom: 80rpx;
		left: 4%;
		border-radius: 88rpx;
		font-weight: bold;
		color: #fff;
	}
	.kkkts{
		width: 100%;
		font-size: 28rpx;
		padding:  24rpx;
		box-sizing: border-box;
		color: #666;
		background: yellow;
		background: #f5f5f5;
	}
	.kkkts .kkls{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		margin-bottom: 24rpx;
	}
	.kkkts .kkls:last-child{
		margin-bottom: 0;
	}
	.moscccc{
		padding: 0 4%;
		box-sizing: border-box;
		position: relative;
	}
	.moscccc 	.kkkts:nth-child(1){
		margin-bottom: 32rpx;
	}
	.moscccc .imglist{
		position: absolute;
		bottom: 32rpx;
		right: 4%;
		width: 92%;
		justify-content: flex-end;
	}
	.paymentlist .lis .ttt text{
		margin-left: 16rpx;
		color: red;
	}
</style>