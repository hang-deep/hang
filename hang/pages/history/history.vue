<template>
	<view class="container">
		<view class="header">
			<view class="back-btn" @click="goBack">‹</view>
			<text class="header-title">浏览记录</text>
			<text class="header-right" @click="clearHistory" v-if="historyList.length > 0">清空</text>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="history-empty" v-if="historyList.length === 0">
				<text class="empty-icon">👁️</text>
				<text class="empty-text">暂无浏览记录</text>
				<view class="empty-btn" @click="goHome">去逛逛</view>
			</view>
			
			<view class="goods-list" v-else>
				<view class="goods-item" v-for="item in historyList" :key="item.id" @click="goDetail(item.id)">
					<image class="goods-image" :src="item.image || item.img" mode="aspectFill" />
					<view class="goods-info">
						<text class="goods-name">{{ item.name }}</text>
						<text class="goods-price">¥{{ parseFloat(item.price).toFixed(2) }}</text>
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
			historyList: []
		}
	},
	onShow() {
		this.historyList = []
		console.log('store.history:', store.getters.history)
		console.log('浏览记录长度:', store.getters.history.length)
		store.getters.history.forEach(item => {
			this.historyList.push({
				id: item.id,
				name: item.name,
				price: item.price,
				image: item.image || item.img
			})
		})
		console.log('historyList:', this.historyList)
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
		clearHistory() {
			uni.showModal({
				title: '清空浏览记录',
				content: '确定要清空所有浏览记录吗？',
				success: (res) => {
					if (res.confirm) {
						store.mutations.CLEAR_HISTORY(store.state)
						this.historyList = []
						uni.showToast({ title: '已清空', icon: 'success' })
					}
				}
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
.header-right { font-size: 28rpx; color: #ff6b6b; }

.scroll-view { flex: 1; padding: 20rpx; }

.history-empty {
	display: flex; flex-direction: column; align-items: center; padding: 120rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.goods-list { display: flex; flex-direction: column; }
.goods-item {
	display: flex; align-items: center; background-color: #fff;
	border-radius: 16rpx; padding: 20rpx; margin-bottom: 16rpx;
}
.goods-image { width: 160rpx; height: 160rpx; border-radius: 12rpx; margin-right: 20rpx; }
.goods-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 160rpx; }
.goods-name { font-size: 28rpx; font-weight: bold; color: #333; }
.goods-price { font-size: 32rpx; font-weight: bold; color: #ff6b6b; }
</style>