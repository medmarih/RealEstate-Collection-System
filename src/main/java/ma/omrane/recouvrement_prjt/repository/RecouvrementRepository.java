package ma.omrane.recouvrement_prjt.repository;

import ma.omrane.recouvrement_prjt.entity.Recouvrement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecouvrementRepository extends JpaRepository<Recouvrement, Long> {

    // Pour le reporting
    List<Recouvrement> findByStatut(String statut);

    // Compter par statut (utilisé dans le controller)
    long countByStatut(String statut);

    Optional<Recouvrement> findByArticle_IdArticle(Long articleId);
}
