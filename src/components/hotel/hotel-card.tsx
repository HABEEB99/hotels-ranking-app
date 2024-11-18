"use client";

import { useDispatch } from "react-redux";

import { IHotelProps } from "@/interfaces/hotel";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { deleteHotel } from "@/redux/features/hotel-slice";
import { useState } from "react";
import ConfirmationModal from "../confirmation-modal";

interface HotelCardProps {
  hotel: IHotelProps;
  onEdit: (hotel: IHotelProps) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onEdit }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open confirmation modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    setIsModalOpen(true);
    dispatch(deleteHotel(hotel.id));
    setIsModalOpen(false);
  };

  return (
    <>
      {" "}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={hotel.images[0] || "https://via.placeholder.com/300x200"}
          alt={`${hotel.name} image`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {hotel.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hotel.address}, {hotel.country}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Category: {hotel.category}
          </Typography>
        </CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px",
          }}
        >
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => onEdit(hotel)}
          >
            <EditIcon color="secondary" />
          </IconButton>

          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={handleOpenModal}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </div>
      </Card>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Hotel Deletion"
        description={`Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </>
  );
};

export default HotelCard;
