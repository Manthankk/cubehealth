package com.example.qubehealth.backend_qube_health.controller;

import com.example.qubehealth.backend_qube_health.dto.MeetingDTO;
import com.example.qubehealth.backend_qube_health.model.Meeting;
import com.example.qubehealth.backend_qube_health.model.Staff;
import com.example.qubehealth.backend_qube_health.model.User;
import com.example.qubehealth.backend_qube_health.repository.MeetingRepository;
import com.example.qubehealth.backend_qube_health.repository.StaffRepository;
import com.example.qubehealth.backend_qube_health.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "http://localhost:5173")
public class MeetingController {

    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addMeeting(@Valid @RequestBody MeetingDTO request, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        Optional<Staff> staffOpt = staffRepository.findById(request.getDoctorId());
        Optional<User> userOpt = userRepository.findById(request.getPatientId());
        if (staffOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid staff or user ID");
        }
        // Double booking check
        if (meetingRepository
                .findByDoctorIdAndAppointmentDateTime(request.getDoctorId(), request.getAppointmentDateTime())
                .isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Staff already has a meeting at this time");
        }
        Meeting meeting = new Meeting();
        meeting.setDoctor(staffOpt.get());
        meeting.setPatient(userOpt.get());
        meeting.setAppointmentDateTime(request.getAppointmentDateTime());
        meeting = meetingRepository.save(meeting);
        // Convert to DTO for response
        MeetingDTO responseDto = new MeetingDTO();
        responseDto.setId(meeting.getId());
        responseDto.setDoctorId(meeting.getDoctor().getId());
        responseDto.setPatientId(meeting.getPatient().getId());
        responseDto.setAppointmentDateTime(meeting.getAppointmentDateTime());
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping
    public List<MeetingDTO> getAllMeetings() {
        List<Meeting> meetings = meetingRepository.findAll();
        return meetings.stream().map(m -> {
            MeetingDTO dto = new MeetingDTO();
            dto.setId(m.getId());
            dto.setDoctorId(m.getDoctor().getId());
            dto.setPatientId(m.getPatient().getId());
            dto.setAppointmentDateTime(m.getAppointmentDateTime());
            return dto;
        }).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingDTO> getMeetingById(@PathVariable Long id) {
        return meetingRepository.findById(id)
                .map(m -> {
                    MeetingDTO dto = new MeetingDTO();
                    dto.setId(m.getId());
                    dto.setDoctorId(m.getDoctor().getId());
                    dto.setPatientId(m.getPatient().getId());
                    dto.setAppointmentDateTime(m.getAppointmentDateTime());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeeting(@PathVariable Long id) {
        if (!meetingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        meetingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeeting(
            @PathVariable Long id,
            @Valid @RequestBody MeetingDTO request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        Optional<Meeting> meetingOpt = meetingRepository.findById(id);
        if (meetingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Staff> staffOpt = staffRepository.findById(request.getDoctorId());
        Optional<User> userOpt = userRepository.findById(request.getPatientId());
        if (staffOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid staff or user ID");
        }
        // Double booking check (exclude current meeting)
        if (meetingRepository
                .findByDoctorIdAndAppointmentDateTime(request.getDoctorId(), request.getAppointmentDateTime())
                .filter(m -> !m.getId().equals(id))
                .isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Staff already has a meeting at this time");
        }
        Meeting meeting = meetingOpt.get();
        meeting.setDoctor(staffOpt.get());
        meeting.setPatient(userOpt.get());
        meeting.setAppointmentDateTime(request.getAppointmentDateTime());
        meeting = meetingRepository.save(meeting);
        MeetingDTO responseDto = new MeetingDTO();
        responseDto.setId(meeting.getId());
        responseDto.setDoctorId(meeting.getDoctor().getId());
        responseDto.setPatientId(meeting.getPatient().getId());
        responseDto.setAppointmentDateTime(meeting.getAppointmentDateTime());
        return ResponseEntity.ok(responseDto);
    }
}
