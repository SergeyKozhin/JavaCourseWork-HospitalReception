package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.Patient;
import server.domain.Ward;

public interface PatientRepository extends CrudRepository<Patient, Long> {

    long countByWard(Ward ward);

}
