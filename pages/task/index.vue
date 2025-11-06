<template>
	<view class="content">
		<view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
			<view class="tsas">
				<view class="lis"  :class="{ active: isActive === 0 }"  @click="setActive(0)">
					<view class="tt">游戏介绍</view>
					<view class="icon"></view>
				</view>
				<view class="lis"  :class="{ active: isActive === 1 }"  @click="setActive(1)">
					<view class="tt">游戏推广</view>
					<view class="icon"></view>
				</view>
			</view>
			<view class="addpro" v-if="isActive === 0" @click="ToCreation()">
				<view class="icon"></view>
				<view class="tt">创作</view>
			</view>
			<view class="addpro" v-if="isActive === 1" @click="TotaskRelease()">
				<view class="icon"></view>
				<view class="tt">发布</view>
			</view>
		</view>
		
		
		
		<view class="status-bars" :style="{paddingTop:statusBarHeight+'px'}"></view>
		
		<!-- 项目 -->
		<template v-if="isActive === 0">
			<view class="project">
				<view class="tab">
					<view v-for="(item,index) in article_classify" :key="index" @click="setArticleClassify(item)" :class="'lis '+(article_classify_id == item.id ? 'active' : '')">{{item.name}}</view>
				</view>
			</view>
			<article-item v-if="article_list.length>0" :list="article_list"></article-item>
			<view v-else>
				<view class="no-data">
					<view class="icon">
						<image src="/static/nocre.png" mode="aspectFill"></image>
					</view>
					<view class="tt">暂无数据</view>
				</view>
			</view>
		</template>
		
		<!-- 任务 -->
		<view class="task" v-if="isActive === 1">
			<view class="tab">
				<view v-for="(item,index) in task_classify" :key="index" @click="setTaskClassify(item)" :class="'lis '+(task_classify_id == item.id ? 'active' : '')">{{item.name}}</view>
			</view>
			<view class="list" v-if="task_list.length>0">
				<view class="lis" v-for="(item,index) in task_list" :key="index" @click="ToTaskDetail(item)">
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
		
		
		<view class="tasklog" v-if="!modelsp" @click="ToTaskLog()"></view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				article_classify:[],
				task_classify:[],
				task_list:[],
				article_list:[],
				article_page:1,
				task_page:1,
				
				article_classify_id:0,
				task_classify_id:0,
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
		onShow(){
			uni.$on('tab', (a) => {
				if(a=='task'){
					this.isActive = 1
				}else{
					this.isActive = 0
				}
			});
		},
		onPullDownRefresh() {
			if(this.isActive == 0){
				this.article_page = 1;
				this.getArticleList()
			}else{
				this.task_page = 1;
				this.getTaskList()
			}
		},
		onReachBottom() {
			if(this.isActive == 0){
				this.article_page++;
				this.getArticleList()
			}else{
				this.task_page++;
				this.getTaskList()
			}
		},
		methods: {
			setArticleClassify(item){
				this.article_classify_id = item.id;
				this.article_page = 1;
				this.getArticleList()
			},
			setTaskClassify(item){
				this.task_classify_id = item.id;
				this.task_page = 1;
				this.getTaskList()
			},
			getArticleList(){
				this.app.ajax({
					url: "/article/index",
					data:{page:this.article_page,classify_id:this.article_classify_id},
					success:(res)=> {
						if(this.article_page == 1){
							this.article_list = res.data
						}else{
							this.article_list = this.article_list.concat(res.data)
						}
					},
				});
			},
			getTaskList(){
				this.app.ajax({
					url: "/task/index",
					data:{page:this.task_page,classify_id:this.task_classify_id},
					success:(res)=> {
						if(this.task_page == 1){
							this.task_list = res.data
						}else{
							this.task_list = this.task_list.concat(res.data)
						}
					},
				});
			},
			init(){
				this.app.ajax({
					url: "/article/getClassify",
					success:(res)=> {
						this.article_classify = res.data
						this.article_classify_id = res.data[0].id
						this.getArticleList()
					},
				});
				this.app.ajax({
					url: "/task/getClassify",
					success:(res)=> {
						this.task_classify = res.data
						this.task_classify_id = res.data[0].id
						this.getTaskList()
					},
				});
			},
			setActive(index) {
				this.isActive = index;
			},
			ToProjectDetail(item){
				uni.navigateTo({
					url:"/pages/task/project_detail?id="+item.id
				})
			},
			ToTaskDetail(item){
				uni.navigateTo({
					url:"/pages/task/task_detail?id="+item.id
				})
			},
			TotaskRelease(){
				if(!this.app.isLogin()){
					this.app.toast('请先登陆');
					this.app.toLogin();
					return
				}
				uni.navigateTo({
					url:"/pages/task/taskreleaselog"
				})
			},
			ToCreation(){
				if(!this.app.isLogin()){
					this.app.toast('请先登陆');
					this.app.toLogin();
					return
				}
				uni.navigateTo({
					url:"/pages/task/creation"
				})
			},
			ToTaskLog(){
				uni.navigateTo({
					url:"/pages/mine/tasklog"
				})
			}
		}
	}
