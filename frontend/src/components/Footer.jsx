import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      width: "100%",
      bgcolor: "#484c54", // Calmer healthcare-friendly blue-gray
      color: "white",
      py: 3,
      mt: "auto",
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="body2" align="center">
        &copy; {new Date().getFullYear()} <strong>MediConnect</strong>. All
        rights reserved.
      </Typography>
      <Typography variant="caption" align="center" display="block" mt={1}>
        Created by <strong>Mihir Kate</strong>
      </Typography>
    </Container>
  </Box>
);

export default Footer;
