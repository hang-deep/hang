<template>
	<view class="container">
		<view class="user-header">
			<view class="user-info">
				<view class="user-avatar">👤</view>
				<view class="user-detail">
					<text class="user-name">{{ userInfo.name }}</text>
				</view>
			</view>
			<view class="user-actions">
					<view class="switch-user-btn" @click="goUserManage">
						<text>切换用户</text>
					</view>
					<view class="user-arrow">›</view>
				</view>
		</view>
		
		<view class="stats-card">
			<view class="stats-item" @click="goOrders">
				<text class="stats-value">{{ ordersCount }}</text>
				<text class="stats-label">全部订单</text>
			</view>
			<view class="stats-item" @click="goOrders('pending')">
				<text class="stats-value">{{ pendingCount }}</text>
				<text class="stats-label">待支付</text>
			</view>
			<view class="stats-item" @click="goOrders('shipping')">
				<text class="stats-value">{{ shippingCount }}</text>
				<text class="stats-label">待发货</text>
			</view>
			<view class="stats-item" @click="goOrders('done')">
				<text class="stats-value">{{ doneCount }}</text>
				<text class="stats-label">已完成</text>
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-card">
				<view class="menu-item" @click="goOrders">
					<text class="menu-icon">📋</text>
					<text class="menu-text">我的订单</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="showCoupon">
					<text class="menu-icon">🎫</text>
					<text class="menu-text">优惠券</text>
					<view class="menu-badge">3张可用</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="showFavorite">
					<text class="menu-icon">❤️</text>
					<text class="menu-text">我的收藏</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			
			<view class="menu-card">
				<view class="menu-item" @click="showAddress">
					<text class="menu-icon">📍</text>
					<text class="menu-text">收货地址</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="showSetting">
					<text class="menu-icon">⚙️</text>
					<text class="menu-text">设置</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="showAbout">
					<text class="menu-icon">ℹ️</text>
					<text class="menu-text">关于我们</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import store from '@/utils/store.js'

export default {
	data() {
		return {
			userInfo: {}
		}
	},
	computed: {
		orders() {
			return store.getters.orders
		},
		ordersCount() {
			return this.orders.length
		},
		pendingCount() {
			return this.orders.filter(o => o.status === '待支付').length
		},
		shippingCount() {
			return this.orders.filter(o => o.status === '待发货').length
		},
		doneCount() {
			return this.orders.filter(o => o.status === '已完成').length
		}
	},
	onShow() {
		this.userInfo = store.getters.userInfo
	},
	methods: {
		goOrders(type) {
			if (type) {
				uni.switchTab({ url: '/pages/orders/orders' })
			} else {
				uni.switchTab({ url: '/pages/orders/orders' })
			}
		},
		showCoupon() {
			uni.showToast({ title: '优惠券功能开发中', icon: 'none' })
		},
		showFavorite() {
			uni.navigateTo({ url: '/pages/favorites/favorites' })
		},
		showAddress() {
			uni.navigateTo({ url: '/pages/address/address' })
		},
		showSetting() {
			uni.showToast({ title: '设置功能开发中', icon: 'none' })
		},
		showAbout() {
			uni.showModal({
				title: '关于我们',
				content: '购物商城 v1.0.0\n\n一款基于uni-app开发的购物系统',
				showCancel: false
			})
		},
		goUserManage() {
			uni.navigateTo({ url: '/pages/userManage/userManage' })
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
	min-height: 100%;
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.user-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
	padding: 70rpx 32rpx 32rpx;
}

.user-info { display: flex; align-items: center; }
.user-avatar {
	width: 120rpx; height: 120rpx; background-color: rgba(255, 255, 255, 0.3);
	border-radius: 50%; display: flex; align-items: center; justify-content: center;
	font-size: 56rpx; margin-right: 24rpx;
}
.user-detail { display: flex; flex-direction: column; }
.user-name { font-size: 36rpx; font-weight: bold; color: #fff; }
.user-actions { display: flex; flex-direction: column; align-items: center; }
.switch-user-btn {
			background-color: rgba(255, 255, 255, 0.3);
			border: 1rpx solid rgba(255, 255, 255, 0.5);
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			margin-bottom: 8rpx;
		}
		.switch-user-btn text { font-size: 22rpx; color: #fff; }
		.user-arrow { font-size: 48rpx; color: rgba(255, 255, 255, 0.8); }

.stats-card {
	display: flex; background-color: #fff;
	margin: -40rpx 20rpx 20rpx; border-radius: 16rpx;
	padding: 32rpx 0; box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}
.stats-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.stats-value { font-size: 40rpx; font-weight: bold; color: #ff6b6b; }
.stats-label { font-size: 24rpx; color: #999; margin-top: 8rpx; }

.menu-list { padding: 0 20rpx; }
.menu-card { background-color: #fff; border-radius: 16rpx; margin-bottom: 20rpx; overflow: hidden; }
.menu-item {
	display: flex; align-items: center; padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 40rpx; margin-right: 20rpx; }
.menu-text { flex: 1; font-size: 30rpx; color: #333; }
.menu-badge {
	background-color: #ff6b6b; color: #fff; font-size: 22rpx;
	padding: 6rpx 16rpx; border-radius: 20rpx; margin-right: 16rpx;
}
.menu-arrow { font-size: 36rpx; color: #ccc; }
</style>
