import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
  Card,
  CardContent,
  Divider,
  useTheme
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import api from "../../services/api";
import {
  createRequest,
  getRequests,
  approve,
  reject,
  complete
} from "../../services/resourceSharingService";

const FALLBACK_EQUIPMENT = [
  "High-Frequency Oscilloscope",
  "Ultrafast Spectrophotometer",
  "DNA Sequencer NextGen",
  "Universal Tensile Tester",
  "Gas Chromatograph MS",
  "Helium Leak Detector",
  "High-Vac Sputter System"
];

const FALLBACK_REQUESTS = [
  {
    id: "req-101",
    equipment: "High-Frequency Oscilloscope",
    fromInstitution: "Metropolitan Tech University",
    toInstitution: "AI & ML Department",
    quantity: 1,
    remarks: "Needed for postgraduate research project validation.",
    status: "Pending"
  },
  {
    id: "req-102",
    equipment: "DNA Sequencer NextGen",
    fromInstitution: "State Science & Research Center",
    toInstitution: "Biology Research Lab",
    quantity: 2,
    remarks: "Required for genome sequence mapping trial.",
    status: "Approved"
  },
  {
    id: "req-103",
    equipment: "Gas Chromatograph MS",
    fromInstitution: "National Institute of Physics",
    toInstitution: "Applied Chemistry Lab",
    quantity: 1,
    remarks: "Calibration verification completed.",
    status: "Complete"
  }
];

