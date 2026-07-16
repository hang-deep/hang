<template>
	<view class="container">
		<view class="header">
			<text class="header-title">👥 用户列表</text>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="users-empty" v-if="userList.length === 0">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无用户数据</text>
				<view class="empty-btn" @click="loadUsers">重新加载</view>
			</view>
			
			<view class="users-list" v-else>
				<view class="user-card" v-for="item in userList" :key="item.id">
					<view class="user-avatar">👤</view>
					<view class="user-info">
						<text class="user-name">账号：{{ item.username }}</text>
						<text class="user-password">密码：{{ item.password }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userList: []
		}
	},
	onLoad() {
		this.loadUsers()
	},
	methods: {
		loadUsers() {
			uni.request({
				url: 'http://127.0.0.1:3000/api/getUserList',
				success: res => {
					console.log(res.data)
					this.userList = res.data.data
				},
				fail: () => {
					uni.showToast({ title: '请求失败', icon: 'none' })
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

.scroll-view { flex: 1; padding: 20rpx; }

.users-empty {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.users-list { display: flex; flex-direction: column; }
.user-card {
	display: flex; align-items: center; background-color: #fff;
	border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx;
}
.user-avatar {
	width: 80rpx; height: 80rpx; background-color: #f5f5f5;
	border-radius: 50%; display: flex; align-items: center; justify-content: center;
	font-size: 40rpx; margin-right: 24rpx;
}
.user-info { flex: 1; }
.user-name { font-size: 30rpx; font-weight: bold; color: #333; display: block; margin-bottom: 12rpx; }
.user-password { font-size: 26rpx; color: #999; }
</style>
