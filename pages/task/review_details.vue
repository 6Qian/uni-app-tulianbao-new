<template>
	<view class="content">
		<view class="top">
			<view class="icon">
				<image :src="info.image" mode="aspectFill"></image>
			</view>
			<view class="text">
				<view class="ts">
					<view class="ll">{{info.name}}</view>
					<view class="rr" v-if="info.status == 0">待完成</view>
					<view class="rr" v-if="info.status == 1">待审核</view>
					<view class="rr" v-if="info.status == 2">已完成</view>
					<view class="rr" v-if="info.status == 3">已拒绝</view>
				</view>
				<view class="tt">
					<view class="ll">
						<image :src="info.avatar" mode="aspectFill"></image>
						<view class="llt">{{info.username}}</view>
					</view>
					<view class="rr" v-if="info.status_text">{{info.status_text}}</view>
				</view>
			</view>
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
							<view class="imglis" @tap="imageClick(item.images,d)" v-for="(c,d) in item.images">
								<image :src="c" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view style="width: 100%;height: 128rpx;"></view>
		<view class="pcnancbtn" v-if="info.status == 1">
			<view class="lb" @click="SetpPopup = true">拒绝</view>
			<view class="rb" @click="confirm(true)">通过</view>
		</view>
		
		
		<view class="popupcenter" v-if="SetpPopup">
			<view class="popups">
				<view class="titlesp">拒绝原因</view>
				<view class="setpdata" >
					<input type="text" placeholder="请输入拒绝原因" v-model="status_text">
				</view>
				<view class="btns">
					<view class="btnl" @click="SetpPopup = false">取消</view>
					<view class="btnr" @click="confirm(false)">确定</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>


