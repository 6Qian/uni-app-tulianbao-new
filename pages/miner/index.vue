<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="text">赚客矿工</view>
			<view class="addpro"  @click="ToRelease()">
				<view class="icon"></view>
				<view class="tt">我的矿工</view>
			</view>
		</view>
		<view class="status-bars"></view>
		
		<view class="minerlist" v-if="list.length > 0">
			<view :class="'lis lv'+(index + 1)" v-for="(item,index) in list" :key="index">
				<view class="ts">{{item.name}}</view>
				<view class="tt">{{item.desc}}</view>
				<view class="ftt"><view class="fl">{{item.price}}金币兑换</view><view class="fr">同时持有上限{{item.limit}}个</view></view>
				<view class="icon"></view>
				<view class="button" @click="exchange(item)">立即兑换</view>
			</view>
		</view>
		<view v-else>
			暂无数据
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				list:[],
				statusBarHeight:uni.getSystemInfoSync().statusBarHeight,
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header headerws';
			} else {
				this.header_class = 'header';
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/package/list",
					success:(res)=> {
						this.list = res.data.list
					},
				});
			},
			exchange(item){
				this.app.confirm({
					content: "确认兑换码，需要扣除"+item.price+"金币？",
					confirmText: "确认",
					success:()=>{
						this.app.ajax({
							url: "/package/exchange",
							data: { id: item.id },
							method: "post",
							success:(res)=> {
								this.app.toast(res.message)
							}
						});
					}
				})
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
			ToRelease(){
				uni.navigateTo({
					url:"/pages/miner/log"
				})
			}
		}
	}
</script>

<style>
	page{
		background: #fff;
	}
	.header{
		background: #fff;
	}
	.headerws{
		background: #fff;
	}
	.header .return{
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro{
		height: 48rpx;
		background: #fff;
		padding: 0 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 24rpx;
		right: 4%;
		border-radius: 8rpx;
		box-sizing: border-box;
	}
	.addpro .icon{
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/kkic.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #333333;
	}
	.latest{
		width: 100%;
	}
	.latest .list{
		width: 100%;
	}
	.latest .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		margin-bottom: 32rpx;
		background: #fff;
	}
	.latest .lis .userinfo{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.latest .lis .userinfo .avatar{
		width: 48rpx;
		height: 48rpx;
		background: #ccc;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}
	.latest .lis .userinfo .ts{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.latest .lis .userinfo .time{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 0;
		right: 48rpx;
	}
	.latest .lis .userinfo .more{
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/dymo.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 4rpx;
		right: 0;
	}
	.latest .lis .text{
		width: 100%;
		margin-top: 24rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		color: #333;
	}
	.imglist{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-start;
	}
	.imglist .imglis{
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		background: #ccc;
		margin-right: 16.66rpx;
		flex-shrink: 0;
	}
	.imglist .imglis:last-child{
		margin-right: 0;
	}
	.lisdata{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		height: 40rpx;
	}
	.lisdata .left{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.lisdata  .right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.lisdata  .right .rrlis{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 24rpx;
	}
	.lisdata  .right .rrlis .icon{
		width: 32rpx;
		height: 32rpx;
	}
	.lisdata  .right .rrlis:nth-child(1) .icon{
		background: url(../../static/link.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis:nth-child(2) .icon{
		background: url(../../static/comment.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis.active:nth-child(1) .icon{
		background: url(../../static/linkactive.png) no-repeat;
		background-size: 100% 100%;
	}
	.lisdata  .right .rrlis.active:nth-child(1) .tt{
		color: #f9285c;
		font-weight: bold;
	}
	.lisdata  .right .rrlis .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #666;
	}
	.comment{
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 24rpx;
	}
	.comment .colis{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.comment .colis .avatar{
		width: 40rpx;
		height: 40rpx;
		background: #ccc;
		border-radius: 40rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}
	.comment .colis  .name{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
		flex-shrink: 0;
	}
	.comment .colis  .tt{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 16rpx;
		overflow: hidden;
	}
	.morepopup{
		width: 160rpx;
		height: 128rpx;
		background: #333;
		position: absolute;
		box-sizing: border-box;
		top: 100rpx;
		right: 4%;
		border-radius: 8rpx;
		z-index: 138;
	}
	.morepopup .vlis{
		width: 100%;
		display: flex;
		justify-content: center;
		height: 64rpx;
		align-items: center;
	}
	.morepopup .vlis .vicon{
		width: 32rpx;
		height: 32rpx;
		margin-right: 16rpx;
	}
	.morepopup .vlis .vtt{
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		color: #fff;
	}
	.morepopup .vlis:nth-child(1) .vicon{
		background: url(../../static/nh1.png) no-repeat;
		background-size: 100% 100%;
	}
	.morepopup .vlis:nth-child(2) .vicon{
		background: url(../../static/nh2.png) no-repeat;
		background-size: 100% 100%;
	}
	.morepopupmusk{
		width: 100%;
		height: 100vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 128;
	}
	.latest .lis{
		position: relative;
	}
	.minerlist{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
	}
	.minerlist .lis.lv1{
		background: linear-gradient(108deg, #999B9F 0%, #64656B 98%);
	}
	.minerlist .lis.lv2{
		background: linear-gradient(108deg, #C6B29B 0%, #A9927C 98%);
	}
	.minerlist .lis.lv3{
		background: linear-gradient(108deg, #6EC57E 0%, #48A55A 98%);
	}
	.minerlist .lis.lv4{
		background: linear-gradient(109deg, #343535 0%, #121615 99%);
	}
	.minerlist .lis.lv1 .icon{
		background: url(../../static/kk1.png);
		background-size: 100% 100%;
	}
	.minerlist .lis.lv2 .icon{
		background: url(../../static/kk2.png);
		background-size: 100% 100%;
	}
	.minerlist .lis.lv3 .icon{
		background: url(../../static/kk3.png);
		background-size: 100% 100%;
	}
	.minerlist .lis.lv4 .icon{
		background: url(../../static/kk4.png);
		background-size: 100% 100%;
	}
	.minerlist .lis{
		width: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		margin-bottom: 32rpx;
		position: relative;
	}
	.minerlist .lis .ts{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}
	.minerlist .lis .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #fff;
		opacity: 0.7;
		margin-top: 20rpx;
	}
	.minerlist .lis  .ftt{
		width: 100%;
		margin-top: 48rpx;
		display: flex;
		justify-content: flex-start;
		height: 48rpx;
		align-items: center;
	}
	.minerlist .lis  .ftt .fl{
		font-size: 28rpx;
		color: #fff;
	}
	.minerlist .lis  .ftt .fr{
		margin-left: 24rpx;
		font-size: 24rpx;
		color: #fff;
		opacity: 0.7;
	}
	.minerlist .lis  .icon{
		width: 128rpx;
		height: 128rpx;
		position: absolute;
		top: 32rpx;
		right: 40rpx;
	}
	.minerlist .lis .button{
		height: 56rpx;
		line-height: 56rpx;
		position: absolute;
		bottom: 32rpx;
		right: 32rpx;
		background: linear-gradient(270deg, #F5C672 0%, #FFE7A6 100%);
		border-radius: 48rpx;
		font-size: 24rpx;
		padding: 0 32rpx;
	}
</style>