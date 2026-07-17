<template>
	<view class="container">
		<view class="header">
			<text class="header-title">收货地址</text>
			<view class="back-btn" @click="goBack">‹</view>
		</view>
		
		<scroll-view class="scroll-view" scroll-y>
			<view class="address-empty" v-if="addresses.length === 0">
				<text class="empty-icon">📍</text>
				<text class="empty-text">还没有收货地址</text>
				<view class="empty-btn" @click="showAddForm">添加收货地址</view>
			</view>
			
			<view class="address-list" v-else>
				<view class="address-item" v-for="address in addresses" :key="address.id">
					<view class="address-content" @click="selectAddress(address)">
						<view class="address-header">
							<text class="address-name">{{ address.name }}</text>
							<text class="address-phone">{{ address.phone }}</text>
							<view class="address-default" v-if="address.isDefault">默认</view>
						</view>
						<text class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</text>
					</view>
					<view class="address-actions">
						<view class="action-btn" @click="editAddress(address)">编辑</view>
						<view class="action-btn delete" @click="deleteAddress(address.id)">删除</view>
					</view>
				</view>
			</view>
			
			<view class="add-btn" @click="showAddForm">
				<text>+ 添加收货地址</text>
			</view>
		</scroll-view>
		
		<view class="form-modal" v-if="showForm" @click="closeForm">
			<view class="form-content" @click.stop>
				<view class="form-header">
					<text class="form-title">{{ editingAddress ? '编辑收货地址' : '添加收货地址' }}</text>
					<view class="form-close" @click="closeForm">×</view>
				</view>
				<view class="form-body">
					<view class="form-item">
						<text class="form-label">收货人</text>
						<input class="form-input" placeholder="请输入收货人姓名" v-model="form.name" />
					</view>
					<view class="form-item">
						<text class="form-label">手机号</text>
						<input class="form-input" placeholder="请输入11位手机号码" v-model="form.phone" type="number" maxlength="11" />
					</view>
					<view class="form-item">
						<text class="form-label">省市区</text>
						<view class="form-picker" @click="openAreaPicker">
							<text class="picker-text" v-if="form.province">{{ form.province }} {{ form.city }} {{ form.district }}</text>
							<text class="picker-placeholder" v-else>请选择省市区</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
					<view class="form-item">
						<text class="form-label">详细地址</text>
						<textarea class="form-textarea" placeholder="请输入详细地址" v-model="form.detail"></textarea>
					</view>
					<view class="form-item">
						<view class="checkbox-item" @click="form.isDefault = !form.isDefault">
							<view class="checkbox" :class="{ checked: form.isDefault }">
								<text v-if="form.isDefault">✓</text>
							</view>
							<text>设为默认地址</text>
						</view>
					</view>
				</view>
				<view class="form-footer">
					<view class="btn-cancel" @click="closeForm">取消</view>
					<view class="btn-save" @click="saveAddress">保存</view>
				</view>
			</view>
		</view>
		
		<view class="area-picker-modal" v-if="showAreaPicker" @click="hideAreaPicker">
			<view class="area-picker-content" @click.stop>
				<view class="picker-header">
					<view class="picker-cancel" @click="hideAreaPicker">取消</view>
					<text class="picker-title">选择省市区</text>
					<view class="picker-confirm" @click="confirmArea">确定</view>
				</view>
				<view class="picker-body">
					<scroll-view class="picker-column" scroll-y :scroll-top="provinceScrollTop">
						<view 
							class="picker-item" 
							:class="{ active: provinceIndex === index }"
							v-for="(item, index) in provinces" 
							:key="index"
							@click="selectProvince(index)"
						>
							{{ item.name }}
						</view>
					</scroll-view>
					<scroll-view class="picker-column" scroll-y :scroll-top="cityScrollTop">
						<view 
							class="picker-item" 
							:class="{ active: cityIndex === index }"
							v-for="(item, index) in cities" 
							:key="index"
							@click="selectCity(index)"
						>
							{{ item.name }}
						</view>
					</scroll-view>
					<scroll-view class="picker-column" scroll-y :scroll-top="districtScrollTop">
						<view 
							class="picker-item" 
							:class="{ active: districtIndex === index }"
							v-for="(item, index) in districts" 
							:key="index"
							@click="selectDistrict(index)"
						>
							{{ item }}
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import store from '@/utils/store.js'
import areaData from '@/utils/area.js'

