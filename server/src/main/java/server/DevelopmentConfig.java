package server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import server.data.DiagnosisRepository;
import server.data.PatientRepository;
import server.data.WardRepository;
import server.domain.Diagnosis;
import server.domain.Patient;
import server.domain.Ward;

@Configuration
@Profile("!prod")
public class DevelopmentConfig {

    @Bean
    public CommandLineRunner dataLoader(DiagnosisRepository diagnosisRepo,
                                        WardRepository wardRepo, PatientRepository patientRepo) {
        return args -> {
            patientRepo.deleteAll();
            diagnosisRepo.deleteAll();
            wardRepo.deleteAll();

            Diagnosis covid = new Diagnosis();
            covid.setName("Covid-19");

            Diagnosis flue = new Diagnosis();
            flue.setName("Flue");

            Diagnosis dementia = new Diagnosis();
            dementia.setName("Dementia");

            diagnosisRepo.save(covid);
            diagnosisRepo.save(flue);
            diagnosisRepo.save(dementia);

            Ward virusWard = new Ward();
            virusWard.setName("Virus Infection Ward");
            virusWard.setMaxCount(50);

            Ward psychologyWard = new Ward();
            psychologyWard.setName("Psychological Ward");
            psychologyWard.setMaxCount(20);

            wardRepo.save(virusWard);
            wardRepo.save(psychologyWard);

            Patient john = new Patient();
            john.setFirstName("John");
            john.setLastName("Smith");
            john.setDiagnosis(covid);
            john.setWard(virusWard);

            Patient tom = new Patient();
            tom.setFirstName("Tom");
            tom.setLastName("Williams");
            tom.setDiagnosis(flue);
            tom.setWard(virusWard);

            Patient sarah = new Patient();
            sarah.setFirstName("Sarah");
            sarah.setLastName("Connor");
            sarah.setDiagnosis(dementia);
            sarah.setWard(psychologyWard);

            patientRepo.save(john);
            patientRepo.save(tom);
            patientRepo.save(sarah);

        };
    }
}
