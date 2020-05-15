package server.data;

import org.springframework.data.repository.CrudRepository;
import server.domain.RefreshToken;
import server.domain.User;

import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
}
