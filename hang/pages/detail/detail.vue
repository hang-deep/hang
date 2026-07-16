<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<image class="goods-image" :src="goods.image" mode="aspectFill" />
			<view class="goods-info">
				<text class="goods-price">¥{{ goods.price }}</text>
				<text class="goods-name">{{ goods.name }}</text>
				<text class="goods-desc">{{ goods.desc }}</text>
				<view class="goods-stats">
					<view class="stat-item">
						<text class="stat-value">1000+</text>
						<text class="stat-label">已售</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">4.9</text>
						<text class="stat-label">评分</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">200+</text>
						<text class="stat-label">评价</text>
					</view>
				</view>
				<view class="goods-service">
					<view class="service-item">
						<text>📦</text>
						<text>包邮</text>
					</view>
					<view class="service-item">
						<text>🔄</text>
						<text>7天无理由</text>
					</view>
					<view class="service-item">
						<text>🛡️</text>
						<text>正品保障</text>
					</view>
				</view>
			</view>
			<view class="detail-section">
				<view class="section-header">
					<text class="section-title">商品详情</text>
				</view>
				<view class="section-content">
					<view class="detail-item">
						<text class="detail-label">品牌</text>
						<text class="detail-value">官方自营</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">产地</text>
						<text class="detail-value">中国大陆</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">规格</text>
						<text class="detail-value">标准规格</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">材质</text>
						<text class="detail-value">优质材料</text>
					</view>
				</view>
			</view>
			<view class="detail-section">
				<view class="section-header">
					<text class="section-title">用户评价</text>
					<text class="section-more">查看全部</text>
				</view>
				<view class="review-list">
					<view class="review-item">
						<view class="review-header">
							<view class="review-avatar">👤</view>
							<view class="review-info">
								<text class="review-name">用户***</text>
								<text class="review-time">2024-01-15</text>
							</view>
							<text class="review-rating">⭐⭐⭐⭐⭐</text>
						</view>
						<text class="review-content">质量很好，物流很快，非常满意！</text>
					</view>
					<view class="review-item">
						<view class="review-header">
							<view class="review-avatar">👤</view>
							<view class="review-info">
								<text class="review-name">用户***</text>
								<text class="review-time">2024-01-14</text>
							</view>
							<text class="review-rating">⭐⭐⭐⭐⭐</text>
						</view>
						<text class="review-content">商品和描述一致，推荐购买！</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-bar">
			<view class="bar-left">
				<view class="bar-item" @click="goHome">
					<text>🏠</text>
					<text>首页</text>
				</view>
				<view class="bar-item" @click="goCart">
					<text>🛒</text>
					<text>购物车</text>
					<view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
				</view>
			</view>
			<view class="bar-right">
				<view class="btn-add" @click="addToCart">加入购物车</view>
				<view class="btn-buy" @click="buyNow">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
import store from '@/utils/store.js'

