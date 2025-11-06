<template>
	<view class="content">
		
		<view class="setp">
			<view class="titles">任务类型</view>
			<view class="typelist">
				<view v-for="(item,index) in classify" :key="index" @click="form.classify_id = item.id" :class="'lis ' + (form.classify_id == item.id ? 'active' : '')">{{item.name}}</view>
			</view>
		</view>
		
		<view class="setp">
			<view class="titles">支持设备</view>
			<view class="typelist">
				<view @click="form.system.includes('android') ? form.system = form.system.filter(item => item !== 'android') : form.system.push('android')" :class="'lis ' + (form.system.includes('android') ? 'active' : '')">安卓</view>
				<view @click="form.system.includes('ios') ? form.system = form.system.filter(item => item !== 'ios') : form.system.push('ios')" :class="'lis ' + (form.system.includes('ios') ? 'active' : '')">苹果</view>
			</view>
		</view>
		
		<view class="setp">
			<view class="titles">任务图片</view>
			<view class="imglist">
				<view class="addimg" @tap="upload2()"></view>
				<view class="imglis">
					<image :src="form.image" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		
		
		
		
		<view class="setp">
			<view class="input">
				<view class="ts">任务名字</view>
				<input type="text" placeholder="请输入任务名字" v-model="form.name">
				<view class="unit"></view>
			</view>
			<view class="input">
				<view class="ts">任务简介</view>
				<input type="text" placeholder="请输入任务简介" v-model="form.desc">
				<view class="unit"></view>
			</view>
			<view class="input">
				<view class="ts">做单次数</view>
				<input type="text" placeholder="请输入做单次数" v-model="form.user_limit">
				<view class="unit"></view>
			</view>
			<view class="tips">单个用户最多可做单次数 0为无限制</view>
			<view class="input">
				<view class="ts">做单时间</view>
				<input type="text" placeholder="请输入做单时间" v-model="form.minute">
				<view class="unit">分钟</view>
			</view>
			<view class="tips">任务做单交单时间，0为无限制</view>
		</view>
		
		
		<view class="setp">
			<view class="input">
				<view class="ts">悬赏单价</view>
				<input type="number" v-model="form.price">
				<view class="unit">金币</view>
			</view>
			<view class="input">
				<view class="ts">悬赏数量</view>
				<input type="number" v-model="form.number">
				<view class="unit"></view>
			</view>
			<view class="input">
				<view class="ts">合计赏金</view>
				<input type="text" ref="priceInput" :value="((parseFloat(form.price?form.price:0) * parseFloat(form.number?form.number:0)) + (parseFloat(form.price?form.price:0) * parseFloat(form.number?form.number:0) * info.rate / 100)).toFixed(2)">
				<view class="unit">元</view>
			</view>
		</view>
		
		<view class="setp">
			<view class="titles">任务步骤
			<view class="addsetp" @click="SetpPopup = true"><view class="icon"></view><view class="tt">添加步骤</view></view></view>
			
			<view class="hlis" v-for="(item,index) in form.form" :key="index">
				<view class="hr"></view>
				<view class="number">{{index+1}}</view>
				<view class="text">
					<view class="tt">{{item.desc}}</view>
					<template v-if="item.type == 1">
						<image :src="a" :key="b" v-for="(a,b) in item.images" mode="widthFix"></image>
					</template>
					<view class="url" v-if="item.type == 5">
						<view class="lis" @click="openurl(item.content)">打开链接</view>
						<view class="lis" @click="copy(item.content)">复制链接</view>
					</view>
					<view class="input" v-if="item.type == 3">
						<input type="text" :placeholder="item.desc">
					</view>
					<view class="input" v-if="item.type == 2">
						<input type="text" :placeholder="item.content">
						<view class="copy" @click="copy(item.content)">复制</view>
					</view>
					<view v-if="item.type == 4">
						<view class="imglist">
							<view class="addimg"></view>
							<view class="imglis">
							</view>
						</view>
					</view>
					<view class="operate">
						<view class="oplis" @click="moveUp(index)">上移</view>
						<view class="oplis" @click="moveDown(index)">下移</view>
						<view class="oplis" @click="removeElement(index)">删除</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="protocol">
			<view class="select active"><text></text></view>
			<view class="tt">阅读并同意<text>《发布须知》</text></view>
		</view>
		
		<view style="width: 100%;height: 160rpx;"></view>
		<view class="btn" @click="go">立即提交</view>
		
		<view class="popupcenter" v-if="SetpPopup">
			<view class="popups">
				<view class="title">选择步骤类型</view>
				<view class="list">
					<view class="lis"  :class="{ active: SetpActive === 0 }"  @click="SetpActives(0)">文字说明</view>
					<view class="lis" :class="{ active: SetpActive === 1 }"  @click="SetpActives(1)">图文说明</view>
					<view class="lis" :class="{ active: SetpActive === 2 }"  @click="SetpActives(2)">数据复制</view>
					<view class="lis" :class="{ active: SetpActive === 3 }"  @click="SetpActives(3)">收集信息</view>
					<view class="lis" :class="{ active: SetpActive === 4 }"  @click="SetpActives(4)">收集截图</view>
					<view class="lis" :class="{ active: SetpActive === 5 }"  @click="SetpActives(5)">打开网址</view>
				</view>
				<view class="textarea" v-if="SetpActive === 0">
					<textarea name="" id="" cols="30" v-model="desc" rows="6" placeholder="请输入活动步骤说明"></textarea>
				</view>
				<view class="textarea" v-if="SetpActive === 1">
					<textarea name="" id="" cols="30" v-model="desc" rows="6" placeholder="请输入活动步骤说明"></textarea>
					<view class="imglist">
						<view class="addimg" @tap="upload(-1)"></view>
						<view class="imglis" @tap="imageClick(index)" v-for="(item,index) in images">
							<image :src="item" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="setpdata" v-if="SetpActive === 2">
					<input type="text" placeholder="请输入步骤说明" v-model="desc">
					<input type="text" placeholder="请输入复制内容。如:邀请码、钱包地址等" v-model="content">
				</view>
				<view class="setpdata" v-if="SetpActive === 3">
					<input type="text" placeholder="请输入要收集的信息" v-model="desc">
				</view>
				<view class="setpdata" v-if="SetpActive === 4">
					<input type="text" placeholder="请输入要收集的信息" v-model="desc">
				</view>
				<view class="setpdata" v-if="SetpActive === 5">
					<input type="text" placeholder="请输入步骤说明" v-model="desc">
					<input type="text" placeholder="请输入网址" v-model="content">
				</view>
				<view class="btns">
					<view class="btnl" @click="SetpPopup = false">取消</view>
					<view class="btnr" @click="formAdd">立即提交</view>
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
				SetpActive: 0,
				info:{rate:0},
				
				desc:"",
				content:"",
				images:[],
				classify:[],
				
				form:{
					classify_id:0,
					system:[],
					name:"",
					user_limit:'',
					minute:'',
					price:'',
					number:'',
					form:[],
					desc:"",
					image:"",
				}
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			go(){
				if(!this.form.price || !this.form.number){
					this.app.toast('请输入完整信息');
					return
				}
				let price = ((parseFloat(this.form.price?this.form.price:0) * parseFloat(this.form.number?this.form.number:0)) + (parseFloat(this.form.price?this.form.price:0) * parseFloat(this.form.number?this.form.number:0) * this.info.rate / 100)).toFixed(2)
				this.app.confirm({
					content: "发布需要扣除合计赏金“"+price+"”金币，确认吗？",
					confirmText: "确认",
					success:()=>{
						this.app.ajax({
							url: "/task/add",
							data: this.form,
							method: "post",
							success:(res)=> {
								if(res.code === 200){
									this.app.alert({
										content:res.message,
										success:()=>{
											this.app.goBack();
										}
									})
								}else{
									this.app.toast(res.message)
								}
							}
						});
					}
				})
			},
			moveUp(index) {
			    if (index > 0) {
			        let temp = this.form.form[index];
			        this.form.form.splice(index, 1);
			        this.form.form.splice(index - 1, 0, temp);
			    }
			},
			moveDown(index) {
			    if (index < this.form.form.length - 1) {
			        let temp = this.form.form[index];
			        this.form.form.splice(index, 1);
			        this.form.form.splice(index + 1, 0, temp);
			    }
			},
			removeElement(index) {
				this.form.form.splice(index, 1);
			},
			formAdd(){
				if(!this.desc){
					this.app.toast('请输入完整')
					return
				}
				if((this.SetpActive == 2 || this.SetpActive == 5) && !this.content){
					this.app.toast('请输入完整')
					return
				}
				if((this.SetpActive == 1) && this.images.length<=0){
					this.app.toast('至少上传一张图片')
					return
				}
				this.form.form.push({type:this.SetpActive,desc:this.desc,content:this.content,images:this.images});
				this.SetpActive = 0
				this.desc = '';
				this.images = [];
				this.content = '';
				this.SetpPopup = false;
			},
			imageClick(index){
				var _this = this;
				uni.hideKeyboard();
				uni.showActionSheet({
					itemList: ['查看', '替换', '删除'],
					success(res) {
						if(res.tapIndex == 0){
							_this.app.openImage(0,[_this.images[index]]);
						}else if(res.tapIndex == 1){
							_this.upload(index);
						}else if(res.tapIndex == 2){
							_this.images.splice(index,1);
						}
					}
				});
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
			//上传图片
			upload(index){
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
									if(index === -1){
										_this.images.push(res.data.url);
									}else{
										_this.images[index] = res.data.url;
									}
								}
							});
						}
						//for(let j in res.tempFiles){
							// _this.app.uploadOss({
							// 	load: true,
							// 	filePath: res.tempFiles[j].path,
							// 	success(res){
							// 		_this.$forceUpdate();
							// 		if(index === -1){
							// 			_this.images.push(res.data.url);
							// 		}else{
							// 			_this.images[index] = res.data.url;
							// 		}
							// 	}
							// });
						//}
				    }
				});
			},
			upload2(){
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
									_this.form.image = res.data.url;
								}
							});
						}
				    }
				});
			},
			SetpActives(index) {
				this.SetpActive = index;
			},
			init(){
				this.app.ajax({
					url: "/task/getClassify",
					data:{is_user:1},
					success:(res)=> {
						this.classify = res.data
					},
				});
				this.app.ajax({
					url: "/task/getInfo",
					success:(res)=> {
						this.info = res.data
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
	.setp:nth-child(1){
		margin-top: 0;
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
		position: relative;
	}
	.setp .titles .addsetp{
		height: 40rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		top: 0;
		right: 0;
	}
	.setp .titles .addsetp .icon{
		width: 28rpx;
		height: 28rpx;
		background: url(../../static/addss.png) no-repeat;
		background-size: 100% 100%;
	}
	.setp .titles .addsetp .tt{
		font-weight: normal;
		font-size: 24rpx;
		margin-left: 8rpx;
	}
	.typelist{
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.typelist .lis{
		width: 18%;
		height: 56rpx;
		line-height: 56rpx;
		margin-right: 2.5%;
		flex-shrink: 0;
		background: #F0EEEF;
		color: #333;
		border-radius: 8rpx;
		font-size: 28rpx;
		text-align: center;
		margin-top: 24rpx;
	}
	.typelist .lis.active{
		background: #f9285c;
		color: #fff;
	}
	.typelist .lis:nth-child(5){
		margin-right: 0;
	}
	.typelist .lis:nth-child(5){
		margin-right: 10;
	}
	.setp .input:nth-child(1){
		margin-top: 0;
	}
	.setp .input{
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		margin-top: 24rpx;
		border-radius: 8rpx;
		position: relative;
	}
	.setp .input input{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 160rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
	}
	.setp .input .ts{
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #333;
		position: absolute;
		top: 0;
		left: 24rpx;
	}
	.setp .input .unit{
		height: 80rpx;
		line-height: 80rpx;
		position: absolute;
		top: 0;
		right: 24rpx;
		font-size: 28rpx;
		color: #999;
	}
	.uni-input-placeholder{
		font-size: 28rpx;
		color: #999;
	}
	.setp .tips{
		width: 100%;
		font-size: 20rpx;
		margin-top: 16rpx;
		color: #999;
		padding-left: 8rpx;
		box-sizing: border-box;
	}
	.protocol{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 48rpx 4%;
		box-sizing: border-box;
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
	.popupmusk{
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 128;
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
		padding: 24rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
		background: #fff;
	}
	.popupcenter .popups .title{
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
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
</style>