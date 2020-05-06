package server.data;

import org.springframework.data.jpa.domain.Specification;
import server.domain.Patient;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.LinkedList;
import java.util.List;

public class PatientSpecification implements Specification<Patient> {

    private final String name;
    private final List<Long> diagnosisIds;
    private final List<Long> wardIds;

    public PatientSpecification(String name, List<Long> diagnosisId, List<Long> wardId) {
        this.name = name;
        this.diagnosisIds = diagnosisId;
        this.wardIds = wardId;
    }

    @Override
    public Predicate toPredicate(Root<Patient> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new LinkedList<>();
        if (!name.isBlank()) {
            predicates.add(
                    criteriaBuilder.or(
                            criteriaBuilder.like(root.get("firstName"), "%" + name + "%"),
                            criteriaBuilder.like(root.get("lastName"), "%" + name + "%"),
                            criteriaBuilder.like(root.get("fatherName"), "%" + name + "%")
                    )
            );
        }

        if (!diagnosisIds.isEmpty()) {
            predicates.add(
                    criteriaBuilder.or(
                            diagnosisIds.stream()
                                    .map(id -> criteriaBuilder.equal(root.get("diagnosis").get("id"), id))
                                    .toArray(Predicate[]::new)
                    )
            );
        }

        if (!wardIds.isEmpty()) {
            predicates.add(
                    criteriaBuilder.or(
                            wardIds.stream()
                                    .map(id -> criteriaBuilder.equal(root.get("ward").get("id"), id))
                                    .toArray(Predicate[]::new)
                    )
            );
        }


        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
