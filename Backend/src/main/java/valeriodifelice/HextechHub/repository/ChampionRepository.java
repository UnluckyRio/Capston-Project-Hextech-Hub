package valeriodifelice.HextechHub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import valeriodifelice.HextechHub.model.Champion;

import java.util.List;

@Repository
public interface ChampionRepository extends JpaRepository<Champion, Long> {
    List<Champion> findByRoleIgnoreCase(String role);
}