import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Alert,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctors,
  getPatients,
} from "../../api";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const defaultForm = {
  doctorId: "",
  patientId: "",
  date: "",
  time: "",
};

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [tableView, setTableView] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("asc");
  const [editingId, setEditingId] = useState(null);

  const getMeetings = useCallback(async () => {
    try {
      const res = await getAppointments();
      setMeetings(res.data || []);
    } catch (err) {
      setError("Failed to fetch meetings");
    }
  }, []);

  useEffect(() => {
    getMeetings();
    getDoctors()
      .then((res) => setStaff(res.data))
      .catch(() => setError("Failed to fetch doctors"));
    getPatients()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to fetch patients"));
  }, [getMeetings]);

  const events = useMemo(
    () =>
      meetings.map((a) => ({
        id: a.id,
        title: `Patient ${a.patientId} with Doctor ${a.doctorId}`,
        start: new Date(a.appointmentDateTime),
        end: new Date(new Date(a.appointmentDateTime).getTime() + 30 * 60000), // 30 min slot
        resource: a,
      })),
    [meetings]
  );

  const openMeetingDialog = (slotInfo) => {
    setForm(defaultForm);
    setEditingId(null);
    setOpen(true);
  };

  const closeMeetingDialog = () => {
    setOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const saveMeeting = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.doctorId || !form.patientId) return;
    try {
      if (editingId) {
        await updateAppointment(editingId, {
          doctorId: Number(form.doctorId),
          patientId: Number(form.patientId),
          appointmentDateTime: `${form.date}T${form.time}:00`,
        });
      } else {
        const res = await createAppointment({
          doctorId: Number(form.doctorId),
          patientId: Number(form.patientId),
          appointmentDateTime: `${form.date}T${form.time}:00`,
        });
      }
      await getMeetings();
      closeMeetingDialog();
    } catch {
      setError("Failed to save meeting");
    }
  };

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    setMeetings((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    const dt = new Date(appointment.appointmentDateTime);
    setForm({
      doctorId: appointment.doctorId.toString(),
      patientId: appointment.patientId.toString(),
      date: format(dt, "yyyy-MM-dd"),
      time: format(dt, "HH:mm"),
    });
    setOpen(true);
  };

  const sortedMeetings = [...meetings].sort((a, b) => {
    let valA, valB;
    if (sortBy === "patientId") {
      valA = a.patientId;
      valB = b.patientId;
    } else if (sortBy === "doctorId") {
      valA = a.doctorId;
      valB = b.doctorId;
    } else {
      // date
      valA = a.appointmentDateTime;
      valB = b.appointmentDateTime;
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const renderTable = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Meetings Table
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ fontWeight: 600, mb: 2, alignItems: "center" }}
      >
        <Grid item xs={3}>
          <FormControl size="small" fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="patientId">Patient ID</MenuItem>
              <MenuItem value="doctorId">Doctor ID</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant={sortDir === "asc" ? "contained" : "outlined"}
            size="small"
            sx={{ mr: 1, minWidth: 60 }}
            onClick={() => setSortDir("asc")}
          >
            Asc
          </Button>
          <Button
            variant={sortDir === "desc" ? "contained" : "outlined"}
            size="small"
            sx={{ minWidth: 60 }}
            onClick={() => setSortDir("desc")}
          >
            Desc
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ fontWeight: 600, mb: 1 }}>
        <Grid item xs={3}>
          Patient ID
        </Grid>
        <Grid item xs={3}>
          Doctor ID
        </Grid>
        <Grid item xs={2}>
          Date
        </Grid>
        <Grid item xs={2}>
          Time
        </Grid>
        <Grid item xs={2}>
          Actions
        </Grid>
      </Grid>
      {sortedMeetings.map((a) => (
        <Grid container spacing={1} key={a.id} alignItems="center">
          <Grid item xs={3}>
            {a.patientId}
          </Grid>
          <Grid item xs={3}>
            {a.doctorId}
          </Grid>
          <Grid item xs={2}>
            {format(new Date(a.appointmentDateTime), "yyyy-MM-dd")}
          </Grid>
          <Grid item xs={2}>
            {format(new Date(a.appointmentDateTime), "HH:mm")}
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(a)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => handleDelete(a.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ))}
    </Paper>
  );

  return (
    <div>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setTableView((v) => !v)}
      >
        {tableView ? "Calendar View" : "Table View"}
      </Button>
      <Button
        variant="contained"
        sx={{ mb: 2, ml: 2 }}
        onClick={() => {
          setEditingId(null);
          setOpen(true);
        }}
      >
        Add Meeting
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {tableView ? (
        renderTable()
      ) : (
        <Paper sx={{ p: 2 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={openMeetingDialog}
            popup
            views={["month", "week", "day", "agenda"]}
          />
        </Paper>
      )}
      <Dialog open={open} onClose={closeMeetingDialog}>
        <DialogTitle>
          {editingId ? "Edit Meeting" : "Add Meeting"}
        </DialogTitle>
        <form onSubmit={saveMeeting}>
          <DialogContent sx={{ minWidth: 350 }}>
            <TextField
              select
              label="Doctor"
              name="doctorId"
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              fullWidth
              margin="normal"
              required
            >
              {staff.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Patient"
              name="patientId"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              fullWidth
              margin="normal"
              required
            >
              {users.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            {error && <Alert severity="error">{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeMeetingDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Meetings;
