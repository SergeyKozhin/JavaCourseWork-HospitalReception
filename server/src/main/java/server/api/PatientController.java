package server.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import server.data.PatientRepository;
import server.data.PatientSpecification;
import server.data.WardRepository;
import server.domain.Patient;
import server.domain.Ward;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/patients", produces = "application/json")
@CrossOrigin("*")
public class PatientController {
    private final PatientRepository patientRepo;
    private final WardRepository wardRepo;

    @Autowired
    public PatientController(PatientRepository patientRepo, WardRepository wardRepo) {
        this.patientRepo = patientRepo;
        this.wardRepo = wardRepo;
    }

    @GetMapping("/page")
    public Page<Patient> patientsPage(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") List<Long> diagnosis,
            @RequestParam(required = false, defaultValue = "") List<Long> ward,
            @PageableDefault Pageable pageable) {
        PatientSpecification specification = new PatientSpecification(name, diagnosis, ward);

        return patientRepo.findAll(specification, pageable);
    }

    @GetMapping
    public Iterable<Patient> allPatients(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") List<Long> diagnosis,
            @RequestParam(required = false, defaultValue = "") List<Long> ward
    ) {
        PatientSpecification specification = new PatientSpecification(name, diagnosis, ward);

        return patientRepo.findAll(specification);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable long id) {
        return patientRepo.findById(id).map(patient ->
                new ResponseEntity<>(patient, HttpStatus.OK)).orElse(
                new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/{id}", consumes = "application/json")
    public void updatePatient(@PathVariable long id, @Valid @RequestBody Patient patient) {
        if (patient.getId() != id) {
            throw new IllegalStateException("Given patient id doesn't match the id in the path.");
        }

        Ward ward = wardRepo.findById(patient.getWard().getId()).orElseThrow(() ->
                new IllegalStateException("No such ward."));

        if (patient.getWard().getId() != ward.getId() && ward.getPatientCount() == ward.getMaxCount()) {
            throw new IllegalStateException("Provided patients ward is fully filled.");
        }

        patientRepo.save(patient);
    }

    @PostMapping(consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Patient createPatient(@RequestBody Patient patient) {
        Ward ward = wardRepo.findById(patient.getWard().getId()).orElseThrow(() ->
                new IllegalStateException("No such ward."));

        if (ward.getPatientCount() == ward.getMaxCount()) {
            throw new IllegalStateException("Provided patients ward is fully filled.");
        }

        return patientRepo.save(patient);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePatient(@Valid @PathVariable long id) {
        try {
            patientRepo.deleteById(id);
        } catch (EmptyResultDataAccessException ignored) {
        }
    }
}
