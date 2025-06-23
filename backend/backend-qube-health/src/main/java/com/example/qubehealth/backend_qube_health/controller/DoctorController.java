package com.example.qubehealth.backend_qube_health.controller;

import com.example.qubehealth.backend_qube_health.dto.DoctorDTO;
import com.example.qubehealth.backend_qube_health.model.Doctor;
import com.example.qubehealth.backend_qube_health.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffController {

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<?> addStaff(@Valid @RequestBody DoctorDTO doctorDTO, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        Doctor doctor = new Doctor();
        BeanUtils.copyProperties(doctorDTO, doctor);
        doctor = doctorRepository.save(doctor);
        doctorDTO.setId(doctor.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorDTO);
    }

    @GetMapping
    public List<DoctorDTO> getAllStaff() {
        return doctorRepository.findAll().stream().map(doc -> {
            DoctorDTO dto = new DoctorDTO();
            BeanUtils.copyProperties(doc, dto);
            return dto;
        }).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getStaffById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(doc -> {
                    DoctorDTO dto = new DoctorDTO();
                    BeanUtils.copyProperties(doc, dto);
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @Valid @RequestBody DoctorDTO updatedDoctorDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        return doctorRepository.findById(id).map(doc -> {
            doc.setName(updatedDoctorDTO.getName());
            doc.setSpecialization(updatedDoctorDTO.getSpecialization());
            doc.setEmail(updatedDoctorDTO.getEmail());
            doctorRepository.save(doc);
            BeanUtils.copyProperties(doc, updatedDoctorDTO);
            return ResponseEntity.ok(updatedDoctorDTO);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
