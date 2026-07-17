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
						<text class="stat-value">{{ salesCount }}</text>
						<text class="stat-label">已售</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">4.{{ Math.floor(Math.random() * 9) + 1 }}</text>
						<text class="stat-label">评分</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ reviewCount }}</text>
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
					<view class="detail-item" v-for="(item, index) in detailInfo" :key="index">
						<text class="detail-label">{{ item.label }}</text>
						<text class="detail-value">{{ item.value }}</text>
					</view>
				</view>
			</view>
			<view class="detail-section">
				<view class="section-header">
					<text class="section-title">用户评价</text>
					<text class="section-more">查看全部</text>
				</view>
				<view class="review-list">
					<view class="review-item" v-for="(review, index) in reviews" :key="index">
						<view class="review-header">
							<view class="review-avatar">{{ review.avatar }}</view>
							<view class="review-info">
								<text class="review-name">{{ review.name }}</text>
								<text class="review-time">{{ review.time }}</text>
							</view>
							<text class="review-rating">{{ review.rating }}</text>
						</view>
						<text class="review-content">{{ review.content }}</text>
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
				<view class="bar-item" @click="toggleFavorite">
					<text>{{ isFavorite ? '❤️' : '🤍' }}</text>
					<text>收藏</text>
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
			cartCount: 0,
			salesCount: '1000+',
			reviewCount: '200+',
			detailInfo: [],
			reviews: []
		}
	},
	onLoad(options) {
		const goodsId = parseInt(options.id)
		uni.request({
			url: 'http://127.0.0.1:3000/api/getGoodsList',
			method: 'GET',
			success: (res) => {
				if (res.data.code === 200) {
					const goodsList = res.data.data.map(item => ({
						id: item.id,
						name: item.name,
						desc: `库存：${item.stock}件`,
						price: item.price,
						image: item.img,
						category: this.getCategoryId(item.name),
						stock: item.stock
					}))
					this.goods = goodsList.find(item => item.id === goodsId) || goodsList[0]
					this.initDetailInfo()
					this.initReviews()
				}
			},
			fail: () => {
				uni.showToast({ title: '商品加载失败', icon: 'none' })
			}
		})
		this.cartCount = store.getters.cartCount
	},
	onShow() {
		this.cartCount = store.getters.cartCount
	},
	computed: {
		isFavorite() {
			return this.goods.id ? store.getters.isFavorite(this.goods.id) : false
		}
	},
	methods: {
		getCategoryId(name) {
			name = name.toLowerCase()
			if (name.includes('手机') || name.includes('耳机') || name.includes('电脑') || name.includes('键盘') || name.includes('鼠标') || name.includes('蓝牙') || name.includes('智能') || name.includes('电视') || name.includes('平板') || name.includes('相机') || name.includes('音响') || name.includes('充电') || name.includes('笔记本') || name.includes('pro') || name.includes('max') || name.includes('dji') || name.includes('osmo') || name.includes('天选') || name.includes('游戏机') || name.includes('显卡')) {
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
			return 1
		},
		initDetailInfo() {
			const name = this.goods.name || ''
			
			if (name.includes('iphone') || name.includes('iPhone')) {
				this.detailInfo = [
					{ label: '品牌', value: 'Apple/苹果' },
					{ label: '型号', value: 'iPhone 15 Pro Max' },
					{ label: '屏幕', value: '6.7英寸 Super Retina XDR' },
					{ label: '处理器', value: 'A17 Pro芯片' },
					{ label: '内存', value: '256GB' },
					{ label: '摄像头', value: '4800万像素主摄' },
					{ label: '网络', value: '5G全网通' },
					{ label: '电池', value: '约29小时视频播放' },
					{ label: '质保', value: '全国联保1年' }
				]
				this.salesCount = '50000+'
				this.reviewCount = '10000+'
			} else if (name.includes('华硕') || name.includes('天选')) {
				this.detailInfo = [
					{ label: '品牌', value: '华硕/ASUS' },
					{ label: '型号', value: '天选6' },
					{ label: '屏幕', value: '16英寸 240Hz高刷屏' },
					{ label: 'CPU', value: 'Intel Core i7-14700HX' },
					{ label: '显卡', value: 'NVIDIA RTX 4060' },
					{ label: '内存', value: '16GB DDR5-5600' },
					{ label: '硬盘', value: '1TB PCIe 4.0 SSD' },
					{ label: '重量', value: '约2.1kg' },
					{ label: '质保', value: '全国联保2年' }
				]
				this.salesCount = '8000+'
				this.reviewCount = '2000+'
			} else if (name.includes('大疆') || name.includes('dji') || name.includes('osmo')) {
				this.detailInfo = [
					{ label: '品牌', value: '大疆/DJI' },
					{ label: '型号', value: 'Osmo Pocket 4' },
					{ label: '传感器', value: '1英寸CMOS' },
					{ label: '视频', value: '4K/120fps超高清' },
					{ label: '防抖', value: '三轴机械防抖' },
					{ label: '续航', value: '约180分钟' },
					{ label: '重量', value: '116g轻巧便携' },
					{ label: '防水', value: 'IPX8防水' },
					{ label: '质保', value: '全国联保1年' }
				]
				this.salesCount = '3000+'
				this.reviewCount = '800+'
			} else if (name.includes('茶几')) {
				this.detailInfo = [
					{ label: '材质', value: '北美进口白橡木' },
					{ label: '尺寸', value: '直径80cm × 高45cm' },
					{ label: '风格', value: '北欧简约' },
					{ label: '工艺', value: '榫卯结构 环保水性漆' },
					{ label: '承重', value: '150kg' },
					{ label: '颜色', value: '原木色/胡桃色' },
					{ label: '包装', value: '整装发货 开箱即用' },
					{ label: '质保', value: '质保3年' }
				]
				this.salesCount = '800+'
				this.reviewCount = '200+'
			} else if (name.includes('沙发')) {
				this.detailInfo = [
					{ label: '材质', value: '头层牛皮' },
					{ label: '尺寸', value: '三人位220×95×85cm' },
					{ label: '框架', value: '实木框架' },
					{ label: '填充', value: '高密度海绵' },
					{ label: '风格', value: '现代轻奢' },
					{ label: '颜色', value: '深棕色/米白色' },
					{ label: '功能', value: '可拆洗设计' },
					{ label: '安装', value: '送货上门 专业安装' },
					{ label: '质保', value: '质保5年' }
				]
				this.salesCount = '500+'
				this.reviewCount = '150+'
			} else if (name.includes('鞋架') || name.includes('鞋柜')) {
				this.detailInfo = [
					{ label: '材质', value: '新西兰松木' },
					{ label: '尺寸', value: '长80×宽35×高120cm' },
					{ label: '层数', value: '5层大容量' },
					{ label: '承重', value: '每层50kg' },
					{ label: '风格', value: '日式简约' },
					{ label: '工艺', value: '环保清漆' },
					{ label: '配件', value: '赠送安装工具' },
					{ label: '安装', value: '自行安装 约30分钟' },
					{ label: '质保', value: '质保2年' }
				]
				this.salesCount = '1200+'
				this.reviewCount = '300+'
			} else if (name.includes('乳酸菌') || name.includes('面包')) {
				this.detailInfo = [
					{ label: '品牌', value: '盼盼' },
					{ label: '规格', value: '500g/箱（约20枚）' },
					{ label: '口味', value: '乳酸菌夹心' },
					{ label: '保质期', value: '6个月' },
					{ label: '储存条件', value: '阴凉干燥处 避免阳光直射' },
					{ label: '配料', value: '小麦粉、乳酸菌、白砂糖' },
					{ label: '营养', value: '富含蛋白质和膳食纤维' },
					{ label: '食用', value: '开袋即食 早餐首选' },
					{ label: '包装', value: '独立小包装 方便携带' }
				]
				this.salesCount = '20000+'
				this.reviewCount = '5000+'
			} else if (name.includes('鱼丸')) {
				this.detailInfo = [
					{ label: '产地', value: '福建福州' },
					{ label: '规格', value: '500g/袋（约20颗）' },
					{ label: '口味', value: '原味/虾味/蟹味' },
					{ label: '保质期', value: '冷冻-18℃保存12个月' },
					{ label: '储存条件', value: '-18℃以下冷冻储存' },
					{ label: '配料', value: '新鲜鱼肉、淀粉、调味料' },
					{ label: '营养', value: '高蛋白 低脂肪' },
					{ label: '食用', value: '水煮3-5分钟即可' },
					{ label: '用途', value: '火锅、煮汤、烧烤皆宜' }
				]
				this.salesCount = '15000+'
				this.reviewCount = '3000+'
			} else if (name.includes('饼干') || name.includes('苏打')) {
				this.detailInfo = [
					{ label: '品牌', value: '嘉顿' },
					{ label: '规格', value: '400g/盒' },
					{ label: '口味', value: '经典海盐风味' },
					{ label: '保质期', value: '12个月' },
					{ label: '储存条件', value: '阴凉干燥通风处' },
					{ label: '配料', value: '小麦粉、食用盐、植物油' },
					{ label: '特点', value: '低糖低盐 健康零食' },
					{ label: '食用', value: '开袋即食 配茶更佳' },
					{ label: '包装', value: '独立小包 方便分享' }
				]
				this.salesCount = '18000+'
				this.reviewCount = '4000+'
			} else if (name.includes('短袖')) {
				this.detailInfo = [
					{ label: '品牌', value: '马克华菲' },
					{ label: '面料', value: '100%纯棉' },
					{ label: '版型', value: '修身版型' },
					{ label: '尺码', value: 'M/L/XL/XXL' },
					{ label: '颜色', value: '白色/黑色/灰色/藏青' },
					{ label: '工艺', value: '精梳棉面料 柔软舒适' },
					{ label: '设计', value: '简约圆领 百搭经典' },
					{ label: '洗涤', value: '建议冷水机洗 反面洗涤' },
					{ label: '季节', value: '夏季必备' }
				]
				this.salesCount = '12000+'
				this.reviewCount = '3000+'
			} else if (name.includes('牛仔裤') || name.includes('裤子')) {
				this.detailInfo = [
					{ label: '品牌', value: 'Lee' },
					{ label: '面料', value: '98%棉 + 2%氨纶' },
					{ label: '版型', value: '宽松直筒' },
					{ label: '尺码', value: '28/30/32/34/36' },
					{ label: '颜色', value: '深蓝色/浅蓝色' },
					{ label: '工艺', value: '复古水洗 磨白工艺' },
					{ label: '设计', value: '工装多口袋 美式风格' },
					{ label: '洗涤', value: '建议反面洗涤 避免褪色' },
					{ label: '季节', value: '夏季薄款 透气舒适' }
				]
				this.salesCount = '8000+'
				this.reviewCount = '2000+'
			} else if (name.includes('鞋') || name.includes('运动鞋') || name.includes('休闲鞋')) {
				this.detailInfo = [
					{ label: '品牌', value: '安踏' },
					{ label: '鞋面', value: '透气网布 + 人造革' },
					{ label: '鞋底', value: '橡胶大底 + EVA中底' },
					{ label: '功能', value: '减震回弹 防滑耐磨' },
					{ label: '尺码', value: '39-44码' },
					{ label: '颜色', value: '黑色/白色/灰色' },
					{ label: '风格', value: '复古老爹鞋 增高厚底' },
					{ label: '用途', value: '跑步/休闲/日常穿搭' },
					{ label: '质保', value: '质保3个月' }
				]
				this.salesCount = '10000+'
				this.reviewCount = '2500+'
			} else {
				const category = this.goods.category || 1
				const detailMap = {
					1: [
						{ label: '品牌', value: '官方自营' },
						{ label: '产地', value: '中国大陆' },
						{ label: '质保', value: '全国联保1年' },
						{ label: '售后服务', value: '7天无理由退换' }
					],
					2: [
						{ label: '材质', value: '实木/环保板材' },
						{ label: '产地', value: '中国大陆' },
						{ label: '风格', value: '现代简约' },
						{ label: '安装', value: '自行安装/上门安装' }
					],
					3: [
						{ label: '品牌', value: '品牌精选' },
						{ label: '产地', value: '中国大陆' },
						{ label: '保质期', value: '12个月' },
						{ label: '储存条件', value: '阴凉干燥处' }
					],
					4: [
						{ label: '材质', value: '纯棉/优质面料' },
						{ label: '产地', value: '中国大陆' },
						{ label: '版型', value: '修身/宽松' },
						{ label: '洗涤', value: '建议手洗/机洗' }
					]
				}
				this.detailInfo = detailMap[category] || detailMap[1]
			}
		},
		initReviews() {
			const name = this.goods.name || ''
			
			if (name.includes('iphone') || name.includes('iPhone')) {
				this.reviews = [
					{ avatar: '👤', name: '果粉小王', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: 'A17 Pro芯片性能太强了，玩游戏超流畅，拍照效果也很好，物有所值！' },
					{ avatar: '👤', name: '数码控', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '钛金属边框手感很棒，屏幕显示效果惊艳，续航也比上一代提升不少。' },
					{ avatar: '👤', name: '摄影爱好者', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '4800万像素主摄拍照太清晰了，夜景模式也很强，买了不后悔！' }
				]
			} else if (name.includes('华硕') || name.includes('天选')) {
				this.reviews = [
					{ avatar: '👤', name: '游戏玩家小李', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: 'RTX 4060显卡性能很强，240Hz屏幕玩游戏太爽了，散热也很不错！' },
					{ avatar: '👤', name: '设计师阿杰', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: 'i7处理器运行设计软件很流畅，屏幕色彩精准，非常满意！' },
					{ avatar: '👤', name: '大学生小张', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '颜值很高，重量也适中，上课携带很方便，性价比很高！' }
				]
			} else if (name.includes('大疆') || name.includes('dji') || name.includes('osmo')) {
				this.reviews = [
					{ avatar: '👤', name: 'Vlog博主', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '4K视频画质太棒了，防抖效果一流，拍出来的视频很稳定，强烈推荐！' },
					{ avatar: '👤', name: '旅行达人', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '体积小巧便携，出门旅行必备，续航也够用，IPX8防水很实用。' },
					{ avatar: '👤', name: '摄影新手', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '操作简单，上手快，一键成片功能很方便，拍出来效果很好。' }
				]
			} else if (name.includes('茶几')) {
				this.reviews = [
					{ avatar: '👤', name: '居家主妇', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '白橡木材质很厚实，放在客厅很有档次，北欧风格百搭，非常喜欢！' },
					{ avatar: '👤', name: '装修业主', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '工艺精细，环保水性漆没味道，收到货直接用，省心省力！' },
					{ avatar: '👤', name: '小户型业主', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '尺寸刚好，不占空间，承重也不错，放茶具水果都没问题。' }
				]
			} else if (name.includes('沙发')) {
				this.reviews = [
					{ avatar: '👤', name: '新家装修', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '头层牛皮手感细腻，坐感舒适，高密度海绵回弹很好，很值！' },
					{ avatar: '👤', name: '家庭用户', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '实木框架很稳固，可拆洗设计很方便，家里有小孩也不怕弄脏。' },
					{ avatar: '👤', name: '品质生活', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '现代轻奢风格，放在客厅很显档次，送货上门安装服务很好。' }
				]
			} else if (name.includes('鞋架') || name.includes('鞋柜')) {
				this.reviews = [
					{ avatar: '👤', name: '收纳达人', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '松木材质很结实，5层大容量能放很多鞋子，家里瞬间整洁了！' },
					{ avatar: '👤', name: '租房一族', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '安装简单，赠送工具很贴心，环保清漆没味道，性价比很高。' },
					{ avatar: '👤', name: '宝妈', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '高度刚好，孩子自己就能拿鞋子，稳固不摇晃，很满意！' }
				]
			} else if (name.includes('乳酸菌') || name.includes('面包')) {
				this.reviews = [
					{ avatar: '👤', name: '上班族', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '乳酸菌夹心味道很好，早餐吃很方便，独立包装携带也方便！' },
					{ avatar: '👤', name: '宝妈', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '孩子很喜欢吃，口感松软，独立包装干净卫生，囤货必备！' },
					{ avatar: '👤', name: '学生党', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '价格实惠，味道不错，当零食吃很合适，宿舍常备！' }
				]
			} else if (name.includes('鱼丸')) {
				this.reviews = [
					{ avatar: '👤', name: '火锅爱好者', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '福州鱼丸名不虚传，Q弹爽口，火锅必备，家人都爱吃！' },
					{ avatar: '👤', name: '煮汤达人', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '煮汤放几颗味道很鲜美，新鲜鱼肉制作，口感很好！' },
					{ avatar: '👤', name: '吃货', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '冷冻保存很方便，随时想吃就煮，性价比很高！' }
				]
			} else if (name.includes('饼干') || name.includes('苏打')) {
				this.reviews = [
					{ avatar: '👤', name: '下午茶爱好者', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '海盐风味很好吃，不会太咸，配茶吃很合适，独立小包方便分享！' },
					{ avatar: '👤', name: '健康生活', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '低糖低盐很健康，老人小孩都能吃，酥脆口感很不错！' },
					{ avatar: '👤', name: '办公室零食', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '办公室常备零食，独立包装卫生，同事都说好吃！' }
				]
			} else if (name.includes('短袖')) {
				this.reviews = [
					{ avatar: '👤', name: '穿搭达人', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '100%纯棉面料很舒服，修身版型显身材，颜色很正，非常满意！' },
					{ avatar: '👤', name: '日常通勤', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '简约圆领很百搭，质量很好，洗了几次没变形，值得购买！' },
					{ avatar: '👤', name: '学生党', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '价格实惠，品质很好，夏季必备，多买了几件换着穿！' }
				]
			} else if (name.includes('牛仔裤') || name.includes('裤子')) {
				this.reviews = [
					{ avatar: '👤', name: '潮男', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '工装风格很帅气，宽松直筒版型很舒适，复古水洗效果很棒！' },
					{ avatar: '👤', name: '日常穿搭', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '夏季薄款很透气，多口袋设计很实用，面料柔软很舒服！' },
					{ avatar: '👤', name: '性价比之选', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '尺码标准，做工精细，美式风格很有范儿，推荐购买！' }
				]
			} else if (name.includes('鞋') || name.includes('运动鞋') || name.includes('休闲鞋')) {
				this.reviews = [
					{ avatar: '👤', name: '跑步爱好者', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '减震效果很好，跑步很舒服，厚底增高效果不错，百搭款！' },
					{ avatar: '👤', name: '日常穿搭', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '复古老爹鞋风格很喜欢，透气网布鞋面不闷脚，颜值很高！' },
					{ avatar: '👤', name: '学生党', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '价格实惠，质量很好，穿了一段时间没开胶，推荐！' }
				]
			} else {
				const category = this.goods.category || 1
				const reviewTemplates = {
					1: [
						{ avatar: '👤', name: '科技达人', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '性能非常好，使用体验很棒，推荐购买！' },
						{ avatar: '👤', name: '数码爱好者', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '质量可靠，物流很快，客服态度好。' },
						{ avatar: '👤', name: '游戏玩家', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '运行流畅，外观漂亮，很满意！' }
					],
					2: [
						{ avatar: '👤', name: '家居达人', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '质量很好，安装简单，放在家里很合适。' },
						{ avatar: '👤', name: '装修业主', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '材质环保，做工精细，非常满意！' },
						{ avatar: '👤', name: '收纳控', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '空间很大，很实用，家里整洁多了。' }
					],
					3: [
						{ avatar: '👤', name: '美食爱好者', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '味道很好，包装精美，下次还会买！' },
						{ avatar: '👤', name: '零食达人', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '价格实惠，口感不错，值得推荐。' },
						{ avatar: '👤', name: '吃货', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '非常好吃，家里人都喜欢！' }
					],
					4: [
						{ avatar: '👤', name: '时尚达人', time: '2024-01-15', rating: '⭐⭐⭐⭐⭐', content: '穿着舒适，款式好看，很满意！' },
						{ avatar: '👤', name: '穿搭博主', time: '2024-01-14', rating: '⭐⭐⭐⭐⭐', content: '面料柔软，做工精细，值得购买。' },
						{ avatar: '👤', name: '购物达人', time: '2024-01-13', rating: '⭐⭐⭐⭐⭐', content: '尺码标准，颜色正，很喜欢！' }
					]
				}
				this.reviews = reviewTemplates[category] || reviewTemplates[1]
			}
		},
		addToCart() {
			store.mutations.ADD_TO_CART(store.state, this.goods)
			this.cartCount = store.getters.cartCount
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		toggleFavorite() {
			if (!this.goods.id) return
			store.mutations.TOGGLE_FAVORITE(store.state, this.goods)
			uni.showToast({ title: this.isFavorite ? '已收藏' : '已取消收藏', icon: 'none' })
		},
		buyNow() {
			store.mutations.ADD_TO_CART(store.state, this.goods)
			uni.navigateTo({ url: '/pages/checkout/checkout' })
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
