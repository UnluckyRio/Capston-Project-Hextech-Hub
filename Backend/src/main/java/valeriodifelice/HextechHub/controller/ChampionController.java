package valeriodifelice.HextechHub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import valeriodifelice.HextechHub.dto.ChampionDto;
import valeriodifelice.HextechHub.service.ChampionService;

import java.util.List;

@RestController
@RequestMapping("/api/champions")
public class ChampionController {
    private final ChampionService championService;

    public ChampionController(ChampionService championService) {
        this.championService = championService;
    }

    @GetMapping
    public ResponseEntity<List<ChampionDto>> list() {
        return ResponseEntity.ok(championService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChampionDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(championService.getById(id));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<ChampionDto>> byRole(@PathVariable String role) {
        return ResponseEntity.ok(championService.getByRole(role));
    }
}