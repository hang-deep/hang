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
							<view class="favorite-btn" :class="{ active: isFavorite(goods.id) }" @click.stop="toggleFavorite(goods)">
								<text>{{ isFavorite(goods.id) ? '❤️' : '🤍' }}</text>
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
				{ id: 2, name: '家居用品' },
				{ id: 3, name: '美味食品' },
				{ id: 4, name: '时尚服装' }
			],
			goodsList: []
		}
	},
	onLoad() {
		uni.request({
			url: "http://127.0.0.1:3000/api/getGoodsList",
			method: "GET",
			success: (res) => {
				console.log("后端商品数据：", res.data);
				if (res.data.code === 200) {
					let tempList = res.data.data.map(item => ({
						id: parseInt(item.id),
						name: item.name,
						desc: `库存：${item.stock}件`,
						price: parseFloat(item.price),
						image: item.img,
						category: 0
					}))
					this.goodsList = this.distributeCategories(tempList)
				}
			},
			fail: (err) => {
				uni.showToast({ title: '商品加载失败，请开启后端终端', icon: 'none' })
				console.error('请求报错', err)
			}
		})
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
		classifyByKeyword(name) {
			name = name.toLowerCase()
			if (name.includes('手机') || name.includes('耳机') || name.includes('电脑') || name.includes('键盘') || name.includes('鼠标') || name.includes('蓝牙') || name.includes('智能') || name.includes('电视') || name.includes('平板') || name.includes('相机') || name.includes('音响') || name.includes('充电') || name.includes('笔记本') || name.includes('pro') || name.includes('max') || name.includes('dji') || name.includes('osmo') || name.includes('天选') || name.includes('游戏机') || name.includes('显卡') || name.includes('cpu') || name.includes('内存') || name.includes('硬盘')) {
				return 1
			}
			if (name.includes('桌子') || name.includes('椅子') || name.includes('床') || name.includes('沙发') || name.includes('柜子') || name.includes('台灯') || name.includes('收纳') || name.includes('窗帘') || name.includes('地毯') || name.includes('枕头') || name.includes('鞋架') || name.includes('实木') || name.includes('茶几') || name.includes('置物架') || name.includes('书架') || name.includes('衣柜') || name.includes('床头柜') || name.includes('鞋柜') || name.includes('电视柜') || name.includes('餐桌')) {
				return 2
			}
			if (name.includes('零食') || name.includes('饼干') || name.includes('糖果') || name.includes('饮料') || name.includes('坚果') || name.includes('蜂蜜') || name.includes('水果') || name.includes('面包') || name.includes('牛奶') || name.includes('巧克力') || name.includes('糕点') || name.includes('丸子') || name.includes('鱼丸') || name.includes('肉脯') || name.includes('薯片') || name.includes('辣条') || name.includes('罐头') || name.includes('方便面') || name.includes('火腿肠')) {
				return 3
			}
			if (name.includes('衣服') || name.includes('裤子') || name.includes('裙子') || name.includes('衬衫') || name.includes('T恤') || name.includes('短袖') || name.includes('鞋子') || name.includes('帽子') || name.includes('袜子') || name.includes('外套') || name.includes('毛衣') || name.includes('连衣裙') || name.includes('卫衣') || name.includes('牛仔裤') || name.includes('风衣') || name.includes('羽绒服') || name.includes('鞋') || name.includes('球鞋') || name.includes('跑鞋') || name.includes('运动鞋') || name.includes('休闲鞋') || name.includes('纯棉')) {
				return 4
			}
			return 0
		},
		distributeCategories(list) {
			const catGroups = { 1: [], 2: [], 3: [], 4: [] }
			let uncategorized = []
			
			list.forEach(item => {
				const cat = this.classifyByKeyword(item.name)
				if (cat !== 0) {
					catGroups[cat].push(item)
				} else {
					uncategorized.push(item)
				}
			})
			
			let overflow = []
			for (const cat of [1, 2, 3, 4]) {
				if (catGroups[cat].length > 3) {
					overflow = overflow.concat(catGroups[cat].splice(3))
				}
			}
			uncategorized = uncategorized.concat(overflow)
			
			for (const cat of [1, 2, 3, 4]) {
				while (catGroups[cat].length < 3 && uncategorized.length > 0) {
					const randomIndex = Math.floor(Math.random() * uncategorized.length)
					const item = uncategorized.splice(randomIndex, 1)[0]
					catGroups[cat].push(item)
				}
			}
			
			const result = []
			for (const cat of [1, 2, 3, 4]) {
				catGroups[cat].forEach(item => {
					item.category = cat
					result.push(item)
				})
			}
			
			return result
		},
		selectCategory(id) {
			this.currentCategory = id
		},
		addToCart(goods) {
			store.mutations.ADD_TO_CART(store.state, goods)
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		toggleFavorite(goods) {
			store.mutations.TOGGLE_FAVORITE(store.state, goods)
			const isFav = store.getters.isFavorite(goods.id)
			uni.showToast({ title: isFav ? '已收藏' : '已取消收藏', icon: 'none' })
		},
		isFavorite(goodsId) {
			return store.getters.isFavorite(goodsId)
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
	flex-direction: column;
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom) + 40rpx);
}
.goods-item {
	display: flex; background-color: #fff; border-radius: 16rpx;
	margin-bottom: 20rpx; overflow: hidden;
}
.goods-image { width: 200rpx; height: 200rpx; }
.goods-info { padding: 20rpx; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.goods-name { font-size: 32rpx; font-weight: bold; color: #333; display: block; }
.goods-desc { font-size: 26rpx; color: #999; display: block; }
.goods-bottom { display: flex; justify-content: space-between; align-items: center; }
.goods-price { font-size: 36rpx; font-weight: bold; color: #ff6b6b; }
.favorite-btn {
	font-size: 40rpx;
}
</style>