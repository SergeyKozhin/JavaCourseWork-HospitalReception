package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.Diagnosis;

public interface DiagnosisRepository extends CrudRepository<Diagnosis, Long> {
}
