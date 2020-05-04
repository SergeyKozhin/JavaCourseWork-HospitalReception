package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.Ward;

public interface WardRepository extends CrudRepository<Ward, Long> {
}