export default function ManagerResourceSharing() {
  const theme = useTheme();
  const [requests, setRequests] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    equipment: "",
    fromInstitution: "",
    toInstitution: "",
    quantity: 1,
    remarks: ""
  });

  const loadEquipment = async () => {
    try {
      const res = await api.get("/equipment");
      const list = res.data || [];
      const names = list.map(e => e.name).filter(Boolean);
      if (names.length > 0) {
        setEquipmentOptions([...new Set(names)]);
      } else {
        setEquipmentOptions(FALLBACK_EQUIPMENT);
      }
    } catch (err) {
      setEquipmentOptions(FALLBACK_EQUIPMENT);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getRequests();
      if (res && res.data) {
        setRequests(res.data);
      } else {
        setRequests(FALLBACK_REQUESTS);
      }
    } catch (err) {
      console.warn("API getRequests failed. Displaying local simulated data.");
      setErrorMsg("Failed to connect to the backend server. Running in local simulation mode.");
      setRequests(prev => prev.length > 0 ? prev : FALLBACK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
    loadRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.equipment || !formData.fromInstitution || !formData.toInstitution || formData.quantity <= 0) {
      setErrorMsg("Please fill out all required fields with positive quantity values.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const payload = {
        equipment: formData.equipment,
        fromInstitution: formData.fromInstitution,
        toInstitution: formData.toInstitution,
        quantity: parseInt(formData.quantity),
        remarks: formData.remarks,
        status: "Pending"
      };

      await createRequest(payload);
      setSuccessMsg("Resource sharing request created successfully.");
      setSnackbarOpen(true);
      
      setFormData({
        equipment: "",
        fromInstitution: "",
        toInstitution: "",
        quantity: 1,
        remarks: ""
      });
      await loadRequests();
    } catch (err) {
      console.warn("API createRequest failed. Running local add fallback.");
      const localNewRequest = {
        id: `req-${Math.floor(Math.random() * 900) + 100}`,
        equipment: formData.equipment,
        fromInstitution: formData.fromInstitution,
        toInstitution: formData.toInstitution,
        quantity: parseInt(formData.quantity),
        remarks: formData.remarks,
        status: "Pending"
      };
      setRequests((prev) => [localNewRequest, ...prev]);
      setSuccessMsg("Simulated request added to local table (Offline Mode).");
      setSnackbarOpen(true);
      setFormData({
        equipment: "",
        fromInstitution: "",
        toInstitution: "",
        quantity: 1,
        remarks: ""
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approve(id);
      setSuccessMsg(`Request ${id} approved.`);
      setSnackbarOpen(true);
      await loadRequests();
    } catch (err) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
      );
      setSuccessMsg("Simulated Approve action completed.");
      setSnackbarOpen(true);
    }
  };

  const handleReject = async (id) => {
    try {
      await reject(id);
      setSuccessMsg(`Request ${id} rejected.`);
      setSnackbarOpen(true);
      await loadRequests();
    } catch (err) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
      );
      setSuccessMsg("Simulated Reject action completed.");
      setSnackbarOpen(true);
    }
  };

  const handleComplete = async (id) => {
    try {
      await complete(id);
      setSuccessMsg(`Request ${id} completed.`);
      setSnackbarOpen(true);
      await loadRequests();
    } catch (err) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Complete" } : r))
      );
      setSuccessMsg("Simulated Complete action completed.");
      setSnackbarOpen(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      case "complete":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ animation: "fadeIn 0.3s ease-in-out", p: 1 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
          Inter-Institution Resource Sharing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Lend and borrow equipment assets between institutions, authorize requests, and manage full transaction cycles.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Request Form */}
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: theme.palette.divider, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
                Request Resource
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  fullWidth
                  select
                  name="equipment"
                  label="Equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  required
                >
                  {equipmentOptions.map((eq) => (
                    <MenuItem key={eq} value={eq}>
                      {eq}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  name="fromInstitution"
                  label="From Institution"
                  value={formData.fromInstitution}
                  onChange={handleInputChange}
                  placeholder="Lending College / Org"
                  required
                />

                <TextField
                  fullWidth
                  name="toInstitution"
                  label="To Institution"
                  value={formData.toInstitution}
                  onChange={handleInputChange}
                  placeholder="Borrowing College / Org"
                  required
                />

                <TextField
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                  required
                />

                <TextField
                  fullWidth
                  name="remarks"
                  label="Remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Agreement terms or purpose of transfer..."
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={<ShareIcon />}
                  sx={{ py: 1.2, fontWeight: 700, borderRadius: 2, textTransform: "none" }}
                >
                  {submitting ? "Requesting..." : "Request Resource"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Requests Workflows Table */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: theme.palette.divider, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
                Inter-Institution Exchange Log
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {loading && requests.length === 0 ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Equipment</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>From</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>To</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.length > 0 ? (
                        requests.map((req, index) => {
                          const statusLower = req.status?.toLowerCase();
                          const isPending = statusLower === "pending";
                          const isApproved = statusLower === "approved";
                          
                          return (
                            <TableRow key={req.id || index} hover>
                              <TableCell sx={{ fontWeight: 650 }}>{req.equipment || req.equipmentName}</TableCell>
                              <TableCell>{req.fromInstitution}</TableCell>
                              <TableCell>{req.toInstitution}</TableCell>
                              <TableCell align="center">{req.quantity}</TableCell>
                              <TableCell>
                                <Chip
                                  label={req.status}
                                  size="small"
                                  color={getStatusColor(req.status)}
                                  sx={{ fontWeight: 700 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                  {isPending && (
                                    <>
                                      <Button
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        onClick={() => handleApprove(req.id)}
                                        startIcon={<CheckIcon />}
                                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        variant="text"
                                        color="error"
                                        size="small"
                                        onClick={() => handleReject(req.id)}
                                        startIcon={<ClearIcon />}
                                        sx={{ textTransform: "none", fontWeight: 600 }}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {isApproved && (
                                    <Button
                                      variant="contained"
                                      color="info"
                                      size="small"
                                      onClick={() => handleComplete(req.id)}
                                      startIcon={<LibraryAddCheckIcon />}
                                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5, color: "#ffffff" }}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  {!isPending && !isApproved && (
                                    <Typography variant="caption" color="text.secondary">
                                      Closed
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                            <Typography color="text.secondary">
                              No active resource sharing transactions.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={successMsg}
      />
    </Box>
  );
}
