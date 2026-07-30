import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ScienceIcon from "@mui/icons-material/Science";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const isDark = theme.palette.mode === "dark";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const getRedirectPath = (roleName) => {
    if (!roleName) return "/student/dashboard";
    const r = roleName.toUpperCase().trim().replace(/\s+/g, "_");
    switch (r) {
      case "SYSTEM_ADMINISTRATOR":
      case "SYSTEM_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "LAB_MANAGER":
      case "MANAGER":
        return "/manager/dashboard";
      case "LAB_TECHNICIAN":
      case "TECHNICIAN":
        return "/technician/dashboard";
      case "INSTITUTION_ADMINISTRATOR":
      case "INSTITUTION_ADMIN":
      case "DEPARTMENT_HEAD":
        return "/institution/dashboard";
      case "STUDENT":
      default:
        return "/student/dashboard";
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    const emailInput = (data.email || "").trim();

    try {
      // Connect to real completed backend API
      const response = await authService.login(emailInput, data.password);
      
      const roleFromBackend = response.data?.role || "STUDENT";
      const userToken = response.data?.token;
      const userName = response.data?.name || emailInput;
      const userEmail = response.data?.email || emailInput;

      // Save credentials to localStorage
      localStorage.setItem("token", userToken);
      localStorage.setItem("role", roleFromBackend);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("name", userName);
      localStorage.setItem("username", userName);

      login(userToken, roleFromBackend, userName, userEmail);
      navigate(getRedirectPath(roleFromBackend));
    } catch (err) {
      console.error("Login Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Invalid email or password";

      setApiError(errorMessage);

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Soft blue/purple dynamic gradient background
        background: isDark
          ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
          : "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #e0f2fe 100%)",
        py: 6,
        px: 2.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Glowing Elements */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          filter: "blur(120px)",
          bgcolor: isDark ? "rgba(79, 70, 229, 0.15)" : "rgba(165, 180, 252, 0.4)",
          top: "-10%",
          left: "10%",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          filter: "blur(100px)",
          bgcolor: isDark ? "rgba(14, 165, 233, 0.1)" : "rgba(196, 181, 253, 0.4)",
          bottom: "-5%",
          right: "15%",
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 4, sm: 5 },
            borderRadius: 6,
            // Glassmorphism design properties
            backdropFilter: "blur(20px)",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.8)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              : "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* Top Logo / Icon and Headers */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4.5}>
            <Box
              sx={{
                p: 2,
                borderRadius: "24px",
                background: isDark
                  ? "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)"
                  : "linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)",
                color: isDark ? "#818cf8" : "#1e3a8a",
                mb: 2.5,
                display: "inline-flex",
                boxShadow: isDark ? "none" : "inset 0 2px 4px rgba(255, 255, 255, 0.6)",
              }}
            >
              <ScienceIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: 900,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.2,
                letterSpacing: -0.5,
              }}
            >
              Lab Resource Utilization Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              Sign in to continue
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3.5, borderRadius: 3 }}>
              {apiError}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field with Start Adornment Icon */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              placeholder="name@university.edu"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address format",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  transition: "all 0.2s ease-in-out",
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.2)" : "rgba(248, 250, 252, 0.8)",
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(241, 245, 249, 1)",
                  },
                },
              }}
            />

            {/* Password Field with Show/Hide Toggle & Start Adornment */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  transition: "all 0.2s ease-in-out",
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.2)" : "rgba(248, 250, 252, 0.8)",
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(241, 245, 249, 1)",
                  },
                },
              }}
            />

            {/* Remember Me and Forgot Password links */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <FormControlLabel
                control={<Checkbox color="primary" {...register("rememberMe")} />}
                label={
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Remember Me
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#818cf8" : "#1e3a8a",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Large Blue Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.6,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "none",
                background: isDark
                  ? "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"
                  : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing in...</span>
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* OR Divider */}
            <Box display="flex" alignItems="center" my={3.5}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mx: 2, fontWeight: 700, letterSpacing: 0.5 }}>
                OR
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Link to Register */}
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? "#818cf8" : "#1e3a8a",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
