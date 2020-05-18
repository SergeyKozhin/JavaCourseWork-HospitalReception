package server.domain;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@RequiredArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private final String username;

    @NotBlank(message = "Password is required")
    private final String password;

    @NotBlank(message = "Role is required")
    private final String role;
}
