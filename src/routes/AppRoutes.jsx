import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Shared & System Pages
import UnderDevelopment from "../pages/UnderDevelopment";
import NotFound from "../pages/NotFound";
import EquipmentModule from "../pages/EquipmentModule";
import Booking from "../pages/Booking";

// Student Module Pages
import StudentDashboard from "../pages/student/Dashboard";
import Laboratories from "../pages/Laboratories";
import StudentEquipment from "../pages/student/Equipment";
import StudentEquipmentDetails from "../pages/student/EquipmentDetails";
import BookEquipment from "../pages/student/BookEquipment";
import StudentMyBookings from "../pages/student/MyBookings";
import StudentBookingHistory from "../pages/student/BookingHistory";
import Notifications from "../pages/Notifications";
import StudentProfile from "../pages/student/Profile";

// Lab Technician Module Pages
import TechnicianDashboard from "../pages/technician/Dashboard";
import TechnicianEquipmentManagement from "../pages/technician/EquipmentManagement";
import AddEquipment from "../pages/technician/AddEquipment";
import EditEquipment from "../pages/technician/EditEquipment";
import TechnicianMaintenance from "../pages/technician/Maintenance";
import TechnicianBookingApproval from "../pages/technician/BookingApproval";
import TechnicianReturnEquipment from "../pages/technician/ReturnEquipment";
import TechnicianReports from "../pages/technician/Reports";

// Lab Manager Module Pages
import ManagerDashboard from "../pages/manager/Dashboard";
import UtilizationDashboard from "../pages/manager/UtilizationDashboard";
import ManagerWaitlistManagement from "../pages/manager/WaitlistManagement";
import ManagerInventoryAnalytics from "../pages/manager/InventoryAnalytics";
import ManagerBookingAnalytics from "../pages/manager/BookingAnalytics";
import ManagerResourceSharing from "../pages/manager/ManagerResourceSharing";
import ManagerReports from "../pages/manager/Reports";
import ManagerBookingRequests from "../pages/manager/BookingRequests";

// Institution Administrator Module Pages
import InstitutionDashboard from "../pages/institution/Dashboard";
import InstitutionDepartments from "../pages/institution/Departments";
import InstitutionAnalytics from "../pages/institution/Analytics";
import InstitutionReports from "../pages/institution/Reports";

