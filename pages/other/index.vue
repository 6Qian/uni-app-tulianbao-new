<template>
	<view class="content">
		<view class="userinfo" @tap="app.openUrl({ url: '/pages/login/index' })" v-if="info == null">
			<view class="avatar">
				<image src="/static/img/cil.png" mode="aspectFill"></image>
			</view>
			<view class="text" style="width: 50%;">
				<view class="ts">登录/注册</view>
				<view class="tt">登陆享受更多功能</view>
			</view>
		</view>
		<view class="userinfo" v-else>
			<view class="avatar">
				<image :src="info.avatar" mode="aspectFill"></image>
			</view>
			<view class="text" style="width: 50%;">
				<view class="ts">{{ info.nickname }}</view>
				<view class="tt">欢迎来到人脉Hub</view>
			</view>
		</view>
		<view class="smons">
			<view class="ts">我的脉点</view>
			<view class="now">{{ info ? info.score : 0}}</view>
			<view class="bots">
				<view class="left">
					<view class="lis">
						<view class="bott">可兑换</view>
						<view class="bono">{{ info ? info.status_score : 0}}</view>
					</view>
					<view class="lis">
						<view class="bott">冻结中</view>
						<view class="bono">{{ info ? info.freeze_score : 0}}</view>
					</view>
				</view>
				<view class="right" v-if="info">
					<view class="btna"  @click="type=0;popups = true">兑出</view>
					<view class="btnb"  @click="type=1;popups = true">兑入</view>
				</view>
			</view>
			<view class="log" @click="ToLog()">脉点记录</view>
		</view>
		<view class="order">
			<view class="title"><view class="ts">我的订单</view><view class="tt"  @click="ToOrder()">查看全部</view></view>
			<view class="list">
				<view class="lis"  @click="ToOrder(1)">
					<view class="icon">
						<image src="../../static/img/o1.png" mode="aspectFill"></image>
					</view>
					<view class="ts">待付款</view>
				</view>
				<view class="lis"  @click="ToOrder(2)">
					<view class="icon">
						<image src="../../static/img/o2.png" mode="aspectFill"></image>
					</view>
					<view class="ts">待确认</view>
				</view>
				<view class="lis"  @click="ToOrder(3)">
					<view class="icon">
						<image src="../../static/img/o3.png" mode="aspectFill"></image>
					</view>
					<view class="ts">已完成</view>
				</view>
				<view class="lis"  @click="ToOrder(4)">
					<view class="icon">
						<image src="../../static/img/o4.png" mode="aspectFill"></image>
					</view>
					<view class="ts">已取消</view>
				</view>
			</view>
		</view>
		<view class="morelist">
			<view class="lis" @click="ToPayment()">
				<view class="icon">
					<image src="../../static/img/p1.png" mode="aspectFill"></image>
				</view>
				<view class="ts">收款信息</view>
				<view class="righticon"></view>
			</view>
			<view class="lis"  @click="ToRule()">
				<view class="icon">
					<image src="../../static/img/p2.png" mode="aspectFill"></image>
				</view>
				<view class="ts">规则说明</view>
				<view class="righticon"></view>
			</view>
			<view class="lis" @click="ToService()">
				<view class="icon">
					<image src="../../static/img/p3.png" mode="aspectFill"></image>
				</view>
				<view class="ts">联系客服</view>
				<view class="righticon"></view>
			</view>
			<view class="lis" @click="logout()">
				<view class="icon">
					<image src="../../static/img/p4.png" mode="aspectFill"></image>
				</view>
				<view class="ts">退出登陆</view>
				<view class="righticon"></view>
			</view>
		</view>
		
		<view class="popups" v-if="popups">
			<view class="bos" @click="popups = false"></view>
			<view class="popupscenter">
				<view class="tts">{{type?'兑入':'兑出'}}</view>
				<view class="ttt">一经{{type?'兑入':'兑出'}}，无法撤回！</view>
				
				<view class="pox">
					<view class="ts">兑换数量</view>
					<input type="text" placeholder="0.00" v-model="num">
					<view class="ts">消耗数量</view>
					<input type="text" disabled="disabled" v-model="aaa">
					<view class="ts">手续费</view>
					<input type="text" disabled="disabled" v-model="bbb">
				</view>
				
				<view class="btn" @click="exgo">立即兑换</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
	    data() {
	    	return {
	    		info: this.app.isLogin() ? this.app.getUserInfo() : null,
				popups:false,
				
				num:'',
				type:0,
				aaa:'',
				bbb:'',
	    	}
	    },
		watch:{
			num(newVal, oldVal) {
			  // 监听文本框值的改变
			  if (newVal !== oldVal && newVal) {
				let rate = (parseFloat(newVal) * parseFloat(this.info[(this.type?'in_rate':'out_rate')]) / 100).toFixed(2)
				this.aaa = parseFloat(newVal) + parseFloat(rate);
				this.bbb = rate
			  }
			},
		},
		onLoad() {
			
		},
		onShow() {
			this.app.isLogin() && this.getData();
		},
	    methods: {
			exgo(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/exgo",
					load:true,
					method:"post",
					data:{num:this.num,type:this.type},
					success(res) {
						_this.app.toast(res.msg)
						if(res.code){
							_this.getData();
						}
					}
				});
			},
			logout(){
				uni.showModal({
					title: '提示',
					content: "退出账号后，您将不可享受平台部分功能，确定退出吗？",
					success: (ccc) => {
						if (ccc.confirm) {
							this.app.loginExit();
							this.info = null
						}
					}
				});
			},
			getData() {
				let _this = this;
				_this.app.ajax({
					url: "/exchange/profile",
					success(res) {
						res.data.info.token = _this.app.token();
			
						_this.info = res.data.info;
						_this.app.setUserInfo(res.data.info);
					}
				});
			},
			ToLog(){
				uni.navigateTo({
					url:"/pages/mine/log"
				})
			},
			ToOrder(a = 0){
				uni.navigateTo({
					url:"/pages/mine/order" +(a?('?status='+a):'')
				})
			},
			ToPayment(){
				uni.navigateTo({
					url:"/pages/mine/payment"
				})
			},
			ToRule(){
				uni.navigateTo({
					url:"/pages/mine/rule"
				})
			},
			ToService(){
				uni.navigateTo({
					url:"/pages/mine/service"
				})
			}
	    }
	};
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.userinfo{
		width: 100%;
		padding: 32rpx 4%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-image: linear-gradient(#fff, #f5f5f5);
		box-sizing: border-box;
	}
	.userinfo .avatar{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.userinfo .avatar image{
		width: 80rpx;
		height: 80rpx;
		background: #eee;
		border-radius: 80rpx;
	}
	.userinfo  .text{
		width: 100%;
		height: 80rpx;
	}
	.userinfo  .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.userinfo  .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.smons{
		width: 92%;
		margin: 16rpx 4% 32rpx;
		background: linear-gradient(45deg, #303241, #696b76);
		border-radius: 16rpx;
		padding: 24rpx;
		box-sizing: border-box;
		position: relative;
	}
	.smons .ts{
		width: 100%;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		opacity: 0.75;
	}
	.smons .now{
		width: 100%;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
		margin-top: 16rpx;
	}
	.smons .bots{
		width: 100%;
		margin-top: 64rpx;
		display: flex;
		justify-content: space-between;
	}
	.smons .bots .left{
		width: 42%;
		height: 88rpx;
		display: flex;
		justify-content: flex-start;
	}
	.smons .bots .left .lis{
		width: 50%;
		height: 80rpx;
		margin-right: 48rpx;
	}
	.smons .bots .left .lis .bott{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		text-align: center;
		color: #fff;
		opacity: 0.75;
		margin-top: 4rpx;
	}
	.smons .bots .left .lis .bono{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		color: #fff;
		text-align: center;
		font-weight: bold;
		margin-top: 4rpx;
	}
	.smons .bots .right{
		height: 88rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.smons .bots .right .btna{
		height: 56rpx;
		line-height: 52rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		border: 2rpx #fff solid;
		background: rgba(255, 255, 255, 0.25);
		padding: 0 32rpx;
		border-radius: 16rpx;
		color: #fff;
	}
	.smons .bots .right .btnb{
		height: 56rpx;
		line-height: 52rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		border: 2rpx #fff solid;
		background: #fff;
		padding: 0 32rpx;
		border-radius: 16rpx;
		color: #12121f;
		margin-left: 24rpx;
	}
	.smons .log{
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		background: rgba(255, 255, 255, 0.5);
		position: absolute;
		top: 0;
		right: 0;
		padding: 0 32rpx;
		border-radius: 0 16rpx 0 16rpx;
	}
	.order{
		width: 92%;
		margin: 0 4%;
		border-radius: 16rpx;
		background: #fff;
	}
	.order .title{
		padding: 24rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
	.order .title .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.order .title .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.order .list{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.order .list .lis{
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 12rpx 0 24rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
	}
	.order .list .lis .icon{
		width: 48rpx;
		height: 48rpx;
	}
	.order .list .lis .icon image{
		width: 48rpx;
		height: 48rpx;
	}
	.order .list .lis  .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		width: 100%;
		text-align: center;
		color: #333;
		margin-top: 12rpx;
	}
	.morelist{
		width: 100%;
		margin-top: 32rpx;
		background: #fff;
	}
	.morelist .lis{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.morelist .lis .icon{
		width: 40rpx;
		height: 40rpx;
		border-radius: 40rpx;
	}
	.morelist .lis .icon image{
		width: 40rpx;
		height: 40rpx;
		border-radius: 40rpx;
	}
	.morelist .lis  .ts{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		margin-left: 16rpx;
	}
	.morelist .lis .righticon{
		height: 32rpx;
		width: 32rpx;
		background: url(../../static/img/more.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: 28rpx;
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
	/* #ifdef APP */
	.popupscenter{
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		z-index: 99;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-radius: 24rpx 24rpx 0 0;
		background: #fff;
	}
	/* #endif */
	/* #ifdef H5 */
	.popupscenter{
		width: 100%;
		position: fixed;
		bottom: 88rpx;
		left: 0;
		z-index: 99;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-radius: 24rpx 24rpx 0 0;
		background: #fff;
	}
	/* #endif */
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
</style>