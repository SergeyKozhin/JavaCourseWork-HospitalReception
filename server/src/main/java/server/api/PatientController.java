package server.api;

import com.sun.jdi.request.InvalidRequestStateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import server.data.PatientRepository;
import server.domain.Patient;

@RestController
@RequestMapping(path = "/api/patients", produces = "application/json")
@CrossOrigin("*")
public class PatientController {
    private final PatientRepository patientRepo;

    @Autowired
    public PatientController(PatientRepository patientRepo) {
        this.patientRepo = patientRepo;
    }

    @GetMapping
    public Iterable<Patient> allPatients() {
        return patientRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientBuId(@PathVariable long id) {
        return patientRepo.findById(id).map(patient ->
                new ResponseEntity<>(patient, HttpStatus.OK)).orElse(
                new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/{id}", consumes = "application/json")
    public void updatePatient(@PathVariable long id, @RequestBody Patient patient) {
        if (patient.getId() != id) {
            throw new InvalidRequestStateException("Given patient id doesn't match the id in the path.");
        }

        patientRepo.save(patient);
    }

    @PostMapping(consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepo.save(patient);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePatient(@PathVariable long id) {
        try {
            patientRepo.deleteById(id);
        } catch (EmptyResultDataAccessException ignored) {
        }
    }
}
