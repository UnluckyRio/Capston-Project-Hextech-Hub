package valeriodifelice.HextechHub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChampionDto {
    private Long id;
    private String name;
    private String role;
    private Double winRate; // percentuale 0..100
    private Double pickRate; // percentuale 0..100
    private Double banRate; // percentuale 0..100
    private Integer matches; // numero partite
}
