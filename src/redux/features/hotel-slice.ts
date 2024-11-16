import hotelsData from "@/data/hotels";
import { IHotelProps } from "@/interfaces/hotel";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "hotels";

const loadHotelsFromLocalStorage = (): IHotelProps[] => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }
  return [];
};

interface HotelState {
  hotels: IHotelProps[];
}

const initialState: HotelState = {
  hotels:
    loadHotelsFromLocalStorage().length > 0
      ? loadHotelsFromLocalStorage()
      : hotelsData,
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    addHotel(state, action: PayloadAction<IHotelProps>) {
      state.hotels.push(action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
    },

    editHotel(state, action: PayloadAction<IHotelProps>) {
      const index = state.hotels.findIndex(
        (hotel) => hotel.id === action.payload.id
      );
      if (index !== -1) {
        state.hotels[index] = action.payload;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
      }
    },

    deleteHotel(state, action: PayloadAction<string>) {
      state.hotels = state.hotels.filter(
        (hotel) => hotel.id !== action.payload
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
    },
  },
});

export const { addHotel, editHotel, deleteHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
