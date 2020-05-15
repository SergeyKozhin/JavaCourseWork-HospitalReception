package server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import server.security.jwt.JwtSecurityConfigurer;
import server.security.jwt.JwtTokenProvider;

@Configuration
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public SpringSecurityConfiguration(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic().disable()
                .csrf().disable()
                .formLogin().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/auth/login").permitAll()
                .antMatchers(HttpMethod.GET, "/api/diagnosis/**", "/api/wards/**", "/api/patients/**").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.POST, "/api/patients/").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.PUT, "/api/patients/{id}").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.DELETE, "/api/patients/{id}").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.POST, "/api/diagnosis/**", "/api/wards/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/diagnosis/{id}", "/api/wards/{id}").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/diagnosis/{id}", "/api/wards/{id}").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .apply(new JwtSecurityConfigurer(jwtTokenProvider));
    }
}
