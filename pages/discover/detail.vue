<template>
	<view class="content">
	<dynamic-items :todetail="false" :comments="false" :list="[info]"></dynamic-items>
	
		<view class="commentslist" v-if="info.comments && info.comments.length>0">
			<view class="title">评论列表</view>
			<view class="list">
				<view class="lis" v-for="(item,index) in info.comments">
					<view class="commentsuserinfo">
						<view class="avatar">
							<image mode="widthFix" :src="item.avatar"></image>
						</view>
						<view class="name">{{item.username}}</view>
						<!-- <view class="link active">
							<view class="icon"></view>
							<view class="tt">500</view>
						</view> -->
					</view>
					<view class="commentsusertext">
						<view class="text">{{item.content}}</view>
						<view class="time">{{ app.getDateDiff(item.create_time * 1000) }} <text style="margin-left: 20rpx;" @click="comment(item.id)"> 回复</text></view>
						
						<view class="comment" v-if="item.childs && item.childs.length>0">
							<view class="colis" v-for="(a,b) in item.childs" :key="b">
								<view class="avatar">
									<image mode="widthFix" :src="a.avatar"></image>
								</view>
								<view class="name">{{a.username}}</view>
								<view class="tt">{{a.content}}</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 128rpx;"></view>
		
		<view class="comentfooter">
			<input type="text" readonly="true" placeholder="发表回帖..." @click="comment(0)">
		</view>
		
		<view class="commentpopupmusk" v-if="CommentPopup" @click="CommentPopup = false"></view>
		<view class="commentpopupcenter" v-if="CommentPopup">
			<textarea name="" :focus="focuess" v-model="commentContent" id="" cols="30" rows="10" placeholder="发表回帖..."></textarea>
			<view class="pos">
				<view class="btn" @click="com">回帖</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CommentPopup: false,
				id:0,
				info:{},
				commentContent:"",
				commentPid:0,
				focuess:false,
			}
		},
		onLoad(e) {
			this.id = e.id
			this.init()
		},
		methods: {
			init(){
				this.app.ajax({
					url: "/dynamic/detail",
					data:{id:this.id},
					success:(res)=> {
						this.info=res.data
					},
				});
			},
			com(){
				this.app.ajax({
					url: "/dynamic/addComment",
					data:{id:this.id,content:this.commentContent,pid:this.commentPid},
					method:"post",
					load:true,
					success:(res)=> {
						this.app.toast(res.message)
						if(res.code == 200){
							this.commentContent = '';
							this.commentPid = 0;
							this.CommentPopup = false;
							this.init()
						}
					},
				});
			},
			comment(id){
				this.commentPid = id;
				this.CommentPopup = true;
				this.focuess = true;
			},
		}
	}
</script>
<style>
	page{
		background: #f5f5f5;
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
	.commentslist{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		background: #fff;
	}
	.commentslist .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.commentslist .list{
		width: 100%;
	}
	.commentslist .lis{
		width: 100%;
		padding: 32rpx 0;
		border-bottom: 2rpx #f5f5f5 solid;
	}
	.commentslist .lis .commentsuserinfo{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.commentslist .lis .commentsuserinfo .avatar{
		width: 48rpx;
		height: 48rpx;
		background: #ccc;
		border-radius: 48rpx;
		margin-right: 16rpx;
	}
	.commentslist .lis .commentsuserinfo .name{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.commentslist .lis .commentsuserinfo .link{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999;
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		
	}
	.commentslist .lis .commentsuserinfo .link .icon{
		width: 32rpx;
		height: 32rpx;
		background: url(../../static/link.png) no-repeat;
		background-size: 100% 100%;
	}
	.commentslist .lis .commentsuserinfo .link .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #666;
	}
	.commentslist .lis .commentsuserinfo .link.active .icon{
		background: url(../../static/linkactive.png) no-repeat;
		background-size: 100% 100%;
	}
	.commentslist .lis .commentsuserinfo .link.active .tt{
		color: #f9285c;
		font-weight: bold;
	}
	.commentsusertext{
		width: 100%;
		padding-left: 64rpx;
		box-sizing: border-box;
		margin-top: 16rpx;
	}
	.commentsusertext .text{
		line-height: 48rpx;
		font-size: 28rpx;
		color: #333;
	}
	.commentsusertext .time{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
	}
	.comentfooter{
		width: 100%;
		padding: 32rpx 4% 64rpx;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
	}
	.comentfooter input{
		width: 100%;
		height: 80rpx;
		font-size: 28rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
		background: #f5f5f5;
	}
	.comentfooter .link{
		flex-shrink: 0;
		margin-left: 32rpx;
		height: 80rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.comentfooter .link .icon{
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/link.png) no-repeat;
		background-size: 100% 100%;
	}
	.comentfooter .link  .tt{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		margin-left: 8rpx;
		color: #666;
	}
	
	.comentfooter .link.active .icon{
		background: url(../../static/linkactive.png) no-repeat;
		background-size: 100% 100%;
	}
	.comentfooter .link.active .tt{
		color: #f9285c;
		font-weight: bold;
	}
	.commentpopupmusk{
		width: 100%;
		height: 100vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 128;
		background: rgba(0, 0, 0, 0.5);
	}
	.commentpopupcenter{
		width: 100%;
		padding: 32rpx 4% 64rpx;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 138;
	}
	.commentpopupcenter textarea{
		width: 100%;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #333;
		max-height: 180rpx;
		background: #f5f5f5;
		border-radius: 16rpx;
		padding: 16rpx;
		box-sizing: border-box;
	}
	.commentpopupcenter .pos{
		width: 100%;
		margin-top: 32rpx;
		display: flex;
		justify-content: flex-end;
	}
	.commentpopupcenter .pos .btn{
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		padding: 0 48rpx;
		border-radius: 8rpx;
		color: #fff;
		background: #f9285c;
	}
</style>