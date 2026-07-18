import { reactive } from 'vue'

const state = reactive({
  cartList: [],
  orders: [],
  favorites: [],
  addresses: [],
  history: [],
  userInfo: {
    name: '用户',
    avatar: '',
    phone: '138****8888'
  }
})

const mutations = {
  ADD_TO_CART(state, goods) {
    const index = state.cartList.findIndex(item => item.id === goods.id)
    if (index > -1) {
      state.cartList[index].quantity++
    } else {
      state.cartList.push({ ...goods, quantity: 1 })
    }
  },
  INCREASE_CART(state, goodsId) {
    const index = state.cartList.findIndex(item => item.id === goodsId)
    if (index > -1) {
      state.cartList[index].quantity++
    }
  },
  DECREASE_CART(state, goodsId) {
    const index = state.cartList.findIndex(item => item.id === goodsId)
    if (index > -1) {
      if (state.cartList[index].quantity > 1) {
        state.cartList[index].quantity--
      } else {
        state.cartList.splice(index, 1)
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
  CREATE_ORDER(state, address) {
    if (state.cartList.length === 0) return null
    
    const order = {
      id: Date.now(),
      createTime: new Date().toLocaleString(),
      items: [...state.cartList],
      totalPrice: state.cartList.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: '待支付',
      address: address
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
  },
  TOGGLE_FAVORITE(state, goods) {
    const index = state.favorites.findIndex(item => item.id === goods.id)
    if (index > -1) {
      state.favorites.splice(index, 1)
    } else {
      state.favorites.push({ ...goods })
    }
  },
  REMOVE_FROM_FAVORITES(state, goodsId) {
    const index = state.favorites.findIndex(item => item.id === goodsId)
    if (index > -1) {
      state.favorites.splice(index, 1)
    }
  },
  ADD_ADDRESS(state, address) {
    state.addresses.push({ ...address, id: Date.now() })
  },
  UPDATE_ADDRESS(state, { id, address }) {
    const index = state.addresses.findIndex(item => item.id === id)
    if (index > -1) {
      state.addresses[index] = { ...state.addresses[index], ...address }
    }
  },
  DELETE_ADDRESS(state, id) {
    const index = state.addresses.findIndex(item => item.id === id)
    if (index > -1) {
      state.addresses.splice(index, 1)
    }
  },
  SET_DEFAULT_ADDRESS(state, id) {
    state.addresses.forEach(item => {
      item.isDefault = item.id === id
    })
  },
  ADD_TO_HISTORY(state, goods) {
    const index = state.history.findIndex(item => item.id === goods.id)
    if (index > -1) {
      state.history.splice(index, 1)
    }
    state.history.unshift({ ...goods, viewTime: new Date().toLocaleString() })
    if (state.history.length > 50) {
      state.history.pop()
    }
  },
  CLEAR_HISTORY(state) {
    state.history = []
  },
  REMOVE_FROM_HISTORY(state, goodsId) {
    const index = state.history.findIndex(item => item.id === goodsId)
    if (index > -1) {
      state.history.splice(index, 1)
    }
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
  },
  get favorites() {
    return state.favorites
  },
  get favoritesCount() {
    return state.favorites.length
  },
  isFavorite(goodsId) {
    return state.favorites.some(item => item.id === goodsId)
  },
  get addresses() {
    return state.addresses
  },
  get addressesCount() {
    return state.addresses.length
  },
  get defaultAddress() {
    return state.addresses.find(item => item.isDefault) || state.addresses[0] || null
  },
  get history() {
    return state.history
  },
  get historyCount() {
    return state.history.length
  }
}

export default {
  state,
  mutations,
  getters
}