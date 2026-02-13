import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: null,
    myOrdersLoading: true,
    searchItems: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCard: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
      state.myOrdersLoading = false;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      const order = state.myOrders.find((o) => o._id === orderId);
      if (!order) return;

      const shopOrderItem = order.shopOrder.find((s) => {
        const currentShopId = typeof s.shop === "object" ? s.shop._id : s.shop;

        return currentShopId?.toString() === shopId;
      });

      if (shopOrderItem) {
        shopOrderItem.status = status;
      }
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
  },
});

export const {
  setUser,
  setUserLoading,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCard,
  clearCart,
  removeFromCart,
  setMyOrders,
  updateOrderStatus,
  setSearchItems,
} = userSlice.actions;
export default userSlice.reducer;
