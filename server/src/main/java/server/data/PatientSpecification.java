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
    private final long diagnosisId;
    private final long wardId;

    public PatientSpecification(String name, long diagnosisId, long wardId) {
        this.name = name;
        this.diagnosisId = diagnosisId;
        this.wardId = wardId;
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
        if (diagnosisId != -1) {
            predicates.add(
                    criteriaBuilder.equal(root.get("diagnosis").get("id"), diagnosisId)
            );
        }
        if (wardId != -1) {
            predicates.add(
                    criteriaBuilder.equal(root.get("ward").get("id"), wardId)
            );
        }


        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
