package valeriodifelice.HextechHub.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import valeriodifelice.HextechHub.dto.ChampionDto;
import valeriodifelice.HextechHub.model.Champion;
import valeriodifelice.HextechHub.repository.ChampionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChampionService {
    private final ChampionRepository championRepository;

    public ChampionService(ChampionRepository championRepository) {
        this.championRepository = championRepository;
    }

    @Transactional(readOnly = true)
    public List<ChampionDto> getAll() {
        return championRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChampionDto getById(Long id) {
        Champion c = championRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Champion non trovato"));
        return toDto(c);
    }

    @Transactional(readOnly = true)
    public List<ChampionDto> getByRole(String role) {
        return championRepository.findByRoleIgnoreCase(role).stream().map(this::toDto).collect(Collectors.toList());
    }

    private ChampionDto toDto(Champion c) {
        // Parsing robusto: rimuove simboli %, spazi e converte virgole in punti
        Double win = parsePercent(c.getWinRate());
        Double pick = parsePercent(c.getPickRate());
        Double ban = parsePercent(c.getBanRate());
        Integer games = parseInt(c.getMatches());

        return ChampionDto.builder()
                .id(c.getId())
                .name(c.getName())
                .role(c.getRole())
                .winRate(win)
                .pickRate(pick)
                .banRate(ban)
                .matches(games)
                .build();
    }

    // Converte stringhe come "52,3%" o "52.3" in Double 52.3
    private Double parsePercent(String s) {
        if (s == null) return 0.0;
        String cleaned = s.trim().replace("%", "").replace(",", ".");
        try { return Double.parseDouble(cleaned); } catch (NumberFormatException e) { return 0.0; }
    }

    // Converte stringhe numeriche in Integer
    private Integer parseInt(String s) {
        if (s == null) return 0;
        String cleaned = s.trim().replaceAll("[^0-9]", "");
        try { return Integer.parseInt(cleaned); } catch (NumberFormatException e) { return 0; }
    }
}
