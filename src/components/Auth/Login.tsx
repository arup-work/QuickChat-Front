import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import AuthService from "../../services/AuthService";
import { ToastContainer } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../helpers/utils/toastUtils";
import { useDispatch } from "react-redux";
import { login} from "../../redux/slices/AuthSlice";
import { AppDispatch } from "../../redux";
import '../../assets/styles/Auth.css'

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  //Validation function
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email";
    }

    if (!formData.password) {
      errors.password = "This field is required";
    }

    return errors;
  };

  //Submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input before submitting
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const response = await AuthService.login(formData.email, formData.password);
    if (response) {
      dispatch(login({
        token: response.token, user: response.user
      }))
      navigate("/", {
        state: {
          message: `Welcome back, ${response.user.name}`,
          type: "success",
        },
      });
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  useEffect(() => {
    if (location.state?.message) {
        if (location.state.type === 'success') {
            showSuccessToast(location.state.message);
        }else{
            showErrorToast(location.state.message);
        }
    }
  },[location.state]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="formBox"
    >
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Login
      </Typography>
      <ToastContainer />
      <FormGroup>
        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="email">Email</label>
          <TextField
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            helperText={errors.email}
            error={!!errors.email}
            fullWidth
          />
        </FormControl>

        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="password">Password</label>
          <TextField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            helperText={errors.password}
            error={!!errors.password}
            fullWidth
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
        <Typography sx={{ marginTop: 2 }} textAlign="center">
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            Register
          </Link>
        </Typography>
      </FormGroup>
    </Box>
  );
};

export default Login;
