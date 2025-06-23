import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../api";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const searchTimeout = useRef();

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPatients();
      setUsers(res.data || []);
      setError("");
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const openUserDialog = (user = null) => {
    setForm(user || defaultForm);
    setEditingId(user ? user.id : null);
    setDialogOpen(true);
  };

  const closeUserDialog = () => {
    setDialogOpen(false);
    setForm(defaultForm);
    setEditingId(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow up to 10 digits for phone number
      if (!/^\d{0,10}$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || form.phone.length !== 10)
      return;

    try {
      if (editingId) {
        await updatePatient(editingId, form);
      } else {
        await createPatient(form);
      }
      await getUsers();
      closeUserDialog();
    } catch {
      setError("Failed to save user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      await getUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase?.() || "";
      const valB = b[sortBy]?.toLowerCase?.() || "";
      if (sortDir === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openUserDialog()}
        >
          Add User
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search users..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && filteredUsers.length === 0 && (
        <Alert severity="info">No users found.</Alert>
      )}

      {!loading && filteredUsers.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => toggleSort("name")}
                  sx={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openUserDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={closeUserDialog}>
        <DialogTitle>{editingId ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={saveUser}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
            <TextField
              fullWidth
              margin="dense"
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              inputProps={{
                inputMode: "numeric",
                pattern: "\\d{10}",
                maxLength: 10,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeUserDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users;
