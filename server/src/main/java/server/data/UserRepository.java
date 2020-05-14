package server.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import server.domain.User;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findUserByUsername(String username);
}
