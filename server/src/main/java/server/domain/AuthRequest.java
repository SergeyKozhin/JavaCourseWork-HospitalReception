package server.domain;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

@Data
@RequiredArgsConstructor
public class AuthRequest implements Serializable {
    private final String username;
    private final String password;
}