export default {
	data() {
		return {
			addresses: [],
			showForm: false,
			showAreaPicker: false,
			editingAddress: null,
			form: {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				detail: '',
				isDefault: false
			},
			provinces: areaData,
			cities: [],
			districts: [],
			provinceIndex: 0,
			cityIndex: 0,
			districtIndex: 0,
			provinceScrollTop: 0,
			cityScrollTop: 0,
			districtScrollTop: 0
		}
	},
	onShow() {
		this.addresses = store.getters.addresses
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		showAddForm() {
			this.editingAddress = null
			this.form = {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				detail: '',
				isDefault: this.addresses.length === 0
			}
			this.showForm = true
		},
		editAddress(address) {
			this.editingAddress = address
			this.form = {
				name: address.name,
				phone: address.phone,
				province: address.province,
				city: address.city || '',
				district: address.district || '',
				detail: address.detail,
				isDefault: address.isDefault || false
			}
			this.showForm = true
		},
		closeForm() {
			this.showForm = false
			this.editingAddress = null
		},
		openAreaPicker() {
			this.showAreaPicker = true
			if (this.form.province) {
				this.provinceIndex = this.provinces.findIndex(p => p.name === this.form.province)
				if (this.provinceIndex < 0) this.provinceIndex = 0
			} else {
				this.provinceIndex = 0
			}
			this.cities = this.provinces[this.provinceIndex].children
			if (this.form.city) {
				this.cityIndex = this.cities.findIndex(c => c.name === this.form.city)
				if (this.cityIndex < 0) this.cityIndex = 0
			} else {
				this.cityIndex = 0
			}
			this.districts = this.cities[this.cityIndex].children
			if (this.form.district) {
				this.districtIndex = this.districts.indexOf(this.form.district)
				if (this.districtIndex < 0) this.districtIndex = 0
			} else {
				this.districtIndex = 0
			}
			setTimeout(() => {
				this.provinceScrollTop = this.provinceIndex * 80
				this.cityScrollTop = this.cityIndex * 80
				this.districtScrollTop = this.districtIndex * 80
			}, 100)
		},
		hideAreaPicker() {
			this.showAreaPicker = false
		},
		selectProvince(index) {
			this.provinceIndex = index
			this.cities = this.provinces[index].children
			this.cityIndex = 0
			this.districts = this.cities[0].children
			this.districtIndex = 0
			setTimeout(() => {
				this.cityScrollTop = 0
				this.districtScrollTop = 0
			}, 50)
		},
		selectCity(index) {
			this.cityIndex = index
			this.districts = this.cities[index].children
			this.districtIndex = 0
			setTimeout(() => {
				this.districtScrollTop = 0
			}, 50)
		},
		selectDistrict(index) {
			this.districtIndex = index
		},
		confirmArea() {
			this.form.province = this.provinces[this.provinceIndex].name
			this.form.city = this.cities[this.cityIndex].name
			this.form.district = this.districts[this.districtIndex]
			this.hideAreaPicker()
		},
		saveAddress() {
			if (!this.form.name) {
				uni.showToast({ title: '请输入收货人', icon: 'none' })
				return
			}
			if (!this.form.phone || this.form.phone.length !== 11) {
				uni.showToast({ title: '请输入11位手机号', icon: 'none' })
				return
			}
			if (!this.form.province) {
				uni.showToast({ title: '请选择省市区', icon: 'none' })
				return
			}
			if (!this.form.detail) {
				uni.showToast({ title: '请输入详细地址', icon: 'none' })
				return
			}
			
			const addressData = {
				name: this.form.name,
				phone: this.form.phone,
				province: this.form.province,
				city: this.form.city,
				district: this.form.district,
				detail: this.form.detail,
				isDefault: this.form.isDefault
			}
			
			if (this.editingAddress) {
				store.mutations.UPDATE_ADDRESS(store.state, { id: this.editingAddress.id, address: addressData })
			} else {
				store.mutations.ADD_ADDRESS(store.state, addressData)
				if (addressData.isDefault) {
					store.mutations.SET_DEFAULT_ADDRESS(store.state, Date.now())
				}
			}
			
			this.addresses = store.getters.addresses
			this.closeForm()
			uni.showToast({ title: '保存成功', icon: 'success' })
		},
		deleteAddress(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个收货地址吗？',
				success: (res) => {
					if (res.confirm) {
						store.mutations.DELETE_ADDRESS(store.state, id)
						this.addresses = store.getters.addresses
						uni.showToast({ title: '删除成功', icon: 'success' })
					}
				}
			})
		},
		selectAddress(address) {
			uni.navigateBack()
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

.scroll-view { flex: 1; padding: 20rpx; padding-bottom: 120rpx; }

.address-empty {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.empty-icon { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 48rpx; }
.empty-btn {
	background-color: #ff6b6b; color: #fff; padding: 24rpx 64rpx;
	border-radius: 48rpx; font-size: 28rpx;
}

.address-list { display: flex; flex-direction: column; }
.address-item {
	background-color: #fff; border-radius: 16rpx;
	margin-bottom: 20rpx; overflow: hidden;
}
.address-content { padding: 24rpx; }
.address-header { display: flex; align-items: center; margin-bottom: 16rpx; }
.address-name { font-size: 32rpx; font-weight: bold; color: #333; margin-right: 20rpx; }
.address-phone { font-size: 28rpx; color: #666; margin-right: auto; }
.address-default {
	background-color: #ff6b6b; color: #fff; font-size: 22rpx;
	padding: 4rpx 16rpx; border-radius: 12rpx;
}
.address-detail { font-size: 28rpx; color: #666; line-height: 1.6; }
.address-actions {
	display: flex; border-top: 1rpx solid #f0f0f0;
}
.action-btn {
	flex: 1; text-align: center; padding: 24rpx; font-size: 28rpx; color: #666;
	border-right: 1rpx solid #f0f0f0;
}
.action-btn:last-child { border-right: none; }
.action-btn.delete { color: #ff6b6b; }

.add-btn {
	position: fixed; bottom: calc(20rpx + env(safe-area-inset-bottom));
	left: 20rpx; right: 20rpx;
	background-color: #ff6b6b; color: #fff; text-align: center;
	padding: 28rpx; border-radius: 48rpx; font-size: 30rpx;
}

.form-modal {
	position: fixed; top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0, 0, 0, 0.5); display: flex;
	align-items: flex-end; z-index: 1000;
}
.form-content {
	width: 100%; background-color: #fff;
	border-radius: 32rpx 32rpx 0 0; padding-bottom: env(safe-area-inset-bottom);
	max-height: 80vh; overflow-y: auto;
}
.form-header {
	display: flex; justify-content: space-between; align-items: center;
	padding: 32rpx; border-bottom: 1rpx solid #f0f0f0;
}
.form-title { font-size: 34rpx; font-weight: bold; color: #333; }
.form-close { font-size: 48rpx; color: #999; }
.form-body { padding: 32rpx; }
.form-item { margin-bottom: 28rpx; }
.form-label {
	display: block; font-size: 28rpx; color: #666;
	margin-bottom: 12rpx;
}
.form-input {
	width: 100%; height: 88rpx; background-color: #f5f5f5;
	border-radius: 12rpx; padding: 0 24rpx; font-size: 28rpx;
	box-sizing: border-box;
}
.form-picker {
	display: flex; align-items: center;
	width: 100%; height: 88rpx; background-color: #f5f5f5;
	border-radius: 12rpx; padding: 0 24rpx; box-sizing: border-box;
}
.picker-text { flex: 1; font-size: 28rpx; color: #333; }
.picker-placeholder { flex: 1; font-size: 28rpx; color: #999; }
.picker-arrow { font-size: 36rpx; color: #ccc; }
.form-textarea {
	width: 100%; height: 160rpx; background-color: #f5f5f5;
	border-radius: 12rpx; padding: 20rpx 24rpx; font-size: 28rpx;
	box-sizing: border-box;
}
.checkbox-item { display: flex; align-items: center; }
.checkbox {
	width: 44rpx; height: 44rpx; border: 2rpx solid #ddd; border-radius: 50%;
	display: flex; align-items: center; justify-content: center;
	font-size: 24rpx; color: #fff; margin-right: 16rpx;
}
.checkbox.checked { background-color: #ff6b6b; border-color: #ff6b6b; }
.checkbox-item text { font-size: 28rpx; color: #333; }
.form-footer {
	display: flex; padding: 24rpx 32rpx; border-top: 1rpx solid #f0f0f0;
}
.btn-cancel, .btn-save { flex: 1; text-align: center; padding: 24rpx; border-radius: 44rpx; }
.btn-cancel { background-color: #f5f5f5; color: #666; margin-right: 20rpx; }
.btn-save { background-color: #ff6b6b; color: #fff; }

.area-picker-modal {
	position: fixed; top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0, 0, 0, 0.5); display: flex;
	align-items: flex-end; z-index: 1001;
}
.area-picker-content {
	width: 100%; background-color: #fff;
	border-radius: 32rpx 32rpx 0 0; padding-bottom: env(safe-area-inset-bottom);
}
.picker-header {
	display: flex; justify-content: space-between; align-items: center;
	padding: 28rpx 32rpx; border-bottom: 1rpx solid #f0f0f0;
}
.picker-cancel, .picker-confirm { font-size: 30rpx; padding: 12rpx 24rpx; }
.picker-cancel { color: #999; }
.picker-confirm { color: #ff6b6b; font-weight: bold; }
.picker-title { font-size: 32rpx; font-weight: bold; color: #333; }
.picker-body {
	display: flex; height: 480rpx;
}
.picker-column {
	flex: 1; background-color: #f5f5f5;
}
.picker-item {
	padding: 28rpx 16rpx; text-align: center;
	font-size: 28rpx; color: #666;
}
.picker-item.active {
	background-color: #fff; color: #ff6b6b; font-weight: bold;
}
</style>
