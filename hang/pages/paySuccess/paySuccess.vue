<template>
	<view class="container">
		<view class="success-icon">✓</view>
		<view class="success-title">支付成功</view>
		<view class="success-desc">您的订单已提交，正在为您备货</view>
		
		<view class="order-card">
			<view class="card-header">
				<text class="card-title">订单信息</text>
				<text class="order-id">{{ orderId }}</text>
			</view>
			<view class="card-body">
				<view class="order-info">
					<text class="info-label">支付金额</text>
					<text class="info-value price">¥{{ amount.toFixed(2) }}</text>
				</view>
				<view class="order-info">
					<text class="info-label">支付方式</text>
					<text class="info-value">{{ paymentMethod }}</text>
				</view>
				<view class="order-info">
					<text class="info-label">下单时间</text>
					<text class="info-value">{{ createTime }}</text>
				</view>
			</view>
		</view>
		
		<view class="action-buttons">
			<view class="action-btn secondary" @click="goOrders">查看订单</view>
			<view class="action-btn primary" @click="goHome">继续购物</view>
		</view>
		
		<view class="tips">
			<text class="tips-title">温馨提示</text>
			<text class="tips-content">请保持手机畅通，快递员将尽快与您联系</text>
		</view>
	</view>
</template>

<script>
import store from '@/utils/store.js'

export default {
	data() {
		return {
			orderId: '',
			amount: 0,
			paymentMethod: '',
			createTime: ''
		}
	},
	onLoad(options) {
		if (options) {
			this.amount = parseFloat(options.amount) || 0
			this.paymentMethod = options.paymentMethod || ''
		}
		
		if (store.getters.orders.length > 0) {
			const latestOrder = store.getters.orders[0]
			this.orderId = '订单号：' + latestOrder.id
			this.createTime = latestOrder.createTime
			if (!this.paymentMethod) {
				this.paymentMethod = latestOrder.paymentMethod || '在线支付'
			}
			if (this.amount === 0 && latestOrder.finalPrice) {
				this.amount = latestOrder.finalPrice
			}
		}
	},
	methods: {
		goOrders() {
			uni.navigateTo({ url: '/pages/orders/orders' })
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		}
	}
}
</script>

<style>
page {
	height: 100%;
	background-color: #f5f5f5;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 40rpx;
	min-height: 100%;
	box-sizing: border-box;
}

.success-icon {
	width: 160rpx;
	height: 160rpx;
	background-color: #00c853;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 80rpx;
	color: #fff;
	margin-bottom: 40rpx;
}

.success-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.success-desc {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 60rpx;
}

.order-card {
	width: 100%;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 32rpx;
	margin-bottom: 40rpx;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.order-id {
	font-size: 24rpx;
	color: #999;
}

.card-body {
	display: flex;
	flex-direction: column;
}

.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
}

.info-label {
	font-size: 28rpx;
	color: #666;
}

.info-value {
	font-size: 28rpx;
	color: #333;
}

.info-value.price {
	font-size: 40rpx;
	font-weight: bold;
	color: #ff6b6b;
}

.action-buttons {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 40rpx;
}

.action-btn {
	padding: 32rpx;
	border-radius: 48rpx;
	font-size: 32rpx;
	text-align: center;
	margin-bottom: 20rpx;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #666;
}

.action-btn.primary {
	background-color: #ff6b6b;
	color: #fff;
	font-weight: bold;
}

.tips {
	background-color: #fffbe6;
	border-radius: 16rpx;
	padding: 24rpx;
	width: 100%;
}

.tips-title {
	display: block;
	font-size: 28rpx;
	font-weight: bold;
	color: #ffaa00;
	margin-bottom: 12rpx;
}

.tips-content {
	font-size: 26rpx;
	color: #999;
	line-height: 1.6;
}
</style>