export default {
	data() {
		return {
			goods: {},
			cartCount: 0
		}
	},
	onLoad(options) {
		const goodsId = parseInt(options.id)
		const goodsList = [
			{ id: 1, name: '无线蓝牙耳机', desc: '高品质音效，长续航，舒适佩戴', price: 199, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wireless%20bluetooth%20earbuds%20white%20background%20product%20photo&image_size=square', category: 1 },
			{ id: 2, name: '智能手表', desc: '健康监测，运动追踪，防水设计', price: 499, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=smart%20watch%20fitness%20tracker%20white%20background%20product%20photo&image_size=square', category: 1 },
			{ id: 3, name: '纯棉T恤', desc: '舒适透气，时尚百搭，修身版型', price: 89, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cotton%20t-shirt%20white%20background%20product%20photo&image_size=square', category: 2 },
			{ id: 4, name: '运动跑鞋', desc: '轻便舒适，防滑耐磨，减震设计', price: 299, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sports%20running%20shoes%20white%20background%20product%20photo&image_size=square', category: 2 },
			{ id: 5, name: '坚果礼盒', desc: '精选坚果，营养健康，送礼佳品', price: 128, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=mixed%20nuts%20gift%20box%20white%20background%20product%20photo&image_size=square', category: 3 },
			{ id: 6, name: '有机蜂蜜', desc: '纯天然，无添加，农家直供', price: 68, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=organic%20honey%20jar%20white%20background%20product%20photo&image_size=square', category: 3 },
			{ id: 7, name: '北欧台灯', desc: '简约设计，护眼光源，多档调光', price: 159, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=nordic%20desk%20lamp%20minimalist%20white%20background%20product%20photo&image_size=square', category: 4 },
			{ id: 8, name: '收纳盒套装', desc: '多功能收纳，整洁生活，环保材质', price: 45, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=storage%20box%20set%20organizer%20white%20background%20product%20photo&image_size=square', category: 4 },
			{ id: 9, name: '机械键盘', desc: 'RGB背光，青轴手感，全键无冲', price: 399, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=mechanical%20keyboard%20RGB%20lighting%20white%20background%20product%20photo&image_size=square', category: 1 },
			{ id: 10, name: '连衣裙', desc: '优雅气质，修身显瘦，舒适面料', price: 189, image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=elegant%20dress%20white%20background%20product%20photo&image_size=square', category: 2 }
		]
		this.goods = goodsList.find(item => item.id === goodsId) || goodsList[0]
		this.cartCount = store.getters.cartCount
	},
	onShow() {
		this.cartCount = store.getters.cartCount
	},
	methods: {
		addToCart() {
			store.mutations.ADD_TO_CART(store.state, this.goods)
			this.cartCount = store.getters.cartCount
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		buyNow() {
			store.mutations.ADD_TO_CART(store.state, this.goods)
			uni.switchTab({ url: '/pages/orders/orders' })
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		goCart() {
			uni.switchTab({ url: '/pages/cart/cart' })
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

.scroll-view { flex: 1; }

.goods-image { width: 100%; height: 600rpx; }

.goods-info {
	background-color: #fff; padding: 24rpx;
	margin-bottom: 20rpx;
}
.goods-price { font-size: 48rpx; font-weight: bold; color: #ff6b6b; display: block; margin-bottom: 16rpx; }
.goods-name { font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 12rpx; }
.goods-desc { font-size: 28rpx; color: #999; display: block; margin-bottom: 24rpx; }
.goods-stats {
	display: flex; border-bottom: 1rpx solid #f0f0f0;
	padding-bottom: 20rpx; margin-bottom: 20rpx;
}
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 32rpx; font-weight: bold; color: #333; }
.stat-label { font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-service { display: flex; }
.service-item { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 26rpx; color: #666; }
.service-item text:first-child { margin-right: 8rpx; }

.detail-section {
	background-color: #fff; padding: 24rpx;
	margin-bottom: 20rpx;
}
.section-header {
	display: flex; justify-content: space-between;
	align-items: center; margin-bottom: 20rpx;
}
.section-title { font-size: 32rpx; font-weight: bold; color: #333; }
.section-more { font-size: 26rpx; color: #ff6b6b; }
.section-content { background-color: #fafafa; border-radius: 12rpx; padding: 16rpx; }
.detail-item {
	display: flex; justify-content: space-between;
	padding: 16rpx 0; border-bottom: 1rpx solid #eee;
}
.detail-item:last-child { border-bottom: none; }
.detail-label { font-size: 28rpx; color: #666; }
.detail-value { font-size: 28rpx; color: #333; }

.review-list { padding-top: 10rpx; }
.review-item { padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.review-item:last-child { border-bottom: none; }
.review-header { display: flex; align-items: center; margin-bottom: 16rpx; }
.review-avatar {
	width: 72rpx; height: 72rpx; background-color: #f0f0f0;
	border-radius: 50%; display: flex; align-items: center;
	justify-content: center; font-size: 32rpx; margin-right: 16rpx;
}
.review-info { flex: 1; }
.review-name { display: block; font-size: 28rpx; color: #333; margin-bottom: 4rpx; }
.review-time { font-size: 24rpx; color: #999; }
.review-rating { font-size: 24rpx; }
.review-content { font-size: 28rpx; color: #666; line-height: 1.6; }

.bottom-bar {
	display: flex; align-items: center;
	background-color: #fff; padding: 16rpx 24rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
.bar-left { display: flex; align-items: center; }
.bar-item {
	display: flex; flex-direction: column; align-items: center;
	margin-right: 48rpx; position: relative;
}
.bar-item text:first-child { font-size: 40rpx; }
.bar-item text:last-child { font-size: 22rpx; color: #666; margin-top: 4rpx; }
.cart-badge {
	position: absolute; top: -8rpx; right: -20rpx;
	background-color: #ff6b6b; color: #fff; font-size: 20rpx;
	padding: 4rpx 12rpx; border-radius: 20rpx;
}
.bar-right { flex: 1; display: flex; margin-left: 20rpx; }
.btn-add, .btn-buy {
	flex: 1; text-align: center; padding: 24rpx;
	border-radius: 48rpx; font-size: 28rpx;
}
.btn-add { background-color: #f0f0f0; color: #333; margin-right: 16rpx; }
.btn-buy { background-color: #ff6b6b; color: #fff; }
</style>
