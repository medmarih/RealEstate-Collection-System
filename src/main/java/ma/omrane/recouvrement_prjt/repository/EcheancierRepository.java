package ma.omrane.recouvrement_prjt.repository;

import ma.omrane.recouvrement_prjt.entity.Echeancier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EcheancierRepository extends JpaRepository<Echeancier, Long> {
}