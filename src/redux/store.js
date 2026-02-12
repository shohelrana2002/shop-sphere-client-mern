import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import ownerSlice from "./ownerSlice.js";
import itemSlice from "./itemSlice.js";
import mapSlice from "./mapSlice.js";
export const store = configureStore({
  // store
  reducer: {
    user: userSlice,
    owner: ownerSlice,
    item: itemSlice,
    map: mapSlice,
  },
});
