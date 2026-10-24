package ma.omrane.recouvrement_prjt.repository;

import ma.omrane.recouvrement_prjt.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findByIdProduit(String idProduit);
    Optional<Article> findByNumeroIndividuel(String numeroIndividuel);
}
