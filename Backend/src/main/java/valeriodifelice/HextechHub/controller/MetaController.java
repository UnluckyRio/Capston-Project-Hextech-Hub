package valeriodifelice.HextechHub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import valeriodifelice.HextechHub.dto.ChampionDto;
import valeriodifelice.HextechHub.service.ChampionService;

import java.util.List;

@RestController
@RequestMapping("/api/meta")
public class MetaController {
    private final ChampionService championService;

    public MetaController(ChampionService championService) {
        this.championService = championService;
    }

    @GetMapping("/tier-list")
    public ResponseEntity<List<ChampionDto>> tierList() {
        return ResponseEntity.ok(championService.getAll());
    }
}

