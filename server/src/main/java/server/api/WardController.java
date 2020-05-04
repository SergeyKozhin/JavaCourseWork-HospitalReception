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
import server.data.WardRepository;
import server.domain.Ward;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/api/wards", produces = "application/json")
@CrossOrigin("*")
public class WardController {
    private final WardRepository wardRepo;

    @Autowired
    public WardController(WardRepository wardRepo) {
        this.wardRepo = wardRepo;
    }

    @GetMapping
    public Iterable<Ward> allWards() {
        return wardRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ward> getWardById(@PathVariable long id) {
        return wardRepo.findById(id).map(ward ->
                new ResponseEntity<>(ward, HttpStatus.OK)).orElse(
                new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/{id}", consumes = "application/json")
    public void updateWard(@PathVariable long id, @Valid @RequestBody Ward ward) {
        if (ward.getId() != id) {
            throw new InvalidRequestStateException("Given ward id doesn't match the id in the path.");
        }

        wardRepo.save(ward);
    }

    @PostMapping(consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Ward createWard(@Valid @RequestBody Ward ward) {
        return wardRepo.save(ward);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWard(@PathVariable long id) {
        try {
            wardRepo.deleteById(id);
        } catch (EmptyResultDataAccessException ignored) {
        }
    }
}
