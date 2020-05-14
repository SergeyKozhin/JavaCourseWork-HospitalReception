package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.Diagnosis;
import server.domain.Ward;

public interface WardRepository extends CrudRepository<Ward, Long> {
    Iterable<Ward> findAllByNameContainsOrderByNameAsc(String name);
}
