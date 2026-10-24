package ma.omrane.recouvrement_prjt.repository;

import ma.omrane.recouvrement_prjt.entity.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OperationRepository extends JpaRepository<Operation, Long> {
    Optional<Operation> findByLibelleAndDivision(String libelle, String division);
}