<template>
	<view class="container">
		<view class="header">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" placeholder="搜索商品" v-model="searchText" />
			</view>
		</view>

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

		<scroll-view class="goods-scroll" scroll-y>
			<view class="goods-list">
				<view class="goods-item" v-for="goods in filteredGoods" :key="goods.id" @click="goDetail(goods.id)">
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
	</view>
</template>

<script>
import store from '@/utils/store.js'

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
			]
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
		}
	},
	methods: {
		selectCategory(id) {
			this.currentCategory = id
		},
		addToCart(goods) {
			store.mutations.ADD_TO_CART(store.state, goods)
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		goDetail(id) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
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
}

.header {
	padding: 60rpx 20rpx 20rpx;
	background-color: #fff;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	flex-shrink: 0;
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #f0f0f0;
	border-radius: 40rpx;
	padding: 16rpx 24rpx;
}

.search-icon { font-size: 32rpx; margin-right: 16rpx; }
.search-input { flex: 1; font-size: 28rpx; background-color: transparent; }

.category-scroll { 
	background-color: #fff; 
	white-space: nowrap; 
	flex-shrink: 0;
}
.category-list { display: inline-flex; padding: 20rpx 0; }
.category-item {
	padding: 16rpx 32rpx; margin: 0 16rpx; font-size: 28rpx; color: #666;
	background-color: #f5f5f5; border-radius: 32rpx;
}
.category-item.active { background-color: #ff6b6b; color: #fff; }

.goods-scroll { 
	flex: 1; 
	padding: 20rpx;
	box-sizing: border-box;
}
.goods-list { 
	display: flex; 
	flex-wrap: wrap; 
	justify-content: space-between; 
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom) + 40rpx);
}
.goods-item {
	width: calc(50% - 10rpx); background-color: #fff; border-radius: 16rpx;
	margin-bottom: 20rpx; overflow: hidden;
}
.goods-image { width: 100%; height: 280rpx; }
.goods-info { padding: 16rpx; }
.goods-name { font-size: 28rpx; font-weight: bold; color: #333; display: block; margin-bottom: 8rpx; }
.goods-desc { font-size: 24rpx; color: #999; display: block; margin-bottom: 12rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goods-bottom { display: flex; justify-content: space-between; align-items: center; }
.goods-price { font-size: 32rpx; font-weight: bold; color: #ff6b6b; }
.add-cart {
	width: 48rpx; height: 48rpx; background-color: #ff6b6b; border-radius: 50%;
	display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32rpx;
}
</style>
