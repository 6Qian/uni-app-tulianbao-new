<template>
	<view class="content">
		<view class="nos">
			<view @click="togType(0)" :class="'lis '+(type == 0 ?'active':'')">全部</view>
			<view @click="togType(1)" :class="'lis '+(type == 1 ?'active':'')">出售</view>
			<view @click="togType(2)" :class="'lis '+(type == 2 ?'active':'')">求购</view>
			<view @click="togType(3)" :class="'lis '+(type == 3 ?'active':'')">购入</view>
			<view @click="togType(4)" :class="'lis '+(type == 4 ?'active':'')">购出</view>
		</view>
		<view class="nos">
			<view @click="togStatus(0)" :class="'lis '+(status == 0 ?'active':'')">全部</view>
			<view @click="togStatus(1)" :class="'lis '+(status == 1 ?'active':'')">待付款</view>
			<view @click="togStatus(2)" :class="'lis '+(status == 2 ?'active':'')">待确定</view>
			<view @click="togStatus(3)" :class="'lis '+(status == 3 ?'active':'')">已完成</view>
			<view @click="togStatus(4)" :class="'lis '+(status == 4 ?'active':'')">已取消</view>
		</view>
		
		<view class="orderlist" v-if="list.length>0">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<view class="ts">
					<view class="tag" v-if="item.is_self">{{item.is_sell ?'出售':'求购'}}</view>
					<view class="tag" v-if="!item.is_self">{{item.is_sell ?'购入':'购出'}}</view>
					<view class="tst">{{item.point_num}}脉点</view>
				</view>
				<view class="tt" v-if="item.is_self && item.is_sell">
					收款方式: 
						<span style="margin-left: 20rpx;" v-for="(a,b) in item.type">
							<span v-if="a == 'alipay'">支付宝 </span>
							<span v-if="a == 'wechat'">微信 </span>
							<span v-if="a == 'bank'">银行卡 </span>
						</span>
				</view>
				<view class="tt" >订单ID: {{item.id}}</view>
				<!-- 状态 -->
				<view class="tt" v-if="item.status == 0">订单状态: 匹配中...</view>
				<view class="tt" v-if="item.status == 1">订单状态: 交易中...</view>
				<view class="tt" v-if="item.status == 2">订单状态: 已完成</view>
				<view class="tt" v-if="item.status == 3">订单状态: 已取消</view>
				<!-- 时间 -->
				<view class="tt">订单时间: {{ app.getDateDiff(item.create_time * 1000) }}</view>
				<view class="tt" v-if="item.pay_time">付款时间: {{ app.getDateDiff(item.pay_time * 1000) }}</view>
				<view class="tt" v-if="item.status == 2">完成时间: {{ app.getDateDiff(item.update_time * 1000) }}</view>
				
				<!-- 实际状态描述 -->
				<view class="tt"  v-if="item.status == 1 && item.is_self && !item.is_sell && !item.pay_status">请在尽快付款给对方</view>
				<view class="tt"  v-if="item.status == 1 && item.is_self && !item.is_sell && item.pay_status">等待对方确认收款</view>
				<view class="tt"  v-if="item.status == 1 && !item.is_self && item.is_sell && !item.pay_status">请在尽快付款给对方</view>
				<view class="tt"  v-if="item.status == 1 && !item.is_self && item.is_sell && item.pay_status">等待对方确认收款放币</view>
				<view class="tt"  v-if="item.status == 1 && !item.is_self && !item.is_sell && !item.pay_status">等待对方付款中</view>
				<view class="tt"  v-if="item.status == 1 && !item.is_self && !item.is_sell && item.pay_status">对方已付款，请尽快确认</view>
				
				<!-- 说明信息 -->
				<view class="tt" v-if="item.remark">注明: {{item.remark}}</view>
				
				<!-- 取消 -->
				<view class="ikbc" @click="close(item,index)" v-if="item.status == 0">取消订单</view>
				<view class="ikbc" @click="close(item,index)" v-if="item.status == 1 && item.is_self && item.is_sell && !item.pay_status">取消订单</view>
				<view class="ikbc" @click="close(item,index)" v-if="item.status == 1 && item.is_self && !item.is_sell">取消订单</view>
				<view class="ikbc" @click="close(item,index)" v-if="item.status == 1 && !item.is_self && item.is_sell && !item.pay_status">取消订单</view>
				<view class="ikbc" @click="close(item,index)" v-if="item.status == 1 && !item.is_self && !item.is_sell && !item.pay_status">取消订单</view>
				
				<!-- 求购订单 ，买家打钱给我，进入收钱界面 -->
				<view class="aru" v-if="item.status !== 0 &&item.is_self && !item.is_sell" @click="app.openUrl({ url: '/pages/index/buy_order', data: {id: item.id} })">查看详情</view>
				<!-- 出售订单 ，卖家打币给我，进入付款界面 -->
				<view class="aru" v-if="item.status !== 0 &&item.is_self && item.is_sell" @click="app.openUrl({ url: '/pages/index/between_order', data: {id: item.id} })">查看详情</view>
				<!-- 购入订单 ，卖家打币给我，进入付款界面 -->
				<view class="aru" v-if="item.status !== 0 &&!item.is_self && item.is_sell" @click="app.openUrl({ url: '/pages/index/buy_order', data: {id: item.id} })">查看详情</view>
				<!-- 购出订单 ，卖家打钱给我，进入收钱界面 -->
				<view class="aru" v-if="item.status !== 0 &&!item.is_self && !item.is_sell" @click="app.openUrl({ url: '/pages/index/between_order', data: {id: item.id} })">查看详情</view>
				
			</view>
		</view>
		<view v-else>
			<no-data ref="no-data"></no-data>
		</view>
		
		
	</view>
