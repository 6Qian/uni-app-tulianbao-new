<template>
	<view class="content">
		<view class="bg"></view>
		
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="text">首页</view>
		</view>
		<view class="status-bars"></view>
		<view class="banner" >
			<image src="../../static/bess.png" @click="app.openUrl({url:'/pages/mine/team'})" mode="widthFix"></image>
		</view>
		<view class="notice" v-if="info.notice">
			<view class="icon"></view>
			<view class="tt">{{ info.notice }}</view>
		</view>
		<view class="nav">
			<view class="list">
				<!-- <view class="lis" @click="goArticle">
					<view class="icon"></view>
					<view class="tt">热门项目</view>
				</view>
				<view class="lis" @click="goTask" >
					<view class="icon"></view>
					<view class="tt">悬赏任务</view>
				</view>
				<view class="lis" @click="ToTeam()">
					<view class="icon"></view>
					<view class="tt">邀请好友</view>
				</view>
				<view class="lis" @click="ToRankings()">
					<view class="icon"></view>
					<view class="tt" >星球奖励</view>
				</view>
				<view class="lis" @click="Toservice()">
					<view class="icon"></view>
					<view class="tt">联系客服</view>
				</view> -->
				
				
				
				
				<view class="list">
					<view class="lis" @click="goArticle">
						<view class="icon"></view>
						<view class="tt">游戏介绍</view>
					</view>
					<view class="lis" @click="goTask" >
						<view class="icon"></view>
						<view class="tt">游戏推广</view>
					</view>
					<view class="lis" @click="ToTeam()">
						<view class="icon"></view>
						<view class="tt">邀请好友</view>
					</view>
					<view class="lis" @click="ToRankings()">
						<view class="icon"></view>
						<view class="tt" >达人奖励</view>
					</view>
					<view class="lis" @click="Toservice()">
						<view class="icon"></view>
						<view class="tt">联系客服</view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="promotional" >
			<!-- <image src="../../static/sccss.png" @click="goTask" mode="aspectFill"></image> -->
			<image src="../../static/sccsss.png" @click="goTask" mode="aspectFill"></image>
		</view>
		<view class="navtable">
			<view class="lis" :class="{ active: isActive === 0 }"  @click="setActive(0)">
				<view class="tt">游戏介绍</view>
				<view class="icon"></view>
			</view>
			<view class="lis" :class="{ active: isActive === 1 }"  @click="setActive(1)">
				<view class="tt">游戏推广</view>
				<view class="icon"></view>
			</view>
		</view>

		<template v-if="isActive == 0">
			<article-item v-if="info.article && info.article.length>0" :list="info.article"></article-item>
			<view v-else>
				<view class="no-data">
					<view class="icon">
						<image src="/static/nocre.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无数据</view>
				</view>
			</view>
		</template>
		<view class="task" v-if="isActive === 1">
			<view class="list" v-if="info.task && info.task.length>0">
				<view class="lis" v-for="(item,index) in info.task" :key="index" @click="ToTaskDetail(item)">
					<view class="info">
						<view class="icon">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="text">
							<view class="ts">{{item.name}} <view class="remaining">剩余{{item.row}}</view></view>
							<view class="tt">{{item.desc}}</view>
						</view>
					</view>
					<view class="classfly">任务分类: {{item.classify}} <view class="money">+{{item.price}}金币</view></view>
				</view>
			</view>
			<view v-else>
				<view class="no-data">
					<view class="icon">
						<image src="/static/nocre.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无数据</view>
				</view>
			</view>
		</view>
		
		
		<view class="uppopup" v-if="updateDialog">
			<view class="upbox">
				<image src="/static/coks.png" mode="widthFix"></image>
				<view class="poxo">
					<view class="tt">修复了已知问题，请立即更新至最新版本。</view>
					<view class="btn" @click="rowUpdate">立即更新</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				info:{},
				updateDialog:false,
				configs:{},
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
		onPullDownRefresh() {
			this.init()
		},
		onShow() {
			this.init()
			this.checkUpdate()
			if(this.modelsp){
				this.refCheck()
			}
		},
		methods: {
			Toservice(){
				uni.navigateTo({
					url:"/pages/webview/index"
				})
			},
			rowUpdate(){
				let platform = uni.getSystemInfoSync().platform;
				if (platform == 'android') {
					plus.runtime.openURL(this.configs.app_url)
				} else if (platform == 'ios') {
					plus.runtime.launchApplication({
						action: this.configs.app_url
					})
				}
			},
			checkUpdate(){
				// #ifdef APP-PLUS
				let that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.app.ajax({
						url: "/config/get",
						success:(res)=> {
							var r = res.data
							const nowversion = widgetInfo.version
							that.nowversion = nowversion;
							let platform = uni.getSystemInfoSync().platform;
							if (platform == 'ios') {
								if (r.ios_app_version > nowversion) {
									that.dialog.update = true
									uni.hideTabBar()
									that.configs = r
								}else{
									uni.showTabBar()
								}
							}else{
								if (r.app_version > nowversion) {
									that.dialog.update = true
									uni.hideTabBar()
									that.configs = r
								}else{
									uni.showTabBar()
								}
							}
						},
					});
				});
				// #endif
			},
			goTask(){
				uni.$emit('tab', 'task');
				this.app.openUrl({url:'/pages/task/index',openType:'switchTab'})
			},
			goArticle(){
				uni.$emit('tab', 'article');
				this.app.openUrl({url:'/pages/task/index',openType:'switchTab'})
			},
			init() {
				this.app.ajax({
					url: "/index/index",
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			setActive(index) {
				this.isActive = index;
			},
			ToTaskDetail(item){
				uni.navigateTo({
					url:"/pages/task/task_detail?id="+item.id
				})
			},
			ToTeam(){
				uni.navigateTo({
					url:"/pages/mine/team"
				})
			},
			ToRankings(){
				uni.navigateTo({
					url:"/pages/home/rankings"
				})
			},
		}
	}
</script>

<style>
	.bg{
		width: 100%;
		height: 100vh;
		/* background: url(../../static/sdc.png) #f5f5f5 no-repeat; */
		background: url(../../static/sdcs.png) #f5f5f5 no-repeat;
		background-size: 100% ;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.title{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		
	}
	.banner{
		width: 92%;
		margin: -16rpx 4% 40rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.banner image{
		width: 100%;
	}
	.nav{
		width: 92%;
		margin: 0 4% 40rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
	}
	 .notice{
		width: 92%;
		height: 88rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 24rpx;
		background: rgba(255,255,255,0.72);
		border-radius: 8rpx;
		box-sizing: border-box;
		margin: 0 4% 40rpx;
		border-radius: 16rpx;
	}
	 .notice .icon{
		width: 46rpx;
		height: 56rpx;
		/* background: url(../../static/sws.png) no-repeat; */
		background: url(../../static/swss.png) no-repeat;
		background-size: 100% 100%;
		flex-shrink: 0;
	}
	.notice .tt{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		margin-left: 24rpx;
		color: #111;
	}
	.nav .list{
		width: 100%;
		margin-top: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.nav .list .lis{
		width: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.nav .list .icon{
		width: 80rpx;
		height: 80rpx;
		/* margin-left: 10rpx; */
	}
	
	.nav .list .lis:nth-child(1) .icon{
		/* background: url(../../static/tt1.png) no-repeat; */
		background: url(../../static/tt1s.png) no-repeat;
		background-size: 100% 100%;
		width: 69rpx;
		height: 69rpx;
	}
	.nav .list .lis:nth-child(2) .icon{
		/* background: url(../../static/tt2.png) no-repeat; */
		background: url(../../static/tt2s.png) no-repeat;
		background-size: 100% 100%;
		width: 70rpx;
		height: 70rpx;
	}
	.nav .list .lis:nth-child(3) .icon{
		/* background: url(../../static/tt3.png) no-repeat; */
		background: url(../../static/tt3s.png) no-repeat;
		background-size: 100% 100%;
		width: 96rpx;
		height: 73rpx;
	}
	.nav .list .lis:nth-child(4) .icon{
		/* background: url(../../static/tt4.png) no-repeat; */
		background: url(../../static/tt4s.png) no-repeat;
		background-size: 100% 100%;
		width: 60rpx;
		height: 73rpx;
	}
	.nav .list .lis:nth-child(5) .icon{
		/* background: url(../../static/tt5.png) no-repeat; */
		background: url(../../static/tt5s.png) no-repeat;
		background-size: 100% 100%;
		width: 70rpx;
		height: 67rpx;
	}
	.nav .list .tt{
		width: 100rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		text-align: center;
		margin-top: 16rpx;
	}
	.promotional{
		width: 92%;
		margin: 32rpx 4% 40rpx;
		height: 140rpx;
		border-radius: 16rpx;
		
	}
	.promotional image{
		width: 100%;
		height: 140rpx;
		border-radius: 16rpx;
	}
	.table{
		width: 100%;
		height: 88rpx;
		background: red;
		background: linear-gradient(180deg, #ECE3FF 0%, #FFFFFF 83%);
		border-radius: 32rpx 32rpx 0 0;
		display: flex;
		justify-content: space-between;
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
	.project{
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		margin-top: 32rpx;
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
		font-size: 24rpx;
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
		padding: 32rpx 0;
		border-bottom: 2rpx #f5f5f5 solid;
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
		flex-shrink: 0;
		position: relative;
		flex-shrink: 0;
	}
	.project .list .lis .img image{
		width: 240rpx;
		height: 160rpx;
		border-radius: 16rpx;
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
		background: url(../../static/hos11.png) no-repeat;
		background-size: 100% 100%;
	}
	.project .list .lis .tag .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #fff;
		margin-left: 8rpx;
	}
	
	
	.task{
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		margin-top: 32rpx;
	}
	.task .tab{
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.task .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: red;
		border-radius: 56rpx;
		font-size: 24rpx;
		color: #333;
	}
	.task .tab .lis.active{
		background: rgba(149, 102, 255, 0.1);
		color: rgba(149, 102, 255, 1);
	}
	.task .list{
		width: 100%;
		margin-bottom: 100rpx;
	}
	.task .list .lis{
		width: 100%;
		padding: 16rpx;
		box-sizing: border-box;
		background: #fff;
		margin-bottom: 32rpx;
	}
	.task .list .lis .info{
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.task .list .lis .info .icon{
		width: 128rpx;
		height: 128rpx;
		flex-shrink: 0;
		border-radius: 16rpx;
		margin-right: 24rpx;
	}
	.task .list .lis .info .icon image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
	}
	.task .list .lis .info .text{
		width: 100%;
		height: 128rpx;
	}
	.task .list .lis .info .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #111;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}
	.task .list .lis .info .text .ts .remaining{
		color: #f9285c;
	}
	.task .list .lis .info .text  .tt{
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.task .list .lis  .classfly{
		width: 100%;
		margin-top: 24rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background: #F5F3F4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: relative;
		font-size: 24rpx;
		color: #333;
	}
	.task .list .lis  .classfly .money{
		height: 64rpx;
		line-height: 64rpx;
		background: #f9285c;
		color: #fff;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 0 16rpx 16rpx 0;
		padding: 0 16rpx;
		font-size: 28rpx;
	}
	.uppopup{
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	.upbox{
		width: 80%;
	}
	.upbox image{
		width: 100%;
	}
	.poxo{
		width: 100%;
		padding: 64rpx 24rpx 32rpx;
		background: #fff;
		box-sizing: border-box;
		margin-top: -8rpx;
		border-radius: 0 0 16rpx 16rpx;
	}
	.poxo .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
	}
	.poxo .btn{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: #f9285c;
		margin-top: 64rpx;
		font-size: 28rpx;
		text-align: center;
		color: #fff;
		border-radius: 8rpx;
	}
	.navtable{
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.navtable .lis{
		width: 136rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 32rpx;
		flex-wrap: wrap;
	}
	.navtable .lis  .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
	.navtable .lis .icon{
		width: 100rpx;
		height: 24rpx;
		/* background: url(../../static/ans.png) no-repeat; */
		background: url(../../static/anss.png) no-repeat;
		background-size: 100% 100%;
		display: none;
		margin-top: 8rpx;
	}
	.navtable .lis.active .tt{
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.navtable .lis.active .icon{
		display: block;
	}
</style>
