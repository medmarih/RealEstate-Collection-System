package ma.omrane.recouvrement_prjt.service;

import ma.omrane.recouvrement_prjt.dto.RecouvrementDTO;
import ma.omrane.recouvrement_prjt.entity.Article;
import ma.omrane.recouvrement_prjt.entity.Recouvrement;
import ma.omrane.recouvrement_prjt.repository.ArticleRepository;
import ma.omrane.recouvrement_prjt.repository.RecouvrementRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecouvrementService {

    private final RecouvrementRepository recouvrementRepository;
    private final ArticleRepository articleRepository;

    public RecouvrementService(RecouvrementRepository recouvrementRepository,
                               ArticleRepository articleRepository) {
        this.recouvrementRepository = recouvrementRepository;
        this.articleRepository = articleRepository;
    }

    // 🔥 création
    public Recouvrement createRecouvrement(Long articleId) {

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article non trouvé avec id: " + articleId));

        Recouvrement r = new Recouvrement();

        r.setArticle(article);
        r.setMontantTotal(article.getPrixCession());
        r.setMontantPaye(0.0);
        r.setMontantRestant(article.getPrixCession());
        r.setStatut("EN_COURS");

        r.setSource("IMPORT");

        return recouvrementRepository.save(r);
    }

    // DTO
    public RecouvrementDTO toDTO(Recouvrement r) {
        return new RecouvrementDTO(
                r.getId(),
                r.getMontantTotal(),
                r.getMontantPaye(),
                r.getMontantRestant(),
                r.getStatut()
        );
    }

    public List<Recouvrement> findAll() {
        return recouvrementRepository.findAll();
    }

    // 🔥 recalcul
    public Recouvrement calculerStatut(Long id) {

        Recouvrement r = recouvrementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recouvrement non trouvé avec id: " + id));

        double restant = r.getMontantTotal() - r.getMontantPaye();
        r.setMontantRestant(restant);

        if (restant <= 0) {
            r.setStatut("SOLDE");
        } else {
            r.setStatut("EN_COURS");
        }

        return recouvrementRepository.save(r);
    }

    // 🔥 reporting simple
    public Map<String, Long> reporting() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("SOLDE", recouvrementRepository.countByStatut("SOLDE"));
        stats.put("EN_COURS", recouvrementRepository.countByStatut("EN_COURS"));

        return stats;
    }

    // 🔥 reporting complet
    public Map<String, Object> reportingComplet() {

        List<Recouvrement> recouvrements = recouvrementRepository.findAll();

        double montantTotal = 0;
        double montantPaye = 0;
        double montantRestant = 0;

        int solde = 0;
        int enCours = 0;

        for (Recouvrement r : recouvrements) {

            montantTotal += r.getMontantTotal();
            montantPaye += r.getMontantPaye();
            montantRestant += r.getMontantRestant();

            if ("SOLDE".equals(r.getStatut())) solde++;
            else if ("EN_COURS".equals(r.getStatut())) enCours++;
        }

        double taux = montantTotal == 0 ? 0 : (montantPaye / montantTotal) * 100;

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalRecouvrements", recouvrements.size());
        stats.put("nombreSolde", solde);
        stats.put("nombreEnCours", enCours);
        stats.put("montantTotal", montantTotal);
        stats.put("montantPaye", montantPaye);
        stats.put("montantRestant", montantRestant);
        stats.put("tauxRecouvrement", taux);

        return stats;
    }
}