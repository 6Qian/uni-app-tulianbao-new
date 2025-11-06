<template>
	<view class="content">
		<view class="taskstate wait" v-if="info.is_in">待完成</view>
		<view class="title">{{info.name}}</view>
		<view class="time"><text>+{{info.price}}金币</text> <text>{{info.classify}}</text></view>
		<view class="taskdata">
			<view class="list">
				<view class="lis">
					<view class="ts">{{info.finish_count}}</view>
					<view class="tt">完成次数</view>
				</view>
				<view class="lis">
					<view class="ts">{{info.row_count}}</view>
					<view class="tt">剩余可接</view>
				</view>
				<view class="lis">
					<view class="ts">{{info.user_limit}}</view>
					<view class="tt">可接次数</view>
				</view>
			</view>
		</view>
		<view class="tips">
			<view class="ts">任务提示</view>
			<view class="tt">1，请先报名再做任务，否则无赏金，恶意提交以骗任务为目的的用户，经县堂主举报给客服，将采取封号、封IP、封设备处理，</view>
			<view class="tt">2，做任务前需看清悬赏主需要的截图，以免截图不一致。</view>
			<view class="tt">3，请不要私下加好友，以免受骗!警惕商家以任何理由收取费用，谨防上当!私下交易出现的损失与平台无关!</view>
			<view class="tt">4，悬赏主已全额托管堂金，请放心做任务。</view>
			<view class="tt">5，请不要在推广平台投资，充钱，高额回报所吸引，导致亏损后果自负。</view>
		</view>
		<view class="setp" v-if="info.form && info.form.length>0">
			<view class="titles">任务步骤</view>
			<view class="hlis" v-for="(item,index) in info.form" :key="index">
				<view class="hr"></view>
				<view class="number">{{index+1}}</view>
				<view class="text">
					<view class="tt">{{item.desc}}</view>
					<template v-if="item.type == 1">
						<image @click="app.openImage(b,item.images);" :src="a" :key="b" v-for="(a,b) in item.images" mode="widthFix"></image>
					</template>
					<view class="url" v-if="item.type == 5">
						<view class="lis" @click="openurl(item.content)">打开链接</view>
						<view class="lis" @click="copy(item.content)">复制链接</view>
					</view>
					<view class="input" v-if="item.type == 3">
						<input type="text" :placeholder="item.desc" v-model="item.content">
					</view>
					<view class="input" v-if="item.type == 2">
						<input type="text" :placeholder="item.content">
						<view class="copy" @click="copy(item.content)">复制</view>
					</view>
					<view v-if="item.type == 4">
						<view class="imglist">
							<view class="addimg" @tap="upload(index)"></view>
							<view class="imglis" @tap="imageClick(index,d)" v-for="(c,d) in item.images">
								<image :src="c" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view style="width: 100%;height: 128rpx;"></view>
		<view class="btn" @click="submit" v-if="info.is_in">提交信息</view>
		<view class="btn" @click="sign" v-else>立即报名</view>
		
		
	</view>
</template>


<script>
	export default {
	    data() {
	        return {
				id:0,
				info:{},
				images:[],
	        }
	    },
		onLoad(e){
			this.id = e.id
			this.init()
		},
	    methods: {
			openurl(url) {
				let _this = this;
				plus.runtime.openURL(url, function(e) {
					_this.app.toast('打开失败，即将为您复制链接，请手动去浏览器粘贴链接打开');
					setTimeout(() => {
						_this.copy(url)
					}, 1000)
				}, 'system');
			},
			copy(str) {
				let _this = this;
				uni.setClipboardData({
					data: str,
					showToast: false,
					success() {
						_this.app.toast("复制成功");
					},
					fail() {
						_this.app.toast("复制失败");
					}
				});
			},
			upload(index){
				if(!this.info.is_in) {
					this.app.toast('请先报名');
					return
				}
				let _this = this;
				uni.hideKeyboard();
				uni.chooseImage({
				    count: 1, //默认9
					sizeType:['compressed'],
				    success(res) {
						for(let j in res.tempFiles){
							const maxSize = 20 * 1024 * 1024; // 20M
							if (res.tempFiles[j].size > maxSize) {
								uni.showToast({
								  title: '图片大小不能超过20M',
								  icon: 'none'
								});
								return; // 超过限制，终止处理
							}
							_this.app.uploadOss({
								load: true,
								filePath: res.tempFiles[j].path,
								success(res){
									_this.$forceUpdate();
									_this.info.form[index].images.push(res.data.url);
								}
							});
						}
				    }
				});
			},
			imageClick(index,d){
				var _this = this;
				uni.hideKeyboard();
				uni.showActionSheet({
					itemList: ['查看','删除'],
					success(res) {
						if(res.tapIndex == 0){
							_this.app.openImage(0,[_this.info.form[index].images[d]]);
						}else if(res.tapIndex == 1){
							_this.info.form[index].images.splice(d,1);
						}
					}
				});
			},
			init(){
				this.app.ajax({
					url: "/task/detail",
					data:{id:this.id},
					success:(res)=> {
						if(res.code === 200){
							this.info = res.data
						}else{
							this.app.toast('任务不存在');
							this.app.goBack()
						}
					},
				});
	        },
			submit(){
				this.app.ajax({
					url: "/task/submit",
					load:true,
					method:"post",
					data:{id:this.id,form:this.info.form},
					success:(res)=> {
						if(res.code == 200){
							this.app.alert({
								content:res.message,
								success:()=>{
									this.app.openUrl({
										url:"/pages/mine/tasklog",
										openType:'redirectTo',
									});
								}
							})
						}else{
							this.app.toast(res.message);
						}
					},
				});
			},
			sign(){
				this.app.ajax({
					url: "/task/sign",
					load:true,
					method:"post",
					data:{id:this.id},
					success:(res)=> {
						this.app.toast(res.message);
						if(res.code === 200){
							this.init();
						}
					},
				});
			},
	    }
	}
