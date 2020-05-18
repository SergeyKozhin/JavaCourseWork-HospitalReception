package server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
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
                .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()
                .formLogin().disable()
                .cors()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/auth/register/**").hasRole("ADMIN")
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/diagnosis/**", "/api/wards/**", "/api/patients/**").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.POST, "/api/patients/").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.PUT, "/api/patients/{id}").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.DELETE, "/api/patients/{id}").hasAnyRole("ADMIN", "USER")
                .antMatchers(HttpMethod.POST, "/api/diagnosis/**", "/api/wards/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/diagnosis/{id}", "/api/wards/{id}").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/diagnosis/{id}", "/api/wards/{id}").hasRole("ADMIN")
                .anyRequest().permitAll()
                .and()
                .addFilterBefore(new CORSFilter(), ChannelProcessingFilter.class)
                .apply(new JwtSecurityConfigurer(jwtTokenProvider));
    }
}
