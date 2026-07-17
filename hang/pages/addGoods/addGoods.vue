<template>
  <view style="padding:30rpx;">
    <text style="font-size:36rpx;font-weight:bold;">新增商品</text>

    <view style="margin-top:40rpx;">
      <text style="font-size:28rpx;">商品名称</text>
      <input 
        style="border:1rpx solid #eee;padding:20rpx;margin-top:10rpx;border-radius:10rpx;"
        placeholder="请输入商品名称"
        v-model="goods.name"
      />
    </view>

    <view style="margin-top:30rpx;">
      <text style="font-size:28rpx;">商品价格</text>
      <input 
        style="border:1rpx solid #eee;padding:20rpx;margin-top:10rpx;border-radius:10rpx;"
        placeholder="请输入价格"
        type="number"
        v-model="goods.price"
      />
    </view>

    <view style="margin-top:30rpx;">
      <text style="font-size:28rpx;">库存数量</text>
      <input 
        style="border:1rpx solid #eee;padding:20rpx;margin-top:10rpx;border-radius:10rpx;"
        placeholder="请输入库存"
        type="number"
        v-model="goods.stock"
      />
    </view>

    <view style="margin-top:30rpx;">
      <text style="font-size:28rpx;">图片地址</text>
      <input 
        style="border:1rpx solid #eee;padding:20rpx;margin-top:10rpx;border-radius:10rpx;"
        placeholder="图片路径"
        v-model="goods.img"
      />
    </view>

    <button 
      style="margin-top:60rpx;background:#ff6b6b;color:#fff;"
      @click="submitAdd"
    >
      提交添加商品
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据，和数据库goods字段对应
      goods: {
        name: "",
        price: "",
        stock: "",
        img: "/static/train1.png"
      }
    }
  },
  methods: {
    submitAdd() {
      // 简单判断不能为空
      if (!this.goods.name || !this.goods.price || !this.goods.stock) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      // 请求后端新增商品接口
      uni.request({
        url: "http://127.0.0.1:3000/api/addGoods",
        method: "POST",
        data: this.goods,
        success: res => {
          if (res.data.code === 200) {
            uni.showToast({ title: res.data.msg })
            // 添加成功清空表单
            this.goods = {
              name: "",
              price: "",
              stock: "",
              img: "/static/train1.png"
            }
          } else {
            uni.showToast({ title: res.data.msg, icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '后端未启动，无法提交', icon: 'none' })
        }
      })
    }
  }
}
</script>

<style>
page {
  background: #f5f5f5;
}
input {
  width: 100%;
}
</style>