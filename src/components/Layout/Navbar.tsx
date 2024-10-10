import React from "react";
import {
  AppBar,
  Toolbar,
  //   IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "../../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", {
        state: {
          message: 'You have been logged out successfully!',
          type: "success",
        },
      });
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#004d40" }}>
      <Toolbar>
        <Box display="flex" alignItems="center"  component={Link} to={"/"}  style={{ textDecoration: 'none', color: 'inherit' }}>
          <img
            src="src/assets/react.svg" // Replace with your logo path
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }} // Adjust height as needed
          />
        </Box>
        {/* App title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link} to={"/"}  style={{ textDecoration: 'none', color: 'inherit' }}>
          QuickChat
        </Typography>
        {/* Navigation buttons */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
          {/* Hides on smaller screens */}
          <Button color="inherit">
            <HomeIcon /> Home
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            <ExitToAppIcon /> Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
