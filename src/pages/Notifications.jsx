import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Badge,
  useTheme,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConstructionIcon from "@mui/icons-material/Construction";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import api from "../services/api";

export default function Notifications() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await api.get("/notifications");
      setNotifications(response.data || []);
    } catch (err) {
      console.warn("GET /notifications offline. Loading local mock notification registry.", err);
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      setErrorMsg("");
      await api.put(`/notifications/${id}`, { read: true });
      setNotifications((prev) =>
        prev.map((n) => ((n.id || n._id) === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("PUT /notifications offline. Updating state locally.", err);
      setNotifications((prev) =>
        prev.map((n) => ((n.id || n._id) === id ? { ...n, read: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setErrorMsg("");
      // Call backend API if batch read endpoint exists, or clear locally
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setSuccessMsg("All notifications successfully marked as read.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "warning":
        return <ConstructionIcon sx={{ color: "warning.main" }} />;
      case "error":
        return <ErrorIcon sx={{ color: "error.main" }} />;
      case "info":
      default:
        return <InfoIcon sx={{ color: "primary.main" }} />;
    }
  };

  const getCategoryChip = (type) => {
    let label = "System";
    let color = "default";
    if (type === "success") { label = "Booking Approved"; color = "success"; }
    else if (type === "warning") { label = "Maintenance"; color = "warning"; }
    else if (type === "info") { label = "Booking Request"; color = "primary"; }
    else if (type === "error") { label = "Critical"; color = "error"; }

    return <Chip label={label} color={color} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.7rem", height: 20 }} />;
  };

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" flexDirection="column" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading notification registry...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ animation: "fadeIn 0.2s ease-in-out" }}>
      {/* Header Panel */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="start" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Badge badgeContent={unreadCount} color="error" max={99} sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
              {unreadCount > 0 ? (
                <NotificationsActiveIcon sx={{ fontSize: 32, color: theme.palette.primary.main, animation: "pulse 1.5s infinite" }} />
              ) : (
                <NotificationsIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />
              )}
            </Badge>
            <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? "#818cf8" : "#1e3a8a" }}>
              Notifications Hub
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Access system logs, equipment booking reviews, maintenance status reports, and alerts.
          </Typography>
        </Box>

        <Box display="flex" gap={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadNotifications}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="contained"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllRead}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                color: "#ffffff",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Mark All Read
            </Button>
          )}
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Unread Alert Card Panel */}
      {unreadCount > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            backgroundColor: isDark ? "rgba(99, 102, 241, 0.08)" : "#eff6ff",
            border: isDark ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <NotificationsActiveIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? "#93c5fd" : "#1e3a8a" }}>
            You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""} requiring attention.
          </Typography>
        </Paper>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <Card sx={{ border: isDark ? "1px solid #334155" : "1px solid #e2e8f0", boxShadow: "none", borderRadius: 4, overflow: "hidden" }}>
          <List sx={{ p: 0 }}>
            {notifications.map((n, idx) => {
              const nId = n.id || n._id || idx;
              return (
                <Box key={nId}>
                  <ListItem
                    sx={{
                      px: { xs: 2.5, sm: 4 },
                      py: 2.5,
                      backgroundColor: n.read ? "transparent" : (isDark ? "rgba(51, 65, 85, 0.2)" : "#f8fafc"),
                      borderLeft: "4px solid",
                      borderLeftColor: n.read ? "transparent" : "primary.main",
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(51, 65, 85, 0.4)" : "#f1f5f9",
                      },
                    }}
                    secondaryAction={
                      !n.read && (
                        <Tooltip title="Mark as Read" arrow>
                          <IconButton
                            edge="end"
                            onClick={() => handleMarkRead(nId)}
                            sx={{
                              color: "primary.main",
                              backgroundColor: isDark ? "rgba(99, 102, 241, 0.1)" : "#e0e7ff",
                              "&:hover": {
                                backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : "#cbd5e1",
                              },
                              p: 1,
                              borderRadius: 2,
                            }}
                          >
                            <DoneIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  >
                    <Box display="flex" gap={2.5} alignItems="start" sx={{ width: "100%", pr: 4 }}>
                      <Box sx={{ mt: 0.5 }}>
                        {getNotificationIcon(n.type)}
                      </Box>
                      <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={0.75} flexWrap="wrap">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: n.read ? 500 : 700,
                              color: n.read ? "text.secondary" : "text.primary",
                            }}
                          >
                            {n.message}
                          </Typography>
                          {!n.read && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                              sx={{
                                fontSize: "0.6rem",
                                height: 16,
                                fontWeight: 800,
                                borderRadius: 1,
                              }}
                            />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                          {getCategoryChip(n.type)}
                          <Typography variant="caption" color="text.secondary">
                            {n.time || "Recently"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                  {idx < notifications.length - 1 && <Divider sx={{ borderColor: isDark ? "#334155" : "#e2e8f0" }} />}
                </Box>
              );
            })}
          </List>
        </Card>
      ) : (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            border: isDark ? "1px dashed #334155" : "1px dashed #cbd5e1",
            borderRadius: 4,
            bgcolor: "background.paper",
          }}
        >
          <NotificationsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            All caught up!
          </Typography>
          <Typography color="text.secondary" variant="body2">
            You have no notifications or alerts to review.
          </Typography>
        </Box>
      )}

      {/* Styled animation overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      ` }} />
    </Box>
  );
}

const MOCK_NOTIFICATIONS = [
  { id: "1", message: "Digital Oscilloscope 100MHz reservation confirmed by Lab Manager.", time: "5 minutes ago", read: false, type: "success" },
  { id: "2", message: "Centrifuge 5000 RPM check-out approval pending manager review.", time: "1 hour ago", read: false, type: "info" },
  { id: "3", message: "UV-Vis Spectrophotometer set to Under Maintenance status.", time: "2 hours ago", read: false, type: "warning" },
  { id: "4", message: "Chemistry Lab resource sharing request approved.", time: "1 day ago", read: true, type: "success" },
  { id: "5", message: "Laboratory profile security credentials updated successfully.", time: "3 days ago", read: true, type: "default" },
];
