import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import ShareIcon from "@mui/icons-material/Share";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

export default function Sidebar({ mobileOpen, onClose, drawerWidth = 260 }) {
  const location = useLocation();
  const theme = useTheme();
  const role = localStorage.getItem("role") || "Student";
  const normalizedRole = role.toUpperCase().replace(/\s+/g, "_");

  // Define role specific navigation menus
  const getMenuItems = () => {
    switch (normalizedRole) {
      case "STUDENT":
        return [
          { text: "Dashboard", path: "/student/dashboard", icon: <DashboardIcon /> },
          { text: "Equipment Catalog", path: "/equipment", icon: <ScienceIcon /> },
          { text: "My Bookings", path: "/student/bookings", icon: <HistoryIcon /> },
          { text: "Booking History", path: "/student/history", icon: <ListAltIcon /> },
          { text: "Notifications", path: "/student/notifications", icon: <NotificationsIcon /> },
          { text: "Profile Settings", path: "/profile", icon: <PersonIcon /> },
        ];
      case "LAB_TECHNICIAN":
      case "TECHNICIAN":
        return [
          { text: "Dashboard", path: "/technician/dashboard", icon: <DashboardIcon /> },
          { text: "Equipment Module", path: "/equipment-module", icon: <ScienceIcon /> },
          { text: "Equipment Registry", path: "/technician/equipment", icon: <ScienceIcon /> },
          { text: "Add Equipment", path: "/technician/equipment/add", icon: <AddCircleIcon /> },
          { text: "Maintenance Log", path: "/technician/maintenance", icon: <EngineeringIcon /> },
          { text: "Booking Approval", path: "/technician/bookings/approve", icon: <CheckCircleIcon /> },
          { text: "Returns Registry", path: "/technician/equipment/return", icon: <AssignmentReturnIcon /> },
          { text: "Reports & Logs", path: "/technician/reports", icon: <AssessmentIcon /> },
        ];
      case "LAB_MANAGER":
      case "MANAGER":
        return [
          { text: "Dashboard", path: "/manager/dashboard", icon: <DashboardIcon /> },
          { text: "Booking Requests", path: "/manager/booking-requests", icon: <EventNoteIcon /> },
          { text: "Utilization Dashboard", path: "/manager/utilization", icon: <EngineeringIcon /> },
          { text: "Waitlist & Demand", path: "/manager/waitlist", icon: <ListAltIcon /> },
          { text: "Inventory Analytics", path: "/manager/inventory-analytics", icon: <AssessmentIcon /> },
          { text: "Booking Analytics", path: "/manager/booking-analytics", icon: <EventNoteIcon /> },
          { text: "Resource Sharing", path: "/manager/resource-sharing", icon: <ShareIcon /> },
          { text: "Reports Registry", path: "/manager/reports", icon: <AssessmentIcon /> },
        ];
      case "INSTITUTION_ADMINISTRATOR":
      case "INSTITUTION_ADMIN":
      case "DEPARTMENT_HEAD":
        return [
          { text: "Dashboard", path: "/institution/dashboard", icon: <DashboardIcon /> },
          { text: "Departments Management", path: "/institution/departments", icon: <ApartmentIcon /> },
          { text: "Analytics Overview", path: "/institution/analytics", icon: <AssessmentIcon /> },
          { text: "Reports Compilation", path: "/institution/reports", icon: <ListAltIcon /> },
        ];
      case "SYSTEM_ADMINISTRATOR":
      case "SYSTEM_ADMIN":
      case "ADMIN":
        return [
          { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
          { text: "User Management", path: "/admin/users", icon: <PeopleIcon /> },
          { text: "Access Roles", path: "/admin/roles", icon: <SecurityIcon /> },
          { text: "System Settings", path: "/admin/settings", icon: <SettingsIcon /> },
          { text: "Audit Logs", path: "/admin/logs", icon: <ListAltIcon /> },
        ];
      default:
        return [
          { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Equipment Catalog", path: "/equipment", icon: <ScienceIcon /> },
        ];
    }
  };

  const menuItems = getMenuItems();

  const formatRoleName = (r) => {
    return r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // The sidebar background is persistent dark-slate to offer visual hierarchy in both themes
  const isDarkMode = theme.palette.mode === "dark";
  const sidebarBg = isDarkMode ? "#1e293b" : "#0f172a";
  const activeColor = isDarkMode ? theme.palette.primary.main : "#1e3a8a";

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: sidebarBg, color: "#f8fafc" }}>
      {/* Brand logo bar */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 3,
          backgroundColor: isDarkMode ? "#0f172a" : "#1e3a8a",
          gap: 1.5,
        }}
      >
        <SchoolIcon sx={{ color: "#ffffff" }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: 0.5 }}>
          LAB PLATFORM
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#334155" }} />

      {/* Role summary label */}
      <Box sx={{ p: 2.5, backgroundColor: isDarkMode ? "rgba(0,0,0,0.1)" : "#0f172a" }}>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Authorized Scope
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "#f1f5f9",
            textTransform: "uppercase",
            mt: 0.5,
            letterSpacing: 0.5,
            fontSize: "0.725rem",
          }}
        >
          {formatRoleName(role)}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#334155" }} />

      {/* Navigation options */}
      <List sx={{ px: 2, py: 2, flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  backgroundColor: isActive ? activeColor : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "#ffffff" : "#64748b",
                  },
                  "&:hover": {
                    backgroundColor: isActive ? activeColor : "#334155",
                    color: "#ffffff",
                    "& .MuiListItemIcon-root": {
                      color: "#ffffff",
                    },
                  },
                  transition: "all 0.15s ease-in-out",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="navigation links drawer"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
