package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.Patient;

public interface PatientRepository extends CrudRepository<Patient, Long> {
}
