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
    private String winRate;
    private String pickRate;
    private String banRate;
    private String matches;
}