import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
    loadingOwner: false,
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
      state.loadingOwner = false;
    },
    setOwnerLoading: (state, action) => {
      state.loadingOwner = action.payload;
    },
  },
});

export const { setMyShopData, setOwnerLoading } = ownerSlice.actions;
export default ownerSlice.reducer;
