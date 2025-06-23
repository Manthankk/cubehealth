import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        bgcolor: "#5bb454",
        color: "white",
        boxShadow: 2,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          MediConnect by Manthan
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to="/patients"
            sx={{
              color: location.pathname === "/patients" ? "#5bb454" : "white",
              bgcolor:
                location.pathname === "/patients" ? "white" : "transparent",
              fontWeight: location.pathname === "/patients" ? 700 : 400,
              borderRadius: 2,
              px: 2,
              "&:hover": {
                bgcolor:
                  location.pathname === "/patients"
                    ? "white"
                    : "rgba(255,255,255,0.08)",
              },
            }}
            variant={location.pathname === "/patients" ? "contained" : "text"}
          >
            Patients
          </Button>
          <Button
            component={Link}
            to="/doctors"
            sx={{
              color: location.pathname === "/doctors" ? "#5bb454" : "white",
              bgcolor:
                location.pathname === "/doctors" ? "white" : "transparent",
              fontWeight: location.pathname === "/doctors" ? 700 : 400,
              borderRadius: 2,
              px: 2,
              "&:hover": {
                bgcolor:
                  location.pathname === "/doctors"
                    ? "white"
                    : "rgba(255,255,255,0.08)",
              },
            }}
            variant={location.pathname === "/doctors" ? "contained" : "text"}
          >
            Doctors
          </Button>
          <Button
            component={Link}
            to="/appointments"
            sx={{
              color:
                location.pathname === "/appointments" ? "#5bb454" : "white",
              bgcolor:
                location.pathname === "/appointments" ? "white" : "transparent",
              fontWeight: location.pathname === "/appointments" ? 700 : 400,
              borderRadius: 2,
              px: 2,
              "&:hover": {
                bgcolor:
                  location.pathname === "/appointments"
                    ? "white"
                    : "rgba(255,255,255,0.08)",
              },
            }}
            variant={
              location.pathname === "/appointments" ? "contained" : "text"
            }
          >
            Appointments
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
