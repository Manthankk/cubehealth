package com.example.qubehealth.backend_qube_health.dto;

import lombok.Data;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class MeetingDTO {
    private Long id;
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment date and time must be in the future")
    private LocalDateTime appointmentDateTime;
}