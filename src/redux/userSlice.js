import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
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
  },
});

export const {
  setUser,
  setUserLoading,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
} = userSlice.actions;
export default userSlice.reducer;
