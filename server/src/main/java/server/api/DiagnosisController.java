package server.api;

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
import server.data.DiagnosisRepository;
import server.domain.Diagnosis;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/api/diagnosis", produces = "application/json")
@CrossOrigin("*")
public class DiagnosisController {
    private final DiagnosisRepository diagnosisRepo;

    @Autowired
    public DiagnosisController(DiagnosisRepository diagnosisRepo) {
        this.diagnosisRepo = diagnosisRepo;
    }

    @GetMapping
    public Iterable<Diagnosis> allDiagnosis() {
        return diagnosisRepo.findAllByOrderByNameAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diagnosis> getDiagnosisById(@PathVariable long id) {
        return diagnosisRepo.findById(id).map(diagnosis ->
                new ResponseEntity<>(diagnosis, HttpStatus.OK)).orElse(
                new ResponseEntity<>(null, HttpStatus.NOT_FOUND)
        );
    }

    @PutMapping(path = "/{id}", consumes = "application/json")
    public void updateDiagnosis(@PathVariable long id, @Valid @RequestBody Diagnosis diagnosis) {
        if (diagnosis.getId() != id) {
            throw new IllegalStateException("Given diagnosis id doesn't match the id in the path.");
        }

        diagnosisRepo.save(diagnosis);
    }

    @PostMapping(consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Diagnosis createDiagnosis(@Valid @RequestBody Diagnosis diagnosis) {
        return diagnosisRepo.save(diagnosis);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable long id) {
        try {
            diagnosisRepo.deleteById(id);
        } catch (EmptyResultDataAccessException ignored) {
        }
    }
}
