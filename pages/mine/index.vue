<template>
	<view class="content">
		<view class="top" >
			<view style="display: flex; justify-content: flex-end; align-items: center;" @click="ToMsg()">
				<view style="position: relative;">
					<image src="/static/notice.png" style="width: 40rpx; height: 40rpx;" mode=""></image>
					<view class="iconss" v-if="info.is_notice"></view>
				</view>
				<text style="color: #ffffff; margin-top: -15rpx;">消息</text>
			</view>
			
			<view class="userinfos" v-if="info.username">
				<view class="avatar">
					<image mode="aspectFill" style="border-radius: 50%;" :src="info.avatar"></image>
				</view>
				<view class="text">
					<view class="names">
					{{info.username}}
					<image v-if="info.vip" src="/static/zuan.png" style="width: 70rpx; height: 48rpx;top: 20rpx;left: 10rpx;" mode=""></image>
					</view>
					
					<view class="id">ID: {{info.id}}</view>
				</view>
				
				<!-- <view class="vicon"></view> -->
				<view class="focus active" @click="ToEditUser()">
					<view class="icon"></view>
					<view class="tt">编辑资料</view>
				</view>
			</view>
			<view class="userinfos" v-else>
				<view class="avatar">
					<image mode="widthFix" src="/static/noavc.png"></image>
				</view>
				<view class="name" @click="app.openUrl({url:'/pages/public/login'})">立即登录</view>
			</view>
			<view class="usersign" v-if="info.username">简介:{{info.desc}}</view>
			<view class="usersign" v-else>登录以后可设置个人签名</view>
			<view class="usernolist">
				<view class="lis" @click="ToCreation()">
					<view class="ts">{{info.article_count || 0}}</view>
					<view class="tt">创作</view>
				</view>
				<view class="lis" @click="ToFriends()">
					<view class="ts">{{info.like_count || 0}}</view>
					<view class="tt">关注</view>
				</view>
				<view class="lis" @click="ToFriends()">
					<view class="ts">{{info.fans_count || 0}}</view>
					<view class="tt">粉丝</view>
				</view>
			</view>

			<view class="vipbox" style="width: 100%; box-sizing: border-box;">
				<view class="vts" style="box-sizing: border-box;">VIP特权</view>
				<view class="vtt" style="box-sizing: border-box;">开通会员可享受会员权益！</view>
				<view class="vbtn" @click="ToVip()">
					<view class="vbtt">开通会员</view>
					<!-- <view class="vbicon"></view> -->
					<!-- <image src="../../static/vmos.png" mode="heightFix" style="height: 24rpx;width: 13rpx;"></image> -->
				</view>
			</view>
		</view>

		<view class="moneys">
			<view class="lis" @click="ToWallet()">
			</view>
			<view class="lis"  @click="ToOrder()"></view>
		</view>
		<!-- <image  v-if="!modelsp" src="/static/miner.png" @click="ToMiner()" mode="widthFix" style="width: 92%;margin: 0 4% 32rpx;"></image> -->
		<view class="navlist">
			<view class="title">常用功能</view>
			<view class="list">
				 <!-- v-show="!modelsp" -->
				<view class="lis" @click="ToTeam()">
					<view class="icon"></view>
					<view class="tt">分享赚钱</view>
				</view>
				<view class="lis" @click="ToLike()">
					<view class="icon"></view>
					<view class="tt">喜欢</view>
				</view>
				<view class="lis" @click="ToDynamic()">
					<view class="icon"></view>
					<view class="tt">动态</view>
				</view>
				<view class="lis" @click="ToHelp()">
					<view class="icon"></view>
					<view class="tt">帮助</view>
				</view>
				<view class="lis" @click="ToBrowselog()">
					<view class="icon"></view>
					<view class="tt">浏览记录</view>
				</view>
				<!-- <view class="lis" @click="ToCertification()">
					<view class="icon"></view>
					<view class="tt">实名认证</view>
				</view> -->
				<view class="lis" @click="ToCertification()">
					<view class="icon"></view>
					<view class="tt">联系客服</view>
				</view>
				<view class="lis" @click="ToFeedback()">
					<view class="icon"></view>
					<view class="tt">反馈</view>
				</view>
				<view class="lis" @click="ToSet()">
					<view class="icon"></view>
					<view class="tt">设置</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{},
			}
		},
		onShow() {
			this.init();
		},
		onLoad() {
			uni.$on("updateMyInfo", () => {
				if (this.app.isLogin()) {
					this.init();
				} 
			})
		},
		onPullDownRefresh() {
			if (this.app.isLogin()) {
				this.init();
			} 
		},
		methods: {
			ToMiner(){
				uni.navigateTo({
					url:"/pages/miner/index"
				})
			},
			init(){
				this.app.ajax({
					url: "/user/profile",
					success:(res)=> {
						console.log(1)
						if(res.code===200 && res.data){
							this.info = res.data
						}else{
							this.info = {}
						}
					},
					logout:()=>{
						this.info={}
					}
				});
			},
			ToEditUser(){
				uni.navigateTo({
					url:"/pages/mine/edituser"
				})
			},
			ToMsg(){
				uni.navigateTo({
					url:"/pages/mine/msg"
				})
			},
			ToCreation(){
				uni.navigateTo({
					url:"/pages/task/creation"
				})
			},
			ToFriends(){
				uni.navigateTo({
					url:"/pages/mine/friends"
				})
			},
			ToVip(){
				uni.navigateTo({
					url:"/pages/mine/vip"
				})
			},
			ToWallet(){
				uni.navigateTo({
					url:"/pages/mine/wallet"
				})
			},
			ToOrder(){
				uni.navigateTo({
					url:"/pages/mine/order"
				})
			},
			ToTeam(){
				uni.navigateTo({
					url:"/pages/mine/team"
				})
			},
			ToHelp(){
				uni.navigateTo({
					url:"/pages/mine/help"
				})
			},
			ToLike(){
				uni.navigateTo({
					url:"/pages/mine/like"
				})
			},
			ToDynamic(){
				uni.navigateTo({
					url:"/pages/mine/dynamic"
				})
			},
			ToBrowselog(){
				uni.navigateTo({
					url:"/pages/mine/browselog"
				})
			},
			ToCertification(){
				// uni.navigateTo({
				// 	url:"/pages/mine/certification"
				// })
				uni.navigateTo({
					url:"/pages/webview/index"
				})
			},
			ToFeedback(){
				uni.navigateTo({
					url:"/pages/mine/feedback"
				})
			},
			ToSet(){
				uni.navigateTo({
					url:"/pages/mine/set"
				})
			}
		}
	}