</template>


<script>
	export default {
		data() {
			return {
				type:0,
				status:0,
				list: [],
				page: 1,
				hasMore: true,
				hasLoading: false,
			}
		},
		onLoad(e) {
			if(e.status){
				this.status = e.status
			}
		},
		mounted(){
			this.getList();
		},
		onReachBottom(){
			this.getList();
		},
		methods: {
			close(item,index){
				uni.showModal({
					title: '提示',
					content: '确认取消吗',
					success: (ccc) => {
						if (ccc.confirm) {
							let _this = this;
							_this.app.ajax({
								url: "/exchange/close_order",
								load:true,
								method:"post",
								data:{
									id:item.id,
								},
								success(res) {
									_this.app.toast(res.msg)
									if(res.code) {
										_this.list[index].status = 3
									}
								}
							});
						}
					}
				});
			},
			togType(a){
				this.type = a;
				this.page = 1;
				this.hasLoading = false
				this.hasMore = true;
				this.getList()
			},
			togStatus(a){
				this.status = a;
				this.page = 1;
				this.hasLoading = false
				this.hasMore = true;
				this.getList()
			},
			getList(){
				let _this = this;
				_this.app.ajax({
					url: "/exchange/orderlogs",
					data: {
						page: _this.page,
						type:_this.type,
						status:_this.status,
					},
					success(res){
						if(_this.page == 1){
							_this.list = res.data.lists;
						}else{
							_this.list = _this.list.concat(res.data.lists);
						}
						_this.page++;
					},
				});
			},
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.nos{
		width: 100%;
		padding: 24rpx 2% 0;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		justify-content: flex-start;
	}
	.nos:nth-child(2){
		padding-bottom: 32rpx;
	}
	.nos .lis{
		width: 18%;
		height: 64rpx;
		background: #f5f5f5;
		color: #999;
		margin-right: 2.5%;
		font-size: 24rpx;
		color: #999;
		text-align: center;
		line-height: 64rpx;
		border-radius: 8rpx;
	}
	.nos .lis:last-child{
		margin-right: 0;
	}
	.nos .lis.active{
		background: linear-gradient(45deg, #303241, #696b76);
		color: #fff;
	}
	.orderlist{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.orderlist .lis{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		margin-bottom: 32rpx;
		background: #fff;
		border-radius: 8rpx;
		position: relative;
	}
	.orderlist .lis .ts{
		width: 100%;
		height: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.orderlist .lis .ts .tag{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 20rpx;
		background: #12121f;
		color: #fff;
		border-radius: 4rpx;
		padding: 0 16rpx;
	}
	.orderlist .lis .ts .tst{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-left: 16rpx;
	}
	.orderlist .lis .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
	}
	.orderlist .lis .aru{
		height: 56rpx;
		line-height: 56rpx;
		background: #12121f;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 8rpx 0 8rpx 0;
		color: #fff;
		font-size: 24rpx;
		padding: 0 24rpx;
	}
	.ikbc{
		width: 240rpx;
		text-align: center;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		background: #12121f;
		color: #fff;
		border-radius: 8rpx;
		padding: 0 32rpx;
		margin-top: 24rpx;
	}
</style>