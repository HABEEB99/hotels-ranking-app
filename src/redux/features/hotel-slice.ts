import hotelsData from "@/data/hotels";
import { IHotelProps } from "@/interfaces/hotel";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "hotels";

// Utility function to load hotels from localStorage or set the default data
const loadOrInitializeHotels = (): IHotelProps[] => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // Store the default hotelsData in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hotelsData));
      return hotelsData;
    }
  }
  return hotelsData;
};

interface HotelState {
  hotels: IHotelProps[];
}

const initialState: HotelState = {
  hotels: loadOrInitializeHotels(),
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    addHotel(state, action: PayloadAction<IHotelProps>) {
      state.hotels = [...state.hotels, action.payload];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
    },

    editHotel(state, action: PayloadAction<IHotelProps>) {
      state.hotels = state.hotels.map((hotel) =>
        hotel.id === action.payload.id ? action.payload : hotel
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
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
