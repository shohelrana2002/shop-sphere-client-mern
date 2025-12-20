import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    itemData: null,
    loadingItem: true,
  },
  reducers: {
    setItemData: (state, action) => {
      state.itemData = action.payload;
      state.loadingItem = false;
    },
    setItemLoading: (state, action) => {
      state.loadingItem = action.payload;
    },
  },
});

export const { setItemData, setItemLoading } = itemSlice.actions;
export default itemSlice.reducer;
