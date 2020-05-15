package server.domain;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
@Data
@NoArgsConstructor(force = true, access = AccessLevel.PROTECTED)
@RequiredArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private final String token;

    @ManyToOne
    private final User user;

}
