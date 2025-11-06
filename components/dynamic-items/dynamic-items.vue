<template>
	<view class="latest">
		<view class="list" v-if="!item.is_del" v-for="(item,index) in list" :key="index">
			<view class="lis" >
				<view class="userinfo">
					<view class="avatar" @click="ToUserInfo(item)">
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
					<view class="ts" @click="ToUserInfo(item)">{{item.username}}</view>
					<view class="time">{{ app.getDateDiff(item.time * 1000) }}</view>
					<view class="more" @click="morepopup = item.id"></view>
				</view>
				<view class="text" @click="ToDetail(item)">
					{{item.content}}
				</view>
				<view class="imglist"  @click="ToDetail(item)" v-if="item.images && item.images.length>0">
					<view class="imglis" v-for="(a,b) in item.images" :key="b">
						<image :src="a" mode="aspectFill"></image>
					</view>
				</view>
				<view class="lisdata">
					<view class="left">{{item.eye}}浏览</view>
					<view class="right">
						<view @click="zan(item,index)" :class="'rrlis ' + (item.is_zan ? 'active' : '')">
							<view class="icon"></view>
							<view class="tt">{{item.zan_count}}</view>
						</view>
						<view class="rrlis">
							<view class="icon"></view>
							<view class="tt">{{item.comment_count}}</view>
						</view>
					</view>
				</view>
				<view class="morepopup" v-if="morepopup == item.id">
					<view class="vlis" v-if="!item.is_self" @click="beblack(item,index)">
						<view class="vicon"></view>
						<view class="vtt">不感兴趣</view>
					</view>
					<view class="vlis" v-if="!item.is_self" @click="">
						<view class="vicon"></view>
						<view class="vtt">举报</view>
					</view>
					<view class="vlis" v-if="item.is_self" @click="del(item,index)">
						<view class="vicon"></view>
						<view class="vtt">删除</view>
					</view>
				</view>
				<view class="comment" v-if="comments && item.comments.length>0">
					<view class="colis" v-for="(c,d) in item.comments" :key="d">
						<view class="avatar">
							<image :src="c.avatar" mode="aspectFill"></image>
						</view>
						<view class="name">{{c.username}}</view>
						<view class="tt">{{c.content}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="morepopupmusk" v-if="morepopup" @click="morepopup = false"></view>
	</view>
</template>

<script>
	export default {
		name:"dynamic-item",
		props: {
			list: {
				type: Array,
				default: []
			},
			touser:{
				type:Boolean,
				default:true
			},
			todetail:{
				type:Boolean,
				default:true
			},
			comments:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				morepopup:false,
			};
		},
		methods:{
			beblack(item,index){
				this.app.ajax({
					url: "/user/beblack",
					data:{id:item.user_id},
					method:'post',
					load:true,
					success:(res)=> {
						if(res.code === 200){
							this.list = this.list.filter(a => a.id !== item.id);
						}else{
							this.app.toast(res.message)
						}
					},
				});
			},
			del(item,index){
				this.app.confirm({
					content: "删除将不可恢复，真的要删除吗？",
					confirmText: "删除",
					success:()=>{
						this.app.ajax({
							url: "/dynamic/del",
							data: { id: item.id },
							method: "post",
							success:(res)=> {
								this.app.toast(res.message)
								if(res.code === 200){
									this.list = this.list.filter(a => a.id !== item.id);
								}
							}
						});
					}
				})
			},
			zan(item,index){
				this.app.ajax({
					url: "/dynamic/zan",
					data:{id:item.id},
					method:'post',
					load:true,
					success:(res)=> {
						if(res.code === 200){
							this.list[index].is_zan = res.data.is_zan
							this.list[index].zan_count = res.data.zan_count
						}else{
							this.app.toast(res.message)
						}
					},
				});
			},
			ToUserInfo(item){
				if(!this.touser) return;
				uni.navigateTo({
					url:"/pages/discover/userinfo?id="+item.user_id
				})
			},
			ToDetail(item){
				if(!this.todetail) return;
				uni.navigateTo({
					url:"/pages/discover/detail?id="+item.id
				})
			},
		}
	}
</script>

<style scoped>
	
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
		position: relative;
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
		width: 200rpx;
		height: 64rpx;
		background: #333;
		position: absolute;
		box-sizing: border-box;
		top: 96rpx;
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
		display: none;
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
</style>