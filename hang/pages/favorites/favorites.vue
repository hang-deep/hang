<template>
	<view class="container">
		<view class="header">
			<text class="header-title">❤️ 我的收藏</text>
			<view class="back-btn" @click="goBack">‹</view>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="favorites-empty" v-if="favorites.length === 0">
				<text class="empty-icon">💔</text>
				<text class="empty-text">还没有收藏商品</text>
				<view class="empty-btn" @click="goHome">去逛逛</view>
			</view>
			
			<view class="favorites-list" v-else>
				<view class="favorites-item" v-for="goods in favorites" :key="goods.id" @click="goDetail(goods.id)">
					<image class="goods-image" :src="goods.image" mode="aspectFill" />
					<view class="goods-info">
						<text class="goods-name">{{ goods.name }}</text>
						<text class="goods-desc">{{ goods.desc }}</text>
						<view class="goods-bottom">
							<text class="goods-price">¥{{ goods.price }}</text>
							<view class="goods-actions">
								<view class="favorite-btn active" @click.stop="toggleFavorite(goods)">
									<text>❤️</text>
								</view>
								<view class="add-cart" @click.stop="addToCart(goods)">
									<text>+</text>
								</view>
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
			favorites: []
		}
	},
	onShow() {
		this.favorites = store.getters.favorites
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		goDetail(id) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
		},
		toggleFavorite(goods) {
			store.mutations.TOGGLE_FAVORITE(store.state, goods)
			this.favorites = store.getters.favorites
			uni.showToast({ title: '已取消收藏', icon: 'none' })
		},
		addToCart(goods) {
			store.mutations.ADD_TO_CART(store.state, goods)
			uni.showToast({ title: '已加入购物车', icon: 'success' })
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

.header-title { font-size: 36rpx; font-weight: bold; color: #333; }
.back-btn { font-size: 56rpx; color: #666; }

.scroll-view { flex: 1; padding: 20rpx; }

.favorites-empty {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.favorites-list { display: flex; flex-direction: column; }
.favorites-item {
	display: flex; background-color: #fff;
	border-radius: 16rpx; padding: 20rpx; margin-bottom: 20rpx;
}
.goods-image { width: 200rpx; height: 200rpx; border-radius: 12rpx; margin-right: 20rpx; }
.goods-info { flex: 1; display: flex; flex-direction: column; }
.goods-name { font-size: 30rpx; font-weight: bold; color: #333; display: block; margin-bottom: 8rpx; }
.goods-desc { font-size: 26rpx; color: #999; display: block; margin-bottom: 16rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goods-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.goods-price { font-size: 36rpx; font-weight: bold; color: #ff6b6b; }
.goods-actions { display: flex; align-items: center; }
.favorite-btn {
	font-size: 40rpx; margin-right: 16rpx;
}
.add-cart {
	width: 56rpx; height: 56rpx; background-color: #ff6b6b; border-radius: 50%;
	display: flex; align-items: center; justify-content: center; color: #fff; font-size: 36rpx;
}
</style>