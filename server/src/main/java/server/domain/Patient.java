package server.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "People")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(length = 20)
    @NotBlank(message = "First name is mandatory")
    @Size(max = 20, message = "First name cant'be longer than 20 characters")
    private String firstName;

    @Column(length = 20)
    @NotBlank(message = "Last name is mandatory")
    @Size(max = 20, message = "LAst name cant'be longer than 20 characters")
    private String lastName;

    @Column(length = 20)
    @Size(max = 20, message = "Father name cant'be longer than 20 characters")
    private String fatherName;

    @ManyToOne(targetEntity = Diagnosis.class)
    @NotNull(message = "Diagnosis is mandatory")
    private Diagnosis diagnosis;

    @ManyToOne(targetEntity = Ward.class)
    @NotNull(message = "Ward is mandatory")
    private Ward ward;
}
