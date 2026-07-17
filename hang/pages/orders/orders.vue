<template>
	<view class="container">
		<view class="header">
			<text class="header-title">📋 我的订单</text>
		</view>
		
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === item.key }"
				v-for="item in tabs" 
				:key="item.key"
				@click="currentTab = item.key"
			>
				<text>{{ item.name }}</text>
				<view class="tab-badge" v-if="getTabCount(item.key) > 0">{{ getTabCount(item.key) }}</view>
			</view>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="orders-empty" v-if="filteredOrders.length === 0">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无订单</text>
				<view class="empty-btn" @click="goHome">去购物</view>
			</view>
			
			<view class="orders-list" v-else>
				<view class="order-card" v-for="order in filteredOrders" :key="order.id">
					<view class="order-header">
						<text class="order-id">订单号：{{ order.id }}</text>
						<text class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</text>
					</view>
					<view class="order-address" v-if="order.address">
						<text class="address-icon">📍</text>
						<text class="address-text">{{ order.address.name }} {{ order.address.phone }}</text>
						<text class="address-detail">{{ order.address.province }} {{ order.address.city }} {{ order.address.district }} {{ order.address.detail }}</text>
					</view>
					<view class="order-items">
						<view class="order-item" v-for="item in order.items" :key="item.id">
							<image class="item-image" :src="item.image" mode="aspectFill" />
							<view class="item-info">
								<text class="item-name">{{ item.name }}</text>
								<text class="item-desc">{{ item.desc }}</text>
								<view class="item-bottom">
									<text class="item-price">¥{{ item.price }}</text>
									<text class="item-quantity">x{{ item.quantity }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="order-footer">
						<view class="order-total">
							<text>合计：</text>
							<text class="total-price">¥{{ order.totalPrice.toFixed(2) }}</text>
						</view>
						<view class="order-actions">
							<view 
								class="action-btn primary" 
								v-if="order.status === '待支付'"
								@click="payOrder(order)"
							>
								立即支付
							</view>
							<view 
								class="action-btn" 
								v-if="order.status === '待发货'"
								@click="remindShip(order)"
							>
								提醒发货
							</view>
							<view 
								class="action-btn success" 
								v-if="order.status === '待收货'"
								@click="confirmOrder(order)"
							>
								确认收货
							</view>
							<view 
								class="action-btn" 
								v-if="order.status === '已完成'"
								@click="reviewOrder(order)"
							>
								评价
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import store from '@/utils/store.js'

export default {
	data() {
		return {
			currentTab: 'all',
			tabs: [
				{ key: 'all', name: '全部' },
				{ key: 'pending', name: '待支付' },
				{ key: 'shipping', name: '待发货' },
				{ key: 'receiving', name: '待收货' },
				{ key: 'done', name: '已完成' }
			]
		}
	},
	computed: {
		orders() {
			return store.getters.orders
		},
		filteredOrders() {
			switch(this.currentTab) {
				case 'pending':
					return this.orders.filter(order => order.status === '待支付')
				case 'shipping':
					return this.orders.filter(order => order.status === '待发货')
				case 'receiving':
					return this.orders.filter(order => order.status === '待收货')
				case 'done':
					return this.orders.filter(order => order.status === '已完成')
				default:
					return this.orders
			}
		}
	},
	onShow() {
		this.currentTab = 'all'
	},
	methods: {
		getTabCount(key) {
			switch(key) {
				case 'pending':
					return this.orders.filter(o => o.status === '待支付').length
				case 'shipping':
					return this.orders.filter(o => o.status === '待发货').length
				case 'receiving':
					return this.orders.filter(o => o.status === '待收货').length
				case 'done':
					return this.orders.filter(o => o.status === '已完成').length
				default:
					return this.orders.length
			}
		},
		getStatusClass(status) {
			switch(status) {
				case '待支付':
					return 'pending'
				case '待发货':
					return 'shipping'
				case '待收货':
					return 'receiving'
				case '已完成':
					return 'done'
				default:
					return ''
			}
		},
		payOrder(order) {
			uni.showModal({
				title: '确认支付',
				content: `订单金额：¥${order.totalPrice.toFixed(2)}`,
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '支付中...' })
						setTimeout(() => {
							uni.hideLoading()
							store.mutations.UPDATE_ORDER_STATUS(store.state, { orderId: order.id, status: '待发货' })
							uni.showToast({ title: '支付成功', icon: 'success' })
							
							setTimeout(() => {
								store.mutations.UPDATE_ORDER_STATUS(store.state, { orderId: order.id, status: '待收货' })
							}, 2000)
						}, 1500)
					}
				}
			})
		},
		remindShip(order) {
			uni.showToast({ title: '已提醒卖家发货', icon: 'none' })
			
			setTimeout(() => {
				store.mutations.UPDATE_ORDER_STATUS(store.state, { orderId: order.id, status: '待收货' })
			}, 2000)
		},
		confirmOrder(order) {
			uni.showModal({
				title: '确认收货',
				content: '确认已收到商品？',
				success: (res) => {
					if (res.confirm) {
						store.mutations.UPDATE_ORDER_STATUS(store.state, { orderId: order.id, status: '已完成' })
						uni.showToast({ title: '确认成功', icon: 'success' })
					}
				}
			})
		},
		reviewOrder(order) {
			uni.showToast({ title: '评价功能开发中', icon: 'none' })
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
	height: 100%;
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.header {
	padding: 60rpx 24rpx 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.header-title { font-size: 36rpx; font-weight: bold; color: #333; }

.tabs {
	display: flex;
	background-color: #fff;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #ff6b6b;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: -20rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 4rpx;
	background-color: #ff6b6b;
	border-radius: 2rpx;
}

.tab-badge {
	background-color: #ff6b6b;
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-left: 8rpx;
}

.scroll-view { flex: 1; padding: 20rpx; }

.orders-empty {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.orders-list { display: flex; flex-direction: column; }
.order-card {
	background-color: #fff; border-radius: 16rpx; padding: 20rpx;
	margin-bottom: 20rpx;
}
.order-header {
	display: flex; justify-content: space-between; align-items: center;
	padding-bottom: 16rpx; border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 16rpx;
}
.order-id { font-size: 24rpx; color: #999; }
.order-status { font-size: 26rpx; font-weight: bold; }
.order-status.pending { color: #ff6b6b; }
.order-status.shipping { color: #ffaa00; }
.order-status.receiving { color: #1890ff; }
.order-status.done { color: #00c853; }
.order-address {
	background-color: #f9f9f9; padding: 16rpx; border-radius: 12rpx;
	margin-bottom: 16rpx;
}
.address-icon { font-size: 28rpx; margin-right: 8rpx; }
.address-text { font-size: 28rpx; color: #333; font-weight: bold; }
.address-detail { display: block; font-size: 26rpx; color: #666; margin-top: 8rpx; }
.order-items { display: flex; flex-direction: column; }
.order-item { display: flex; margin-bottom: 16rpx; }
.order-item:last-child { margin-bottom: 0; }
.order-item .item-image { width: 120rpx; height: 120rpx; border-radius: 12rpx; margin-right: 16rpx; }
.order-item .item-info { flex: 1; }
.order-item .item-name { font-size: 28rpx; font-weight: bold; color: #333; display: block; margin-bottom: 8rpx; }
.order-item .item-desc { font-size: 24rpx; color: #999; display: block; margin-bottom: 12rpx; }
.order-item .item-bottom { display: flex; justify-content: space-between; align-items: center; }
.order-item .item-price { font-size: 26rpx; font-weight: bold; color: #ff6b6b; }
.order-item .item-quantity { font-size: 24rpx; color: #999; }
.order-footer {
	display: flex; justify-content: space-between; align-items: center;
	padding-top: 16rpx; border-top: 1rpx solid #f0f0f0;
	margin-top: 16rpx;
}
.order-total { font-size: 28rpx; color: #666; }
.total-price { font-size: 32rpx; font-weight: bold; color: #ff6b6b; }
.order-actions { display: flex; }
.action-btn {
	padding: 16rpx 32rpx; border-radius: 32rpx; font-size: 26rpx;
	border: 1rpx solid #ddd; color: #666; margin-left: 16rpx;
}
.action-btn.primary { background-color: #ff6b6b; color: #fff; border-color: #ff6b6b; }
.action-btn.success { background-color: #00c853; color: #fff; border-color: #00c853; }
</style>
