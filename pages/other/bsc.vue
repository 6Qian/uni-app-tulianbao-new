<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="noks">
				<view class="icon"></view>
				<view class="tok">
					<view class="ts">购买脉点</view>
					<view class="tt">单价¥{{row.money}}</view>
				</view>
			</view>
		</view>
		<view class="status-bars"></view>
		<view class="ckm">
			<view class="toscs">
				<view class="kko">
					按数量
				</view>
			</view>
			<view class="input">
				<input type="text" placeholder="0.00" v-model="num">
				<view class="right">脉点</view>
			</view>
			<view class="tt">购买后请在10分钟内完成付款</view>
			<view class="mon">应付<text>¥{{ ((num?num:0) * (row.money?row.money:0)).toFixed(2) }}</text></view>
		</view>
		<view class="info">
			<view class="title">商家信息</view>
			<view class="tons">
				<view class="left">交易时间</view>
				<view class="right">30分钟</view>
			</view>
			<view class="tons">
				<view class="left">商家昵称</view>
				<view class="right">{{row.nickname}}</view>
			</view>
			<view class="title">交易提醒</view>
			<view class="tips">交易将产生1%的手续费由卖方承担，订单生成后就立即扣除，交易失败则退回。多次恶意购买不付款将冻结账号处理。</view>
		</view>
		
		<view class="pobtn" @click="join_buy()">
			立即购买
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				id:0,
				row:{},
				num:"",
				type:[],
				info:{},
				load:false,
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
			};
		},
		onLoad(args){
			this.id = args.id
			this.num = args.point_num
			this.init();
		},
		onShow(){
			this.init();
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header';
			} else {
				this.header_class = 'header';
			}
		},
		methods: {
			init(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/order_info",
					method: "get",
					data: {
						id: _this.id
					},
					success(res){
						if(!res.code){
							uni.navigateBack();
							return;
						}
						if(res.data.status !== 0){
							_this.app.toast('已下架');
							setTimeout(()=>{
								uni.navigateBack();
							},1000)
							return;
						}
						_this.row = res.data
					}
				});
				_this.app.ajax({
					url: "/exchange/profile",
					success(res) {
						_this.info = res.data.info
					},
				});
			},
			join_buy(){
				uni.showModal({
					title: '提示',
					content: '确认购买吗？拍下就要付款',
					success: (ccc) => {
						if (ccc.confirm) {
							if(this.load) return;
							this.load = true;
							let _this = this;
							_this.app.ajax({
								url: "/exchange/join_buy",
								load:true,
								method:"post",
								data:{
									id:_this.id,
									point_num:_this.num,
								},
								success(res) {
									_this.app.toast(res.msg)
									_this.load = false
									if(res.code) {
										setTimeout(()=>{
											_this.ToOrder(res.data.id);
										},1000)
									}
								},done(){
									_this.load = false
								}
							});
						}
					}
				});
				
			},
			ToOrder(id){
				uni.redirectTo({
					url:"/pages/index/buy_order?id="+id
				})
			},
			returns() {
				uni.navigateBack({
					delta: 1
				});
			}
		},
	};
</script>

<style>
	page{
		background: #fff;
	}
	.headers {
		width: 100%;
		height: 96rpx;
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
		background: #fff;
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
		background: url(../../static/img/return.png) no-repeat;
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
		color: #333;
		position: absolute;
		bottom: 0;
		right: 4%;
		z-index: 9999;
	}
	.noks{
		height: 96rpx;
		width: 50%;
		position: absolute;
		left: 88rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.noks .icon{
		width: 48rpx;
		height: 48rpx;
		background: url(../../static/img/level_g.png) no-repeat;
		background-size: 100% 100%;
		border-radius: 48rpx;
	}
	.noks .tok{
		margin-left: 16rpx;
	}
	.noks .tok .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	.noks .tok .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.ckm{
		width: 92%;
		background: #f5f5f5;
		margin: 16rpx 4%;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
	}
	.ckm .toscs{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.ckm .toscs .kko{
		height: 56rpx;
		line-height: 56rpx;
		font-size: 28rpx;
		font-weight: bold;
		position: relative;
		color: #333;
	}
	.ckm .toscs .kko::after{
		content: "";
		width: 100%;
		height: 4rpx;
		background: #333;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.ckm .input{
		width: 100%;
		height: 96rpx;
		position: relative;
		border-bottom: 2rpx #e3dfdf solid;
		margin: 32rpx 0 24rpx;
	}
	.ckm .input input{
		height: 80rpx;
		line-height: 80rpx;
		font-weight: bold;
		color: #333;
		font-size: 40rpx;
	}
	.ckm .input .right{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		position: absolute;
		top: 0;
		right: 0;
	}
	.ckm .tt{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
	}
	.ckm .mon{
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 48rpx;
		color: #333;
		font-size: 28rpx;
	}
	.ckm .mon text{
		margin-left: 16rpx;
		color: #999;
		font-weight: bold;
		font-size: 32rpx;
	}
	.info{
		width: 92%;
		margin: 32rpx 4%;
	}
	.info .title{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 30rpx;
		font-weight: bold;
		margin: 24rpx 0;
	}
	.info .tons{
		width: 100%;
		height: 56rpx;
		line-height: 56rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
	}
	.info .tons .right{
		color: #333;
		font-weight: bold;
	}
	.info .tips{
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
	}
	.pobtn{
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		text-align: center;
		
		background: linear-gradient(45deg, #303241, #696b76);
		position: absolute;
		bottom: 64rpx;
		left: 4%;
		border-radius: 88rpx;
		font-weight: bold;
		color: #fff;
	}
	.payments{
		width: 100%;
		height: 80rpx;
		background: #eee;
		border-radius: 8rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: relative;
	}
	.payments .icon{
		width: 40rpx;
		height: 40rpx;
		border-radius: 48rpx;
	}
	.payments .icon image{
		width: 40rpx;
		height: 40rpx;
		border-radius: 48rpx;
	}
	.payments  .ts{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-left: 16rpx;
	}
	.payments .tt{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 8rpx;
	}
	.payments  .aru{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #0093ff;
		position: absolute;
		top: 0;
		right: 24rpx;
	}
	.payment{
		width: 100%;
		height: 80rpx;
		background: #eee;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.payment .tt{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #999;
	}
	.payment .aru{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		text-decoration: underline;
		margin-left: 16rpx;
	}
	.paymentlist{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.paymentlist .lis{
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
	.paymentlist .lis.active{
		background: linear-gradient(45deg, #303241, #696b76);
		color: #fff;
	}
	.paymentlist .lis:nth-child(3){
		margin-right: 0;
	}
</style>