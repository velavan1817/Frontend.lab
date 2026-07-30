import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import api from "../../services/api";

export default function NotificationMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      const list = response.data || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch (err) {
      console.warn("GET /notifications failed. Using local mock alerts.", err);
      setNotifications(MOCK_ALERTS);
      setUnreadCount(MOCK_ALERTS.filter((n) => !n.read).length);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "#475569" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 3,
            mt: 1.5,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        {/* Header Options */}
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2.5} py={1.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem", p: 0 }}
            >
              Mark All Read
            </Button>
          )}
        </Box>
        <Divider />

        {/* Dropdown list */}
        <List sx={{ p: 0, maxHeight: 240, overflow: "auto" }}>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <ListItem
                key={n.id}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  backgroundColor: n.read ? "transparent" : "#eff6ff",
                  borderBottom: "1px solid #f1f5f9",
                  "&:hover": { backgroundColor: "#f8fafc" },
                }}
              >
                <ListItemText
                  primary={n.message}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: n.read ? 500 : 700,
                    color: "#0f172a",
                  }}
                  secondary={n.time}
                  secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                />
              </ListItem>
            ))
          ) : (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications logged.
              </Typography>
            </Box>
          )}
        </List>
        <Divider />

        {/* Footer Link */}
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Button size="small" sx={{ textTransform: "none", fontWeight: 750 }} onClick={() => { handleClose(); navigate("/notifications"); }}>
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}

const MOCK_ALERTS = [
  { id: "1", message: "New Booking Request Submitted", time: "5 min ago", read: false },
  { id: "2", message: "Equipment Status set to Under Maintenance", time: "1 hour ago", read: false },
  { id: "3", message: "Centrifuge Allocation Approved", time: "2 days ago", read: true },
];
