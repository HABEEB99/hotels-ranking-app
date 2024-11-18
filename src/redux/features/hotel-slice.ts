import hotelsData from "@/data/hotels";
import { IHotelProps } from "@/interfaces/hotel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "hotels";

// Utility function to load or initialize hotels
const loadOrInitializeHotels = (): IHotelProps[] => {
  if (typeof window !== "undefined") {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }

      // Store the default hotelsData in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hotelsData));
      return hotelsData;
    } catch (error) {
      console.error("Error loading hotels from localStorage:", error);
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
    // Add a new hotel
    addHotel(state, action: PayloadAction<IHotelProps>) {
      const newHotel = {
        ...action.payload,
        id: action.payload.id || crypto.randomUUID(),
      };
      state.hotels = [...state.hotels, newHotel];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.hotels));
    },

    // Edit an existing hotel
    editHotel(state, action: PayloadAction<IHotelProps>) {
      const { id } = action.payload;
      const updatedHotels = state.hotels.map((hotel) =>
        hotel.id === id ? { ...hotel, ...action.payload } : hotel
      );

      if (updatedHotels.find((hotel) => hotel.id === id)) {
        state.hotels = updatedHotels;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHotels));
      } else {
        console.warn(`Hotel with id "${id}" not found.`);
      }
    },

    // Delete a hotel by its ID
    deleteHotel(state, action: PayloadAction<string>) {
      const idToDelete = action.payload;
      const filteredHotels = state.hotels.filter(
        (hotel) => hotel.id !== idToDelete
      );

      if (filteredHotels.length < state.hotels.length) {
        state.hotels = filteredHotels;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredHotels));
      } else {
        console.warn(`Hotel with id "${idToDelete}" not found.`);
      }
    },
  },
});

export const { addHotel, editHotel, deleteHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
