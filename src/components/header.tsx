"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { addHotel } from "@/redux/features/hotel-slice";
import { CreateOrEditHotelModal } from "@/components";
import { IHotelProps } from "@/interfaces/hotel";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Handle Create/Save Hotel
  const handleSaveHotel = (hotelData: IHotelProps) => {
    // Add the hotel via Redux Toolkit
    dispatch(addHotel(hotelData));

    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          width: "100vw",
          height: "10vh",
          zIndex: 1100,
          padding: "0 20px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Logo Section */}
          <Typography variant="h6" component="div">
            Hotels
          </Typography>

          {/* Create Hotel Button */}
          <Box>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setIsModalOpen(true)}
            >
              Create Hotel
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal for Creating/Editing Hotel */}
      {isModalOpen && (
        <CreateOrEditHotelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHotel}
        />
      )}
    </>
  );
};

export default Header;
