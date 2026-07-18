<template>
	<view class="container">
		<view class="header">
			<text class="header-title">用户管理</text>
			<view class="back-btn" @click="goBack">‹</view>
		</view>
		
		<view class="tabs">
			<view class="tab-item" :class="{ active: currentTab === 'login' }" @click="currentTab = 'login'">登录</view>
			<view class="tab-item" :class="{ active: currentTab === 'register' }" @click="currentTab = 'register'">注册</view>
		</view>
		
		<view class="content" v-if="currentTab === 'login'">
			<view class="form-card">
				<view class="form-item">
					<text class="form-label">用户名</text>
					<input class="form-input" placeholder="请输入用户名" v-model="loginForm.username" />
				</view>
				<view class="form-item">
					<text class="form-label">密码</text>
					<input class="form-input" type="password" placeholder="请输入密码" v-model="loginForm.password" />
				</view>
				<view class="btn-login" @click="handleLogin">登录</view>
				<text class="error-text" v-if="loginError">{{ loginError }}</text>
			</view>
		</view>
		
		<view class="content" v-if="currentTab === 'register'">
			<view class="form-card">
				<view class="form-item">
					<text class="form-label">用户名</text>
					<input class="form-input" placeholder="请输入用户名" v-model="registerForm.username" />
				</view>
				<view class="form-item">
					<text class="form-label">密码</text>
					<input class="form-input" type="password" placeholder="请输入密码" v-model="registerForm.password" />
				</view>

				<view class="btn-register" @click="handleRegister">注册</view>
				<text class="error-text" v-if="registerError">{{ registerError }}</text>
			</view>
		</view>
		

	</view>
</template>

<script>
import store from '@/utils/store.js'

export default {
	data() {
			return {
				currentTab: 'login',
				loginForm: {
					username: '',
					password: ''
				},
				registerForm: {
					username: '',
					password: ''
				},
				loginError: '',
				registerError: ''
			}
		},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		handleLogin() {
			if (!this.loginForm.username || !this.loginForm.password) {
				this.loginError = '请输入用户名和密码'
				return
			}
			
			uni.showLoading({ title: '登录中...' })
			uni.request({
				url: 'http://127.0.0.1:3000/api/login',
				method: 'POST',
				data: {
					username: this.loginForm.username,
					password: this.loginForm.password
				},
				success: (res) => {
					uni.hideLoading()
					if (res.data.code === 200) {
						store.mutations.SET_USER_INFO(store.state, {
							id: res.data.data.id,
							name: res.data.data.username,
							phone: res.data.data.phone || '138****8888'
						})
						this.currentUserId = res.data.data.id
						this.loginError = ''
						uni.showToast({ title: '登录成功', icon: 'success' })
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						this.loginError = res.data.message || '用户名或密码错误'
					}
				},
				fail: () => {
					uni.hideLoading()
					this.loginError = '登录失败，请检查后端服务是否开启'
				}
			})
		},
		handleRegister() {
			if (!this.registerForm.username) {
				this.registerError = '请输入用户名'
				return
			}
			if (!this.registerForm.password) {
				this.registerError = '请输入密码'
				return
			}
			
			uni.showLoading({ title: '注册中...' })
			uni.request({
				url: 'http://127.0.0.1:3000/api/addUser',
				method: 'POST',
				data: {
					username: this.registerForm.username,
					password: this.registerForm.password
				},
			success: (res) => {
				uni.hideLoading()
				const data = res.data || {}
				if (data.code === 200) {
					this.registerError = ''
					this.registerForm = { username: '', password: '' }
					uni.showToast({ title: '注册成功', icon: 'success' })
				} else {
					this.registerError = data.message || data.msg || data.error || '注册失败'
				}
			},
			fail: (err) => {
				uni.hideLoading()
				console.error('请求失败:', err)
				this.registerError = '注册失败，请检查后端服务是否开启'
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
	background-color: #fff;
	padding: 60rpx 32rpx 24rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.back-btn {
	font-size: 56rpx;
	color: #666;
}

.tabs {
	display: flex;
	background-color: #fff;
	padding: 16rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 16rpx;
	font-size: 28rpx;
	color: #666;
	border-radius: 32rpx;
	transition: all 0.3s;
}

.tab-item.active {
	background-color: #ff6b6b;
	color: #fff;
}

.content {
	flex: 1;
	padding: 32rpx 24rpx;
}

.form-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
}

.form-item {
	margin-bottom: 32rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.form-input {
	width: 100%;
	height: 88rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.btn-login, .btn-register {
	width: 100%;
	height: 88rpx;
	background-color: #ff6b6b;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 24rpx;
}

.btn-login text, .btn-register text {
	font-size: 32rpx;
	font-weight: bold;
	color: #fff;
}

.error-text {
	display: block;
	text-align: center;
	font-size: 26rpx;
	color: #ff6b6b;
	margin-top: 20rpx;
}


</style>