// System Administrator Module Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRoles from "../pages/admin/Roles";
import AdminSettings from "../pages/admin/Settings";
import AdminLogs from "../pages/admin/Logs";
import AdminEquipment from "../pages/AdminEquipment";
import AdminBookings from "../pages/AdminBookings";
import AdminReports from "../pages/AdminReports";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "";
  const normalizedRole = role.toUpperCase().replace(/[\s_]+/g, "");

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Authenticated Dashboard Shell Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Main dashboard redirect to role-specific dashboard */}
          <Route
            path="/dashboard"
            element={
              normalizedRole === "LABTECHNICIAN" || normalizedRole === "TECHNICIAN" ? (
                <Navigate to="/technician/dashboard" replace />
              ) : normalizedRole === "LABMANAGER" || normalizedRole === "MANAGER" ? (
                <Navigate to="/manager/dashboard" replace />
              ) : normalizedRole === "INSTITUTIONADMINISTRATOR" || normalizedRole === "INSTITUTIONADMIN" || normalizedRole === "DEPARTMENTHEAD" ? (
                <Navigate to="/institution/dashboard" replace />
              ) : normalizedRole === "SYSTEMADMINISTRATOR" || normalizedRole === "SYSTEMADMIN" || normalizedRole === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            }
          />

          {/* SHARED AUTHENTICATED ROUTES (Accessible to all logged-in roles) */}
          <Route path="/equipment" element={<StudentEquipment />} />
          <Route path="/equipment/:id" element={<StudentEquipmentDetails />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/equipment-module" element={<EquipmentModule />} />
          <Route path="/under-development" element={<UnderDevelopment />} />
          <Route path="/calibration" element={<UnderDevelopment />} />
          <Route path="/laboratory" element={<Laboratories />} />
          <Route path="/laboratories" element={<Laboratories />} />
          <Route path="/student/laboratories" element={<Laboratories />} />

          {/* Case-insensitive and common path aliases */}
          <Route path="/Equipment" element={<StudentEquipment />} />
          <Route path="/Equipment/:id" element={<StudentEquipmentDetails />} />
          <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/Profile" element={<StudentProfile />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Bookings" element={<Booking />} />
          <Route path="/Maintenance" element={<TechnicianMaintenance />} />
          <Route path="/Reports" element={<ManagerReports />} />
          <Route path="/Users" element={<AdminUsers />} />
          <Route path="/Roles" element={<AdminRoles />} />
          <Route path="/Settings" element={<AdminSettings />} />
          <Route path="/Logs" element={<AdminLogs />} />

          {/* 1. STUDENT MODULE ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Student", "STUDENT"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/equipment" element={<StudentEquipment />} />
            <Route path="/student/equipment/:id" element={<StudentEquipmentDetails />} />
            <Route path="/student/book/:id" element={<BookEquipment />} />
            <Route path="/student/laboratories"element={<Laboratories />}/>
            <Route path="/student/bookings" element={<StudentMyBookings />} />
            <Route path="/student/history" element={<StudentBookingHistory />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>

          {/* 2. LAB TECHNICIAN MODULE ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Lab Technician", "Technician", "LAB_TECHNICIAN"]} />}>
            <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
            <Route path="/technician/equipment" element={<TechnicianEquipmentManagement />} />
            <Route path="/technician/equipment/add" element={<AddEquipment />} />
            <Route path="/technician/equipment/edit/:id" element={<EditEquipment />} />
            <Route path="/technician/maintenance" element={<TechnicianMaintenance />} />
            <Route path="/technician/bookings/approve" element={<TechnicianBookingApproval />} />
            <Route path="/technician/equipment/return" element={<TechnicianReturnEquipment />} />
            <Route path="/technician/reports" element={<TechnicianReports />} />
            <Route path="/technician/profile" element={<StudentProfile />} />
          </Route>

          {/* 3. LAB MANAGER MODULE ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Lab Manager", "Manager", "LAB_MANAGER"]} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/booking-requests" element={<ManagerBookingRequests />} />
            <Route path="/manager/bookings" element={<ManagerBookingRequests />} />
            <Route
                path="/manager/utilization"
                element={<UtilizationDashboard />}
            />
            <Route path="/manager/waitlist" element={<ManagerWaitlistManagement />} />
            <Route path="/manager/inventory-analytics" element={<ManagerInventoryAnalytics />} />
            <Route path="/manager/booking-analytics" element={<ManagerBookingAnalytics />} />
            <Route path="/manager/resource-sharing" element={<ManagerResourceSharing />} />
            <Route path="/manager/reports" element={<ManagerReports />} />
            <Route path="/manager/equipment" element={<TechnicianEquipmentManagement />} />
            <Route path="/manager/profile" element={<StudentProfile />} />
          </Route>

          {/* 4. INSTITUTION ADMIN MODULE ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Institution Administrator", "Institution Admin", "INSTITUTION_ADMINISTRATOR", "INSTITUTION_ADMIN", "Department Head", "DEPARTMENT_HEAD"]} />}>
            <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
            <Route path="/institution/departments" element={<InstitutionDepartments />} />
            <Route path="/institution/analytics" element={<InstitutionAnalytics />} />
            <Route path="/institution/reports" element={<InstitutionReports />} />
            <Route path="/institution/equipment" element={<StudentEquipment />} />
            <Route path="/institution/profile" element={<StudentProfile />} />
          </Route>

          {/* 5. SYSTEM ADMIN MODULE ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["System Admin", "Admin", "System Administrator", "SYSTEM_ADMINISTRATOR", "ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            <Route path="/admin/equipment" element={<AdminEquipment />} />
            <Route path="/admin/inventory" element={<AdminEquipment />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/profile" element={<StudentProfile />} />
          </Route>

          {/* Shared fallback edit route */}
          <Route path="/equipment/edit/:id" element={<EditEquipment />} />

          {/* Authenticated fallback for unmatched routes: Feature Under Development */}
          <Route path="*" element={<UnderDevelopment />} />
        </Route>
      </Route>

      {/* Global 404 Unauthenticated Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
