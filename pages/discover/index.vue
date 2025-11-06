<template>
	<view class="" style="padding: 30rpx; box-sizing: border-box;">
		<view @click="playgame" class="w-1 fr-b-c p-r-20" style=" box-sizing: border-box; position: relative; width: 690rpx; height: 136rpx;">
			<image src="/static/gamebg.png" style="width: 690rpx; height: 136rpx; position: absolute; left: 0; top: 0;" mode=""></image>
			<image src="/static/dts.jpg" class="relative" mode="aspectFill" style="border-radius: 15rpx; width: 100rpx; height: 100rpx;"></image>
			<text class="relative" style="flex:1; margin-left: 20rpx; color: #333333; font-size: 32rpx;">途练宝捉迷藏</text>
			<image class="relative" src="/static/rightb.png" style="width: 13rpx; height: 22rpx;" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header_class: 'header',
				isActive: 0,
				
				dynamic:[],
				article:[],
				page:[1,1],
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 16) {
				this.header_class = 'header headerws';
			} else {
				this.header_class = 'header';
			}
		},
		onLoad(e) {
			this.getList();
		},
		onReachBottom() {
			this.getList(true)
		},
		onPullDownRefresh() {
			this.page[this.isActive] = 1
			this.getList()
		},
		methods: {
			playgame(){
				 plus.runtime.openURL('http://game.whjcf.top', (res) => {
				            // 打开失败处理
				            uni.showModal({
				                title: '打开失败',
				                content: platform === 'android' ? 
				                    '请检查是否有可用的浏览器应用' : 
				                    '请在系统设置中允许访问浏览器',
				                showCancel: false
				            });
				            console.error('打开链接失败:', res);
				        });
			},
			getList(a) {
				if(a === true){
					this.page[this.isActive]++;
				}
				this.app.ajax({
					url: "/dynamic/index",
					data:{page:this.page[this.isActive],user_id:(this.isActive == 0?0:-1)},
					success:(res)=> {
						let name = this.isActive == 1?'article':'dynamic';
						if(this.page[this.isActive] == 1){
							this[name] = res.data
						}else{
							this[name] = this[name].concat(res.data)
						}
					},
				});
			},
			setActive(index) {
				this.isActive = index;
				if(!this.article.length && index == 1){
					this.getList()
				}
			},
			ToUserInfo(){
				uni.navigateTo({
					url:"/pages/discover/userinfo"
				})
			},
			ToDetail(){
				uni.navigateTo({
					url:"/pages/discover/detail"
				})
			},
			ToRelease(){
				uni.navigateTo({
					url:"/pages/discover/release"
				})
			}
		}
	}
</script>


<style>
	page{
		background: #ffffff;
	}
	.fr-b-c{
		display: flex; justify-content: space-between; align-items: center;
	}
	.p-r-20{
		padding: 0 20rpx;
	}
	.bb-solid{
		border-bottom: 2rpx solid #eeeeee;
	}
	
	.relative{
		position: relative;
	}
</style>