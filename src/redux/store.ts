import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./features/hotel-slice";

export const store = configureStore({
  reducer: {
    // Reducer for hotels slice
    hotels: hotelReducer,
  },
});

// Type for root state
export type RootState = ReturnType<typeof store.getState>;

// Type for dispatch
export type AppDispatch = typeof store.dispatch;
