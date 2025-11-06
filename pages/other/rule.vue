<template>
	<view class="content">
		<view class="box">
			<view class="ts">一、关于交易手续费</view>
			<view class="tt">每笔交易将产生1%的手续费，由卖方承担，在订单生成后立即扣除，如若订单交易失败将退回。</view>
			
			<view class="ts">二、关于兑入兑出</view>
			<view class="tt">兑入将扣除手续费，与合作平台转赠规则相对应，兑出无需手续费。</view>
			
			<view class="ts">三、关于交易流程</view>
			<view class="tt">订单创建生成后，要求在10分钟内完成付款，否则将自动取消订单，付款后要求在30分钟内完成确认，否则订单将自动确认完成。</view>
			
			<view class="ts">四、关于交易纠纷</view>
			<view class="tt">如果发生欺骗问题，请联系客服处理，人脉Hub对于欺骗行为严厉打击，请勿抱有侥幸心理。</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	page{
		overflow: hidden;
	}
	.box{
		width: 100%;
		padding: 0rpx 4% 24rpx;
		box-sizing: border-box;
	}
	.box .ts{
		width: 100%;
		margin-top: 32rpx;
		margin-bottom: 16rpx;
		font-weight: bold;
	}
	.box .tt{
		width: 100%;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #999;
	}
</style>