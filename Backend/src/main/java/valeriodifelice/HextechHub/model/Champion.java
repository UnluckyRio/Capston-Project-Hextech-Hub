package valeriodifelice.HextechHub.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "champions")
public class Champion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 32)
    private String role;

    @Column(name = "winrate", nullable = false)
    private String winRate;

    @Column(name = "pickrate", nullable = false)
    private String pickRate;

    @Column(name = "banrate", nullable = false)
    private String banRate;

    @Column(name = "matches", nullable = false)
    private String matches;
}