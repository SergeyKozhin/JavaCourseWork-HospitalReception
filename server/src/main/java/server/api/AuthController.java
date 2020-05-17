package server.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import server.domain.AuthRequest;
import server.security.AccountService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountService accountService;

    @Autowired
    public AuthController(AccountService accountService) {
        this.accountService = accountService;

    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody @Valid AuthRequest request, HttpServletResponse response) {
        return accountService.loginUser(request.getUsername(), request.getPassword(), response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        return accountService.refreshToken(refreshToken).map(newToken ->
                ResponseEntity.ok(Map.of("jwtToken", newToken))).orElse(
                new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED)
        );
    }

    @DeleteMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(name = "refreshToken") String refreshToken) {
        accountService.logoutUser(refreshToken);
    }
}
