package server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import server.data.DiagnosisRepository;
import server.data.PatientRepository;
import server.data.UserRepository;
import server.data.WardRepository;
import server.domain.Diagnosis;
import server.domain.Patient;
import server.domain.User;
import server.domain.Ward;

import java.util.List;

@Configuration
@Profile("!prod")
public class DevelopmentConfig {

    @Bean
    public CommandLineRunner dataLoader(DiagnosisRepository diagnosisRepo,
                                        WardRepository wardRepo,
                                        PatientRepository patientRepo,
                                        UserRepository userRepo,
                                        PasswordEncoder passwordEncoder) {
        return args -> {
            patientRepo.deleteAll();
            diagnosisRepo.deleteAll();
            wardRepo.deleteAll();
            userRepo.deleteAll();

            final int n = 100;

            Diagnosis[] diagnoses = new Diagnosis[n];
            Ward[] wards = new Ward[n];
            Patient[] patients = new Patient[n];

            for (int i = 0; i < n; i++) {
                diagnoses[i] = new Diagnosis("Diagnosis" + i);
                diagnosisRepo.save(diagnoses[i]);
            }

            for (int i = 0; i < n; i++) {
                wards[i] = new Ward("Ward" + i, 50);
                wardRepo.save(wards[i]);
            }

            for (int i = 0; i < n; i++) {
                patients[i] = new Patient("Patient", Integer.toString(i), "", diagnoses[i], wards[i]);
                patientRepo.save(patients[i]);
            }


            userRepo.save(new User("user", passwordEncoder.encode("password"), List.of("ROLE_USER")));
            userRepo.save(new User("admin", passwordEncoder.encode("adminpass"), List.of("ROLE_ADMIN")));
        };
    }
}
