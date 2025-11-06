<template>
    <view class="content">
        <view :class="header_class" :style="{paddingTop:statusBarHeight+'px'}">
            <view class="return" @click="returns()"></view>
            <view class="text" style="color: #ffffff;">开通VIP</view>
        </view>
        <view class="top">
            <view class="userinfos">
                <view class="avatar">
                    <image mode="aspectFill" :src="info.avatar"></image>
                </view>
                <view class="text">
                    <view class="ts" style="color: #ffffff;">{{info.username}}</view>
                    <view class="tt" style="color: rgba(255, 255, 255, 0.32);" v-if="info.vip">会员到期时间：{{info.vip_time}}</view>
                    <view class="tt" style="color: rgba(255, 255, 255, 0.32);" v-else>兑换会员后可享受多种特权福利</view>
                </view>

            </view>
            <view class="vipbox" style="width: 714rpx; height: 215rpx; padding-top: 60rpx;">
                <!-- <view class="vts">VIP特权</view>
                <view class="vtt">开通会员全场文章免费阅读！</view>
                <view class="kcicon"></view> -->
				<view class="" style="width: 100%; height: 100%;">
					<view style="display: flex; align-items: center;">
						<image src="/static/zuan.png" style="width: 70rpx; height: 48rpx;" mode=""></image>
						<text style="color: #ffffff; font-weight: bold; font-size: 30rpx;">享受会员特殊权益</text>
					</view>
					<text style="color: #ffffff; font-size: 24rpx;" >开通会员可享受会员权益</text>
				</view>
            </view>
        </view>
        <view style="width: 100%;height: 552rpx;"></view>
        <view class="center" style="z-index: 111;">
            <view style="display: flex;overflow-x: auto;" v-if="info.vip_list && info.vip_list.length > 0">
                <view :class="'viplist ' + (Inv == i ? 'active' : '')" @click="Inv=i" v-for="(v,i) in info.vip_list"
                    :key="v.id">
                    <view class="lis" style="position: relative; padding: 0; padding-top: 100rpx; width: 258rpx; height: 254rpx; display: flex; flex-direction: column; justify-content: flex-start; align-items: center;">
						<image src="/static/vlbg.png" style="width: 100%; height: 100%; position: absolute; left: 0; top: 0;" mode=""></image>
						<image src="/static/vlr.png" style="width: 110rpx; height: 80rpx; position: absolute; right: 30rpx; top: 4rpx;"  mode=""></image>
                        <h3 style="position: relative; color: #D76B86;">{{v.name}}</h3>
                        <view style="position: relative;">
                            <h2 style="color: #F9285C;"><text>¥</text>{{v.price}}</h2>
                            <text class="moneys">{{v.desc}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="title">
                <view class="ls">会员权益</view>
                <view class="rs">开通可畅想多种会员权益</view>
            </view>
            <view class="polist">
                <view class="lis">
                    <view class="icon"></view>
                    <view class="text">
                        <view class="ts">游戏免费试玩</view>
                        <view class="tt">全场游戏免费玩</view>
                    </view>
                </view>
                <view class="lis">
                    <view class="icon"></view>
                    <view class="text">
                        <view class="ts">专属客服</view>
                        <view class="tt">极速接待专线</view>
                    </view>
                </view>
            </view>
            <view class="title">
                <view class="ls">服务说明</view>
            </view>
            <view class="tips">1.开通会员获得全场游戏免费玩权限
                2.该服务为网络商品，付费后即可享受权益</view>
        </view>

        <view class="footer" v-if="Inv != null">
            <view class="left">{{info.vip_list[Inv].name}}：<text>¥{{info.vip_list[Inv].price}}</text></view>
            <!-- <view class="btn" @click="open">立即开通</view> -->
            <view class="btn" @click="PayPopup = true">{{info.vip?"续费会员":"立即开通"}}</view>
        </view>



        <view class="popupcenter" v-if="PayPopup">
            <view class="paylists">
                <view class="titlecc">请选择支付方式 <view class="colse" @click="PayPopup = false">取消</view>
                </view>
                <view class="lis" @click="paytype = 'alipay'" v-if="info.alipay">
                    <view class="icon">
                        <image src="/static/p2.png" mode="aspectFill"></image>
                    </view>
                    <view class="text">
                        <view class="ts">支付宝</view>
                        <view class="tt">推荐安装了支付宝的用户选择</view>
                    </view>
                    <view :class="'sva '+(paytype == 'alipay' ? 'active' : '')">
                        <text></text>
                    </view>
                </view>
                <view class="lis" @click="paytype = 'wxpay'" v-if="info.wxpay">
                    <view class="icon">
                        <image src="/static/p1.png" mode="aspectFill"></image>
                    </view>
                    <view class="text">
                        <view class="ts">微信</view>
                        <view class="tt">推荐安装了微信的用户选择</view>
                    </view>
                    <view :class="'sva '+(paytype == 'wxpay' ? 'active' : '')">
                        <text></text>
                    </view>
                </view>
                <view class="lis" @click="paytype = 'bankpay'" v-if="info.bankpay">
                    <view class="icon">
                        <image src="/static/p3.png" mode="aspectFill"></image>
                    </view>
                    <view class="text">
                        <view class="ts">银行卡</view>
                        <view class="tt">推荐开通银联用户选择</view>
                    </view>
                    <view :class="'sva '+(paytype == 'bankpay' ? 'active' : '')">
                        <text></text>
                    </view>
                </view>
                <view class="paybtn" @click="open">立即支付</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                header_class: 'header',
                SetpPopup: false,
                isActive: 0,
                info: {},
                paytype: "alipay",
                code: "",
                PayPopup: false,
                Inv: null,
                paylink: '',
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
        onShow() {
            this.init();
        },
        onLoad() {
            var that = this
            var score = uni.getStorageSync('vip_time2');
            if (score) {
                that.info.vip_time = that.info.vip_time2
            }
            uni.$off('paymentSuccess').$on('paymentSuccess', function(res) {
                that.info.vip = 1
                that.info.vip_time = that.info.vip_time2
                uni.setStorageSync('vip_time2', vip_time2);
                uni.showToast({
                    title: '充值成功'
                })

            }.bind(this))
        },
        methods: {
            iospay() {
                uni.showToast({
                    title: '正在连接App Store,请稍等',
                    icon: 'loading',
                    duration: 10000
                })
                this.app.apple('zhuankevip', this.app.generateRandomFourDigitNumber())
            },
			
            open() {
                this.app.ajax({
                    url: "/vip/open",
                    data: {
                        paytype: this.paytype,
                        id: this.info.vip_list[this.Inv].id
                    },
                    load: true,
                    method: "post",
                    success: async (res) => {
                        if (res.code === 200) {
							console.log(res,'rerssssssssssss')
							// return
                            // this.app.openUrl({url:"/pages/public/pay",data:{src:res.data.payUrl,id:res.data.order_id,vip:1}})
							uni.navigateTo({
								url:'/pages/webview/vippay?url='+encodeURIComponent(res.data.payUrl)
							})
							return
                            if (plus.os.name === 'iOS') {
                                plus.runtime.launchApplication({
                                    action: res.data.payUrl
                                }, (e) => {
                                    console.log('跳转失败:', e);
                                });
                            } else {
                                // Android仍使用openURL
                                plus.runtime.openURL(res.data.payUrl, (e) => {
                                    console.log(e, 'cuole???')
                                })
                            }
                        } else {
                            this.app.toast(res.message)
                        }
                    },
                });
            },
            exchange() {
                this.app.ajax({
                    url: "/vip/exchange",
                    data: {
                        code: this.code
                    },
                    load: true,
                    method: "post",
                    success: (res) => {
                        this.app.toast(res.message)
                        if (res.code === 200) {
                            this.init();
                            this.SetpPopup = false
                        }
                    },
                });
            },
            init() {
                this.app.ajax({
                    url: "/vip/index",
                    success: (res) => {
                        this.info = res.data
                    },
                });
            },
            returns() {
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
        overflow: hidden;
    }

    .return {
        background: url(../../static/fhs.png) no-repeat;
        background-size: 100% 100%;
    }

    .headerws {
        background: transparent;
        background-size: 100% 100%;
    }

    .top {
        width: 100%;
        padding: 200rpx 4% 0;
        box-sizing: border-box;
        background: url(../../static/kcss.png) no-repeat;
        background-size: 100% 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }

    .viplist {
        display: flex;
        justify-content: flex-start;
        margin-left: 20rpx;
    }

    .viplist .lis {
        box-sizing: border-box;
        /* border: 2px solid #f3e1ae; */
        border-radius: 16rpx;
    }

    .center .active {
        /* background-image: linear-gradient(112deg, #fcf0c8 0%, #fae2a2 100%); */
		border: 5rpx solid #f9285c;
		border-radius: 16rpx;
    }

    .viplist .lis h3 {
        width: 100%;
        text-align: center;
        font-size: 24rpx;
        color: #4a331e;
    }

    .viplist .lis h2 {
        width: 100%;
        font-size: 48rpx;
        color: red;
        text-align: center;
    }

    .viplist .lis h2 text {
        font-size: 32rpx;
        margin-right: 8rpx;
    }

    .viplist .lis .moneys {
        width: 100%;
        text-align: center;
        font-size: 24rpx;
        display: block;
        color: #999;
        text-decoration: line-through;
    }

    .viplist .ccpp {
        width: 50%;
        height: 200rpx;
        margin-top: 25rpx;
        background-color: #fffcf2;
        padding: 16rpx;
        box-sizing: border-box;
        border: 2rpx #f3e1ae solid;
        box-sizing: border-box;
        border-left: 0;
        border-radius: 0 16rpx 16rpx 0;
    }

    .viplist .ccpp .tsk {
        width: 100%;
        height: 48rpx;
        line-height: 48rpx;
        font-size: 28rpx;
    }

    .viplist .ccpp .mojus {
        width: 100%;
        margin-top: 12rpx;
        height: 100rpx;
        padding: 10rpx 32rpx;
        box-sizing: border-box;
        border-radius: 8rpx;
        background-image: linear-gradient(112deg, #fcf0c8 0%, #fae2a2 100%);
        background: #1e1f23;
    }

    .viplist .ccpp .mojus h4 {
        width: 100%;
        font-size: 28rpx;
        height: 40rpx;
        line-height: 40rpx;
        font-weight: normal;
        color: #bc9b6b;
        font-weight: bold;
    }

    .viplist .ccpp .mojus text {
        font-size: 28rpx;
        height: 40rpx;
        font-size: 24rpx;
        color: #fff;
    }

    .userinfos {
        width: 100%;
        height: 88rpx;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .userinfos .avatar {
        width: 88rpx;
        height: 88rpx;
        background: #fff;
        flex-shrink: 0;
        border-radius: 96rpx;
        margin-right: 16rpx;
    }

    .userinfos .text {
        width: 100%;
        padding-right: 128rpx;
        box-sizing: border-box;
    }

    .userinfos .text .ts {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
    }

    .userinfos .text .tt {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #333;
        margin-top: 8rpx;
    }

    .userinfos .name {
        height: 96rpx;
        line-height: 96rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
    }

    .userinfos .vicon {
        width: 32rpx;
        height: 32rpx;
        background: url(../../static/vicon.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 8rpx;
    }

    .userinfos .focus {
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

    .userinfos .focus .icon {
        width: 28rpx;
        height: 28rpx;
        background: url(../../static/adds.png) no-repeat;
        background-size: 100% 100%;
    }

    .userinfos .focus.active {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.33) 100%);
        border-radius: 88rpx;
    }

    .userinfos .focus.active .icon {
        display: none;
    }

    .userinfos .focus.active .tt {
        margin-left: 0;
        color: #AB6F48;
    }

    .userinfos .focus .tt {
        height: 56rpx;
        line-height: 56rpx;
        font-size: 24rpx;
        margin-left: 16rpx;
        color: #f9285c;
    }

    .usersign {
        width: 100%;
        line-height: 48rpx;
        font-size: 28rpx;
        color: #fff;
        margin-top: 24rpx;
    }

    .usernolist {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-top: 48rpx;
        position: relative;
    }

    .usernolist .notice {
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

    .usernolist .notice .icon {
        width: 40rpx;
        height: 40rpx;
        background: url(../../static/notice.png) no-repeat;
        background-size: 100% 100%;
        position: relative;
    }

    .usernolist .notice .icon::before {
        content: '1';
        width: 24rpx;
        height: 24rpx;
        line-height: 24rpx;
        border-radius: 24rpx;
        background: #EA282F;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 16rpx;
        text-align: center;
    }

    .usernolist .notice .tt {
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #fff;
        opacity: 0.75;
    }

    .usernolist .lis {
        width: 88rpx;
        margin-right: 16rpx;
    }

    .usernolist .lis .ts {
        width: 88rpx;
        text-align: center;
        font-size: 32rpx;
        height: 48rpx;
        line-height: 48rpx;
    }

    .usernolist .lis .tt {
        width: 88rpx;
        text-align: center;
        font-size: 24rpx;
        color: #fff;
        opacity: 0.75;
        margin-top: 8rpx;
    }

    .vipbox {
        width: 100%;
        padding: 24rpx 24rpx 80rpx;
        box-sizing: border-box;
        background: url(../../static/ncsdfs.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 64rpx;
        position: relative;
        border-radius: 16rpx 16rpx 0 0;
    }

    .vipbox .vts {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #E3BBA0;
    }

    .vipbox .vtt {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #E3BBA0;
        margin-top: 16rpx;
    }

    .vipbox .vbtn {
        height: 64rpx;
        background: #5B3A2F;
        position: absolute;
        top: 36rpx;
        right: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 24rpx;
        border-radius: 64rpx;
    }

    .vipbox .vbtn .vbtt {
        height: 64rpx;
        line-height: 64rpx;
        font-size: 24rpx;
        color: red;
    }

    .vipbox .vbtn .vbicon {
        width: 13.2rpx;
        height: 24rpx;
        background: url(../../static/vmos.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 16rpx;
    }

    .vipbox .kcicon {
        width: 128rpx;
        height: 128rpx;
        background: url(../../static/kcse.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 24rpx;
        top: -24rpx;
    }

    .center {
        width: 100%;
        padding: 32rpx 4%;
        box-sizing: border-box;
        background: #fff;
        margin-top: -32rpx;
        position: relative;
        z-index: 69;
        border-radius: 32rpx 32rpx 0 0;
    }

    .center .notice {
        width: 100%;
        height: 80rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: rgba(245, 171, 22, 0.1);
        padding: 0 24rpx;
        box-sizing: border-box;
    }

    .center .notice .icon {
        width: 40rpx;
        height: 40rpx;
        background: url(../../static/jns.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 16rpx;
    }

    .center .notice .tt {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 26rpx;
        color: #F5AB16;
    }

    .title {
        width: 100%;
        margin-top: 48rpx;
        height: 48rpx;
        margin-bottom: 32rpx;
        display: flex;
        justify-content: space-between;
    }

    .title .ls {
        height: 48rpx;
        line-height: 48rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
    }

    .title .rs {
        height: 48rpx;
        line-height: 48rpx;
        font-size: 24rpx;
        color: #999;
    }

    .polist {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .polist .lis {
        width: 48%;
        padding: 24rpx;
        box-sizing: border-box;
        border-radius: 16rpx;
        background: #F5F3F4;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .polist .lis .icon {
        width: 80rpx;
        height: 80rpx;
        margin-right: 24rpx;
        flex-shrink: 0;
    }

    .polist .lis:nth-child(1) .icon {
        background: url(../../static/nne1s.png) no-repeat;
        background-size: 100% 100%;
    }

    .polist .lis:nth-child(2) .icon {
        background: url(../../static/nne2s.png) no-repeat;
        background-size: 100% 100%;
    }

    .polist .lis .text {
        width: 100%;
        height: 80rpx;
    }

    .polist .lis .text .ts {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
    }

    .polist .lis .text .tt {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #999;
    }

    .tips {
        width: 100%;
        line-height: 48rpx;
        font-size: 24rpx;
        color: #999;
        margin-top: -16rpx;

    }

    .footer {
        width: 100%;
        padding: 32rpx 4% 64rpx;
        box-sizing: border-box;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 99;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer .left {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        color: #333;
    }

    .footer .left text {
        font-size: 32rpx;
        font-weight: bold;
        color: #EA282F;
    }

    .footer .btn {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        background: #f9285c;
        color: #fff;
        padding: 0 64rpx;
        border-radius: 16rpx;
    }

    .popupmusk {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 128;
    }

    .popupcenter {
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

    .popupcenter .popups {
        width: 88%;
        padding: 32rpx 24rpx;
        border-radius: 16rpx;
        box-sizing: border-box;
        background: #fff;
    }

    .popupcenter .popups .titlesp {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 32rpx;
        text-align: center;
        color: #333;
        margin-bottom: 24rpx;
        font-weight: bold;
    }

    .popupcenter .popups .list {
        width: 100%;
        margin-top: 24rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .popupcenter .popups .list .lis {
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

    .popupcenter .popups .list .lis.active {
        background: #f9285c;
        color: #fff;
    }

    .textarea {
        width: 100%;
        padding: 24rpx;
        box-sizing: border-box;
        background: #f5f5f5;
    }

    .textarea textarea {
        line-height: 48rpx;
        font-size: 28rpx;
        color: #333;
        max-height: 160rpx;
    }

    .btns {
        width: 100%;
        height: 80rpx;
        margin-top: 48rpx;
        display: flex;
        justify-content: space-between;
    }

    .btns .btnl {
        width: 48%;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        border-radius: 8rpx;
        text-align: center;
        background: #666666;
        color: #fff;
    }

    .btns .btnr {
        width: 48%;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        border-radius: 8rpx;
        text-align: center;
        background: #f9285c;
        color: #fff;
    }

    .imglist {
        width: 100%;
        height: 128rpx;
        margin-top: 32rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: scroll;
        overflow: hidden;
    }

    .imglist .imglis {
        width: 128rpx;
        height: 128rpx;
        border-radius: 16rpx;
        margin-left: 24rpx;
        flex-shrink: 0;
    }

    .imglist .imglis image {
        width: 128rpx;
        height: 128rpx;
        border-radius: 16rpx;
    }

    .imglist .addimg {
        width: 128rpx;
        height: 128rpx;
        border-radius: 16rpx;
        background: url(../../static/addimgsss.png) no-repeat;
        background-size: 100% 100%;
        flex-shrink: 0;
    }

    .setpdata {
        width: 100%;
    }

    .setpdata input {
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

    .setpdata .uni-input-placeholder {
        font-size: 28rpx;
        color: #999;
    }

    .setpdata input:nth-child(1) {
        margin-top: 0;
    }

    .setp .hlis:nth-child(2) {
        margin-top: 24rpx;
    }

    .setp .hlis {
        width: 100%;
        padding-left: 64rpx;
        box-sizing: border-box;
        position: relative;
        padding-bottom: 48rpx;
    }

    .setp .hlis .hr {
        width: 4rpx;
        height: 100%;
        background: #f5f5f5;
        position: absolute;
        top: 4rpx;
        left: 18rpx;
    }

    .setp .hlis .number {
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

    .setp .hlis .text {
        width: 100%;
    }

    .setp .hlis .text .tt {
        line-height: 48rpx;
        color: #333;
        font-size: 28rpx;
    }

    .setp .hlis .text image {
        margin-top: 16rpx;
        width: 256rpx;
    }

    .setp .hlis .text .url {
        width: 100%;
        margin-top: 16rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .setp .hlis .text .lis {
        height: 48rpx;
        line-height: 48rpx;
        border: 2rpx solid;
        margin-right: 32rpx;
        font-size: 24rpx;
        padding: 0 24rpx;
        border-radius: 8rpx;
    }

    .setp .hlis .text .lis:nth-child(1) {
        border-color: #f9285c;
        background: #f9285c;
        color: #fff;
    }

    .setp .hlis .input {
        width: 100%;
        height: 80rpx;
        background: #f5f5f5;
        border-radius: 8rpx;
        margin-top: 16rpx;
        position: relative;
    }

    .setp .hlis .input input {
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        line-height: 80rpx;
        padding: 0 24rpx;
        box-sizing: border-box;
        background: transparent;
    }

    .uni-input-placeholder {
        color: #999;
    }

    .setp .hlis .input .copy {
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

    .operate {
        width: 100%;
        margin-top: 24rpx;
        display: flex;
        justify-content: flex-end;
    }

    .operate .oplis {
        height: 40rpx;
        line-height: 40rpx;
        border: 2rpx #f9285c solid;
        border-radius: 8rpx;
        padding: 0 24rpx;
        font-size: 24rpx;
        margin-left: 24rpx;
        color: #f9285c;
    }

    .operate .oplis:last-child {
        border-color: #EA282F;
        color: #EA282F;
    }

    .paylists {
        width: 100%;
        padding: 32rpx 32rpx 80rpx;
        box-sizing: border-box;
        background: #fff;
        border-radius: 32rpx 32rpx 0 0;
        position: fixed;
        bottom: 0;
        right: 0;
    }

    .paylists .titlecc {
        width: 100%;
        text-align: center;
        height: 48rpx;
        line-height: 48rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        position: relative;
    }

    .paylists .titlecc .colse {
        height: 48rpx;
        line-height: 48rpx;
        font-size: 28rpx;
        color: #999;
        position: absolute;
        top: 0;
        right: 0;
        font-weight: normal;
    }

    .paylists .lis {
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

    .paylists .lis .icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 80rpx;
        background: red;
        margin-right: 24rpx;
        flex-shrink: 0;
    }

    .paylists .lis .icon image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 80rpx;
    }

    .paylists .lis .text {
        width: 100%;
        height: 80rpx;
    }

    .paylists .lis .text .ts {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
    }

    .paylists .lis .text .tt {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #999;
    }

    .paylists .lis .sva {
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

    .paylists .lis .sva text {
        width: 16rpx;
        height: 16rpx;
        background: #ccc;
        border-radius: 16rpx;
    }

    .paylists .lis .sva.active {
        border-color: #f9285c;
    }

    .paylists .lis .sva.active text {
        background: #f9285c;
    }

    .paylists .paybtn {
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