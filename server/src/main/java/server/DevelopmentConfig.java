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
//
//            Diagnosis covid = new Diagnosis("Covid-19");
//            Diagnosis flue = new Diagnosis("Flue");
//            Diagnosis dementia = new Diagnosis("Dementia");
//
//            diagnosisRepo.save(covid);
//            diagnosisRepo.save(flue);
//            diagnosisRepo.save(dementia);
//
//            Ward virusWard = new Ward("Virus Infection Ward", 50);
//            Ward psychologyWard = new Ward("Psychological Ward", 20);
//
//            wardRepo.save(virusWard);
//            wardRepo.save(psychologyWard);
//
//            Patient john = new Patient("John", "Smith", "", covid, virusWard);
//            Patient tom = new Patient("Tom", "Williams", "", flue, virusWard);
//            Patient sarah = new Patient("Sarah", "Connor", "", dementia, psychologyWard);
//
//            patientRepo.save(john);
//            patientRepo.save(tom);
//            patientRepo.save(sarah);

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
        };
    }
}