</script>

<style>
	page {
		background: #f5f5f5;
	}

	.title {
		width: 100%;
		padding: 16rpx 4% 8rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		line-height: 56rpx;
		font-weight: bold;
		overflow: hidden;
		background: #fff;
	}

	.time {
		width: 100%;
		padding: 8rpx 4%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		background: #fff;
	}
	.time  text:nth-child(1){
		font-size: 28rpx;
		font-weight: bold;
		color: #EA282F;
	}
	.taskdata{
		width: 100%;
		padding: 24rpx 4% 32rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
	}
	.taskdata .list{
		width: 100%;
		height: 128rpx;
		border-radius: 16rpx;
		background: #F0EEEF;
		display: flex;
		justify-content: space-between;
	}
	.taskdata .list  .lis{
		width: 33.33%;
		flex-shrink: 0;
	}
	.taskdata .list .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-top: 20rpx;
	}
	.taskdata .list .tt{
		width: 100%;
		text-align: center;
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.tips{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		background: #fff;
		margin-top: 32rpx;
	}
	.tips .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}
	.tips  .tt{
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
	}
	.setp{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		background: #fff;
		margin-top: 32rpx;
	}
	.setp .titles{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 24rpx;
	}
	.setp .hlis{
		width: 100%;
		padding-left: 64rpx;
		box-sizing: border-box;
		position: relative;
		padding-bottom: 48rpx;
	}
	.setp .hlis .hr{
		width: 4rpx;
		height: 100%;
		background: #f5f5f5;
		position: absolute;
		top: 4rpx;
		left: 18rpx;
	}
	.setp .hlis .number{
		width: 40rpx;
		height: 40rpx;
		font-size: 24rpx;
		background: #f9285c;
		color: #fff;
		position: absolute;
		top: 4rpx;
		left: 0;
		border-radius: 40rpx;
		text-align: center;
		line-height: 40rpx;
	}
	.setp .hlis .text{
		width: 100%;
	}
	.setp .hlis .text .tt{
		line-height: 48rpx;
		color: #333;
		font-size: 28rpx;
	}
	.setp .hlis .text  image{
		margin-top: 16rpx;
		width: 256rpx;
	}
	.setp .hlis .text .url{
		width: 100%;
		margin-top: 16rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.setp .hlis .text .lis{
		height: 48rpx;
		line-height: 48rpx;
		border: 2rpx  solid;
		margin-right: 32rpx;
		font-size: 24rpx;
		padding: 0 24rpx;
		border-radius: 8rpx;
	}
	.setp .hlis .text .lis:nth-child(1){
		border-color: #f9285c;
		background: #f9285c;
		color: #fff;
	}
	.setp .hlis  .input{
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 16rpx;
		position: relative;
	}
	.setp .hlis  .input input{
		width: 100%;
		height: 80rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		background: transparent;
	}
	.uni-input-placeholder{
		color: #999;
	}
	.setp .hlis  .input .copy{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		padding: 0 24rpx;
		background: #666666;
		border-radius: 8rpx;
		position: absolute;
		top: 16rpx;
		color: #fff;
		right: 24rpx;
	}
	.btn{
		width: 100%;
		padding: 32rpx 0 48rpx;
		box-sizing: border-box;
		background: red;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		text-align: center;
		background: #f9285c;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}
	.taskstate{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		text-align: center;
	}
	.taskstate.wait{
		background: #FFA100;
	}
	.taskstate.success{
		background: #999;
	}
	.imglist{
		width: 100%;
		height: 128rpx;
		margin-top: 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		overflow: scroll;
		overflow: hidden;
		padding: 0 4%;
		box-sizing: border-box;
	}
	.imglist .imglis{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		margin-left: 24rpx;
		flex-shrink: 0;
	}
	.imglist .imglis image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
	}
	.imglist .addimg{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		background: url(../../static/reaelseadd.png) no-repeat;
		background-size: 100% 100%;
		flex-shrink: 0;
	}
</style>