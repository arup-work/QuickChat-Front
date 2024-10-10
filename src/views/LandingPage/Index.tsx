import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { Box, Typography } from "@mui/material";
import { showErrorToast, showSuccessToast } from "../../helpers/utils/toastUtils";
import { useLocation } from "react-router-dom";

const Index: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.message) {
        if (location.state.type === 'success') {
            showSuccessToast(location.state.message);
        }else{
            showErrorToast(location.state.message);
        }
    }
  },[location.state]);

  const auth = useSelector((state: RootState) => state.auth.auth);
  return (
    <Box
      component="form"
      sx={{
        width: 400,
        margin: "auto",
        padding: 3,
        borderRadius: 2, // Rounded corners
        border: "1px solid #ccc", // Light gray border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        backgroundColor: "#fff", // Background color to make it stand out
        marginTop: "60px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Welcome back, {auth.user?.name}
      </Typography>
    </Box>
  );
};

export default Index;
