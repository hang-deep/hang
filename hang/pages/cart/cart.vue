<template>
	<view class="container">
		<view class="header">
			<text class="header-title">🛒 购物车</text>
			<text class="header-edit" @click="toggleEdit">{{ isEditing ? '完成' : '编辑' }}</text>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="cart-empty" v-if="cartList.length === 0">
				<text class="empty-icon">🛒</text>
				<text class="empty-text">购物车是空的</text>
				<view class="empty-btn" @click="goHome">去逛逛</view>
			</view>
			
			<view class="cart-list" v-else>
				<view 
					class="cart-item" 
					v-for="item in cartList" 
					:key="item.cartId || item.id"
					@click="goDetail(item.goodsId)"
				>
					<view class="item-checkbox" v-if="isEditing" @click.stop>
						<view class="checkbox" :class="{ checked: selectedItems.includes(item.goodsId) }" @click="toggleSelect(item.goodsId)">
							<text v-if="selectedItems.includes(item.goodsId)">✓</text>
						</view>
					</view>
					<image class="item-image" :src="item.img || '/static/goods/default.png'" mode="aspectFill" />
					<view class="item-info">
						<text class="item-name">{{ item.name }}</text>
						<text class="item-desc">库存：{{ item.stock }}件</text>
						<view class="item-bottom">
							<text class="item-price">¥{{ item.price }}</text>
							<view class="item-control">
								<view class="control-btn" @click.stop="decreaseCart(item)">-</view>
								<text class="control-num">{{ item.quantity }}</text>
								<view class="control-btn" @click.stop="increaseCart(item)">+</view>
							</view>
						</view>
					</view>
					<view class="item-delete" v-if="isEditing" @click.stop="deleteCart(item)">
						<text>删除</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="bottom-bar" v-if="cartList.length > 0">
			<view class="bar-left" v-if="isEditing">
				<view class="select-all" @click="toggleSelectAll">
					<view class="checkbox" :class="{ checked: isAllSelected }">
						<text v-if="isAllSelected">✓</text>
					</view>
					<text>全选</text>
				</view>
				<view class="delete-selected" @click="deleteSelected">删除选中</view>
			</view>
			<view class="bar-left" v-else>
				<view class="select-all" @click="toggleSelectAll">
					<view class="checkbox" :class="{ checked: isAllSelected }">
						<text v-if="isAllSelected">✓</text>
					</view>
					<text>全选</text>
				</view>
			</view>
			<view class="bar-right">
				<view class="total-info">
					<text class="total-label">合计：</text>
					<text class="total-price">¥{{ selectedTotal.toFixed(2) }}</text>
				</view>
				<view 
					class="checkout-btn" 
					:class="{ disabled: selectedCount === 0 }"
					@click="checkout"
				>
					结算({{ selectedCount }})
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isEditing: false,
			selectedItems: [],
			cartList: [],
			userId: 1
		}
	},
	computed: {
		isAllSelected() {
			return this.cartList.length > 0 && this.selectedItems.length === this.cartList.length
		},
		selectedCount() {
			return this.selectedItems.reduce((sum, goodsId) => {
				const item = this.cartList.find(i => i.goodsId === goodsId)
				return sum + (item ? item.quantity : 0)
			}, 0)
		},
		selectedTotal() {
			return this.selectedItems.reduce((sum, goodsId) => {
				const item = this.cartList.find(i => i.goodsId === goodsId)
				return sum + (item ? parseFloat(item.price) * item.quantity : 0)
			}, 0)
		}
	},
	onShow() {
		this.loadCartList()
	},
	methods: {
		loadCartList() {
			uni.showLoading({ title: '加载中...' })
			uni.request({
				url: 'http://127.0.0.1:3000/api/getCartList',
				method: 'GET',
				data: { userId: this.userId },
				success: (res) => {
					uni.hideLoading()
					if (res.data.code === 200) {
						this.cartList = res.data.data
						this.selectedItems = this.cartList.map(item => item.goodsId)
					} else {
						uni.showToast({ title: '加载失败', icon: 'none' })
					}
				},
				fail: () => {
					uni.hideLoading()
					uni.showToast({ title: '网络错误', icon: 'none' })
				}
			})
		},
		toggleEdit() {
			this.isEditing = !this.isEditing
			if (!this.isEditing) {
				this.selectedItems = this.cartList.map(item => item.goodsId)
			}
		},
		toggleSelect(goodsId) {
			const index = this.selectedItems.indexOf(goodsId)
			if (index > -1) {
				this.selectedItems.splice(index, 1)
			} else {
				this.selectedItems.push(goodsId)
			}
		},
		toggleSelectAll() {
			if (this.isAllSelected) {
				this.selectedItems = []
			} else {
				this.selectedItems = this.cartList.map(item => item.goodsId)
			}
		},
		increaseCart(item) {
			uni.request({
				url: 'http://127.0.0.1:3000/api/updateCart',
				method: 'POST',
				data: {
					userId: this.userId,
					goodsId: item.goodsId,
					quantity: item.quantity + 1
				},
				success: (res) => {
					if (res.data.code === 200) {
						this.loadCartList()
					} else {
						uni.showToast({ title: '更新失败', icon: 'none' })
					}
				},
				fail: () => {
					uni.showToast({ title: '网络错误', icon: 'none' })
				}
			})
		},
		decreaseCart(item) {
			if (item.quantity <= 1) {
				this.deleteCart(item)
				return
			}
			uni.request({
				url: 'http://127.0.0.1:3000/api/updateCart',
				method: 'POST',
				data: {
					userId: this.userId,
					goodsId: item.goodsId,
					quantity: item.quantity - 1
				},
				success: (res) => {
					if (res.data.code === 200) {
						this.loadCartList()
					} else {
						uni.showToast({ title: '更新失败', icon: 'none' })
					}
				},
				fail: () => {
					uni.showToast({ title: '网络错误', icon: 'none' })
				}
			})
		},
		deleteCart(item) {
			uni.request({
				url: 'http://127.0.0.1:3000/api/deleteFromCart',
				method: 'POST',
				data: {
					userId: this.userId,
					goodsId: item.goodsId
				},
				success: (res) => {
					if (res.data.code === 200) {
						this.loadCartList()
					} else {
						uni.showToast({ title: '删除失败', icon: 'none' })
					}
				},
				fail: () => {
					uni.showToast({ title: '网络错误', icon: 'none' })
				}
			})
		},
		deleteSelected() {
			this.selectedItems.forEach(goodsId => {
				uni.request({
					url: 'http://127.0.0.1:3000/api/deleteFromCart',
					method: 'POST',
					data: {
						userId: this.userId,
						goodsId: goodsId
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.loadCartList()
						}
					}
				})
			})
			this.selectedItems = []
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		goDetail(id) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
		},
		checkout() {
			if (this.selectedCount === 0) {
				uni.showToast({ title: '请选择商品', icon: 'none' })
				return
			}
			const selectedIds = this.selectedItems.join(',')
			uni.navigateTo({ url: `/pages/checkout/checkout?selectedIds=${selectedIds}` })
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
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 60rpx 24rpx 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.header-title { font-size: 36rpx; font-weight: bold; color: #333; }
.header-edit { font-size: 28rpx; color: #ff6b6b; }

.scroll-view { flex: 1; padding: 20rpx; }

.cart-empty {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.cart-list { display: flex; flex-direction: column; }
.cart-item {
	display: flex; align-items: center; background-color: #fff;
	border-radius: 16rpx; padding: 20rpx; margin-bottom: 20rpx;
	position: relative;
}
.item-checkbox { margin-right: 20rpx; }
.checkbox {
	width: 44rpx; height: 44rpx; border: 2rpx solid #ddd; border-radius: 50%;
	display: flex; align-items: center; justify-content: center;
	font-size: 24rpx; color: #fff;
}
.checkbox.checked { background-color: #ff6b6b; border-color: #ff6b6b; }
.item-image { width: 160rpx; height: 160rpx; border-radius: 12rpx; margin-right: 20rpx; }
.item-info { flex: 1; }
.item-name { font-size: 28rpx; font-weight: bold; color: #333; display: block; margin-bottom: 8rpx; }
.item-desc { font-size: 24rpx; color: #999; display: block; margin-bottom: 16rpx; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.item-price { font-size: 32rpx; font-weight: bold; color: #ff6b6b; }
.item-control { display: flex; align-items: center; }
.control-btn {
	width: 48rpx; height: 48rpx; background-color: #f0f0f0; border-radius: 50%;
	display: flex; align-items: center; justify-content: center; font-size: 28rpx;
}
.control-num { padding: 0 20rpx; font-size: 28rpx; }
.item-delete {
	position: absolute; right: 20rpx; top: 50%; transform: translateY(-50%);
	color: #ff6b6b; font-size: 26rpx; padding: 16rpx;
}

.bottom-bar {
	display: flex; justify-content: space-between; align-items: center;
	padding: 20rpx 24rpx; background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
.footer-left { display: flex; align-items: center; }
.select-all { display: flex; align-items: center; margin-right: 32rpx; }
.select-all text { font-size: 28rpx; color: #333; margin-left: 8rpx; }
.delete-selected { font-size: 28rpx; color: #ff6b6b; }
.footer-right { display: flex; align-items: center; }
.total-info { margin-right: 24rpx; }
.total-label { font-size: 26rpx; color: #666; }
.total-price { font-size: 36rpx; font-weight: bold; color: #ff6b6b; }
.checkout-btn {
	background-color: #ff6b6b; color: #fff; padding: 20rpx 48rpx;
	border-radius: 40rpx; font-size: 28rpx;
}
.checkout-btn.disabled { background-color: #ccc; }
</style>