<template>
	<view class="container">
		<view class="header">
			<view class="back-btn" @click="goBack">‹</view>
			<text class="header-title">确认订单</text>
			<text class="header-right"></text>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="address-section" @click="goAddress">
				<view class="address-icon">📍</view>
				<view class="address-content" v-if="selectedAddress">
					<view class="address-header">
						<text class="address-name">{{ selectedAddress.name }}</text>
						<text class="address-phone">{{ selectedAddress.phone }}</text>
						<text class="address-default" v-if="selectedAddress.isDefault">默认</text>
					</view>
					<text class="address-detail">{{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detail }}</text>
				</view>
				<view class="address-empty" v-else>
					<text>请添加收货地址</text>
				</view>
				<text class="address-arrow">›</text>
			</view>
			
			<view class="goods-section">
				<view class="section-header">
					<text class="section-title">商品清单</text>
					<text class="section-count">共{{ totalCount }}件</text>
				</view>
				<view class="goods-list">
					<view class="goods-item" v-for="item in cartList" :key="item.cartId">
						<image class="item-image" :src="item.img" mode="aspectFill" />
						<view class="item-info">
							<text class="item-name">{{ item.name }}</text>
							<text class="item-desc">库存：{{ item.stock }}件</text>
							<view class="item-bottom">
								<text class="item-price">¥{{ parseFloat(item.price).toFixed(2) }}</text>
								<text class="item-quantity">x{{ item.quantity }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="remark-section">
				<text class="remark-label">订单备注</text>
				<input class="remark-input" placeholder="选填，请输入备注信息" v-model="remark" />
			</view>
			
			<view class="payment-section">
				<view class="section-header">
					<text class="section-title">支付方式</text>
				</view>
				<view class="payment-list">
					<view 
						class="payment-item" 
						:class="{ active: paymentMethod === item.key }"
						v-for="item in paymentMethods" 
						:key="item.key"
						@click="paymentMethod = item.key"
					>
						<view class="payment-icon">{{ item.icon }}</view>
						<text class="payment-name">{{ item.name }}</text>
						<view class="payment-radio" :class="{ checked: paymentMethod === item.key }">
							<text v-if="paymentMethod === item.key">✓</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="coupon-section" @click="showCoupon">
				<view class="coupon-left">
					<text class="coupon-icon">🎫</text>
					<text class="coupon-text">优惠券</text>
				</view>
				<view class="coupon-right">
					<text class="coupon-value" v-if="selectedCoupon">-¥{{ selectedCoupon.amount }}</text>
					<text class="coupon-default" v-else>暂无可用</text>
					<text class="coupon-arrow">›</text>
				</view>
			</view>
			
			<view class="summary-section">
				<view class="summary-item">
					<text class="summary-label">商品金额</text>
					<text class="summary-value">¥{{ totalPrice.toFixed(2) }}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">运费</text>
					<text class="summary-value free">免运费</text>
				</view>
				<view class="summary-item" v-if="selectedCoupon">
					<text class="summary-label">优惠券</text>
					<text class="summary-value discount">-¥{{ selectedCoupon.amount.toFixed(2) }}</text>
				</view>
				<view class="summary-item total">
					<text class="summary-label">实付金额</text>
					<text class="summary-value">¥{{ finalPrice.toFixed(2) }}</text>
				</view>
			</view>
		</scroll-view>
		
		<view class="bottom-bar">
			<view class="total-info">
				<text class="total-label">实付：</text>
				<text class="total-price">¥{{ finalPrice.toFixed(2) }}</text>
			</view>
			<view 
				class="submit-btn" 
				:class="{ disabled: !selectedAddress || cartList.length === 0 }"
				@click="submitOrder"
			>
				提交订单
			</view>
		</view>
		
		<view class="address-modal" v-if="showAddressModal" @click="closeAddressModal">
			<view class="address-modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择收货地址</text>
					<view class="modal-close" @click="closeAddressModal">×</view>
				</view>
				<scroll-view class="modal-scroll" scroll-y>
					<view class="modal-address-list">
						<view 
							class="modal-address-item" 
							v-for="address in addresses" 
							:key="address.id"
							@click="selectAddress(address)"
						>
							<view class="modal-address-radio" :class="{ checked: selectedAddress && selectedAddress.id === address.id }">
								<text v-if="selectedAddress && selectedAddress.id === address.id">✓</text>
							</view>
							<view class="modal-address-info">
								<view class="modal-address-header">
									<text class="modal-address-name">{{ address.name }}</text>
									<text class="modal-address-phone">{{ address.phone }}</text>
								</view>
								<text class="modal-address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="modal-footer">
					<view class="modal-add-btn" @click="goAddAddress">添加新地址</view>
				</view>
			</view>
		</view>
		
		<view class="pay-modal" v-if="showPayModal" @click="closePayModal">
			<view class="pay-modal-content" @click.stop>
				<view class="pay-header">
					<text class="pay-title">确认支付</text>
					<view class="pay-close" @click="closePayModal">×</view>
				</view>
				<view class="pay-body">
					<view class="pay-amount">
						<text class="pay-label">支付金额</text>
						<text class="pay-value">¥{{ finalPrice.toFixed(2) }}</text>
					</view>
					<view class="pay-method">
						<text class="pay-label">支付方式</text>
						<text class="pay-method-name">{{ getPaymentName() }}</text>
					</view>
				</view>
				<view class="pay-footer">
					<view class="pay-cancel" @click="closePayModal">取消</view>
					<view class="pay-confirm" @click="confirmPay">立即支付</view>
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
			cartList: [],
			addresses: [],
			selectedAddress: null,
			showAddressModal: false,
			showPayModal: false,
			remark: '',
			paymentMethod: 'wechat',
			paymentMethods: [
				{ key: 'wechat', name: '微信支付', icon: '💳' },
				{ key: 'alipay', name: '支付宝', icon: '🔷' },
				{ key: 'card', name: '银行卡', icon: '🏦' }
			],
			selectedCoupon: null,
			selectedIds: [],
			userId: 1
		}
	},
	computed: {
		totalPrice() {
			return this.cartList.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity), 0)
		},
		totalCount() {
			return this.cartList.reduce((sum, item) => sum + parseInt(item.quantity), 0)
		},
		finalPrice() {
			let price = this.totalPrice
			if (this.selectedCoupon) {
				price -= this.selectedCoupon.amount
			}
			return Math.max(0, price)
		}
	},
	onLoad(options) {
		if (options && options.selectedIds) {
			this.selectedIds = options.selectedIds.split(',').map(id => parseInt(id))
		}
	},
	onShow() {
		this.addresses = store.getters.addresses
		this.selectedAddress = store.getters.defaultAddress
		this.loadCartList()
	},
	methods: {
		loadCartList() {
			console.log('loadCartList - selectedIds:', this.selectedIds)
			console.log('loadCartList - userId:', this.userId)
			uni.showLoading({ title: '加载中...' })
			uni.request({
				url: 'http://127.0.0.1:3000/api/getCartList',
				method: 'GET',
				data: { userId: this.userId },
				success: (res) => {
					uni.hideLoading()
					console.log('loadCartList - response:', res.data)
					if (res.data.code === 200) {
						let data = res.data.data
						console.log('loadCartList - all cart data:', data)
						if (this.selectedIds.length > 0) {
							data = data.filter(item => this.selectedIds.includes(parseInt(item.goodsId)))
							console.log('loadCartList - filtered data:', data)
						}
						this.cartList = data
						console.log('loadCartList - cartList:', this.cartList)
					} else {
						uni.showToast({ title: '加载失败', icon: 'none' })
					}
				},
				fail: (err) => {
					uni.hideLoading()
					console.log('loadCartList - network error:', err)
					uni.showToast({ title: '网络错误', icon: 'none' })
				}
			})
		},
		goBack() {
			uni.navigateBack()
		},
		goAddress() {
			if (this.addresses.length === 0) {
				uni.navigateTo({ url: '/pages/address/address' })
			} else {
				this.showAddressModal = true
			}
		},
		closeAddressModal() {
			this.showAddressModal = false
		},
		selectAddress(address) {
			this.selectedAddress = address
			this.showAddressModal = false
		},
		goAddAddress() {
			this.showAddressModal = false
			uni.navigateTo({ url: '/pages/address/address' })
		},
		showCoupon() {
			uni.showToast({ title: '优惠券功能开发中', icon: 'none' })
		},
		getPaymentName() {
			const method = this.paymentMethods.find(m => m.key === this.paymentMethod)
			return method ? method.name : ''
		},
		submitOrder() {
			if (!this.selectedAddress) {
				uni.showToast({ title: '请选择收货地址', icon: 'none' })
				return
			}
			
			if (this.cartList.length === 0) {
				uni.showToast({ title: '购物车为空', icon: 'none' })
				return
			}
			
			this.showPayModal = true
		},
		closePayModal() {
			this.showPayModal = false
		},
		confirmPay() {
			console.log('confirmPay - cartList:', this.cartList)
			console.log('confirmPay - selectedAddress:', this.selectedAddress)
			console.log('confirmPay - totalPrice:', this.totalPrice)
			console.log('confirmPay - finalPrice:', this.finalPrice)
			
			if (this.cartList.length === 0) {
				uni.showToast({ title: '购物车为空', icon: 'none' })
				return
			}
			
			if (!this.selectedAddress) {
				uni.showToast({ title: '请选择收货地址', icon: 'none' })
				return
			}
			
			this.showPayModal = false
			uni.showLoading({ title: '支付中...' })
			
			const order = {
				id: Date.now(),
				createTime: new Date().toLocaleString(),
				items: this.cartList.map(item => ({
					id: item.goodsId,
					name: item.name,
					price: parseFloat(item.price),
					quantity: parseInt(item.quantity),
					image: item.img,
					desc: `库存：${item.stock}件`
				})),
				totalPrice: parseFloat(this.totalPrice.toFixed(2)),
				finalPrice: parseFloat(this.finalPrice.toFixed(2)),
				status: '待支付',
				address: this.selectedAddress,
				paymentMethod: this.getPaymentName(),
				remark: this.remark
			}
			
			console.log('confirmPay - order:', order)
			
			store.state.orders.unshift(order)
			console.log('confirmPay - orders after adding:', store.state.orders.length)
			
			const deletePromises = this.cartList.map(item => {
				return new Promise((resolve) => {
					uni.request({
						url: 'http://127.0.0.1:3000/api/deleteFromCart',
						method: 'POST',
						data: {
							userId: this.userId,
							goodsId: item.goodsId
						},
						success: () => resolve(),
						fail: () => resolve()
					})
				})
			})
			
			Promise.all(deletePromises).then(() => {
				uni.hideLoading()
				
				setTimeout(() => {
					const createdOrder = store.state.orders.find(o => o.id === order.id)
					if (createdOrder) {
						createdOrder.status = '待发货'
					}
				}, 2000)
				
				console.log('confirmPay - navigating to paySuccess')
				uni.navigateTo({ 
					url: `/pages/paySuccess/paySuccess?amount=${this.finalPrice}&paymentMethod=${this.getPaymentName()}` 
				})
			}).catch(() => {
				uni.hideLoading()
				console.log('confirmPay - navigating to paySuccess (after error)')
				uni.navigateTo({ 
					url: `/pages/paySuccess/paySuccess?amount=${this.finalPrice}&paymentMethod=${this.getPaymentName()}` 
				})
			})
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
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 60rpx 24rpx 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.back-btn { font-size: 56rpx; color: #666; }
.header-title { font-size: 36rpx; font-weight: bold; color: #333; }
.header-right { font-size: 28rpx; color: #666; }

.scroll-view { flex: 1; padding: 20rpx; padding-bottom: 140rpx; }

.address-section {
	display: flex; align-items: center;
	background-color: #fff; border-radius: 16rpx;
	padding: 24rpx; margin-bottom: 20rpx;
}

.address-icon { font-size: 48rpx; margin-right: 20rpx; }

.address-content { flex: 1; }
.address-header { display: flex; align-items: center; margin-bottom: 12rpx; }
.address-name { font-size: 32rpx; font-weight: bold; color: #333; margin-right: 20rpx; }
.address-phone { font-size: 28rpx; color: #666; margin-right: auto; }
.address-default {
	background-color: #ff6b6b; color: #fff; font-size: 22rpx;
	padding: 4rpx 16rpx; border-radius: 12rpx;
}
.address-detail { font-size: 28rpx; color: #666; line-height: 1.6; }

.address-empty { flex: 1; font-size: 30rpx; color: #999; }
.address-arrow { font-size: 36rpx; color: #ccc; }

.goods-section {
	background-color: #fff; border-radius: 16rpx;
	margin-bottom: 20rpx; overflow: hidden;
}

.section-header { 
	display: flex; justify-content: space-between; align-items: center;
	padding: 20rpx 24rpx; border-bottom: 1rpx solid #f0f0f0; 
}
.section-title { font-size: 30rpx; font-weight: bold; color: #333; }
.section-count { font-size: 26rpx; color: #999; }

.goods-list { padding: 16rpx 24rpx; }
.goods-item {
	display: flex; padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}
.goods-item:last-child { border-bottom: none; }
.item-image { width: 160rpx; height: 160rpx; border-radius: 12rpx; margin-right: 20rpx; }
.item-info { flex: 1; display: flex; flex-direction: column; }
.item-name { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 8rpx; }
.item-desc { font-size: 24rpx; color: #999; flex: 1; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.item-price { font-size: 32rpx; font-weight: bold; color: #ff6b6b; }
.item-quantity { font-size: 26rpx; color: #999; }

.remark-section {
	display: flex; align-items: center;
	background-color: #fff; border-radius: 16rpx;
	padding: 24rpx; margin-bottom: 20rpx;
}
.remark-label { font-size: 30rpx; color: #333; margin-right: 20rpx; }
.remark-input { flex: 1; font-size: 28rpx; color: #666; }

.payment-section {
	background-color: #fff; border-radius: 16rpx;
	margin-bottom: 20rpx; overflow: hidden;
}

.payment-list { padding: 0 24rpx; }
.payment-item {
	display: flex; align-items: center;
	padding: 28rpx 0; border-bottom: 1rpx solid #f5f5f5;
}
.payment-item:last-child { border-bottom: none; }
.payment-item.active { background-color: #f9f9f9; }
.payment-icon { font-size: 40rpx; margin-right: 20rpx; }
.payment-name { flex: 1; font-size: 30rpx; color: #333; }
.payment-radio {
	width: 44rpx; height: 44rpx; border: 2rpx solid #ddd;
	border-radius: 50%; display: flex; align-items: center;
	justify-content: center; font-size: 24rpx; color: #fff;
}
.payment-radio.checked { background-color: #ff6b6b; border-color: #ff6b6b; }

.coupon-section {
	display: flex; justify-content: space-between; align-items: center;
	background-color: #fff; border-radius: 16rpx;
	padding: 28rpx 24rpx; margin-bottom: 20rpx;
}
.coupon-left { display: flex; align-items: center; }
.coupon-icon { font-size: 36rpx; margin-right: 16rpx; }
.coupon-text { font-size: 30rpx; color: #333; }
.coupon-right { display: flex; align-items: center; }
.coupon-value { font-size: 28rpx; color: #ff6b6b; margin-right: 12rpx; }
.coupon-default { font-size: 28rpx; color: #999; margin-right: 12rpx; }
.coupon-arrow { font-size: 36rpx; color: #ccc; }

.summary-section {
	background-color: #fff; border-radius: 16rpx;
	padding: 20rpx 24rpx;
}

.summary-item {
	display: flex; justify-content: space-between;
	padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5;
}
.summary-item:last-child { border-bottom: none; }
.summary-item.total { padding-top: 20rpx; }
.summary-label { font-size: 28rpx; color: #666; }
.summary-value { font-size: 28rpx; color: #333; }
.summary-value.free { color: #00c853; }
.summary-value.discount { color: #ff6b6b; }
.summary-item.total .summary-value { font-size: 36rpx; font-weight: bold; color: #ff6b6b; }

.bottom-bar {
	position: fixed; bottom: 0; left: 0; right: 0;
	display: flex; justify-content: space-between; align-items: center;
	padding: 20rpx 24rpx; background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.total-info { display: flex; align-items: baseline; }
.total-label { font-size: 28rpx; color: #666; }
.total-price { font-size: 40rpx; font-weight: bold; color: #ff6b6b; }

.submit-btn {
	background-color: #ff6b6b; color: #fff;
	padding: 24rpx 64rpx; border-radius: 48rpx;
	font-size: 32rpx; font-weight: bold;
}
.submit-btn.disabled { background-color: #ccc; }

.address-modal {
	position: fixed; top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0, 0, 0, 0.5); display: flex;
	align-items: flex-end; z-index: 1000;
}
.address-modal-content {
	width: 100%; background-color: #fff;
	border-radius: 32rpx 32rpx 0 0; padding-bottom: env(safe-area-inset-bottom);
	max-height: 70vh; display: flex; flex-direction: column;
}
.modal-header {
	display: flex; justify-content: space-between; align-items: center;
	padding: 32rpx; border-bottom: 1rpx solid #f0f0f0;
}
.modal-title { font-size: 34rpx; font-weight: bold; color: #333; }
.modal-close { font-size: 48rpx; color: #999; }
.modal-scroll { flex: 1; padding: 20rpx; }
.modal-address-list { display: flex; flex-direction: column; }
.modal-address-item {
	display: flex; align-items: flex-start;
	padding: 20rpx; background-color: #f9f9f9;
	border-radius: 16rpx; margin-bottom: 16rpx;
}
.modal-address-radio {
	width: 44rpx; height: 44rpx; border: 2rpx solid #ddd;
	border-radius: 50%; display: flex; align-items: center;
	justify-content: center; font-size: 24rpx; color: #fff;
	margin-right: 20rpx; flex-shrink: 0; margin-top: 4rpx;
}
.modal-address-radio.checked { background-color: #ff6b6b; border-color: #ff6b6b; }
.modal-address-info { flex: 1; }
.modal-address-header { display: flex; align-items: center; margin-bottom: 8rpx; }
.modal-address-name { font-size: 30rpx; font-weight: bold; color: #333; margin-right: 20rpx; }
.modal-address-phone { font-size: 26rpx; color: #666; }
.modal-address-detail { font-size: 26rpx; color: #666; line-height: 1.6; }
.modal-footer { padding: 20rpx 32rpx; border-top: 1rpx solid #f0f0f0; }
.modal-add-btn {
	background-color: #ff6b6b; color: #fff; text-align: center;
	padding: 24rpx; border-radius: 44rpx; font-size: 30rpx;
}

.pay-modal {
	position: fixed; top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0, 0, 0, 0.5); display: flex;
	align-items: center; justify-content: center; z-index: 1001;
}
.pay-modal-content {
	width: 600rpx; background-color: #fff;
	border-radius: 24rpx; padding-bottom: env(safe-area-inset-bottom);
}
.pay-header {
	display: flex; justify-content: space-between; align-items: center;
	padding: 32rpx; border-bottom: 1rpx solid #f0f0f0;
}
.pay-title { font-size: 34rpx; font-weight: bold; color: #333; }
.pay-close { font-size: 48rpx; color: #999; }
.pay-body { padding: 40rpx 32rpx; }
.pay-amount, .pay-method {
	display: flex; justify-content: space-between; align-items: center;
	margin-bottom: 24rpx;
}
.pay-amount:last-child, .pay-method:last-child { margin-bottom: 0; }
.pay-label { font-size: 30rpx; color: #666; }
.pay-value { font-size: 48rpx; font-weight: bold; color: #ff6b6b; }
.pay-method-name { font-size: 30rpx; color: #333; }
.pay-footer {
	display: flex; border-top: 1rpx solid #f0f0f0;
}
.pay-cancel, .pay-confirm { flex: 1; text-align: center; padding: 28rpx; }
.pay-cancel { color: #666; border-right: 1rpx solid #f0f0f0; }
.pay-confirm { background-color: #ff6b6b; color: #fff; font-weight: bold; }
</style>