</script>


<style>
	page{
		background: #f5f5f5;
	}
	.header{
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.headerws{
		background: #f9285c;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tsas{
		width: 320rpx;
		height: 64rpx;
		display: flex;
		justify-content: space-between;
	}
	.tsas .lis{
		width: 100%;
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	.tsas .lis .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #fff;
		opacity: 0.75;
		text-align: center;
	}
	.tsas .lis.active .tt{
		font-size: 30rpx;
		opacity: 1;
		font-weight: bold;
	}
	.tsas .lis.active .icon{
		width: 80rpx;
		height: 20rpx;
		background: url(../../static/avs.png) no-repeat;
		background-size: 100% 100%;
	}
	.tables{
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-radius: 64rpx;
		padding: 4rpx;
		box-sizing: border-box;
	}
	.tables .lis{
		padding: 0 24rpx;
		height: 52rpx;
		line-height: 52rpx;
		font-size: 28rpx;
		color: #111;
		border-radius: 52rpx;
	}
	.tables .lis.active{
		background: #f9285c;
		color: #fff;
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
		/* background: url(../../static/add.png) no-repeat; */
		background: url(../../static/adds.png) no-repeat;
		background-size: 100% 100%;
	}
	.addpro  .tt{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		margin-left: 8rpx;
		color: #f9285c;
	}
	
	.project{
		width: 100%;
		background: #f5f5f5;
		padding: 32rpx 4% 0;
		box-sizing: border-box;
	}
	.project .tab{
		width: 100%;
		height: 64rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		overflow: scroll;
	}
	.project .tab::-webkit-scrollbar{
		display: none;
		width: 0;
		height: 0;
		background: transparent;
	}
	.project .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: #fff;
		border-radius: 56rpx;
		font-size: 28rpx;
		color: #333;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.project .tab .lis.active{
		/* background: linear-gradient(0deg, #DA8FF6 0%, #A075F7 100%); */
		background: #F9285C;
		color: #fff;
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
		background: #f5f5f5;
		padding: 32rpx 4% 0;
		box-sizing: border-box;
	}
	.task .tab{
		width: 100%;
		height: 64rpx;
		display: flex;
		justify-content: flex-start;
		overflow: scroll;
		align-items: center;
	}
	.task .tab .lis{
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 48rpx;
		background: #fff;
		border-radius: 56rpx;
		font-size: 28rpx;
		color: #333;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.task .tab .lis.active{
		/* background: linear-gradient(0deg, #DA8FF6 0%, #A075F7 100%); */
		background: #F9285C;
		color: #fff;
	}
	.task .list{
		width: 100%;
		margin-top: 32rpx;
	}
	.task .list .lis{
		width: 100%;
		padding: 24rpx;
		background: #fff;
		box-sizing: border-box;
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
		font-size: 30rpx;
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
		font-size: 28rpx;
		color: #333;
	}
	.task .list .lis  .classfly .money{
		height: 64rpx;
		line-height: 64rpx;
		/* background: #f9285c; */
		background: linear-gradient(to left, #F9285C 0%, #FDBE68 100%);
		color: #fff;
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 0 16rpx 16rpx 0;
		padding: 0 16rpx;
		font-size: 28rpx;
	}
	.status-bars{
		height: 96rpx;
	}
	.tasklog{
		width: 138rpx;
		height: 130rpx;
		background: url(../../static/lssc.png) no-repeat;
		background-size: 100% 100%;
		position: fixed;
		bottom: 32rpx;
		right: 2.5%;
		z-index: 999;
	}
	.tablessss{
		width: 50%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		text-align: center
	}
	.project .list{
		margin-top: 32rpx !important;
	}
</style>