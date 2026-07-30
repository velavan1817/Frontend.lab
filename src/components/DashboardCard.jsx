import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

export default function DashboardCard({ title, value, icon, color }) {
  // Map color strings to nice background gradients
  const getGradient = (col) => {
    switch (col) {
      case "primary":
        return "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
      case "secondary":
        return "linear-gradient(135deg, #10b981 0%, #047857 100%)";
      case "warning":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      case "error":
        return "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)";
      case "info":
        return "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)";
      default:
        return "linear-gradient(135deg, #64748b 0%, #475569 100%)";
    }
  };

  return (
    <Card
      sx={{
        background: getGradient(color),
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent sx={{ width: "100%", py: 2, px: 3, "&:last-child": { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.85, fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
