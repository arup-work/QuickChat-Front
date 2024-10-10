import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    } else if (formData.name.length < 5) {
      errors.name = "Name should be minimum 5 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.password = "Password & confirm password must be same";
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate input before submitting
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/", {
        state: {
          message: response.message,
          type: "success",
        },
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="formBox">
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Register
      </Typography>

      <FormGroup>
        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="name">Name</label>
          <TextField
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="email">Email</label>
          <TextField
            fullWidth
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </FormControl>
        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="password">Password</label>
          <TextField
            fullWidth
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.email}
          />
        </FormControl>
        <FormControl sx={{ marginBottom: 2 }}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <TextField
            fullWidth
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </FormControl>
        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <Typography sx={{ marginTop: 2 }} textAlign="center">
          Already have an account?{" "}
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            Login
          </Link>
        </Typography>
      </FormGroup>
    </Box>
  );
};

export default Register;
