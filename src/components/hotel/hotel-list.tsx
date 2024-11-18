"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HotelCard, CreateOrEditHotelModal } from "@/components";
import { IHotelProps } from "@/interfaces/hotel";

import {
  Grid,
  SelectChangeEvent,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  InputAdornment,
  Typography,
} from "@mui/material";
import useCountries from "@/api-hooks/use-get/use-countries";
import { ICountriesResponse } from "@/interfaces/country";
import { countries } from "@/data/countries";
import { Search } from "@mui/icons-material";
import { editHotel } from "@/redux/features/hotel-slice";

const ITEMS_PER_PAGE = 8;

const HotelList = () => {
  const hotels = useSelector((state: RootState) => state.hotels.hotels);

  const dispatch = useDispatch();

  const [selectedHotel, setSelectedHotel] = useState<IHotelProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState(0);
  const [filterCountry, setFilterCountry] = useState("");
  const [sortOption, setSortOption] = useState("dateCreated");
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: integrate API
  // const { data: countryData } = useCountries();
  // Flatten the array of arrays
  // const countries = useMemo(
  //   () => (countryData ? countryData.flat() : []),
  //   [countryData]
  // );
  // const countries = countryData ? countryData.flat() : [];

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle category change
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFilterCategory(Number(e.target.value) || 0);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle country filter change
  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    setFilterCountry(e.target.value);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle sorting option change
  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle pagination change
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Filter hotels by category
  let filteredHotels = filterCategory
    ? hotels.filter((hotel) => hotel.category === filterCategory)
    : hotels;

  // Filter by country
  filteredHotels = filterCountry
    ? filteredHotels.filter((hotel) => hotel.country === filterCountry)
    : filteredHotels;

  // Search hotels by name
  filteredHotels = searchQuery
    ? filteredHotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredHotels;

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "dateCreated") {
      const dateA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
      const dateB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;

      // Sort in descending order of dateCreated
      return dateB - dateA;
    }
    return 0;
  });

  // Paginate hotels
  const totalHotels = sortedHotels.length;
  const paginatedHotels = sortedHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle edit button click
  const handleEdit = (hotel: IHotelProps) => {
    setSelectedHotel(hotel);
    dispatch(editHotel(hotel));
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedHotel(null);
    setIsModalOpen(false);
  };

  // Handle saving the hotel data
  const handleSaveHotel = (hotelData: IHotelProps) => {
    console.log("Saving hotel:", hotelData);
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        paddingY: {
          xs: 14,
          lg: 8,
        },
        paddingX: {
          xs: 3,
          lg: 8,
        },
      }}
    >
      {/* Filter Section */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {/* Search Bar */}
        <TextField
          label="Search Hotels"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        {/* Category Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory.toString()}
            onChange={handleCategoryChange}
          >
            <MenuItem value={0}>All Categories</MenuItem>
            {[1, 2, 3, 4, 5].map((star) => (
              <MenuItem key={star} value={star}>
                {"⭐".repeat(star)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Country Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Country</InputLabel>
          <Select value={filterCountry} onChange={handleCountryChange}>
            <MenuItem value="">All Countries</MenuItem>
            {countries.map((country: ICountriesResponse.Country) => (
              <MenuItem key={country.geonameid} value={country.country}>
                {country.country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sorting */}
        <FormControl size="small" fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortOption} onChange={handleSortChange}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="alphabetical">Alphabetical</MenuItem>
            <MenuItem value="dateCreated">Date Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {paginatedHotels.length > 0 ? (
          paginatedHotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={3} key={hotel.id}>
              <HotelCard hotel={hotel} onEdit={handleEdit} />
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              marginTop: 5,
              textAlign: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No hotels found matching your criteria. Try adjusting your
              filters.
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Pagination */}
      {totalHotels > ITEMS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Pagination
            count={Math.ceil(totalHotels / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      )}

      {selectedHotel && (
        <CreateOrEditHotelModal
          hotel={selectedHotel}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveHotel}
        />
      )}
    </Box>
  );
};

export default HotelList;