<script>
export default {
		data() {
			return {
				SetpPopup: false,
				info:{},
				id:0,
				status_text:""
			}
		},
		onLoad(e){
			this.id = e.id
			this.init()
		},
		methods: {
			confirm(a){
				this.app.confirm({
					content: "操作后无法撤销",
					confirmText: "确认",
					success:()=>{
						this.app.ajax({
							url: "/task/myTaskConfirm",
							data: { id: this.id,status:a,status_text:this.status_text },
							method: "post",
							load:true,
							success:(res)=> {
								this.app.toast(res.message)
								if(res.code === 200){
									this.init();
									this.SetpPopup = false;
									this.status_text = '';
								}
							}
						});
					}
				})
			},
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
			imageClick(list,index){
				var _this = this;
				uni.hideKeyboard();
				_this.app.openImage(index,list);
			},
			init(){
				this.app.ajax({
					url: "/task/myTaskDetail",
					data:{id:this.id},
					success:(res)=> {
						this.info = res.data
					},
				});
			},
			returns(){
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	page {
		background: #f5f5f5;
	}

	.top{
		width: 100%;
		padding: 24rpx 4%;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.top .icon{
		width: 100rpx;
		height: 100rpx;
		border-radius: 128rpx;
		flex-shrink: 0;
	}
	.top .icon image{
		width: 100rpx;
		height: 100rpx;
		border-radius: 128rpx;
	}
	.top  .text{
		width: 100%;
	}
	.top  .text .ts{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		padding-left: 32rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		overflow: hidden;
	}
	.top  .text .ts .rr{
		font-size: 24rpx;
		color: #FFA100;
		font-weight: normal;
	}
	.top  .text .tt{
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		padding-left: 32rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		margin-top: 16rpx;
	}
	.top  .text .tt .ll{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 24rpx;
		font-weight: bold;
	}
	.top  .text .tt .ll image{
		height: 32rpx;
		width: 32rpx;
		margin-right: 16rpx;
	}
	.top  .text .tt .rr{
		font-size: 24rpx;
		color: #999;
		font-weight: normal;
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
	.pcnancbtn{
		width: 100%;
		padding: 32rpx 4% 80rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		background: #fff;
	}
	.pcnancbtn .lb{
		width: 48%;
		height: 88rpx;
		border: 2rpx #999 solid;
		border-radius: 16rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #999;
	}
	.pcnancbtn .rb{
		width: 48%;
		height: 88rpx;
		border: 2rpx #f9285c solid;
		border-radius: 16rpx;
		text-align: center;
		background: #f9285c;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #fff;
	}
	.popupcenter{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 138;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
		
	}
	.popupcenter .popups{
		width: 88%;
		padding:32rpx 24rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
		background: #fff;
	}
	.popupcenter .popups .titlesp{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 32rpx;
		text-align: center;
		color: #333;
		margin-bottom: 24rpx;
		font-weight: bold;
	}
	.popupcenter .popups .list{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.popupcenter .popups .list .lis{
		width: 31%;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 28rpx;
		background: #F0EEEF;
		color: #333;
		margin-bottom: 24rpx;
		border-radius: 8rpx;
		text-align: center;
	}
	.popupcenter .popups .list .lis.active{
		background: #f9285c;
		color: #fff;
	}
	.textarea{
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;
		background: #f5f5f5;
	}
	.textarea textarea{
		line-height: 48rpx;
		font-size: 28rpx;
		color: #333;
		max-height: 160rpx;
	}
	.btns{
		width: 100%;
		height: 80rpx;
		margin-top: 48rpx;
		display: flex;
		justify-content: space-between;
	}
	.btns .btnl{
		width: 48%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-radius: 8rpx;
		text-align: center;
		background: #666666;
		color: #fff;
	}
	.btns .btnr{
		width: 48%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-radius: 8rpx;
		text-align: center;
		background: #f9285c;
		color: #fff;
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
		background: url(../../static/addimgsss.png) no-repeat;
		background-size: 100% 100%;
		flex-shrink: 0;
	}
	.setpdata{
		width: 100%;
	}
	.setpdata input{
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 24rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333;
	}
	.setpdata .uni-input-placeholder{
		font-size: 28rpx;
		color: #999;
	}
	.setpdata input:nth-child(1){
		margin-top: 0;
	}
	.setp .hlis:nth-child(2){
		margin-top: 24rpx;
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
	.operate{
		width: 100%;
		margin-top: 24rpx;
		display: flex;
		justify-content: flex-end;
	}
	.operate .oplis{
		height: 40rpx;
		line-height: 40rpx;
		border: 2rpx #f9285c solid;
		border-radius: 8rpx;
		padding: 0 24rpx;
		font-size: 24rpx;
		margin-left: 24rpx;
		color: #f9285c;
	}
	.operate .oplis:last-child{
		border-color: #EA282F;
		color: #EA282F;
	}
	.paylists{
		width: 100%;
		padding: 32rpx 32rpx 80rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		position: fixed;
		bottom: 0;
		right: 0;
	}
	.paylists .titlecc{
		width: 100%;
		text-align: center;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		position: relative;
	}
	.paylists .titlecc .colse{
		height: 48rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #999;
		position: absolute;
		top: 0;
		right: 0;
		font-weight: normal;
	}
	.paylists .lis{
		width: 100%;
		margin-top: 32rpx;
		background: #f5f5f5;
		border-radius: 24rpx;
		padding: 24rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.paylists .lis .icon{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: red;
		margin-right: 24rpx;
		flex-shrink: 0;
	}
	.paylists .lis .icon image{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
	}
	.paylists .lis .text{
		width: 100%;
		height: 80rpx;
	}
	.paylists .lis .text .ts{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.paylists .lis .text .tt{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	.paylists .lis .sva{
		width: 28rpx;
		height: 28rpx;
		position: absolute;
		top: 50rpx;
		right: 24rpx;
		border-radius: 40rpx;
		border: 2rpx #ccc solid;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.paylists .lis .sva text{
		width: 16rpx;
		height: 16rpx;
		background: #ccc;
		border-radius: 16rpx;
	}
	.paylists .lis .sva.active{
		border-color: #f9285c;
	}
	.paylists .lis .sva.active text{
		background: #f9285c;
	}
	.paylists .paybtn{
		width: 100%;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		border-radius: 88rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		margin-top: 64rpx;
		background: #f9285c;
	}
</style>