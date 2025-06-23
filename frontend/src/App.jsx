import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Doctors from "./components/doctor/Doctors";
import Appointments from "./components/appointments/Appointments";
import Patients from "./components/patients/Patients";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CssBaseline />
      <Router>
        {/* Full width Navbar with background and padding */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "primary.main",
            color: "white",
            boxShadow: 2,
            mb: 3,
            px: { xs: 0, md: 0 },
          }}
        >
          <Navbar />
        </Box>

        {/* Main content with padding and soft background */}
        <Box
          sx={{
            minHeight: "80vh",
            bgcolor: "#f7f9fb",
            py: { xs: 2, md: 4 },
            px: { xs: 1, md: 0 },
          }}
        >
          <Container maxWidth="md" sx={{ py: 2 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/patients" />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
            </Routes>
          </Container>
        </Box>

        {/* Full width Footer with background and padding */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "primary.main",
            color: "white",
            boxShadow: 2,
            mt: 3,
            px: { xs: 0, md: 0 },
          }}
        >
          <Footer />
        </Box>
      </Router>
    </>
  );
}

export default App;
