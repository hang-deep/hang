<template>
	<view class="container">
		<!-- 头部搜索栏 -->
		<view class="header">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" placeholder="搜索商品" v-model="searchText" />
			</view>
		</view>

		<!-- 商品分类 -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-list">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === item.id }"
					v-for="item in categories" 
					:key="item.id"
					@click="selectCategory(item.id)"
				>
					{{ item.name }}
				</view>
			</view>
		</scroll-view>

		<!-- 商品列表 -->
		<scroll-view class="goods-scroll" scroll-y>
			<view class="goods-list">
				<view class="goods-item" v-for="goods in filteredGoods" :key="goods.id" @click="showGoodsDetail(goods)">
					<image class="goods-image" :src="goods.image" mode="aspectFill" />
					<view class="goods-info">
						<text class="goods-name">{{ goods.name }}</text>
						<text class="goods-desc">{{ goods.desc }}</text>
						<view class="goods-bottom">
							<text class="goods-price">¥{{ goods.price }}</text>
							<view class="add-cart" @click.stop="addToCart(goods)">
								<text>+</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部购物车栏 -->
		<view class="footer">
			<view class="footer-left">
				<view class="cart-icon" @click="showCart">
					<text>🛒</text>
					<view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
				</view>
				<text class="cart-text">购物车</text>
			</view>
			<view class="footer-right">
				<view class="total-price">
					<text>合计：</text>
					<text class="price">¥{{ totalPrice.toFixed(2) }}</text>
				</view>
				<view class="checkout-btn" :class="{ disabled: cartCount === 0 }" @click="checkout">
					结算({{ cartCount }})
				</view>
			</view>
		</view>

		<!-- 购物车弹窗 -->
		<view class="cart-modal" v-if="showCartModal" @click="closeCart">
			<view class="cart-content" @click.stop>
				<view class="cart-header">
					<text>购物车</text>
					<text class="close-btn" @click="closeCart">✕</text>
				</view>
				<scroll-view class="cart-scroll" scroll-y>
					<view class="cart-empty" v-if="cartList.length === 0">
						<text>购物车是空的</text>
					</view>
					<view class="cart-item" v-for="item in cartList" :key="item.id">
						<image class="cart-image" :src="item.image" mode="aspectFill" />
						<view class="cart-info">
							<text class="cart-name">{{ item.name }}</text>
							<text class="cart-price">¥{{ item.price }}</text>
						</view>
						<view class="cart-control">
							<view class="control-btn" @click="decreaseCart(item)">-</view>
							<text class="control-num">{{ item.quantity }}</text>
							<view class="control-btn" @click="increaseCart(item)">+</view>
						</view>
						<view class="cart-delete" @click="deleteCart(item)">✕</view>
					</view>
				</scroll-view>
				<view class="cart-footer">
					<view class="cart-total">
						<text>总价：</text>
						<text class="total">¥{{ totalPrice.toFixed(2) }}</text>
					</view>
					<view class="cart-checkout" @click="checkout">去结算</view>
				</view>
			</view>
		</view>

		<!-- 商品详情弹窗 -->
		<view class="detail-modal" v-if="showDetailModal" @click="closeDetail">
			<view class="detail-content" @click.stop>
				<image class="detail-image" :src="selectedGoods.image" mode="aspectFill" />
				<view class="detail-info">
					<text class="detail-name">{{ selectedGoods.name }}</text>
					<text class="detail-desc">{{ selectedGoods.desc }}</text>
					<text class="detail-price">¥{{ selectedGoods.price }}</text>
					<view class="detail-action">
						<view class="detail-add" @click="addToCart(selectedGoods)">加入购物车</view>
						<view class="detail-buy" @click="buyNow(selectedGoods)">立即购买</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				currentCategory: 0,
				categories: [
					{ id: 0, name: '全部' },
					{ id: 1, name: '电子产品' },
					{ id: 2, name: '服装' },
					{ id: 3, name: '食品' },
					{ id: 4, name: '家居' }
				],
				goodsList: [
					{ id: 1, name: '无线蓝牙耳机', desc: '高品质音效，长续航', price: 199, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wireless%20bluetooth%20earbuds%20white%20background%20product%20photo&image_size=square', category: 1 },
					{ id: 2, name: '智能手表', desc: '健康监测，运动追踪', price: 499, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=smart%20watch%20fitness%20tracker%20white%20background%20product%20photo&image_size=square', category: 1 },
					{ id: 3, name: '纯棉T恤', desc: '舒适透气，时尚百搭', price: 89, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cotton%20t-shirt%20white%20background%20product%20photo&image_size=square', category: 2 },
					{ id: 4, name: '运动跑鞋', desc: '轻便舒适，防滑耐磨', price: 299, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sports%20running%20shoes%20white%20background%20product%20photo&image_size=square', category: 2 },
					{ id: 5, name: '坚果礼盒', desc: '精选坚果，营养健康', price: 128, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=mixed%20nuts%20gift%20box%20white%20background%20product%20photo&image_size=square', category: 3 },
					{ id: 6, name: '有机蜂蜜', desc: '纯天然，无添加', price: 68, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=organic%20honey%20jar%20white%20background%20product%20photo&image_size=square', category: 3 },
					{ id: 7, name: '北欧台灯', desc: '简约设计，护眼光源', price: 159, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=nordic%20desk%20lamp%20minimalist%20white%20background%20product%20photo&image_size=square', category: 4 },
					{ id: 8, name: '收纳盒套装', desc: '多功能收纳，整洁生活', price: 45, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=storage%20box%20set%20organizer%20white%20background%20product%20photo&image_size=square', category: 4 },
					{ id: 9, name: '机械键盘', desc: 'RGB背光，青轴手感', price: 399, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=mechanical%20keyboard%20RGB%20lighting%20white%20background%20product%20photo&image_size=square', category: 1 },
					{ id: 10, name: '连衣裙', desc: '优雅气质，修身显瘦', price: 189, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=elegant%20dress%20white%20background%20product%20photo&image_size=square', category: 2 }
				],
				cartList: [],
				showCartModal: false,
				showDetailModal: false,
				selectedGoods: {}
			}
		},
		computed: {
			filteredGoods() {
				let result = this.goodsList
				if (this.currentCategory !== 0) {
					result = result.filter(item => item.category === this.currentCategory)
				}
				if (this.searchText) {
					result = result.filter(item => 
						item.name.includes(this.searchText) || item.desc.includes(this.searchText)
					)
				}
				return result
			},
			cartCount() {
				return this.cartList.reduce((sum, item) => sum + item.quantity, 0)
			},
			totalPrice() {
				return this.cartList.reduce((sum, item) => sum + item.price * item.quantity, 0)
			}
		},
		methods: {
			selectCategory(id) {
				this.currentCategory = id
			},
			addToCart(goods) {
				const exists = this.cartList.find(item => item.id === goods.id)
				if (exists) {
					exists.quantity++
				} else {
					this.cartList.push({ ...goods, quantity: 1 })
				}
				uni.showToast({ title: '已加入购物车', icon: 'success' })
			},
			increaseCart(item) {
				item.quantity++
			},
			decreaseCart(item) {
				if (item.quantity > 1) {
					item.quantity--
				} else {
					this.deleteCart(item)
				}
			},
			deleteCart(item) {
				const index = this.cartList.findIndex(i => i.id === item.id)
				if (index > -1) {
					this.cartList.splice(index, 1)
				}
			},
			showCart() {
				this.showCartModal = true
			},
			closeCart() {
				this.showCartModal = false
			},
			showGoodsDetail(goods) {
				this.selectedGoods = goods
				this.showDetailModal = true
			},
			closeDetail() {
				this.showDetailModal = false
				this.selectedGoods = {}
			},
			buyNow(goods) {
				this.addToCart(goods)
				this.checkout()
			},
			checkout() {
				if (this.cartCount === 0) {
					uni.showToast({ title: '购物车是空的', icon: 'none' })
					return
				}
				uni.showToast({ title: '正在结算...', icon: 'loading' })
				setTimeout(() => {
					uni.showToast({ title: '下单成功', icon: 'success' })
					this.cartList = []
					this.showCartModal = false
				}, 1500)
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.header {
		padding: 20rpx;
		background-color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 40rpx;
		padding: 16rpx 24rpx;
	}

	.search-icon {
		font-size: 32rpx;
		margin-right: 16rpx;
	}

	.search-input {
		flex: 1;
		font-size: 28rpx;
		background-color: transparent;
	}

	.category-scroll {
		background-color: #fff;
		white-space: nowrap;
	}

	.category-list {
		display: inline-flex;
		padding: 20rpx 0;
	}

	.category-item {
		padding: 16rpx 32rpx;
		margin: 0 16rpx;
		font-size: 28rpx;
		color: #666;
		background-color: #f5f5f5;
		border-radius: 32rpx;
	}

	.category-item.active {
		background-color: #ff6b6b;
		color: #fff;
	}

	.goods-scroll {
		flex: 1;
		padding: 20rpx;
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.goods-item {
		width: calc(50% - 10rpx);
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.goods-image {
		width: 100%;
		height: 280rpx;
	}

	.goods-info {
		padding: 16rpx;
	}

	.goods-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
	}

	.goods-desc {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-price {
		font-size: 32rpx;
		font-weight: bold;
		color: #ff6b6b;
	}

	.add-cart {
		width: 48rpx;
		height: 48rpx;
		background-color: #ff6b6b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 24rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
		padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	}

	.footer-left {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.cart-icon {
		font-size: 48rpx;
		position: relative;
	}

	.cart-badge {
		position: absolute;
		top: -8rpx;
		right: -16rpx;
		background-color: #ff6b6b;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
	}

	.cart-text {
		font-size: 22rpx;
		color: #666;
	}

	.footer-right {
		display: flex;
		align-items: center;
	}

	.total-price {
		font-size: 26rpx;
		color: #333;
		margin-right: 24rpx;
	}

	.total-price .price {
		font-size: 36rpx;
		font-weight: bold;
		color: #ff6b6b;
	}

	.checkout-btn {
		background-color: #ff6b6b;
		color: #fff;
		padding: 20rpx 48rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.checkout-btn.disabled {
		background-color: #ccc;
	}

	.cart-modal, .detail-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-end;
		z-index: 1000;
	}

	.cart-content {
		width: 100%;
		background-color: #fff;
		border-radius: 24rpx 24rpx 0 0;
		max-height: 70vh;
		display: flex;
		flex-direction: column;
	}

	.cart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.close-btn {
		font-size: 36rpx;
		color: #999;
	}

	.cart-scroll {
		flex: 1;
		padding: 16rpx;
	}

	.cart-empty {
		text-align: center;
		padding: 60rpx;
		color: #999;
	}

	.cart-item {
		display: flex;
		align-items: center;
		padding: 16rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.cart-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		margin-right: 16rpx;
	}

	.cart-info {
		flex: 1;
	}

	.cart-name {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.cart-price {
		font-size: 26rpx;
		color: #ff6b6b;
	}

	.cart-control {
		display: flex;
		align-items: center;
		margin-right: 16rpx;
	}

	.control-btn {
		width: 48rpx;
		height: 48rpx;
		background-color: #f0f0f0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.control-num {
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.cart-delete {
		color: #999;
		font-size: 32rpx;
	}

	.cart-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 24rpx;
		border-top: 1rpx solid #f0f0f0;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}

	.cart-total {
		font-size: 28rpx;
	}

	.cart-total .total {
		font-size: 36rpx;
		font-weight: bold;
		color: #ff6b6b;
	}

	.cart-checkout {
		background-color: #ff6b6b;
		color: #fff;
		padding: 20rpx 60rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.detail-content {
		width: 100%;
		background-color: #fff;
		border-radius: 24rpx 24rpx 0 0;
	}

	.detail-image {
		width: 100%;
		height: 500rpx;
	}

	.detail-info {
		padding: 24rpx;
	}

	.detail-name {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 12rpx;
	}

	.detail-desc {
		display: block;
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.detail-price {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #ff6b6b;
		margin-bottom: 32rpx;
	}

	.detail-action {
		display: flex;
		justify-content: space-between;
	}

	.detail-add, .detail-buy {
		flex: 1;
		text-align: center;
		padding: 24rpx;
		border-radius: 48rpx;
		font-size: 32rpx;
	}

	.detail-add {
		background-color: #f0f0f0;
		color: #333;
		margin-right: 20rpx;
	}

	.detail-buy {
		background-color: #ff6b6b;
		color: #fff;
	}
</style>