</script>


<style>
	page{
		background: #f5f5f5;
	}
	.return{
		background: url(../../static/returns.png) no-repeat;
		background-size: 100% 100%;
	}
	.headerws{
		background: #f9285c;
	}
	.top{
		width: 100%;
		padding: 128rpx 4% 0;
		box-sizing: border-box;
		background: #f9285c;
	/* 	position: fixed;
		top: 0;
		left: 0; */
	}
	.top .ts{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}
	.table{
		width: 100%;
		height: 88rpx;
		background: red;
		background: linear-gradient(180deg, #ECE3FF 0%, #FFFFFF 83%);
		border-radius: 32rpx 32rpx 0 0;
		display: flex;
		justify-content: space-between;
		margin-top: -32rpx;
	}
	.table .lis{
		width: 50%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		flex-shrink: 0;
		font-size: 28rpx;
		color: #111;
		position: relative;
	}
	.table .lis.active{
		font-size: 32rpx;
		font-weight: bold;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		margin-top: -16rpx;
	}
	.table .lis::before{
		content: '';
		width: 216rpx;
		height: 64rpx;
		background: url(../../static/tableactives.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: 12rpx;
		left: 50%;
		margin-left: -108rpx;
		display: none;
	}
	.table .lis.active::before{
		display: block;
	}
	.pwdlogin{
		width: 100%;
		padding: 40rpx 4%;
		box-sizing: border-box;
	}
	.pwdlogin .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #111;
		margin-bottom: 16rpx;
	}
	.pwdlogin .title:nth-child(3){
		margin-top: 32rpx;
	}
	.pwdlogin .input{
		width: 100%;
		height: 80rpx;
		position: relative;
	}
	.pwdlogin input{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 2rpx #f5f5f5 solid;
		font-size: 28rpx;
		color: #ccc;
	}
	.pwdlogin  .send{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		color: #f9285c;
	}
	.uni-input-placeholder{
		font-size: 28rpx;
		color: #ccc;
	}
	.pwdlogin .more{
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 48rpx;
		margin-top: 16rpx;
	}
	.pwdlogin .more .los{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #f9285c;
	}
	.login{
		width: 92%;
		margin: 64rpx 4% 40rpx;
		height: 88rpx;
		border-radius: 16rpx;
		line-height: 88rpx;
		background: #f9285c;
		color: #fff;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
	}
	.wxlogin{
		width: 92%;
		margin: 0 4%;
		height: 88rpx;
		border-radius: 16rpx;
		background: linear-gradient(90deg, rgba(68, 220, 96, 0.2) 6%, rgba(40, 196, 69, 0.2) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wxlogin .icon{
		width: 48rpx;
		height: 48rpx;
		background: url(../../static/wxlogin.png) no-repeat;
		background-size: 100% 100%;
	}
	.wxlogin .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-weight: bold;
		margin-left: 24rpx;
		font-size: 32rpx;
		color: #28C445;
	}
	.protocol{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 50;
		left: 0;
		bottom: 64rpx;
	}
	.protocol .select{
		width: 28rpx;
		height: 28rpx;
		border: 2rpx #999 solid;
		border-radius: 28rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.protocol .select text{
		width: 16rpx;
		height: 16rpx;
		background: #f9285c;
		border-radius: 16rpx;
		display: block;
		display: none;
	}
	.protocol .select.active{
		border-color: #f9285c;
	}
	.protocol .select.active text{
		display: block;
	}
	.protocol .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 12rpx;
	}
	.protocol .tt text{
		color: #333;
	}
	.userinfos{
		width: 100%;
		height: 96rpx;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.userinfos .avatar{
		width: 88rpx;
		height: 88rpx;
		background: #fff;
		flex-shrink: 0;
		border-radius: 96rpx;
		margin-right: 24rpx;
	}
	.userinfos .text{
		width: 100%;
		height: 96rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}
	.userinfos .text .names{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}
	.userinfos .text .id{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #fff;
		opacity: 0.75;
	}
	.userinfos .name{
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}
	.userinfos .vicon{
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/vicon.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 8rpx;
	}
	.userinfos .focus{
		height: 56rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 20rpx;
		right: 0;
		padding: 0 24rpx;
		border-radius: 8rpx;
	}
	.userinfos .focus .icon{
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/adds.png) no-repeat;
		background-size: 100% 100%;
	}
	.userinfos .focus.active{
		background: rgba(255, 255, 255, 0.25);
	}
	.userinfos .focus.active .icon{
		display: none;
	}
	.userinfos .focus.active .tt{
		margin-left: 0;
		color: #fff;
	}
	.userinfos .focus  .tt{
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		margin-left: 16rpx;
		color: #f9285c;
	}
	.usersign{
		width: 100%;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #fff;
		margin-top: 24rpx;
	}
	.usernolist{
		width: 100%;
		display: flex;
		justify-content: space-around;
		margin-top: 48rpx;
		position: relative;
	}
	.usernolist .notice{
		width: 64rpx;
		height: 88rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	.usernolist .notice .icon{
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/notice.png) no-repeat;
		background-size: 100% 100%;
		position: relative;
	}
	.iconss{
		content: '';
		width: 16rpx;
		height: 16rpx;
		line-height: 24rpx;
		border-radius: 24rpx;
		background: #ffffff;
		color: #fff;
		position: absolute;
		top: 0;
		right: 0;
		font-size: 16rpx;
		text-align: center;
	}
	.usernolist .notice .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #fff;
		    opacity: 0.75;
	}
	.usernolist .lis{
		width: 88rpx;
		margin-right: 16rpx;
	}
	.usernolist  .lis .ts{
		width: 88rpx;
		text-align: center;
		font-size: 32rpx;
		height: 48rpx;
		line-height: 48rpx;
	}
	.usernolist  .lis .tt{
		width: 88rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		opacity: 0.75;
		margin-top: 8rpx;
	}
	.blacklistpopopmusk{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99999;
	}
	.blacklistpopopcenter{
		height: 64rpx;
		background: #333333;
		position: fixed;
		right: 4%;
		top: 80rpx;
		z-index: 99999;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 16rpx;
	}
	.blacklistpopopcenter .icon{
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/blacklist.png) no-repeat;
		background-size: 100% 100%;
	}
	.blacklistpopopcenter .tt{
		height: 64rpx;
		line-height: 64rpx;
		font-size: 24rpx;
		color: #fff;
		margin-left: 16rpx;
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
	.project{
		width: 100%;
		background: #fff;
		padding: 0 4%;
		box-sizing: border-box;
	}
	.project .tab{
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.project .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: #F5F3F4;
		border-radius: 56rpx;
		font-size: 28rpx;
		color: #333;
	}
	.project .tab .lis.active{
		background: rgba(149, 102, 255, 0.1);
		color: rgba(149, 102, 255, 1);
	}
	.project .list{
		width: 100%;
	}
	.project .list .lis{
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 2rpx #f5f5f5 solid;
		padding: 32rpx 0;
	}
	.project .list .lis .text{
		width: 100%;
		height: 160rpx;
		margin-right: 24rpx;
	}
	.project .list .lis .text .ts{
		font-size: 28rpx;
		line-height: 48rpx;
		font-weight: bold;
		height: 96rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
	}
	.project .list .lis .text .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.project .list .lis .img{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
		background: #ccc;
		flex-shrink: 0;
		position: relative;
		flex-shrink: 0;
	}
	.project .list .lis .tag{
		height: 48rpx;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 16rpx 0 16rpx 0;
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 24rpx;
	}
	.project .list .lis .tag .icon{
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0;
		background: #fff;
	}
	.project .list .lis .tag .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #fff;
		margin-left: 8rpx;
	}
	.vipbox{
		width: 690rpx;
		height: 168rpx;
		padding: 24rpx;
		box-sizing: border-box;
		/* background: url(../../static/vipbox.png) no-repeat; */
		background: url(../../static/vipboxs.png) no-repeat;
		background-size: 100% 100%;
		margin-top: 24rpx;
		position: relative;
	}
	.vipbox .vts{
		width: 100%;
		padding-left: 210rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #5B3A2F;
		margin-top: 40rpx;
	}
	.vipbox .vtt{
		width: 100%;
		padding-left: 210rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #5B3A2F;
		margin-top: 8rpx;
	}
	.vipbox .vbtn{
		/* eight: 64rpx;
		background: #5B3A2F;
		position: absolute;
		top: 36rpx;
		right: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 24rpx;
		border-radius: 64rpx; */
		position: absolute;
		top: 66rpx;
		right: 24rpx;
		width: 128rpx;
		height: 46rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: url(../../static/openbg.png) no-repeat;
		background-size: 100% 100%;
	}
	.vipbox .vbtn .vbtt{
		font-size: 24rpx;
		color: #432E15;
	}
	.vipbox .vbtn  .vbicon{
		width: 13.2rpx;
		height: 24rpx;
		background: url(../../static/vmos.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 16rpx;
	}
	.moneys{
		width: 92%;
		margin: 32rpx 4%;
		display: flex;
		justify-content: space-between;
		height: 112rpx;
	}
	.moneys .lis{
		width: 48%;
		height: 108rpx;
		border-radius: 16rpx;
	}
	.moneys .lis:nth-child(1){
		/* background: url(../../static/vm1.png) no-repeat; */
		background: url(../../static/vm1s.png) no-repeat;
		background-size: 100% 100%;
	}
	.moneys .lis:nth-child(2){
		/* background: url(../../static/vm2.png) no-repeat; */
		background: url(../../static/vm2s.png) no-repeat;
		background-size: 100% 100%;
	}
	.navlist{
		width: 92%;
		margin: 0 4%;
		padding: 32rpx 0;
		box-sizing: border-box;
		border-radius: 16rpx;
		background: #fff;
	}
	.navlist .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	.navlist .list{
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.navlist .list .lis{
		width: 25%;
		margin-top: 32rpx;
	}
	.navlist .list .lis .icon{
		width: 64rpx;
		height: 64rpx;
		display: block;
		margin: 0 auto;
	}
	.navlist .list .lis .tt{
		width: 100%;
		text-align: center;
		margin-top: 16rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
	.navlist .list .lis:nth-child(1) .icon{
		/* background: url(../../static/vk1.png) no-repeat; */
		background: url(../../static/vk1s.png) no-repeat;
		background-size: 100% 100%;
		width: 49rpx;
		height: 51rpx;
	}
	.navlist .list .lis:nth-child(2) .icon{
		/* background: url(../../static/vk2.png) no-repeat; */
		background: url(../../static/vk2s.png) no-repeat;
		background-size: 100% 100%;
		width: 52rpx;
		height: 50rpx;
	}
	.navlist .list .lis:nth-child(3) .icon{
		/* background: url(../../static/vk3.png) no-repeat; */
		background: url(../../static/vk3s.png) no-repeat;
		background-size: 100% 100%;
		width: 64rpx;
		height: 47rpx;
	}
	.navlist .list .lis:nth-child(4) .icon{
		/* background: url(../../static/vk4.png) no-repeat; */
		background: url(../../static/vk4s.png) no-repeat;
		background-size: 100% 100%;
		width: 47rpx;
		height: 47rpx;
	}
	.navlist .list .lis:nth-child(5) .icon{
		/* background: url(../../static/vk5.png) no-repeat; */
		background: url(../../static/vk5s.png) no-repeat;
		background-size: 100% 100%;
		width: 49rpx;
		height: 49rpx;
	}
	.navlist .list .lis:nth-child(6) .icon{
		/* background: url(../../static/vk6.png) no-repeat; */
		/* background: url(../../static/vk6s.png) no-repeat; */
		background: url(../../static/m4.png) no-repeat;
		background-size: 100% 100%;
		width: 48rpx;
		height: 48rpx;
	}
	.navlist .list .lis:nth-child(7) .icon{
		/* background: url(../../static/vk7.png) no-repeat; */
		background: url(../../static/vk7s.png) no-repeat;
		background-size: 100% 100%;
		width: 48rpx;
		height: 50rpx;
	}
	.navlist .list .lis:nth-child(8) .icon{
		/* background: url(../../static/vk8.png) no-repeat; */
		background: url(../../static/vk8s.png) no-repeat;
		background-size: 100% 100%;
		width: 46rpx;
		height: 46rpx;
	}
</style>