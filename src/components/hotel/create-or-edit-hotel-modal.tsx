"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import { IHotelProps } from "@/interfaces/hotel";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from "@mui/material";

import { addHotel, editHotel } from "@/redux/features/hotel-slice";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import useCountries from "@/api-hooks/use-get/use-countries";
import { ICountriesResponse } from "@/interfaces/country";
import { countries } from "@/data/countries";

interface ICreateOrEditHotelModal {
  hotel?: IHotelProps;
  onClose: () => void;
  isOpen: boolean;
  onSave: (hotelData: IHotelProps) => void;
}

const CreateOrEditHotelModal: React.FC<ICreateOrEditHotelModal> = ({
  hotel,
  onClose,
  isOpen,
  onSave,
}) => {
  const dispatch = useDispatch();

  // TODO: integrate API
  // const { data: countryData } = useCountries();
  // Flatten the array of arrays
  // const countries = useMemo(
  //   () => (countryData ? countryData.flat() : []),
  //   [countryData]
  // );

  const [formData, setFormData] = useState<IHotelProps>(
    hotel || {
      id: crypto.randomUUID(),
      name: "",
      country: "",
      address: "",
      category: 0,
      images: [],
      dateCreated: null,
    }
  );

  // Update form data and images when editing a hotel
  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
      setSelectedImages(hotel.images || []);
    }
  }, [hotel]);

  useEffect(() => {
    if (!hotel) {
      setFormData((prev) => ({ ...prev, dateCreated: Date.now() }));
    }
  }, [hotel]);

  // useEffect to handle dynamically generated image URLs after the component mounts
  useEffect(() => {
    const updatedImages = selectedImages.map((image) =>
      image.startsWith("blob:")
        ? image
        : URL.createObjectURL(new File([], image))
    );
    setSelectedImages(updatedImages);
  }, []);

  useEffect(() => {
    if (hotel?.images) {
      setSelectedImages(hotel.images);
    }
  }, [hotel]);

  const [selectedImages, setSelectedImages] = useState<string[]>(
    hotel?.images || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (formData.category < 1 || formData.category > 5)
      newErrors.category = "Category must be between 1 and 5.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // For handling TextField changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "category" ? Math.min(Math.max(Number(value), 1), 5) : value,
    }));
  };

  // For handling Select changes
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileURLs = files.map((file) =>
        typeof window !== "undefined" ? URL.createObjectURL(file) : ""
      );
      setSelectedImages((prevImages) => [...prevImages, ...fileURLs]);
    }
  };

  const handleImageDelete = (image: string) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img !== image)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      const updatedFormData = { ...formData, images: selectedImages };
      onSave(updatedFormData);
      dispatch(hotel ? editHotel(updatedFormData) : addHotel(updatedFormData));
      setSnackbarMessage(
        hotel
          ? `${hotel.name} Hotel updated successfully!`
          : `Hotel created successfully!`
      );
      setSnackbarOpen(true);
      onClose();
    }
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "600px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            textAlign="center"
            color="textPrimary"
          >
            {hotel ? "Edit Hotel" : "Create Hotel"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.country}>
                  <InputLabel>Country</InputLabel>
                  {countries.length > 0 ? (
                    <Select
                      label="Country"
                      name="country"
                      fullWidth
                      value={formData.country || ""}
                      onChange={handleSelectChange}
                    >
                      {countries.map((country: ICountriesResponse.Country) => (
                        <MenuItem key={country.geonameid} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography>Loading countries...</Typography>
                  )}

                  <Typography variant="caption" color="error">
                    {errors.country}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Category"
                  name="category"
                  type="number"
                  fullWidth
                  value={formData.category}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText={errors.category}
                  inputProps={{ min: 1, max: 5 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" mb={1}>
                  Images
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
                <Grid container spacing={1} mt={2}>
                  {selectedImages.map((image, index) => (
                    <Grid key={index} item xs={4}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1/1",
                          overflow: "hidden",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={image}
                          alt={`hotel-image-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                          }}
                          onClick={() => handleImageDelete(image)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">
                {hotel ? "Save Changes" : "Create Hotel"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateOrEditHotelModal;
