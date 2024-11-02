import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useLocation } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../helpers/utils/toastUtils";
import ChatIndex from "../../components/Chat/Index";

const Index: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth.auth);
  const location = useLocation();
  const currentUser = auth.user?.id;

  useEffect(() => {
    
    if (location.state?.message) {
      if (location.state.type === "success") {
        showSuccessToast(location.state.message);
      } else {
        showErrorToast(location.state.message);
      }
    }
  }, [location.state]);

  return (
    <>
    {/* <Box
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
    </Box> */}
     {currentUser && (
      <ChatIndex />
    )}
    </>
  );
};

export default Index;
