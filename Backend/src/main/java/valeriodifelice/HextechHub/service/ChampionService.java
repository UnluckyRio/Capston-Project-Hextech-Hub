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
        return ChampionDto.builder()
                .id(c.getId())
                .name(c.getName())
                .role(c.getRole())
                .winRate(c.getWinRate())
                .pickRate(c.getPickRate())
                .banRate(c.getBanRate())
                .matches(c.getMatches())
                .build();
    }
}