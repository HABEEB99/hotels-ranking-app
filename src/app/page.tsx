import { HotelList } from "@/components";
import { Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        paddingY: {
          xs: "12px",
          sm: "20px",
          md: "30px",
          lg: "36px",
          xl: "46px",
        },
        backgroundColor: "white",
        height: "100vh",
        overflowY: "auto",

        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      {/* Hotel List */}
      <HotelList />
    </Box>
  );
};

export default HomePage;
