const state = {
  cartList: [],
  orders: [],
  userInfo: {
    name: '用户',
    avatar: '',
    phone: '138****8888'
  }
}

const mutations = {
  ADD_TO_CART(state, goods) {
    const exists = state.cartList.find(item => item.id === goods.id)
    if (exists) {
      exists.quantity++
    } else {
      state.cartList.push({ ...goods, quantity: 1 })
    }
  },
  INCREASE_CART(state, goodsId) {
    const item = state.cartList.find(item => item.id === goodsId)
    if (item) {
      item.quantity++
    }
  },
  DECREASE_CART(state, goodsId) {
    const item = state.cartList.find(item => item.id === goodsId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        const index = state.cartList.findIndex(i => i.id === goodsId)
        if (index > -1) {
          state.cartList.splice(index, 1)
        }
      }
    }
  },
  DELETE_FROM_CART(state, goodsId) {
    const index = state.cartList.findIndex(item => item.id === goodsId)
    if (index > -1) {
      state.cartList.splice(index, 1)
    }
  },
  CLEAR_CART(state) {
    state.cartList = []
  },
  CREATE_ORDER(state) {
    if (state.cartList.length === 0) return null
    
    const order = {
      id: Date.now(),
      createTime: new Date().toLocaleString(),
      items: [...state.cartList],
      totalPrice: state.cartList.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: '待支付'
    }
    
    state.orders.unshift(order)
    state.cartList = []
    return order
  },
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find(item => item.id === orderId)
    if (order) {
      order.status = status
    }
  },
  SET_USER_INFO(state, info) {
    state.userInfo = { ...state.userInfo, ...info }
  }
}

const getters = {
  get cartCount() {
    return state.cartList.reduce((sum, item) => sum + item.quantity, 0)
  },
  get cartTotal() {
    return state.cartList.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
  get cartList() {
    return state.cartList
  },
  get orders() {
    return state.orders
  },
  get userInfo() {
    return state.userInfo
  }
}

export default {
  state,
  mutations,
  getters
}
