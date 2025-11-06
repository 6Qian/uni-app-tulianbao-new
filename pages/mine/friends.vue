<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="return" @click="returns()"></view>
			<view class="tables">
				<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">关注</view>
				<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">粉丝</view>
			</view>
		</view>
		<view class="status-bars"></view>
		<template v-if="isActive === 0">
			<view class="userlist" v-if="list.length>0" >
				<view class="lis" v-for="(item,index) in list" :key="index">
					<view class="avatar">
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.username}}</view>
						<view class="tt"><text>动态 {{item.dynamic_count}}</text><text>创作 {{item.article_count}}</text></view>
					</view>
					<view class="btns" @click="liked(item,index)" v-if="item.is_fans">取关Ta</view>
					<view class="btns acs" @click="liked(item,index)" v-else>关注Ta</view>
				</view>
			</view>
			<view class="no-data" v-else>
				<view class="icon">
					<image src="../../static/focx.png" mode="aspectFill"></image>
				</view>
				<view class="tt">暂无喜欢</view>
			</view>
		</template>
		
		<template v-if="isActive === 1">
			<view class="userlist" v-if="list.length>0" >
				<view class="lis" v-for="(item,index) in list" :key="index">
					<view class="avatar">
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="ts">{{item.username}}</view>
						<view class="tt"><text>动态 {{item.dynamic_count}}</text><text>创作 {{item.article_count}}</text></view>
					</view>
					<view class="btns" @click="liked(item,index)" v-if="item.is_fans">取消回关</view>
					<view class="btns acs" @click="liked(item,index)" v-else>回关Ta</view>
				</view>
			</view>
			<view class="no-data" v-else>
				<view class="icon">
					<image src="../../static/focx.png" mode="aspectFill"></image>
				</view>
				<view class="tt">暂无粉丝</view>
			</view>
		</template>
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				list:[],
				page: 1,
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
		onShow(){
			this.getList();
		},
		onReachBottom() {
			this.page++
			this.getList()
		},
		onLoad() {
			
		},
		methods: {
			liked(item,index){
				this.app.ajax({
					url: "/user/belike",
					data:{id:item.user_id},
					method:'post',
					load:true,
					success:(res)=> {
						if(res.code === 200){
							this.list[index].is_fans = item.is_fans?false:true
						}else{
							this.app.toast(res.message)
						}
					},
				});
			},
			getList(){
				this.app.ajax({
					url: "/user/friends",
					data:{page:this.page,type:this.isActive},
					success:(res)=> {
						if(this.page == 1){
							this.list = res.data
						}else{
							this.list = this.list.concat(res.data)
						}
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				this.page = 1;
				this.getList()
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>


<style>
	page{
		background: #f5f5f5;
	}
	.header{
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header .return{
		background: url(../../static/return.png) no-repeat;
		background-size: 100% 100%;
	}
	.headerws{
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tables{
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-radius: 64rpx;
		box-sizing: border-box;
	}
	.tables .lis{
		padding: 0 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #999;
		position: relative;
		margin: 0 16rpx;
	}
	.tables .lis::before{
		content: '';
		width: 136rpx;
		height: 40rpx;
		background: url(../../static/tableactives.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: 10rpx;
		left: -12rpx;
		display: none;
	}
	.tables .lis.active::before{
		display: block;
	}
	.tables .lis.active{
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
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
	}
	.addpro .icon{
		width: 24rpx;
		height: 24rpx;
		background: url(../../static/redos.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #f9285c;
	}
	.status-bars{
		height: 96rpx;
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
	.search{
		width: 100%;
		padding: 16rpx 4%;
		box-sizing: border-box;
		background: #fff;
	}
	.search .input{
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 80rpx;
		position: relative;
	}
	.search .input .icon{
		width: 40rpx;
		height: 40rpx;
		background: url(../../static/scs.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: 20rpx;
		left: 20rpx;
	}
	.search .input input{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		padding-left: 80rpx;
		box-sizing: border-box;
	}
	.userlist{
		width: 100%;
		background: #fff;
	}
	.userlist .lis{
		width: 100%;
		padding: 32rpx 4%;
		box-sizing: border-box;
		border-bottom: 2rpx #f5f5f5 solid;
		display: flex;
		justify-content: flex-start;
		position: relative;
	}
	.userlist .lis .avatar{
		width: 84rpx;
		height: 84rpx;
		background: #ccc;
		border-radius: 88rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.userlist .lis .text{
		width: 100%;
		height: 84rpx;
	}
	.userlist .lis .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.userlist .lis .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 4rpx;
	}
	.userlist .lis .text .tt text{
		margin-right: 16rpx;
	}
	.userlist .lis  .btns{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 24rpx;
		border-radius: 8rpx;
		background: #eee;
		color: #999;
		
		position: absolute;
		top: 46rpx;
		right: 4%;
		font-size: 24rpx;
	}
	.userlist .lis  .btns.acs{
		background: #f9285c;
		color: #fff;
	}
	.userlist .lis:last-child{
		border: none;
	}
</style>